import React, { useCallback, useEffect, useState } from 'react'
import { adminService } from '../../api'
import { Card, Loading, EmptyState, Toast, useToast, Modal, inputCls, labelCls, thCls, tdCls, timeAgo, fmtMoney } from './ui'

const initialForm = { name: '', email: '', subject: '', message: '', status: 'new' }

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function InquiriesView() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(initialForm)
  const { toast, push } = useToast()

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    adminService
      .listInquiries()
      .then((res) => setItems(res?.data?.items || res?.items || []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = items.filter((i) => {
    const q = query.toLowerCase()
    return !q || [i.name, i.email, i.subject].some((v) => String(v || '').toLowerCase().includes(q))
  })

  const openReply = (item) => {
    setModal(item)
    setForm({ name: item.name, email: item.email, subject: item.subject, message: '', status: item.status })
  }

  const sendReply = () => {
    if (!form.message.trim()) {
      push('error', 'Reply message is required.')
      return
    }
    setModal(null)
    push('ok', `Reply to ${form.name} queued.`)
  }

  return (
    <div className="space-y-4">
      {toast && <Toast toast={toast} />}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-tight">Inquiries</h2>
          <p className="text-xs text-gray-500">Customer messages and contact form submissions.</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:border-[#baf120] text-xs font-bold text-gray-300 hover:text-white rounded-xl px-4 py-2.5 transition-colors">
          <i className="fa-solid fa-rotate text-[11px]"></i>
          Refresh
        </button>
      </div>

      {loading ? (
        <Loading label="Loading inquiries…" />
      ) : error ? (
        <Card className="p-6">
          <EmptyState icon="fa-solid fa-triangle-exclamation" title="Could not load inquiries" hint={error.message} />
        </Card>
      ) : (
        <Card>
          <div className="flex flex-wrap items-center gap-3 p-4 border-b border-white/10">
            <div className="relative flex-1 min-w-[200px]">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email or subject…" className={`${inputCls} pl-10`} />
            </div>
            <span className="text-xs font-bold text-gray-500">{filtered.length} messages</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className={thCls}>Customer</th>
                  <th className={thCls}>Subject</th>
                  <th className={thCls}>Received</th>
                  <th className={thCls}>Status</th>
                  <th className={`${thCls} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                    <td className={tdCls}>
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-[#baf120] shrink-0">
                          {String(i.name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{i.name}</p>
                          <p className="text-xs text-gray-500 truncate">{i.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`${tdCls} text-gray-300 max-w-[260px] truncate`}>{i.subject}</td>
                    <td className={`${tdCls} text-gray-500 text-xs`}>{timeAgo(i.createdAt)}</td>
                    <td className={tdCls}>
                      <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${i.status === 'new' ? 'bg-sky-500/15 text-sky-400' : i.status === 'open' ? 'bg-amber-500/15 text-amber-400' : i.status === 'closed' ? 'bg-[#baf120]/15 text-[#baf120]' : 'bg-white/10 text-gray-400'}`}>{i.status}</span>
                    </td>
                    <td className={`${tdCls} text-right whitespace-nowrap`}>
                      <button onClick={() => openReply(i)} className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-[#baf120] rounded-lg px-3 py-1.5 transition-colors">
                        <i className="fa-solid fa-reply text-[10px]"></i>
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-sm text-gray-500">No inquiries match "{query}".</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={`Reply to ${modal?.name || ''}`}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Name</label>
              <input value={form.name} disabled className={`${inputCls} opacity-60`} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input value={form.email} disabled className={`${inputCls} opacity-60`} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Original subject</label>
            <input value={form.subject} disabled className={`${inputCls} opacity-60`} />
          </div>
          <div>
            <label className={labelCls}>Reply message</label>
            <textarea rows="5" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Write your response to the customer…" className={inputCls} />
          </div>
          <div className="flex items-center justify-between gap-2 pt-2">
            <span className="text-[11px] text-gray-500">Mark as {form.status === 'new' ? 'open' : 'closed'} after replying.</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setModal(null)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-400 border border-white/10 hover:text-white hover:border-white/20 transition-colors">
                Cancel
              </button>
              <button onClick={sendReply} className="px-5 py-2.5 rounded-xl text-sm font-black bg-[#baf120] text-black hover:bg-[#a6e216] transition-colors">
                Send reply
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
