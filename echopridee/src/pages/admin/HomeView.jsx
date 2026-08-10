import React, { useEffect, useState } from 'react'
import { analyticsService, productService, adminService } from '../../api'
import {
  Card, SectionTitle, Sparkline, RevenueChart, Loading, EmptyState,
  fmtMoney, fmtCompact, timeAgo, DeltaPill,
} from './ui'

const PERIODS = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
]

const STAT_CARDS = [
  { key: 'products', label: 'Total Products', icon: 'fa-solid fa-box-open', tint: 'bg-[#baf120]/15 text-[#baf120]' },
  { key: 'categories', label: 'Categories', icon: 'fa-solid fa-tags', tint: 'bg-sky-500/15 text-sky-400' },
  { key: 'customers', label: 'Customers', icon: 'fa-solid fa-users', tint: 'bg-violet-500/15 text-violet-400' },
  { key: 'orders', label: 'Orders', icon: 'fa-solid fa-cart-shopping', tint: 'bg-amber-500/15 text-amber-400' },
  { key: 'revenue', label: 'Revenue', icon: 'fa-solid fa-sack-dollar', tint: 'bg-[#baf120]/15 text-[#baf120]', money: true },
  { key: 'pendingInquiries', label: 'Pending Inquiries', icon: 'fa-solid fa-envelope', tint: 'bg-rose-500/15 text-rose-400' },
  { key: 'surveyResponses', label: 'Survey Responses', icon: 'fa-solid fa-clipboard-check', tint: 'bg-emerald-500/15 text-emerald-400' },
  { key: 'conversionRate', label: 'Conversion Rate', icon: 'fa-solid fa-percent', tint: 'bg-sky-500/15 text-sky-400', pct: true },
]

const STAT_SPARKS = {
  products: [12, 15, 14, 18, 17, 20, 19, 22],
  categories: [4, 4, 5, 5, 5, 5, 5, 5],
  customers: [6, 8, 7, 11, 10, 14, 13, 17],
  orders: [9, 12, 10, 15, 13, 18, 16, 22],
  revenue: [10, 13, 11, 16, 14, 19, 17, 23],
  pendingInquiries: [8, 9, 7, 10, 9, 12, 11, 13],
  surveyResponses: [5, 7, 6, 9, 8, 12, 11, 15],
  conversionRate: [9, 10, 9, 11, 10, 12, 11, 13],
}

export default function HomeView({ go }) {
  const [period, setPeriod] = useState('month')
  const [metric, setMetric] = useState('revenue')
  const [hovered, setHovered] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      analyticsService.overview(period),
      analyticsService.chart(period, metric),
      analyticsService.traffic(period),
      analyticsService.advisor(),
    ])
      .then(([overview, chart, traffic, advisor]) => {
        if (cancelled) return
        setData({ overview, chart, traffic, advisor })
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [period, metric])

  useEffect(() => {
    let cancelled = false
    adminService
      .stats()
      .then((res) => {
        if (!cancelled) setStats(res?.data || res || null)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const [snapshot, setSnapshot] = useState(null)

  useEffect(() => {
    let cancelled = false
    productService
      .list({ limit: 500 })
      .then((res) => {
        if (cancelled) return
        const items = res?.items || []
        const out = items.filter((p) => Number(p.stockQuantity) <= 0)
        const low = items.filter((p) => Number(p.stockQuantity) > 0 && Number(p.stockQuantity) < 20)
        setSnapshot({
          total: res?.total ?? items.length,
          active: items.length - out.length,
          outOfStock: out.length,
          lowStock: low.length,
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const [feed, setFeed] = useState([])

  useEffect(() => {
    let cancelled = false
    adminService
      .listNotifications({ limit: 12 })
      .then((res) => {
        if (!cancelled) setFeed(res?.items || res?.data?.items || [])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const overview = data?.overview
  const chart = data?.chart
  const traffic = data?.traffic
  const advisor = data?.advisor

  return (
    <>
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black tracking-tight">Overview</h2>
            <p className="text-xs text-gray-500">Your store at a glance — live comparisons vs the prior period.</p>
          </div>
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            {PERIODS.map((t) => (
              <button key={t.key} onClick={() => setPeriod(t.key)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${period === t.key ? 'bg-[#baf120] text-black' : 'text-gray-400 hover:text-white'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAT_CARDS.map((kpi) => {
            const m = stats?.[kpi.key] || { value: 0, delta: null }
            return (
              <Card key={kpi.key} className="p-5 hover:border-white/20 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${kpi.tint} flex items-center justify-center`}>
                    <i className={`${kpi.icon} text-sm`}></i>
                  </div>
                  {m.delta != null ? <DeltaPill delta={m.delta} /> : <span className="text-[11px] font-bold text-gray-600">—</span>}
                </div>
                <p className="text-2xl md:text-[1.7rem] font-black tracking-tight">
                  {kpi.money ? fmtMoney(m.value) : kpi.pct ? `${Number(m.value).toFixed(2)}%` : fmtCompact(m.value)}
                </p>
                <p className="text-xs text-gray-500 mt-1 mb-3">{kpi.label}</p>
                <Sparkline data={STAT_SPARKS[kpi.key]} />
              </Card>
            )
          })}
        </div>
      </section>

      {loading && !data && <Loading label="Crunching analytics…" />}
      {error && (
        <Card className="p-6">
          <EmptyState icon="fa-solid fa-triangle-exclamation" title="Could not load analytics" hint={error.message} />
        </Card>
      )}

      {!loading && data && (
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-[#0d1117] border border-white/10 rounded-2xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">{chart?.label}</p>
                <p className="text-3xl md:text-4xl font-black tracking-tight mt-1">{fmtMoney(chart?.total)}</p>
                <p className="text-xs font-bold mt-1.5">
                  <DeltaPill delta={chart?.delta} />
                  <span className="text-gray-500 ml-1.5">vs previous {period}</span>
                </p>
              </div>
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                <button onClick={() => setMetric('revenue')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${metric === 'revenue' ? 'bg-[#baf120] text-black' : 'text-gray-400 hover:text-white'}`}>
                  Revenue
                </button>
                <button onClick={() => setMetric('orders')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${metric === 'orders' ? 'bg-[#baf120] text-black' : 'text-gray-400 hover:text-white'}`}>
                  Orders
                </button>
              </div>
            </div>
            <RevenueChart labels={chart?.labels || []} values={chart?.values || []} unit={chart?.unit} hovered={hovered} setHovered={setHovered} />
          </div>

          <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#baf120]/15 text-[#baf120] flex items-center justify-center">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider">Shop Advisor</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#baf120] text-black px-2 py-1 rounded-full">AI</span>
            </div>

            <p className="text-xs text-gray-500 mb-4">Upcoming sales events</p>
            <div className="space-y-2.5 mb-6">
              {(advisor?.events || []).length === 0 && <p className="text-xs text-gray-600">No sales events scheduled.</p>}
              {(advisor?.events || []).slice(0, 3).map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{e.title}</p>
                    <p className="text-[11px] text-gray-500">{e.dateLabel}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${e.status === 'Live' ? 'bg-[#baf120] text-black' : 'bg-white/10 text-gray-300'}`}>{e.status}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mb-4">Recommended for you</p>
            <div className="space-y-3">
              {(advisor?.recommendations || []).length === 0 && <p className="text-xs text-gray-600">No recommendations yet.</p>}
              {(advisor?.recommendations || []).slice(0, 3).map((tip) => (
                <div key={tip.title} className="rounded-xl bg-gradient-to-br from-[#baf120]/10 to-transparent border border-[#baf120]/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <i className={`${tip.icon} text-[#baf120] text-sm`}></i>
                    <h4 className="text-sm font-bold">{tip.title}</h4>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{tip.text}</p>
                  <span className="inline-block mt-2 text-[10px] font-black uppercase tracking-widest text-[#baf120]">{tip.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!loading && data && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center">
                  <i className="fa-solid fa-box"></i>
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider">Inventory</h3>
              </div>
              <button onClick={() => go('catalog')} className="text-xs font-bold text-[#baf120] hover:underline">
                Manage catalog <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>

            {snapshot && (
              <>
                <p className="text-3xl font-black tracking-tight">{snapshot.total}</p>
                <p className="text-xs text-gray-500 mt-1 mb-6">Listings in your catalog</p>
                <div className="space-y-4">
                  {[
                    { label: 'In stock', value: snapshot.active, pct: snapshot.total ? Math.round((snapshot.active / snapshot.total) * 100) : 0, color: 'bg-[#baf120]' },
                    { label: 'Low stock (<20)', value: snapshot.lowStock, pct: snapshot.total ? Math.round((snapshot.lowStock / snapshot.total) * 100) : 0, color: 'bg-amber-400' },
                    { label: 'Sold out', value: snapshot.outOfStock, pct: snapshot.total ? Math.round((snapshot.outOfStock / snapshot.total) * 100) : 0, color: 'bg-gray-500' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="font-bold text-white">{item.value}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-6 pt-5 border-t border-white/10">
              <button onClick={() => go('catalog')} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-300 border border-white/10 hover:border-[#baf120] hover:text-white rounded-xl px-4 py-3 transition-colors">
                <i className="fa-solid fa-plus text-[11px]"></i>
                Add product
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#0d1117] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
                  <i className="fa-solid fa-bell"></i>
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider">Activity Feed</h3>
              </div>
              <button onClick={() => go('orders')} className="text-xs font-bold text-[#baf120] hover:underline">
                All orders <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>

            {feed.length === 0 && <EmptyState icon="fa-solid fa-bell-slash" title="No notifications yet" hint="Order status changes will appear here in real time." />}
            <div className="relative">
              <div className="absolute left-[19px] top-3 bottom-3 w-px bg-white/10"></div>
              <div className="space-y-1">
                {feed.map((a) => (
                  <div key={a.id} className="relative flex items-center gap-4 py-2.5">
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/10 ${a.type === 'order' ? 'bg-[#baf120]/15 text-[#baf120]' : a.type === 'inventory' ? 'bg-amber-500/15 text-amber-400' : 'bg-sky-500/15 text-sky-400'}`}>
                      <i className={`${a.type === 'order' ? 'fa-solid fa-truck-fast' : a.type === 'inventory' ? 'fa-solid fa-boxes-stacked' : 'fa-solid fa-circle-info'} text-sm`}></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-200 truncate">{a.title}</p>
                      <p className="text-[11px] text-gray-500 truncate">{a.message}</p>
                    </div>
                    <span className="text-[11px] text-gray-500 shrink-0">{timeAgo(a.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {!loading && traffic && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-6">
            <SectionTitle icon="fa-solid fa-bullseye" tint="bg-sky-500/15 text-sky-400" title={`Traffic snapshot · ${period}`} />
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-2xl font-black">{fmtCompact(traffic.sessions?.value)}</p>
                <p className="text-xs text-gray-500">Sessions</p>
              </div>
              <div>
                <p className="text-2xl font-black">{traffic.pagesPerVisit?.value}</p>
                <p className="text-xs text-gray-500">Pages / visit</p>
              </div>
              <div>
                <p className="text-2xl font-black">{traffic.bounceRate?.value}%</p>
                <p className="text-xs text-gray-500">Bounce rate</p>
              </div>
              <div>
                <p className="text-2xl font-black">{fmtCompact(traffic.uniqueVisitors?.value)}</p>
                <p className="text-xs text-gray-500">Unique visitors</p>
              </div>
            </div>
            <SectionTitle icon="fa-solid fa-filter" tint="bg-[#baf120]/15 text-[#baf120]" title="Conversion funnel" />
            <div className="space-y-4">
              {(traffic.funnel || []).map((f, i) => {
                const maxFunnel = Math.max(...(traffic.funnel || []).map((x) => x.value), 1)
                const pct = Math.round((f.value / maxFunnel) * 100)
                const stepPct = i === 0 ? 100 : Math.round((f.value / (traffic.funnel[i - 1].value || 1)) * 100)
                return (
                  <div key={f.label}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-gray-400">{f.label}</span>
                      <span className="font-bold text-white">{f.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#7a9e14] to-[#baf120] rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">{i === 0 ? '100% of visitors' : `${stepPct}% of ${traffic.funnel[i - 1].label.toLowerCase()}`}</p>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card className="p-6">
            <SectionTitle icon="fa-solid fa-share-nodes" tint="bg-violet-500/15 text-violet-400" title="Referral sources" />
            <div className="space-y-4">
              {(traffic.sources || []).map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#baf120] shrink-0">
                    <i className={`${s.icon} text-sm`}></i>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-gray-300 truncate">{s.name}</span>
                      <span className="font-bold text-white">{s.sessions.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#baf120] rounded-full" style={{ width: `${s.pct * 2.6}%` }}></div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-500 w-10 text-right">{s.pct}%</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-white/10">
              <button onClick={() => go('analytics')} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-300 border border-white/10 hover:border-[#baf120] hover:text-white rounded-xl px-4 py-3 transition-colors">
                <i className="fa-solid fa-chart-line text-[11px]"></i>
                Open full analytics
              </button>
            </div>
          </Card>
        </section>
      )}
    </>
  )
}
