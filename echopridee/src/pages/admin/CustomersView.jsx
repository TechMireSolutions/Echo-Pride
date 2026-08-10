import React, { useCallback, useEffect, useState } from 'react'
import { adminService } from '../../api'
import { Card, Loading, EmptyState, thCls, tdCls, fmtMoney, timeAgo } from './ui'

export default function CustomersView() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    adminService
      .listCustomers()
      .then((res) => setItems(res?.data?.items || res?.items || []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = items.filter((c) => {
    const q = query.toLowerCase()
    return !q || [c.name, c.email].some((v) => String(v || '').toLowerCase().includes(q))
  })

  const totalSpent = items.reduce((s, c) => s + Number(c.spent || 0), 0)
  const withOrders = items.filter((c) => Number(c.orders) > 0).length

  const stats = [
    { icon: 'fa-solid fa-users', tint: 'bg-sky-500/15 text-sky-400', label: 'Total customers', value: items.length },
    { icon: 'fa-solid fa-bag-shopping', tint: 'bg-[#baf120]/15 text-[#baf120]', label: 'Have ordered', value: withOrders },
    { icon: 'fa-solid fa-sack-dollar', tint: 'bg-violet-500/15 text-violet-400', label: 'Lifetime spend', value: fmtMoney(totalSpent) },
    { icon: 'fa-solid fa-chart-line', tint: 'bg-amber-500/15 text-amber-400', label: 'Avg. spend / buyer', value: withOrders ? fmtMoney(totalSpent / withOrders) : '$0.00' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-tight">Customers</h2>
          <p className="text-xs text-gray-500">Registered users, buyers and their activity.</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:border-[#baf120] text-xs font-bold text-gray-300 hover:text-white rounded-xl px-4 py-2.5 transition-colors">
          <i className="fa-solid fa-rotate text-[11px]"></i>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((c) => (
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
        <Loading label="Loading customers…" />
      ) : error ? (
        <Card className="p-6">
          <EmptyState icon="fa-solid fa-triangle-exclamation" title="Could not load customers" hint={error.message} />
        </Card>
      ) : (
        <Card>
          <div className="flex flex-wrap items-center gap-3 p-4 border-b border-white/10">
            <div className="relative flex-1 min-w-[200px]">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers…" className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#baf120] focus:bg-white/10" />
            </div>
            <span className="text-xs font-bold text-gray-500">{filtered.length} customers</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className={thCls}>Customer</th>
                  <th className={thCls}>Orders</th>
                  <th className={thCls}>Total spent</th>
                  <th className={thCls}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                    <td className={tdCls}>
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-[#baf120] shrink-0">
                          {String(c.name || c.email || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{c.name || '—'}</p>
                          <p className="text-xs text-gray-500 truncate">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`${tdCls} text-gray-300`}>{c.orders}</td>
                    <td className={`${tdCls} font-bold text-white`}>{fmtMoney(c.spent)}</td>
                    <td className={`${tdCls} text-gray-500 text-xs`}>{timeAgo(c.joinedAt)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-10 text-center text-sm text-gray-500">{query ? `No customers match "${query}".` : 'No customers yet.'}</td>
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
