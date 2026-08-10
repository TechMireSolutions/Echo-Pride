import React, { useCallback, useEffect, useState } from 'react'
import { adminService } from '../../api'
import { Card, Loading, EmptyState, thCls, tdCls, timeAgo } from './ui'

export default function SurveysView() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    adminService
      .listSurveys()
      .then((res) => setItems(res?.data?.items || res?.items || []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const avg = items.length ? (items.reduce((s, x) => s + Number(x.rating || 0), 0) / items.length).toFixed(2) : '—'
  const sources = [...new Set(items.map((i) => i.source).filter(Boolean))]

  const filtered = items.filter((i) => {
    const q = query.toLowerCase()
    const matchesQ = !q || [i.email, i.feedback].some((v) => String(v || '').toLowerCase().includes(q))
    const matchesS = !sourceFilter || i.source === sourceFilter
    return matchesQ && matchesS
  })

  const renderStars = (rating) => (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={`fa-solid fa-star text-[10px] ${n <= Math.round(rating) ? 'text-[#baf120]' : 'text-white/10'}`}></i>
      ))}
    </span>
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-black tracking-tight">Surveys</h2>
        <p className="text-xs text-gray-500">Store feedback responses and ratings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { icon: 'fa-solid fa-clipboard-check', tint: 'bg-[#baf120]/15 text-[#baf120]', label: 'Total responses', value: items.length },
          { icon: 'fa-solid fa-star', tint: 'bg-amber-500/15 text-amber-400', label: 'Average rating', value: avg },
          { icon: 'fa-solid fa-envelope', tint: 'bg-sky-500/15 text-sky-400', label: 'Unique emails', value: new Set(items.map((i) => i.email).filter(Boolean)).size },
          { icon: 'fa-solid fa-thumbs-up', tint: 'bg-violet-500/15 text-violet-400', label: 'Positive (4★+)', value: items.filter((i) => Number(i.rating) >= 4).length },
        ].map((c) => (
          <div key={c.label} className="bg-[#0d1117] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
            <div className={`w-10 h-10 rounded-xl ${c.tint} flex items-center justify-center mb-4`}>
              <i className={`${c.icon} text-sm`}></i>
            </div>
            <p className="text-2xl font-black tracking-tight">{c.value}</p>
            <p className="text-xs text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <Loading label="Loading survey responses…" />
      ) : error ? (
        <Card className="p-6">
          <EmptyState icon="fa-solid fa-triangle-exclamation" title="Could not load surveys" hint={error.message} />
        </Card>
      ) : (
        <Card>
          <div className="flex flex-wrap items-center gap-3 p-4 border-b border-white/10">
            <div className="relative flex-1 min-w-[200px]">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by email or feedback…" className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#baf120] focus:bg-white/10" />
            </div>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
              <button onClick={() => setSourceFilter('')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${!sourceFilter ? 'bg-[#baf120] text-black' : 'text-gray-400 hover:text-white'}`}>All</button>
              {sources.map((s) => (
                <button key={s} onClick={() => setSourceFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${sourceFilter === s ? 'bg-[#baf120] text-black' : 'text-gray-400 hover:text-white'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className={thCls}>Email</th>
                  <th className={thCls}>Rating</th>
                  <th className={thCls}>Feedback</th>
                  <th className={thCls}>Source</th>
                  <th className={thCls}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                    <td className={`${tdCls} text-gray-300`}>{i.email || '—'}</td>
                    <td className={tdCls}>{renderStars(i.rating)}</td>
                    <td className={`${tdCls} text-gray-400 max-w-[320px]`}>
                      <span className="line-clamp-2">{i.feedback || '—'}</span>
                    </td>
                    <td className={`${tdCls} text-gray-500 text-xs`}>{i.source || '—'}</td>
                    <td className={`${tdCls} text-gray-500 text-xs`}>{timeAgo(i.createdAt)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-sm text-gray-500">No survey responses found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
