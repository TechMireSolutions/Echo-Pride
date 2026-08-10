import React, { useEffect, useRef, useState } from 'react'
import { orderService, adminService, getToken, ApiError } from '../../api'
import {
  Card, Modal, Loading, EmptyState, Toast, useToast,
  inputCls, labelCls, thCls, tdCls,
  ORDER_FLOW, canonicalStatus, canonicalLabel, fmtMoney, timeAgo,
} from './ui'

const STATUS_CHIPS = [
  { key: '', label: 'All' },
  { key: 'received', label: 'Pending' },
  { key: 'packing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'refunded', label: 'Refunded' },
]

const SOURCE_CHIPS = [
  { key: '', label: 'All orders' },
  { key: '0', label: 'Live' },
  { key: '1', label: 'Demo' },
]

const FLOW_TRANSITIONS = {
  received: ['packing', 'cancelled'],
  packing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled', 'refunded'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
}

const STEP_COLORS = {
  received: 'bg-sky-500/15 text-sky-400',
  packing: 'bg-amber-500/15 text-amber-400',
  shipped: 'bg-violet-500/15 text-violet-400',
  delivered: 'bg-[#baf120]/15 text-[#baf120]',
  cancelled: 'bg-rose-500/15 text-rose-400',
  refunded: 'bg-rose-500/15 text-rose-400',
}

function OrderStatusBadge({ status }) {
  const k = canonicalStatus(status)
  const cls = STEP_COLORS[k] || 'bg-white/10 text-gray-400'
  return <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${cls}`}>{canonicalLabel(status)}</span>
}

function useLiveNotifications({ onEvent }) {
  const [connected, setConnected] = useState(false)
  const cbRef = useRef(onEvent)
  cbRef.current = onEvent

  useEffect(() => {
    const token = getToken()
    if (!token) return undefined
    let es
    try {
      es = new EventSource(`/api/notifications/stream?token=${encodeURIComponent(token)}`)
    } catch {
      return undefined
    }
    es.onopen = () => setConnected(true)
    es.onerror = () => setConnected(false)
    es.onmessage = (e) => {
      try {
        cbRef.current?.(JSON.parse(e.data))
      } catch {
        /* ignore malformed frames */
      }
    }
    return () => es.close()
  }, [])

  return connected
}

function LifecycleStepper({ order }) {
  const current = canonicalStatus(order.canonicalStatus)
  const isTerminal = current === 'cancelled' || current === 'refunded'
  const stepIdx = ORDER_FLOW.findIndex((s) => s.key === current)

  return (
    <div>
      <div className="flex items-center">
        {ORDER_FLOW.map((step, i) => {
          const reached = !isTerminal && i <= stepIdx
          const isLast = i === ORDER_FLOW.length - 1
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border text-xs font-black transition-colors ${
                    reached ? 'bg-[#baf120] border-[#baf120] text-black' : 'bg-white/5 border-white/10 text-gray-500'
                  }`}
                >
                  <i className={`fa-solid ${reached ? 'fa-check' : 'fa-lock'} text-[10px]`}></i>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${reached ? 'text-white' : 'text-gray-600'}`}>{step.label}</span>
              </div>
              {!isLast && (
                <div className={`flex-1 h-px mx-2 mb-5 ${i < stepIdx && !isTerminal ? 'bg-[#baf120]' : 'bg-white/10'}`}></div>
              )}
            </div>
          )
        })}
      </div>
      {isTerminal && (
        <p className="text-center text-xs font-bold mt-4">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${STEP_COLORS[current]}`}>
            <i className={`fa-solid ${current === 'cancelled' ? 'fa-ban' : 'fa-rotate-left'} text-[10px]`}></i>
            {canonicalLabel(current)}
          </span>
        </p>
      )}
    </div>
  )
}

export default function OrdersView() {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [demo, setDemo] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const { toast, push } = useToast()
  const [feedOpen, setFeedOpen] = useState(false)
  const [feed, setFeed] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    setError(null)
    orderService
      .list({ status, demo, search: query, page, limit: 15 })
      .then((res) => {
        setOrders(res?.items || [])
        setTotal(res?.total || 0)
        setPages(res?.pages || 1)
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }

  useEffect(load, [status, demo, page])
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1)
      load()
    }, 350)
    return () => clearTimeout(t)
  }, [query])

  const refreshFeed = () => {
    adminService
      .listNotifications({ limit: 20 })
      .then((res) => {
        setFeed(res?.items || [])
        setUnreadCount(res?.unreadCount || 0)
      })
      .catch(() => {})
  }

  useEffect(() => {
    refreshFeed()
    const t = setInterval(refreshFeed, 30000)
    return () => clearInterval(t)
  }, [])

  useLiveNotifications({ onEvent: (n) => {
    setFeed((prev) => [n, ...prev.filter((x) => x.id !== n.id)].slice(0, 30))
    if (n && !n.isRead) setUnreadCount((c) => c + 1)
  } })

  const openOrder = (o) => {
    setSelected(o)
    setNote('')
    setBusy(false)
    orderService.getById(o.id).then((res) => {
      const fresh = res?.data?.order || res?.order || res
      if (fresh && fresh.id === o.id) setSelected(fresh)
    }).catch(() => {})
  }

  const refreshSelected = (updated) => {
    if (selected && updated && updated.id === selected.id) setSelected(updated)
  }

  const doTransition = (toStatus) => {
    if (!selected || busy) return
    setBusy(true)
    orderService
      .updateStatus(selected.id, toStatus, note)
      .then((res) => {
        const updated = res?.data?.order || res?.order || res
        const list = orders.map((o) => (o.id === updated.id ? updated : o))
        setOrders(list)
        refreshSelected(updated)
        push('ok', `Order ${updated.orderNumber} moved to ${canonicalLabel(updated.status)}.`)
        setNote('')
      })
      .catch((err) => {
        push('err', err instanceof ApiError ? err.message : 'Could not update order status.')
      })
      .finally(() => setBusy(false))
  }

  const markRead = () => {
    adminService
      .markAllNotificationsRead()
      .then(() => {
        setUnreadCount(0)
        setFeed((prev) => prev.map((n) => ({ ...n, isRead: true })))
      })
      .catch(() => {})
  }

  const markOneRead = (n) => {
    if (n.isRead) return
    adminService.markNotificationsRead([n.id]).catch(() => {})
    setUnreadCount((c) => Math.max(0, c - 1))
    setFeed((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)))
  }

  const current = selected ? canonicalStatus(selected.canonicalStatus) : ''
  const flowNext = selected ? FLOW_TRANSITIONS[current] || [] : []

  const quickNext = (o) => FLOW_TRANSITIONS[canonicalStatus(o.canonicalStatus)] || []

  const doDelete = () => {
    if (!confirmDelete || deleting) return
    setDeleting(true)
    orderService
      .remove(confirmDelete.id)
      .then(() => {
        const removed = confirmDelete
        setOrders((list) => list.filter((o) => o.id !== removed.id))
        setTotal((t) => Math.max(0, t - 1))
        if (selected?.id === removed.id) setSelected(null)
        push('ok', `Order ${removed.orderNumber} removed.`)
        setConfirmDelete(null)
      })
      .catch((err) => {
        push('err', err instanceof ApiError ? err.message : 'Could not remove the order.')
      })
      .finally(() => setDeleting(false))
  }

  const doQuickTransition = (o, toStatus) => {
    setBusy(true)
    orderService
      .updateStatus(o.id, toStatus)
      .then((res) => {
        const updated = res?.data?.order || res?.order || res
        setOrders((list) => list.map((x) => (x.id === updated.id ? updated : x)))
        refreshSelected(updated)
        push('ok', `Order ${updated.orderNumber} → ${canonicalLabel(updated.status)}.`)
      })
      .catch((err) => {
        push('err', err instanceof ApiError ? err.message : 'Could not update order status.')
      })
      .finally(() => setBusy(false))
  }

  return (
    <>
      <Toast toast={toast} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-tight">Orders</h2>
          <p className="text-xs text-gray-500">
            {total} {demo === '0' ? 'live' : demo === '1' ? 'demo' : ''} orders · demo orders tagged with a badge
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setFeedOpen((v) => !v)}
            className="relative w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#baf120] transition-colors"
            aria-label="Notifications"
          >
            <i className="fa-solid fa-bell"></i>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          {feedOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setFeedOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-96 max-w-[85vw] z-50 bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <p className="text-xs font-black uppercase tracking-widest">Notifications</p>
                  {unreadCount > 0 && (
                    <button onClick={markRead} className="text-[11px] font-bold text-[#baf120] hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {feed.length === 0 && <EmptyState icon="fa-solid fa-bell-slash" title="No notifications yet" hint="Order updates will appear here in real time." />}
                  {feed.map((n) => (
                    <button key={n.id} onClick={() => markOneRead(n)} className={`w-full text-left px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors ${n.isRead ? 'opacity-60' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${n.isRead ? 'bg-white/20' : 'bg-[#baf120]'}`}></span>
                        <p className="text-sm font-bold truncate">{n.title}</p>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{n.message}</p>
                      <p className="text-[10px] text-gray-600 mt-1">{timeAgo(n.createdAt)}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-white/10">
          <div className="relative flex-1 min-w-[200px]">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order number…" className={`${inputCls} pl-10`} />
          </div>
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 flex-wrap">
            {STATUS_CHIPS.map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  setStatus(s.key)
                  setPage(1)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${status === s.key ? 'bg-[#baf120] text-black' : 'text-gray-400 hover:text-white'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            {SOURCE_CHIPS.map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  setDemo(s.key)
                  setPage(1)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${demo === s.key ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Loading label="Loading orders…" />
        ) : error ? (
          <div className="p-6">
            <EmptyState icon="fa-solid fa-triangle-exclamation" title="Could not load orders" hint={error.message} />
          </div>
        ) : orders.length === 0 ? (
          <EmptyState icon="fa-solid fa-inbox" title="No orders found" hint="Try a different status filter or search term." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className={thCls}>Order</th>
                  <th className={thCls}>Customer</th>
                  <th className={thCls}>Items</th>
                  <th className={thCls}>Total</th>
                  <th className={thCls}>Status</th>
                  <th className={thCls}>Placed</th>
                  <th className={`${thCls} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                    <td className={tdCls}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#baf120]">{o.orderNumber}</span>
                        {o.isDemo && (
                          <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded px-1.5 py-0.5">Demo</span>
                        )}
                      </div>
                    </td>
                    <td className={tdCls}>
                      <p className="font-bold text-white">{o.customer?.name || 'Guest'}</p>
                      {o.customer?.email && <p className="text-xs text-gray-500 truncate max-w-[180px]">{o.customer.email}</p>}
                    </td>
                    <td className={`${tdCls} text-gray-300`}>{o.items?.length || 0}</td>
                    <td className={`${tdCls} font-bold text-white`}>{fmtMoney(o.total)}</td>
                    <td className={tdCls}>
                      <OrderStatusBadge status={o.canonicalStatus} />
                    </td>
                    <td className={`${tdCls} text-gray-500 text-xs`}>{timeAgo(o.createdAt)}</td>
                    <td className={`${tdCls} text-right whitespace-nowrap`}>
                      {quickNext(o).length > 0 && (
                        <button
                          onClick={() => doQuickTransition(o, quickNext(o)[0])}
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-[#baf120] text-black hover:bg-[#a6e216] disabled:opacity-50 rounded-lg px-3 py-1.5 mr-2 transition-colors"
                          aria-label={`Mark order ${o.orderNumber} as ${canonicalLabel(quickNext(o)[0])}`}
                        >
                          <i className="fa-solid fa-arrow-right text-[10px]"></i>
                          {canonicalLabel(quickNext(o)[0])}
                        </button>
                      )}
                      <button onClick={() => openOrder(o)} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 border border-white/10 hover:border-[#baf120] hover:text-[#baf120] rounded-lg px-3 py-1.5 transition-colors">
                        View <i className="fa-solid fa-arrow-right text-[10px]"></i>
                      </button>
                      <button
                        onClick={() => setConfirmDelete(o)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 border border-white/10 hover:border-rose-500 hover:text-rose-400 rounded-lg px-3 py-1.5 transition-colors"
                        aria-label={`Remove order ${o.orderNumber}`}
                        title="Remove order"
                      >
                        <i className="fa-solid fa-trash text-[10px]"></i>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
            <p className="text-xs text-gray-500">Page {page} of {pages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 flex items-center justify-center transition-colors"
                aria-label="Previous page"
              >
                <i className="fa-solid fa-chevron-left text-[10px]"></i>
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 flex items-center justify-center transition-colors"
                aria-label="Next page"
              >
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </div>
          </div>
        )}
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Order ${selected?.orderNumber || ''}`} wide>
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-gray-500">Placed {timeAgo(selected.createdAt)} · {selected.paymentMethod || 'Card'}</p>
                <div className="mt-1 flex items-center gap-2">
                  <OrderStatusBadge status={selected.canonicalStatus} />
                  {selected.isDemo && (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-full px-2 py-1">Demo order</span>
                  )}
                </div>
              </div>
              <p className="text-2xl font-black tracking-tight">{fmtMoney(selected.total)}</p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Customer</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div>
                  <p className="font-bold text-white">
                    {selected.customer?.name || selected.shippingAddress?.fullName || 'Guest'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selected.customer ? selected.customer.email || 'Registered customer' : 'Guest checkout (no account)'}
                  </p>
                </div>
                {selected.shippingAddress?.phone && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Phone</p>
                    <p className="font-bold text-white">{selected.shippingAddress.phone}</p>
                  </div>
                )}
                {selected.customer?.email && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Email</p>
                    <p className="font-bold text-white">{selected.customer.email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Lifecycle</p>
              <LifecycleStepper order={selected} />
            </div>

            {flowNext.length > 0 && (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Update status</p>
                <div className="flex flex-wrap items-center gap-2">
                  {flowNext.map((to) => (
                    <button
                      key={to}
                      onClick={() => doTransition(to)}
                      disabled={busy}
                      className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-[#baf120] text-black hover:bg-[#a6e216] disabled:opacity-50 rounded-xl px-4 py-2.5 transition-colors"
                    >
                      <i className={`fa-solid ${to === 'cancelled' ? 'fa-ban' : to === 'refunded' ? 'fa-rotate-left' : 'fa-arrow-right'} text-[10px]`}></i>
                      Move to {canonicalLabel(to)}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <label className={labelCls}>Note (optional)</label>
                  <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note to the status change…" className={inputCls} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Items</p>
                <div className="space-y-3">
                  {selected.items?.map((it) => (
                    <div key={it.id} className="flex items-center gap-3">
                      <span className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm text-gray-400 shrink-0">
                        <i className="fa-solid fa-box"></i>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold truncate">{it.productName}</p>
                        <p className="text-xs text-gray-500">{it.quantity} × {fmtMoney(it.price)}</p>
                      </div>
                      <p className="text-sm font-bold">{fmtMoney(it.price * it.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 space-y-1 text-sm">
                  <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{fmtMoney(selected.subtotal)}</span></div>
                  <div className="flex justify-between text-gray-400"><span>Tax</span><span>{fmtMoney(selected.tax)}</span></div>
                  <div className="flex justify-between font-black text-white pt-1"><span>Total</span><span>{fmtMoney(selected.total)}</span></div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Ship to</p>
                {selected.shippingAddress?.fullName ? (
                  <div className="text-sm space-y-1 text-gray-300">
                    <p className="font-bold text-white">{selected.shippingAddress.fullName}</p>
                    {selected.shippingAddress.phone && <p>{selected.shippingAddress.phone}</p>}
                    <p>{selected.shippingAddress.addressLine1}</p>
                    {selected.shippingAddress.addressLine2 && <p>{selected.shippingAddress.addressLine2}</p>}
                    <p>{[selected.shippingAddress.city, selected.shippingAddress.state, selected.shippingAddress.postalCode].filter(Boolean).join(', ')}</p>
                    {selected.shippingAddress.country && <p>{selected.shippingAddress.country}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No shipping details.</p>
                )}

                <div className="mt-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">History</p>
                  <div className="relative">
                    <div className="absolute left-[9px] top-2 bottom-2 w-px bg-white/10"></div>
                    <div className="space-y-4">
                      {(selected.history || []).map((h) => (
                        <div key={h.id} className="relative flex items-start gap-4">
                          <span className="relative z-10 w-[19px] h-[19px] rounded-full border-2 border-[#0d1117] bg-[#baf120] shrink-0"></span>
                          <div className="min-w-0">
                            <p className="text-sm font-bold">
                              {h.fromStatus ? `${canonicalLabel(h.fromStatus)} → ` : ''}{canonicalLabel(h.toStatus || h.to_status)}
                            </p>
                            <p className="text-xs text-gray-500">{timeAgo(h.createdAt)} {h.actor ? `· ${h.actor}` : ''}</p>
                            {h.note && <p className="text-xs text-gray-400 mt-0.5">{h.note}</p>}
                          </div>
                        </div>
                      ))}
                      {(!selected.history || selected.history.length === 0) && (
                        <p className="text-xs text-gray-600">No status changes yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => !deleting && setConfirmDelete(null)} title="Remove order">
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <i className="fa-solid fa-trash-can text-sm"></i>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Remove order {confirmDelete?.orderNumber}?</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                This will permanently delete the order, its items, and its status history from the database. This action
                cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setConfirmDelete(null)}
              disabled={deleting}
              className="text-xs font-bold uppercase tracking-wider text-gray-300 border border-white/10 hover:border-white/30 rounded-lg px-4 py-2.5 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={doDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-rose-500 text-white hover:bg-rose-400 disabled:opacity-50 rounded-lg px-4 py-2.5 transition-colors"
            >
              {deleting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Removing…
                </>
              ) : (
                <>
                  <i className="fa-solid fa-trash-can text-[10px]"></i> Yes, remove order
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
