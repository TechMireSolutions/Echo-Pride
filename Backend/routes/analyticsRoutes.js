const express = require('express')
const db = require('../db')
const drizzleDb = require('../db/drizzle')
const {
  analyticsEvents,
  orders,
  orderItems,
  products,
  salesEvents,
} = require('../db/schema')
const { and, asc, count, desc, eq, gte, sql } = require('drizzle-orm')
const { requireAuth, requireAdmin, asyncWrap } = require('../middleware/auth')

const router = express.Router()

const PERIODS = new Set(['day', 'week', 'month', 'year'])
const VALID_EVENTS = new Set(['page_view', 'add_to_cart', 'checkout'])

const pad = (n) => String(n).padStart(2, '0')
const toSqlDate = (ms) => {
  const d = new Date(ms)
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
}
const toMs = (sqlDate) => Date.parse(`${sqlDate.replace(' ', 'T')}Z`)

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function buildBuckets(period) {
  const now = Date.now()
  const HOUR = 3600e3
  const DAY = 86400e3
  const out = []

  if (period === 'day') {
    const end = Math.floor(now / HOUR) * HOUR
    const start = end - 23 * HOUR
    for (let i = 0; i < 24; i++) {
      const s = start + i * HOUR
      out.push({ label: `${pad(new Date(s).getUTCHours())}:00`, startMs: s, endMs: s + HOUR })
    }
  } else if (period === 'week') {
    const end = Math.floor(now / DAY) * DAY
    const start = end - 6 * DAY
    for (let i = 0; i < 7; i++) {
      const s = start + i * DAY
      out.push({ label: WEEKDAYS[new Date(s).getUTCDay()], startMs: s, endMs: s + DAY })
    }
  } else if (period === 'month') {
    const end = Math.floor(now / DAY) * DAY
    const start = end - 29 * DAY
    for (let i = 0; i < 30; i++) {
      const s = start + i * DAY
      out.push({ label: `${new Date(s).getUTCDate()}`, startMs: s, endMs: s + DAY })
    }
  } else {
    const nowDate = new Date(now)
    const months = []
    for (let i = 0; i < 12; i++) {
      const y = nowDate.getUTCFullYear() - (i >= nowDate.getUTCMonth() ? 1 : 0)
      const m = (nowDate.getUTCMonth() - i + 12) % 12
      months.unshift({ y, m })
    }
    for (let i = 0; i < 12; i++) {
      const { y, m } = months[i]
      const s = Date.UTC(y, m, 1)
      const e = i < 11 ? Date.UTC(months[i + 1].y, months[i + 1].m, 1) : now
      out.push({ label: MONTHS[m], startMs: s, endMs: e })
    }
  }
  return out
}

function getWindow(period) {
  const buckets = buildBuckets(period)
  const start = buckets[0].startMs
  const end = buckets[buckets.length - 1].endMs
  const span = end - start
  const prevEnd = start
  let prevStart
  if (period === 'year') {
    const d = new Date(start)
    prevStart = Date.UTC(d.getUTCFullYear() - 1, d.getUTCMonth(), 1)
  } else {
    prevStart = start - span
  }
  return { buckets, start, end, prevStart, prevEnd }
}

function pctChange(cur, prev) {
  if (!prev) return cur > 0 ? 100 : 0
  return ((cur - prev) / prev) * 100
}

const metric = (value, prev, spark) => ({
  value,
  delta: pctChange(value, prev),
  spark,
})

function bucketize(tsMs, buckets) {
  for (let i = 0; i < buckets.length; i++) {
    if (tsMs >= buckets[i].startMs && tsMs < buckets[i].endMs) return i
  }
  return -1
}

/* ----------------------- Aggregation helpers ----------------------- */

async function countEventType(eventType, fromMs) {
  const rows = drizzleDb
    .select({ n: count() })
    .from(analyticsEvents)
    .where(and(eq(analyticsEvents.eventType, eventType), gte(analyticsEvents.createdAt, toSqlDate(fromMs))))
    .all()
  return Number(rows[0]?.n ?? 0)
}

async function countVisits(fromMs) {
  const rows = drizzleDb
    .select({ n: sql`COUNT(DISTINCT ${analyticsEvents.sessionId})`.as('n') })
    .from(analyticsEvents)
    .where(and(eq(analyticsEvents.eventType, 'page_view'), gte(analyticsEvents.createdAt, toSqlDate(fromMs))))
    .all()
  return Number(rows[0]?.n ?? 0)
}

async function countOrders(fromMs) {
  const rows = drizzleDb
    .select({ n: count() })
    .from(orders)
    .where(gte(orders.createdAt, toSqlDate(fromMs)))
    .all()
  return Number(rows[0]?.n ?? 0)
}

async function sumOrders(fromMs) {
  const rows = drizzleDb
    .select({ s: sql`COALESCE(SUM(${orders.total}), 0)`.as('s') })
    .from(orders)
    .where(gte(orders.createdAt, toSqlDate(fromMs)))
    .all()
  return Number(rows[0]?.s ?? 0)
}

async function fetchEvents(fromMs) {
  return drizzleDb
    .select({
      eventType: analyticsEvents.eventType,
      path: analyticsEvents.path,
      sessionId: analyticsEvents.sessionId,
      source: analyticsEvents.source,
      createdAt: analyticsEvents.createdAt,
    })
    .from(analyticsEvents)
    .where(gte(analyticsEvents.createdAt, toSqlDate(fromMs)))
    .all()
}

async function fetchOrders(fromMs) {
  return drizzleDb
    .select({ id: orders.id, total: orders.total, status: orders.status, createdAt: orders.createdAt })
    .from(orders)
    .where(gte(orders.createdAt, toSqlDate(fromMs)))
    .all()
}

function buildSeries(eventRows, orderRows, buckets, start, end) {
  const views = new Array(buckets.length).fill(0)
  const visitSets = buckets.map(() => new Set())
  const orderCounts = new Array(buckets.length).fill(0)
  const revenue = new Array(buckets.length).fill(0)

  for (const r of eventRows) {
    const ts = toMs(r.createdAt)
    if (ts < start || ts >= end) continue
    const i = bucketize(ts, buckets)
    if (i < 0) continue
    if (r.eventType === 'page_view') {
      views[i] += 1
      visitSets[i].add(r.sessionId)
    }
  }
  for (const r of orderRows) {
    const ts = toMs(r.createdAt)
    if (ts < start || ts >= end) continue
    const i = bucketize(ts, buckets)
    if (i < 0) continue
    orderCounts[i] += 1
    revenue[i] += Number(r.total)
  }

  const visits = visitSets.map((s) => s.size)
  const conversion = views.map((v, i) => (visits[i] ? (orderCounts[i] / visits[i]) * 100 : 0))
  return { views, visits, orders: orderCounts, revenue, conversion }
}

/* ------------------------------ Track ------------------------------ */

router.post('/track', (req, res) => {
  const body = req.body || {}
  const eventType = VALID_EVENTS.has(body.eventType) ? body.eventType : 'page_view'
  const path = String(body.path || '/').slice(0, 512)
  const source = String(body.source || '').slice(0, 64)
  const sessionId = String(body.sessionId || '').slice(0, 128)
  db.prepare(
    'INSERT INTO analytics_events (event_type, path, source, session_id) VALUES (?, ?, ?, ?)',
  ).run(eventType, path, source, sessionId)
  res.status(201).json({ success: true, data: null })
})

/* ----------------------------- Overview ---------------------------- */

router.get(
  '/overview',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const period = PERIODS.has(req.query.period) ? req.query.period : 'month'
    const { buckets, start, end, prevStart } = getWindow(period)

    const [viewsCur, viewsPrev, visitsCur, visitsPrev, ordersCur, ordersPrev, revCur, revPrev] =
      await Promise.all([
        countEventType('page_view', start),
        countEventType('page_view', prevStart) - countEventType('page_view', start),
        countVisits(start),
        countVisits(prevStart) - countVisits(start),
        countOrders(start),
        countOrders(prevStart) - countOrders(start),
        sumOrders(start),
        sumOrders(prevStart) - sumOrders(start),
      ])

    const [eventRows, orderRows] = await Promise.all([
      fetchEvents(prevStart),
      fetchOrders(prevStart),
    ])
    const series = buildSeries(eventRows, orderRows, buckets, start, end)

    const conversionCur = visitsCur ? (ordersCur / visitsCur) * 100 : 0
    const conversionPrev = visitsPrev ? (ordersPrev / visitsPrev) * 100 : 0

    res.json({
      success: true,
      data: {
        period,
        stats: {
          views: metric(viewsCur, viewsPrev, series.views),
          visits: metric(visitsCur, visitsPrev, series.visits),
          orders: metric(ordersCur, ordersPrev, series.orders),
          conversionRate: metric(Number(conversionCur.toFixed(2)), Number(conversionPrev.toFixed(2)), series.conversion.map((v) => Number(v.toFixed(2)))),
        },
        revenue: metric(revCur, revPrev, series.revenue),
      },
    })
  }),
)

/* ---------------------------- Chart ---------------------------- */

router.get(
  '/chart',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const period = PERIODS.has(req.query.period) ? req.query.period : 'month'
    const metricType = req.query.metric === 'orders' ? 'orders' : 'revenue'
    const { buckets, start, prevStart } = getWindow(period)

    const [orderRows, curSum, prevSum, curCount, prevCount] = await Promise.all([
      fetchOrders(prevStart),
      sumOrders(start),
      sumOrders(prevStart) - sumOrders(start),
      countOrders(start),
      countOrders(prevStart) - countOrders(start),
    ])
    const series = buildSeries([], orderRows, buckets, start, Date.now())

    const isRevenue = metricType === 'revenue'
    const values = isRevenue ? series.revenue : series.orders
    const total = isRevenue ? curSum : curCount
    const delta = isRevenue ? pctChange(curSum, prevSum) : pctChange(curCount, prevCount)

    res.json({
      success: true,
      data: {
        period,
        metric: metricType,
        label: isRevenue ? 'Revenue' : 'Orders',
        unit: isRevenue ? '$' : '',
        labels: buckets.map((b) => b.label),
        values: values.map((v) => (isRevenue ? Math.round(v * 100) / 100 : v)),
        total,
        delta,
      },
    })
  }),
)

/* ---------------------------- Traffic ---------------------------- */

router.get(
  '/traffic',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const period = PERIODS.has(req.query.period) ? req.query.period : 'month'
    const { buckets, start, prevStart } = getWindow(period)

    const eventRows = await fetchEvents(prevStart)
    const orderRows = await fetchOrders(prevStart)

    const curEvents = eventRows.filter((r) => {
      const ts = toMs(r.createdAt)
      return r.eventType === 'page_view' && ts >= start
    })
    const prevEvents = eventRows.filter((r) => {
      const ts = toMs(r.createdAt)
      return r.eventType === 'page_view' && ts < start
    })

    const summarize = (rows) => {
      const sessions = new Set()
      const viewsPerSession = new Map()
      const sourceSessions = new Map()
      for (const r of rows) {
        sessions.add(r.sessionId)
        viewsPerSession.set(r.sessionId, (viewsPerSession.get(r.sessionId) || 0) + 1)
        if (!sourceSessions.has(r.source)) sourceSessions.set(r.source, new Set())
        sourceSessions.get(r.source).add(r.sessionId)
      }
      return { sessions, viewsPerSession, sourceSessions }
    }

    const cur = summarize(curEvents)
    const prev = summarize(prevEvents)

    const viewsCur = curEvents.length
    const viewsPrev = prevEvents.length
    const sessionsCur = cur.sessions.size
    const sessionsPrev = prev.sessions.size

    const pagesPerVisitCur = sessionsCur ? viewsCur / sessionsCur : 0
    const pagesPerVisitPrev = sessionsPrev ? viewsPrev / sessionsPrev : 0
    const bouncesCur = [...cur.viewsPerSession.values()].filter((v) => v === 1).length
    const bouncesPrev = [...prev.viewsPerSession.values()].filter((v) => v === 1).length
    const bounceCur = sessionsCur ? (bouncesCur / sessionsCur) * 100 : 0
    const bouncePrev = sessionsPrev ? (bouncesPrev / sessionsPrev) * 100 : 0

    const funnel = [
      { label: 'Visited store', value: sessionsCur },
      {
        label: 'Viewed product',
        value: new Set(curEvents.filter((r) => r.path.startsWith('/product')).map((r) => r.sessionId)).size,
      },
      {
        label: 'Added to cart',
        value: new Set(
          eventRows.filter((r) => r.eventType === 'add_to_cart' && toMs(r.createdAt) >= start).map((r) => r.sessionId),
        ).size,
      },
      {
        label: 'Reached checkout',
        value: new Set(
          eventRows.filter((r) => r.eventType === 'checkout' && toMs(r.createdAt) >= start).map((r) => r.sessionId),
        ).size,
      },
      { label: 'Purchased', value: orderRows.filter((r) => toMs(r.createdAt) >= start).length },
    ]

    const SOURCE_ICONS = {
      'Google search': 'fa-brands fa-google',
      Instagram: 'fa-brands fa-instagram',
      Direct: 'fa-solid fa-globe',
      TikTok: 'fa-brands fa-tiktok',
      Facebook: 'fa-brands fa-facebook-f',
      Email: 'fa-solid fa-envelope',
    }
    const sources = [...cur.sourceSessions.entries()]
      .map(([name, set]) => ({
        name,
        icon: SOURCE_ICONS[name] || 'fa-solid fa-globe',
        sessions: set.size,
        pct: sessionsCur ? Math.round((set.size / sessionsCur) * 100) : 0,
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 6)

    const series = buildSeries(eventRows, orderRows, buckets, start, Date.now())

    res.json({
      success: true,
      data: {
        period,
        sessions: metric(sessionsCur, sessionsPrev, series.visits),
        uniqueVisitors: metric(sessionsCur, sessionsPrev, series.visits),
        pagesPerVisit: metric(Number(pagesPerVisitCur.toFixed(2)), Number(pagesPerVisitPrev.toFixed(2)), []),
        bounceRate: metric(Number(bounceCur.toFixed(2)), Number(bouncePrev.toFixed(2)), []),
        funnel,
        sources,
      },
    })
  }),
)

/* ---------------------------- Advisor ---------------------------- */

router.get(
  '/advisor',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const eventRows = await fetchEvents(Date.now() - 30 * 86400e3)
    const orderRows = await fetchOrders(Date.now() - 90 * 86400e3)

    const sessions = new Set(eventRows.filter((r) => r.eventType === 'page_view').map((r) => r.sessionId))
    const orders30 = orderRows.filter((r) => toMs(r.createdAt) >= Date.now() - 30 * 86400e3).length

    const topRows = drizzleDb
      .select({ name: orderItems.productName, qty: sql`SUM(${orderItems.quantity})`.as('q') })
      .from(orderItems)
      .groupBy(orderItems.productName)
      .orderBy(desc(sql`SUM(${orderItems.quantity})`))
      .limit(1)
      .all()

    const lowRows = drizzleDb
      .select({ name: products.name, stock: products.stockQuantity })
      .from(products)
      .where(sql`${products.stockQuantity} < 20`)
      .orderBy(products.stockQuantity)
      .limit(1)
      .all()

    const weekdayCounts = new Array(7).fill(0)
    for (const r of orderRows) {
      weekdayCounts[new Date(toMs(r.createdAt)).getUTCDay()] += 1
    }
    const bestDayIdx = weekdayCounts.indexOf(Math.max(...weekdayCounts))

    const top = topRows[0]
    const low = lowRows[0]
    const conversion = sessions.size ? (orders30 / sessions.size) * 100 : 0

    const recommendations = []
    if (top) {
      recommendations.push({
        icon: 'fa-solid fa-crown',
        title: `Best seller: ${top.name}`,
        text: `This product drove the most units in the last 90 days. Feature it in a homepage banner and email campaign.`,
        tag: 'Boost sales',
      })
    }
    if (low) {
      recommendations.push({
        icon: 'fa-solid fa-triangle-exclamation',
        title: `Low stock: ${low.name}`,
        text: `Only ${low.stock} units left. Restock before the next sales event to avoid missed revenue.`,
        tag: 'Inventory',
      })
    }
    if (conversion < 8) {
      recommendations.push({
        icon: 'fa-solid fa-bolt',
        title: 'Run a flash sale',
        text: `Current conversion is ${conversion.toFixed(1)}%. Time-limited discounts lift conversions during low-traffic hours.`,
        tag: 'Convert more',
      })
    } else {
      recommendations.push({
        icon: 'fa-solid fa-truck-fast',
        title: 'Free shipping threshold',
        text: 'Free shipping over $75 raises average order value by up to 18% in your category.',
        tag: 'AOV up',
      })
    }
    recommendations.push({
      icon: 'fa-solid fa-calendar-star',
      title: `${WEEKDAYS[bestDayIdx]} is your best sales day`,
      text: `You sell most on ${WEEKDAYS[bestDayIdx]}s. Schedule product drops and campaigns mid-week.`,
      tag: 'Seasonal',
    })

    const events = drizzleDb
      .select({ id: salesEvents.id, title: salesEvents.title, startsAt: salesEvents.startsAt, endsAt: salesEvents.endsAt, status: salesEvents.status, color: salesEvents.color })
      .from(salesEvents)
      .orderBy(asc(salesEvents.startsAt))
      .all()

    const now = new Date()
    const formatDate = (iso) => {
      if (!iso) return ''
      const d = new Date(iso)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    const formatRange = (e) => {
      if (!e.endsAt) return formatDate(e.startsAt)
      return `${formatDate(e.startsAt)} – ${formatDate(e.endsAt)}`
    }
    const mappedEvents = events
      .map((e) => ({
        id: e.id,
        title: e.title,
        startsAt: e.startsAt,
        endsAt: e.endsAt,
        status: e.status,
        color: e.color,
        dateLabel: formatRange(e),
        upcoming: new Date(e.startsAt) >= now,
      }))
      .sort((a, b) => (a.upcoming === b.upcoming ? new Date(a.startsAt) - new Date(b.startsAt) : a.upcoming ? -1 : 1))

    res.json({ success: true, data: { events: mappedEvents, recommendations } })
  }),
)

module.exports = router
