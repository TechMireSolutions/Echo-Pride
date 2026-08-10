import React, { useCallback, useEffect, useState } from 'react'
import { adminService } from '../../api'
import { Card, Loading, EmptyState, Toast, useToast, thCls, tdCls, timeAgo } from './ui'

const TYPE_ICON = {
  order: { icon: 'fa-solid fa-truck-fast', tint: 'bg-[#baf120]/15 text-[#baf120]' },
  inventory: { icon: 'fa-solid fa-boxes-stacked', tint: 'bg-amber-500/15 text-amber-400' },
  inquiry: { icon: 'fa-solid fa-envelope', tint: 'bg-sky-500/15 text-sky-400' },
  survey: { icon: 'fa-solid fa-clipboard-check', tint: 'bg-violet-500/15 text-violet-400' },
}

export default function NotificationsView() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const { toast, push } = useToast()

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    adminService
      .listNotifications({ limit: 100, unread: unreadOnly || undefined })
      .then((res) => setItems(res?.data?.items || res?.items || []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [unreadOnly])

  useEffect(() => {
    load()
  }, [load])

  const unread = items.filter((n) => !n.isRead).length

  const markRead = async (n) => {
    if (n.isRead) return
    await adminService.markNotificationsRead([n.id])
    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)))
  }

  const markAll = async () => {
    await adminService.markAllNotificationsRead()
    setItems((prev) => prev.map((x) => ({ ...x, isRead: true })))
    push('ok', 'All notifications marked as read.')
  }

  const meta = (n) => TYPE_ICON[n.type] || { icon: 'fa-solid fa-circle-info', tint: 'bg-sky-500/15 text-sky-400' }

  return (
    <div className="space-y-4">
      {toast && <Toast toast={toast} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-tight">Notifications</h2>
          <p className="text-xs text-gray-500">{unread} unread · order, inventory and customer events.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setUnreadOnly((v) => !v)} className={`inline-flex items-center gap-2 border text-xs font-bold rounded-xl px-4 py-2.5 transition-colors ${unreadOnly ? 'bg-[#baf120] text-black border-[#baf120]' : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:border-[#baf120]'}`}>
            <i className="fa-solid fa-filter text-[11px]"></i>
            Unread only
          </button>
          <button onClick={markAll} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:border-[#baf120] text-xs font-bold text-gray-300 hover:text-white rounded-xl px-4 py-2.5 transition-colors">
            <i className="fa-solid fa-check-double text-[11px]"></i>
            Mark all read
          </button>
        </div>
      </div>

      {loading ? (
        <Loading label="Loading notifications…" />
      ) : error ? (
        <Card className="p-6">
          <EmptyState icon="fa-solid fa-triangle-exclamation" title="Could not load notifications" hint={error.message} />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className={thCls}>Type</th>
                  <th className={thCls}>Message</th>
                  <th className={thCls}>Time</th>
                  <th className={`${thCls} text-right`}>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((n) => {
                  const m = meta(n)
                  return (
                    <tr key={n.id} onClick={() => markRead(n)} className={`border-b border-white/5 last:border-0 transition-colors cursor-pointer ${n.isRead ? '' : 'hover:bg-white/[0.03]'}`}>
                      <td className={tdCls}>
                        <div className={`relative z-10 w-9 h-9 rounded-full ${m.tint} flex items-center justify-center shrink-0`}>
                          <i className={`${m.icon} text-sm`}></i>
                        </div>
                      </td>
                      <td className={tdCls}>
                        <p className={`text-sm ${n.isRead ? 'text-gray-400' : 'text-white font-bold'}`}>{n.title}</p>
                        <p className="text-[11px] text-gray-500 truncate max-w-[420px]">{n.message}</p>
                      </td>
                      <td className={`${tdCls} text-gray-500 text-xs`}>{timeAgo(n.createdAt)}</td>
                      <td className={`${tdCls} text-right`}>
                        {n.isRead ? (
                          <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-gray-400">Read</span>
                        ) : (
                          <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#baf120] text-black">New</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {items.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-10 text-center text-sm text-gray-500">{unreadOnly ? 'No unread notifications.' : 'No notifications yet.'}</td>
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
