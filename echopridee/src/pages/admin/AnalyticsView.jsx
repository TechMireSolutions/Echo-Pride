import React, { useEffect, useState } from 'react'
import { analyticsService } from '../../api'
import {
  Card, SectionTitle, RevenueChart, Sparkline, Loading, EmptyState,
  fmtMoney, fmtCompact, DeltaPill,
} from './ui'

const PERIODS = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
]

const KPIS = [
  { key: 'views', label: 'Total Views', icon: 'fa-solid fa-eye', tint: 'bg-sky-500/15 text-sky-400' },
  { key: 'visits', label: 'Visits', icon: 'fa-solid fa-user-group', tint: 'bg-[#baf120]/15 text-[#baf120]' },
  { key: 'orders', label: 'Orders', icon: 'fa-solid fa-cart-shopping', tint: 'bg-violet-500/15 text-violet-400' },
  { key: 'conversionRate', label: 'Conversion Rate', icon: 'fa-solid fa-percent', tint: 'bg-amber-500/15 text-amber-400' },
]

export default function AnalyticsView() {
  const [period, setPeriod] = useState('month')
  const [metric, setMetric] = useState('revenue')
  const [hovered, setHovered] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      analyticsService.overview(period),
      analyticsService.chart(period, metric),
      analyticsService.traffic(period),
    ])
      .then(([overview, chart, traffic]) => {
        if (cancelled) return
        setData({ overview, chart, traffic })
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

  const overview = data?.overview
  const chart = data?.chart
  const traffic = data?.traffic

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-tight">Analytics</h2>
          <p className="text-xs text-gray-500">Traffic, views and conversion metrics in detail.</p>
        </div>
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          {PERIODS.map((t) => (
            <button key={t.key} onClick={() => setPeriod(t.key)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${period === t.key ? 'bg-[#baf120] text-black' : 'text-gray-400 hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading && !data && <Loading label="Crunching analytics…" />}
      {error && (
        <Card className="p-6">
          <EmptyState icon="fa-solid fa-triangle-exclamation" title="Could not load analytics" hint={error.message} />
        </Card>
      )}

      {!loading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {KPIS.map((kpi) => {
            const m = overview?.stats?.[kpi.key] || { value: 0, delta: 0, spark: [] }
            return (
              <Card key={kpi.key} className="p-5 hover:border-white/20 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${kpi.tint} flex items-center justify-center`}>
                    <i className={`${kpi.icon} text-sm`}></i>
                  </div>
                  <DeltaPill delta={m.delta} />
                </div>
                <p className="text-2xl md:text-[1.7rem] font-black tracking-tight">
                  {kpi.key === 'conversionRate' ? `${Number(m.value).toFixed(2)}%` : fmtCompact(m.value)}
                </p>
                <p className="text-xs text-gray-500 mt-1 mb-3">{kpi.label}</p>
                <Sparkline data={m.spark} />
              </Card>
            )
          })}
        </div>
      )}

      {!loading && data && (
        <Card className="p-6">
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
              <button onClick={() => setMetric('revenue')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${metric === 'revenue' ? 'bg-[#baf120] text-black' : 'text-gray-400 hover:text-white'}`}>Revenue</button>
              <button onClick={() => setMetric('orders')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${metric === 'orders' ? 'bg-[#baf120] text-black' : 'text-gray-400 hover:text-white'}`}>Orders</button>
            </div>
          </div>
          <RevenueChart labels={chart?.labels || []} values={chart?.values || []} unit={chart?.unit} hovered={hovered} setHovered={setHovered} />
        </Card>
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
              {(traffic.funnel || []).length === 0 && <p className="text-xs text-gray-600">No funnel data for this period yet.</p>}
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
              {(traffic.sources || []).length === 0 && <p className="text-xs text-gray-600">No referral data for this period yet.</p>}
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
          </Card>
        </section>
      )}
    </div>
  )
}
