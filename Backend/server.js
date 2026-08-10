require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('./db')
const productRoutes = require('./routes/productRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const mediaRoutes = require('./routes/mediaRoutes')
const { quote } = require('./wholesale')
const { requireAuth, optionalAuth, requireAdmin, asyncWrap } = require('./middleware/auth')

/* ------------------------- Order state machine ------------------------- */

const ORDER_STATES = {
  received: { label: 'Received', step: 0 },
  packing: { label: 'Packing', step: 1 },
  shipped: { label: 'Shipped', step: 2 },
  delivered: { label: 'Delivered', step: 3 },
  cancelled: { label: 'Cancelled', step: -1 },
  refunded: { label: 'Refunded', step: -2 },
}

const ORDER_TRANSITIONS = {
  received: ['packing', 'cancelled'],
  packing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled', 'refunded'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
}

// Legacy statuses used by older seeds map onto the canonical lifecycle.
const ORDER_STATUS_ALIAS = {
  pending: 'received',
  processing: 'packing',
  confirmed: 'packing',
  in_production: 'packing',
  shipped: 'shipped',
  out_for_delivery: 'shipped',
  delivered: 'delivered',
  completed: 'delivered',
  cancelled: 'cancelled',
  refunded: 'refunded',
}

function normalizeOrderStatus(status) {
  const s = String(status || '').toLowerCase()
  if (ORDER_STATUS_ALIAS[s]) return ORDER_STATUS_ALIAS[s]
  if (ORDER_STATES[s]) return s
  return null
}

function canTransition(from, to) {
  const f = normalizeOrderStatus(from)
  const t = normalizeOrderStatus(to)
  if (!f || !t) return { ok: false, message: 'Unknown order status.' }
  if (f === t) return { ok: true }
  if (ORDER_TRANSITIONS[f] && ORDER_TRANSITIONS[f].includes(t)) return { ok: true }
  return { ok: false, message: `Cannot move an order from "${ORDER_STATES[f].label}" to "${ORDER_STATES[t].label}".` }
}

function insertOrderStatusEvent(orderId, fromStatus, toStatus, note = '', actor = 'admin') {
  db.prepare(
    `INSERT INTO order_status_events (order_id, from_status, to_status, note, actor)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(orderId, fromStatus, toStatus, note, actor)
}

function createNotification({ type = 'system', title, message, data = {} }) {
  const { lastInsertRowid } = db
    .prepare(
      `INSERT INTO notifications (type, title, message, data)
       VALUES (?, ?, ?, ?)`,
    )
    .run(type, title, message, JSON.stringify(data))
  const row = db.prepare('SELECT * FROM notifications WHERE id = ?').get(Number(lastInsertRowid))
  const notification = serializeNotification(row)
  notifyClients(notification)
  return notification
}

function serializeNotification(row) {
  if (!row) return null
  let data = {}
  try {
    data = JSON.parse(row.data || '{}')
  } catch {
    data = {}
  }
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    data,
    isRead: Boolean(row.is_read),
    createdAt: row.created_at,
  }
}

/* ------------------------------ SSE feed ------------------------------- */

const sseClients = new Set()

function notifyClients(notification) {
  const payload = `data: ${JSON.stringify(notification)}\n\n`
  for (const res of sseClients) {
    res.write(payload)
  }
}

const app = express()
const PORT = Number(process.env.PORT) || 5000
const UPLOAD_DIR = path.resolve(__dirname, process.env.UPLOAD_DIR || './uploads')

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',').map((s) => s.trim()) : true,
    credentials: true,
  }),
)
app.use(express.json({ limit: '2mb' }))
app.use('/uploads', express.static(UPLOAD_DIR))

/* --------------------------- Auth helpers --------------------------- */

const ACCESS_SECRET = process.env.JWT_SECRET || 'echopride-access-secret'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'echopride-refresh-secret'
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || '15m'
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d'
const COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || 'ep_refresh'

const COOKIE_MAX_AGE_SECONDS = (() => {
  const unit = REFRESH_EXPIRES.slice(-1)
  const value = parseInt(REFRESH_EXPIRES, 10) || 7
  if (unit === 'h') return value * 3600
  if (unit === 'm') return value * 60
  return value * 86400
})()

function signAccess(user) {
  return jwt.sign({ sub: user.id, role: user.role }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  })
}

function signRefresh(user) {
  return jwt.sign({ sub: user.id }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  })
}

function parseCookies(header) {
  const out = {}
  if (!header) return out
  for (const part of String(header).split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    const key = part.slice(0, idx).trim()
    const value = part.slice(idx + 1).trim()
    if (key) out[key] = decodeURIComponent(value)
  }
  return out
}

function setRefreshCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`,
  )
}

function clearRefreshCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`)
}

const serializeUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  createdAt: u.created_at,
})

/* --------------------------- Seed admin user ------------------------ */

;(function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@echopride.com').toLowerCase()
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) return
  const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin110', 10)
  db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run(
    'Echo Pride Admin',
    email,
    hash,
    'admin',
  )
  console.log(`[db] Admin account ready: ${email}`)
})()

/* ------------------------------ Auth -------------------------------- */

app.post(
  '/api/auth/register',
  asyncWrap(async (req, res) => {
    const { name, email, password } = req.body || {}
    const cleanName = String(name || '').trim()
    const cleanEmail = String(email || '').trim().toLowerCase()

    if (!cleanName) {
      res.status(400).json({ success: false, message: 'Please enter your name.' })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      res.status(400).json({ success: false, message: 'Please enter a valid email address.' })
      return
    }
    if (!password || String(password).length < 8) {
      res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' })
      return
    }

    const hash = bcrypt.hashSync(String(password), 10)
    let user
    try {
      const { lastInsertRowid } = db
        .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
        .run(cleanName, cleanEmail, hash, 'customer')
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(lastInsertRowid))
    } catch (err) {
      if (String(err.message).includes('UNIQUE')) {
        res.status(409).json({ success: false, message: 'An account with this email already exists.' })
        return
      }
      throw err
    }

    setRefreshCookie(res, signRefresh(user))
    res.status(201).json({
      success: true,
      data: { user: serializeUser(user), accessToken: signAccess(user) },
    })
  }),
)

app.post(
  '/api/auth/login',
  asyncWrap(async (req, res) => {
    const { email, password } = req.body || {}
    const cleanEmail = String(email || '').trim().toLowerCase()
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail)
    if (!user || !bcrypt.compareSync(String(password || ''), user.password_hash)) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' })
      return
    }

    setRefreshCookie(res, signRefresh(user))
    res.json({ success: true, data: { user: serializeUser(user), accessToken: signAccess(user) } })
  }),
)

app.post('/api/auth/refresh', (req, res) => {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME]
  if (!token) {
    res.status(401).json({ success: false, message: 'No refresh token provided.' })
    return
  }
  try {
    const payload = jwt.verify(token, REFRESH_SECRET)
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.sub)
    if (!user) throw new Error('user missing')
    setRefreshCookie(res, signRefresh(user))
    res.json({ success: true, data: { accessToken: signAccess(user) } })
  } catch {
    clearRefreshCookie(res)
    res.status(401).json({ success: false, message: 'Session expired, please log in again.' })
  }
})

app.post('/api/auth/logout', (req, res) => {
  clearRefreshCookie(res)
  res.json({ success: true, data: null })
})

app.get('/api/auth/profile', requireAuth, (req, res) => {
  res.json({ success: true, data: { user: serializeUser(req.user) } })
})

/* ------------------------------- Cart ------------------------------- */

const CART_ITEM_SELECT = `
  SELECT ci.id, ci.product_id, ci.quantity,
         p.slug, p.name, p.price, p.compare_at_price, p.stock_quantity,
         c.id AS category_id, c.slug AS category_slug, c.name AS category_name,
         COALESCE((SELECT GROUP_CONCAT(url, ',') FROM product_images i WHERE i.product_id = p.id ORDER BY i.position), '') AS images
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  LEFT JOIN categories c ON c.id = p.category_id
`

function serializeCartItem(row) {
  const effectivePrice = effectiveUnitPrice({ id: row.product_id, price: row.price }, row.quantity)
  return {
    id: row.id,
    quantity: row.quantity,
    effectivePrice: Number(effectivePrice),
    product: {
      id: row.product_id,
      slug: row.slug,
      name: row.name,
      price: Number(row.price),
      compareAtPrice: row.compare_at_price === null ? null : Number(row.compare_at_price),
      stockQuantity: Number(row.stock_quantity),
      images: String(row.images).split(',').filter(Boolean),
      category: row.category_name
        ? { id: row.category_id, slug: row.category_slug, name: row.category_name }
        : null,
    },
  }
}

app.get(
  '/api/cart',
  requireAuth,
  asyncWrap(async (req, res) => {
    const rows = db
      .prepare(`${CART_ITEM_SELECT} WHERE ci.user_id = ? ORDER BY ci.id ASC`)
      .all(req.user.id)
    res.json({ success: true, data: { items: rows.map(serializeCartItem) } })
  }),
)

app.post(
  '/api/cart/items',
  requireAuth,
  asyncWrap(async (req, res) => {
    const productId = Number(req.body?.productId)
    const quantity = Math.max(1, Math.floor(Number(req.body?.quantity) || 1))
    if (!Number.isInteger(productId)) {
      res.status(400).json({ success: false, message: 'A valid product is required.' })
      return
    }
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId)
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' })
      return
    }

    db.prepare(
      `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)
       ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = cart_items.quantity + excluded.quantity`,
    ).run(req.user.id, productId, quantity)

    const row = db
      .prepare(`${CART_ITEM_SELECT} WHERE ci.user_id = ? AND ci.product_id = ?`)
      .get(req.user.id, productId)
    res.status(201).json({ success: true, data: { item: serializeCartItem(row) } })
  }),
)

app.put(
  '/api/cart/items/:id',
  requireAuth,
  asyncWrap(async (req, res) => {
    const id = Number(req.params.id)
    const quantity = Math.floor(Number(req.body?.quantity))
    if (!Number.isInteger(id) || !Number.isInteger(quantity) || quantity < 1) {
      res.status(400).json({ success: false, message: 'Quantity must be at least 1.' })
      return
    }
    const result = db
      .prepare('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?')
      .run(quantity, id, req.user.id)
    if (result.changes === 0) {
      res.status(404).json({ success: false, message: 'Cart item not found.' })
      return
    }
    const row = db.prepare(`${CART_ITEM_SELECT} WHERE ci.id = ?`).get(id)
    res.json({ success: true, data: { item: serializeCartItem(row) } })
  }),
)

app.delete(
  '/api/cart/items/:id',
  requireAuth,
  asyncWrap(async (req, res) => {
    const result = db
      .prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?')
      .run(Number(req.params.id), req.user.id)
    if (result.changes === 0) {
      res.status(404).json({ success: false, message: 'Cart item not found.' })
      return
    }
    res.json({ success: true, data: { id: Number(req.params.id) } })
  }),
)

app.delete(
  '/api/cart',
  requireAuth,
  asyncWrap(async (req, res) => {
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id)
    res.json({ success: true, data: null })
  }),
)

/* ------------------------------ Orders ------------------------------ */

function getProductTiers(productId) {
  return db
    .prepare(
      `SELECT id, type, min_quantity, price, label FROM price_tiers WHERE product_id = ? ORDER BY min_quantity ASC`,
    )
    .all(productId)
    .map((t) => ({
      id: t.id,
      type: t.type,
      minQuantity: Number(t.min_quantity),
      price: Number(t.price),
      label: t.label,
    }))
}

/**
 * Effective unit price for a product at a given quantity, applying the
 * dual-pricing (retail + wholesale volume tiers) engine. Falls back to the
 * retail price when no tier applies.
 */
function effectiveUnitPrice(product, quantity) {
  const tiers = getProductTiers(product.id)
  const q = quote({ retailPrice: Number(product.price), tiers, quantity })
  return q.unitPrice
}

function serializeOrder(row) {
  if (!row) return null
  const items = db
    .prepare('SELECT id, product_id, product_name, price, quantity, image FROM order_items WHERE order_id = ? ORDER BY id ASC')
    .all(row.id)
    .map((i) => ({
      id: i.id,
      productId: i.product_id,
      productName: i.product_name,
      price: Number(i.price),
      quantity: i.quantity,
      image: i.image,
    }))

  let shippingAddress = {}
  try {
    shippingAddress = JSON.parse(row.shipping_address || '{}')
  } catch {
    shippingAddress = {}
  }

  const history = db
    .prepare('SELECT id, from_status, to_status, note, actor, created_at FROM order_status_events WHERE order_id = ? ORDER BY id ASC')
    .all(row.id)
    .map((h) => ({
      id: h.id,
      fromStatus: h.from_status,
      toStatus: h.to_status,
      note: h.note,
      actor: h.actor,
      createdAt: h.created_at,
    }))

  let customer = null
  if (row.user_id) {
    const u = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(row.user_id)
    if (u) customer = { id: u.id, name: u.name, email: u.email }
  }

  const canonical = normalizeOrderStatus(row.status) || 'received'

  return {
    id: row.id,
    orderNumber: row.order_number,
    isDemo: Boolean(row.is_demo),
    status: row.status,
    canonicalStatus: canonical,
    statusLabel: ORDER_STATES[canonical] ? ORDER_STATES[canonical].label : row.status,
    statusStep: ORDER_STATES[canonical] ? ORDER_STATES[canonical].step : 0,
    paymentMethod: row.payment_method,
    subtotal: Number(row.subtotal),
    tax: Number(row.tax),
    total: Number(row.total),
    shippingAddress,
    items,
    history,
    customer,
    createdAt: row.created_at,
  }
}

function generateOrderNumber() {
  const stamp = Date.now().toString().slice(-6)
  const rand = String(Math.floor(Math.random() * 90) + 10)
  return `EP-${stamp}${rand}`
}

app.post(
  '/api/orders',
  optionalAuth,
  asyncWrap(async (req, res) => {
    const shippingAddress = req.body?.shippingAddress || null
    if (!shippingAddress || !shippingAddress.fullName) {
      res.status(400).json({ success: false, message: 'Shipping details are required.' })
      return
    }

    let cartRows = []
    if (req.user) {
      cartRows = db
        .prepare(
          `SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price,
                  COALESCE((SELECT url FROM product_images i WHERE i.product_id = p.id ORDER BY i.position LIMIT 1), '') AS image
           FROM cart_items ci
           JOIN products p ON p.id = ci.product_id
           WHERE ci.user_id = ?`,
        )
        .all(req.user.id)
    } else if (Array.isArray(req.body?.items) && req.body.items.length) {
      const productStmt = db.prepare(
        `SELECT p.id, p.name, p.price,
                COALESCE((SELECT url FROM product_images i WHERE i.product_id = p.id ORDER BY i.position LIMIT 1), '') AS image
         FROM products p
         WHERE p.id = ?`,
      )
      const seen = new Set()
      for (const it of req.body.items) {
        const productId = Number(it?.productId)
        const quantity = Math.max(1, Math.floor(Number(it?.quantity) || 1))
        if (!Number.isInteger(productId) || productId <= 0 || seen.has(productId)) continue
        const p = productStmt.get(productId)
        if (!p) {
          res.status(400).json({ success: false, message: 'One of the products in your cart is no longer available.' })
          return
        }
        seen.add(productId)
        cartRows.push({ product_id: p.id, name: p.name, price: p.price, quantity, image: p.image })
      }
    }

    if (cartRows.length === 0) {
      res.status(400).json({ success: false, message: 'Your cart is empty.' })
      return
    }

    const settingsRow = db.prepare('SELECT payload FROM settings WHERE id = 1').get()
    let taxPercent = 0
    try {
      taxPercent = Number(settingsRow?.payload ? JSON.parse(settingsRow.payload).taxPercent : 0) || 0
    } catch {
      taxPercent = 0
    }

    const subtotal = cartRows.reduce((sum, item) => {
      const unitPrice = effectiveUnitPrice({ id: item.product_id, price: item.price }, item.quantity)
      return sum + unitPrice * item.quantity
    }, 0)
    const tax = (subtotal * taxPercent) / 100
    const total = subtotal + tax
    const paymentMethod = String(req.body?.paymentMethod || 'cod')

    let orderNumber = generateOrderNumber()
    while (db.prepare('SELECT id FROM orders WHERE order_number = ?').get(orderNumber)) {
      orderNumber = generateOrderNumber()
    }

    let orderId
    db.exec('BEGIN')
    try {
      const result = db
        .prepare(
          `INSERT INTO orders (order_number, user_id, status, payment_method, subtotal, tax, total, shipping_address, is_demo)
           VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, 0)`,
        )
        .run(
          orderNumber,
          req.user?.id ?? null,
          paymentMethod,
          subtotal,
          tax,
          total,
          JSON.stringify(shippingAddress),
        )
      orderId = Number(result.lastInsertRowid)
      insertOrderStatusEvent(orderId, '', 'pending', 'Order placed by customer')

      const insertItem = db.prepare(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      for (const item of cartRows) {
        const unitPrice = effectiveUnitPrice({ id: item.product_id, price: item.price }, item.quantity)
        insertItem.run(orderId, item.product_id, item.name, unitPrice, item.quantity, item.image)
      }

      if (req.user) {
        db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id)
      }
      db.exec('COMMIT')
    } catch (err) {
      db.exec('ROLLBACK')
      throw err
    }

    const order = serializeOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId))
    res.status(201).json({ success: true, data: { order } })
  }),
)

app.get(
  '/api/orders',
  requireAuth,
  asyncWrap(async (req, res) => {
    const isAdmin = req.user.role === 'admin'
    const { status = '', search = '', limit: rawLimit = '', page: rawPage = '1', demo = '' } = req.query

    const where = []
    const params = []
    if (!isAdmin) {
      where.push('user_id = ?')
      params.push(req.user.id)
    }
    if (isAdmin && demo !== '') {
      where.push('is_demo = ?')
      params.push(demo === '1' ? 1 : 0)
    }
    if (isAdmin && status) {
      const canonical = normalizeOrderStatus(status)
      if (canonical) {
        const aliases = Object.keys(ORDER_STATUS_ALIAS).filter((k) => ORDER_STATUS_ALIAS[k] === canonical)
        const quoted = aliases.map(() => 'status = ?').join(' OR ')
        where.push(`(${quoted})`)
        params.push(...aliases)
      }
    }
    if (isAdmin && search) {
      where.push('order_number LIKE ?')
      params.push(`%${search}%`)
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const countRow = db
      .prepare(`SELECT COUNT(*) AS c FROM orders ${whereSql}`)
      .get(...params)
    const total = Number(countRow.c)

    let page = Math.max(1, parseInt(rawPage, 10) || 1)
    const limit = rawLimit === '' || rawLimit === undefined
      ? 100
      : Math.min(500, Math.max(1, parseInt(rawLimit, 10) || 100))
    const pages = Math.max(1, Math.ceil(total / limit))
    if (page > pages) page = pages

    const rows = db
      .prepare(`SELECT * FROM orders ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`)
      .all(...params, limit, (page - 1) * limit)

    res.json({
      success: true,
      data: { items: rows.map(serializeOrder), total, page, pages, limit },
    })
  }),
)

app.get(
  '/api/orders/:id',
  requireAuth,
  asyncWrap(async (req, res) => {
    const isAdmin = req.user.role === 'admin'
    const row = isAdmin
      ? db.prepare('SELECT * FROM orders WHERE id = ?').get(Number(req.params.id))
      : db
          .prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?')
          .get(Number(req.params.id), req.user.id)
    if (!row) {
      res.status(404).json({ success: false, message: 'Order not found.' })
      return
    }
    res.json({ success: true, data: { order: serializeOrder(row) } })
  }),
)

app.put(
  '/api/orders/:id/status',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const orderStatus = String(req.body?.orderStatus || '').trim()
    const note = String(req.body?.note || '').trim()

    const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(Number(req.params.id))
    if (!row) {
      res.status(404).json({ success: false, message: 'Order not found.' })
      return
    }

    const toStatus = normalizeOrderStatus(orderStatus)
    if (!toStatus) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${Object.keys(ORDER_TRANSITIONS).join(', ')}.`,
      })
      return
    }

    const check = canTransition(row.status, toStatus)
    if (!check.ok) {
      res.status(400).json({ success: false, message: check.message })
      return
    }

    const fromStatus = normalizeOrderStatus(row.status) || 'received'
    if (fromStatus !== toStatus) {
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(toStatus, row.id)
      insertOrderStatusEvent(row.id, row.status, toStatus, note)
      const user = db.prepare('SELECT name FROM users WHERE id = ?').get(row.user_id)
      createNotification({
        type: 'order',
        title: `Order ${row.order_number} — ${ORDER_STATES[toStatus].label}`,
        message: `${user?.name || 'A customer'}'s order is now ${ORDER_STATES[toStatus].label.toLowerCase()}.${note ? ` ${note}` : ''}`,
        data: { orderId: row.id, orderNumber: row.order_number, status: toStatus },
      })
    }

    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(row.id)
    res.json({ success: true, data: { order: serializeOrder(updated) } })
  }),
)

app.delete(
  '/api/orders/:id',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(Number(req.params.id))
    if (!row) {
      res.status(404).json({ success: false, message: 'Order not found.' })
      return
    }

    db.exec('BEGIN')
    try {
      db.prepare('DELETE FROM order_items WHERE order_id = ?').run(row.id)
      db.prepare('DELETE FROM order_status_events WHERE order_id = ?').run(row.id)
      db.prepare('DELETE FROM orders WHERE id = ?').run(row.id)
      db.exec('COMMIT')
    } catch (err) {
      db.exec('ROLLBACK')
      throw err
    }

    createNotification({
      type: 'system',
      title: `Order ${row.order_number} removed`,
      message: `Order ${row.order_number} was deleted by an admin.`,
      data: { orderId: row.id, orderNumber: row.order_number },
    })

    res.json({ success: true, data: { id: row.id } })
  }),
)

/* ---------------------------- Notifications ---------------------------- */

app.get(
  '/api/notifications',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50))
    const unread = req.query.unread === 'true' || req.query.unread === '1'
    const rows = unread
      ? db.prepare('SELECT * FROM notifications WHERE is_read = 0 ORDER BY id DESC LIMIT ?').all(limit)
      : db.prepare('SELECT * FROM notifications ORDER BY id DESC LIMIT ?').all(limit)
    const unreadCount = Number(db.prepare('SELECT COUNT(*) AS c FROM notifications WHERE is_read = 0').get().c)
    res.json({
      success: true,
      data: { items: rows.map(serializeNotification), unreadCount },
    })
  }),
)

app.get(
  '/api/notifications/unread-count',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const count = Number(db.prepare('SELECT COUNT(*) AS c FROM notifications WHERE is_read = 0').get().c)
    res.json({ success: true, data: { count } })
  }),
)

app.post(
  '/api/notifications/read',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(Number).filter(Number.isInteger) : []
    if (ids.length) {
      db.prepare(`UPDATE notifications SET is_read = 1 WHERE id IN (${ids.map(() => '?').join(',')})`).run(...ids)
    }
    res.json({ success: true, data: { updated: ids.length } })
  }),
)

app.post(
  '/api/notifications/read-all',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const result = db.prepare('UPDATE notifications SET is_read = 1 WHERE is_read = 0').run()
    res.json({ success: true, data: { updated: result.changes } })
  }),
)

app.get('/api/notifications/stream', (req, res) => {
  const token = String(req.query.token || '')
  let payload = null
  try {
    payload = jwt.verify(token, ACCESS_SECRET)
  } catch {
    res.status(401).json({ success: false, message: 'Invalid stream token.' })
    return
  }
  const user = payload?.sub ? db.prepare('SELECT id, role FROM users WHERE id = ?').get(payload.sub) : null
  if (!user || user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Admin access required.' })
    return
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  })
  res.write('retry: 5000\n\n')
  sseClients.add(res)

  const heartbeat = setInterval(() => {
    res.write(`: ping ${Date.now()}\n\n`)
  }, 25000)

  req.on('close', () => {
    clearInterval(heartbeat)
    sseClients.delete(res)
  })
})

/* ----------------------------- Admin stats ----------------------------- */

const DAY_MS = 86400e3
const toSql = (ms) => {
  const d = new Date(ms)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`
}

function deltaOf(cur, prev) {
  if (!prev) return cur > 0 ? 100 : 0
  return Number((((cur - prev) / prev) * 100).toFixed(1))
}

function monthWindows() {
  const now = Date.now()
  const curStart = now - 30 * DAY_MS
  const prevStart = now - 60 * DAY_MS
  return { curStart, prevStart, cur: [toSql(curStart), toSql(now)], prev: [toSql(prevStart), toSql(curStart)] }
}

app.get(
  '/api/admin/stats',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const { cur, prev } = monthWindows()

    const countSince = (table, col, start) =>
      Number(db.prepare(`SELECT COUNT(*) AS c FROM ${table} WHERE ${col} >= ?`).get(start).c)
    const sumSince = (col, start) =>
      Number(db.prepare(`SELECT COALESCE(SUM(${col}), 0) AS s FROM orders WHERE created_at >= ?`).get(start).s)

    const productsCur = countSince('products', 'created_at', cur[0])
    const productsPrev = countSince('products', 'created_at', prev[0])
    const customersCur = countSince('users', 'created_at', cur[0])
    const customersPrev = countSince('users', 'created_at', prev[0])
    const ordersCur = countSince('orders', 'created_at', cur[0])
    const ordersPrev = countSince('orders', 'created_at', prev[0])
    const inquiriesCur = countSince('inquiries', 'created_at', cur[0])
    const inquiriesPrev = countSince('inquiries', 'created_at', prev[0])
    const surveysCur = countSince('survey_responses', 'created_at', cur[0])
    const surveysPrev = countSince('survey_responses', 'created_at', prev[0])

    const revenueCur = sumSince('total', cur[0])
    const revenuePrev = sumSince('total', prev[0])

    const sessionsCur = Number(
      db
        .prepare('SELECT COUNT(DISTINCT session_id) AS n FROM analytics_events WHERE event_type = ? AND created_at >= ?')
        .get('page_view', cur[0]).n,
    )
    const sessionsPrev = Number(
      db
        .prepare('SELECT COUNT(DISTINCT session_id) AS n FROM analytics_events WHERE event_type = ? AND created_at >= ?')
        .get('page_view', prev[0]).n,
    )
    const conversionCur = sessionsCur ? (ordersCur / sessionsCur) * 100 : 0
    const conversionPrev = sessionsPrev ? (ordersPrev / sessionsPrev) * 100 : 0

    res.json({
      success: true,
      data: {
        products: { value: productsCur, delta: deltaOf(productsCur, productsPrev) },
        categories: {
          value: Number(db.prepare('SELECT COUNT(*) AS c FROM categories').get().c),
          delta: null,
        },
        customers: { value: customersCur, delta: deltaOf(customersCur, customersPrev) },
        orders: { value: ordersCur, delta: deltaOf(ordersCur, ordersPrev) },
        revenue: { value: revenueCur, delta: deltaOf(revenueCur, revenuePrev) },
        pendingInquiries: {
          value: Number(db.prepare('SELECT COUNT(*) AS c FROM inquiries WHERE status IN (?, ?)').get('new', 'open').c),
          delta: deltaOf(inquiriesCur, inquiriesPrev),
        },
        surveyResponses: { value: surveysCur, delta: deltaOf(surveysCur, surveysPrev) },
        conversionRate: {
          value: Number(conversionCur.toFixed(2)),
          delta: Number((conversionCur - conversionPrev).toFixed(2)),
        },
        unreadNotifications: Number(
          db.prepare('SELECT COUNT(*) AS c FROM notifications WHERE is_read = 0').get().c,
        ),
      },
    })
  }),
)

app.get(
  '/api/admin/customers',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const rows = db
      .prepare(
        `SELECT u.id, u.name, u.email, u.created_at,
                (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS orders,
                (SELECT COALESCE(SUM(o.total), 0) FROM orders o WHERE o.user_id = u.id) AS spent
         FROM users u
         WHERE u.role != 'admin'
         ORDER BY u.id DESC
         LIMIT 500`,
      )
      .all()
    res.json({
      success: true,
      data: {
        items: rows.map((r) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          joinedAt: r.created_at,
          orders: Number(r.orders),
          spent: Number(r.spent),
        })),
      },
    })
  }),
)

app.get(
  '/api/admin/inquiries',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const rows = db.prepare('SELECT * FROM inquiries ORDER BY id DESC LIMIT 500').all()
    res.json({
      success: true,
      data: {
        items: rows.map((r) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          subject: r.subject,
          message: r.message,
          status: r.status,
          createdAt: r.created_at,
        })),
      },
    })
  }),
)

app.get(
  '/api/admin/surveys',
  requireAuth,
  requireAdmin,
  asyncWrap(async (req, res) => {
    const rows = db.prepare('SELECT * FROM survey_responses ORDER BY id DESC LIMIT 500').all()
    res.json({
      success: true,
      data: {
        items: rows.map((r) => ({
          id: r.id,
          email: r.email,
          rating: Number(r.rating),
          feedback: r.feedback,
          source: r.source,
          createdAt: r.created_at,
        })),
      },
    })
  }),
)

/* ----------------------------- Settings ----------------------------- */

function getSettings() {
  const row = db.prepare('SELECT payload FROM settings WHERE id = 1').get()
  if (!row) return {}
  try {
    return JSON.parse(row.payload)
  } catch {
    return {}
  }
}

function saveSettings(next) {
  db.prepare('UPDATE settings SET payload = ? WHERE id = 1').run(JSON.stringify(next))
}

function deepMerge(base, patch) {
  if (patch && typeof patch === 'object' && !Array.isArray(patch)) {
    const out = { ...(base && typeof base === 'object' && !Array.isArray(base) ? base : {}) }
    for (const key of Object.keys(patch)) {
      out[key] = deepMerge(out[key], patch[key])
    }
    return out
  }
  return patch === undefined ? base : patch
}

app.get('/api/settings', (req, res) => {
  res.json({ success: true, data: getSettings() })
})

app.put(
  '/api/settings',
  asyncWrap(async (req, res) => {
    if (!req.body?.settings || typeof req.body.settings !== 'object') {
      res.status(400).json({ success: false, message: 'Settings payload is required.' })
      return
    }
    const next = deepMerge(getSettings(), req.body.settings)
    saveSettings(next)
    res.json({ success: true, data: next })
  }),
)

app.put(
  '/api/settings/deal',
  asyncWrap(async (req, res) => {
    if (!req.body?.deal || typeof req.body.deal !== 'object') {
      res.status(400).json({ success: false, message: 'Deal payload is required.' })
      return
    }
    const current = getSettings()
    current.deal = deepMerge(current.deal || {}, req.body.deal)
    saveSettings(current)
    res.json({ success: true, data: current })
  }),
)

/* --------------------------- Products mount ------------------------- */

app.use('/api', productRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/media', mediaRoutes)

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', time: new Date().toISOString() } })
})

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Echo Pride Backend is running!' })
})

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` })
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || (err.name === 'MulterError' ? 400 : err.statusCode) || 500
  if (status >= 500) console.error(err)
  res.status(status).json({
    success: false,
    message: err.expose || status < 500 ? err.message : 'Internal server error.',
  })
})

app.listen(PORT, () => {
  console.log(`[server] Echo Pride API listening on http://localhost:${PORT}`)
})
