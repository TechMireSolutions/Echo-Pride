import React, { useState } from 'react'

export const inputCls =
  'w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#baf120] focus:bg-white/10'
export const labelCls = 'block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1.5'
export const thCls = 'text-left text-[10px] font-black uppercase tracking-widest text-gray-500 px-4 py-3 whitespace-nowrap'
export const tdCls = 'px-4 py-3.5 text-sm'

export const ORDER_FLOW = [
  { key: 'received', label: 'Received' },
  { key: 'packing', label: 'Packing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
]

const STATUS_ALIAS = {
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

export function canonicalStatus(status) {
  const s = String(status || '').toLowerCase()
  return STATUS_ALIAS[s] || s || 'received'
}

export function canonicalLabel(status) {
  const k = canonicalStatus(status)
  const step = ORDER_FLOW.find((o) => o.key === k)
  if (step) return step.label
  return k.charAt(0).toUpperCase() + k.slice(1)
}

export function fmtMoney(n) {
  const num = Number(n) || 0
  return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function fmtCompact(n) {
  const num = Number(n) || 0
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}k`
  return String(Math.round(num))
}

export function timeAgo(dateStr) {
  if (!dateStr) return ''
  const d = new Date(String(dateStr).replace(' ', 'T') + 'Z')
  if (Number.isNaN(d.getTime())) return dateStr
  const s = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000))
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hr ago`
  const days = Math.floor(h / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function Card({ children, className = '' }) {
  return <div className={`bg-[#0d1117] border border-white/10 rounded-2xl ${className}`}>{children}</div>
}

export function SectionTitle({ icon, tint, title, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${tint} flex items-center justify-center`}>
          <i className={icon}></i>
        </div>
        <h3 className="text-sm font-black uppercase tracking-wider">{title}</h3>
      </div>
      {action}
    </div>
  )
}

export function StatCard({ icon, tint, label, value, sub }) {
  return (
    <Card className="p-5 hover:border-white/20 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl ${tint} flex items-center justify-center`}>
          <i className={`${icon} text-sm`}></i>
        </div>
      </div>
      <p className="text-2xl font-black tracking-tight">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
      <p className="text-[11px] font-bold text-green-400 mt-2">{sub}</p>
    </Card>
  )
}

export function StatusBadge({ status }) {
  const k = canonicalStatus(status)
  const map = {
    active: 'bg-[#baf120]/15 text-[#baf120]',
    in_stock: 'bg-[#baf120]/15 text-[#baf120]',
    sold_out: 'bg-white/10 text-gray-400',
    out_of_stock: 'bg-white/10 text-gray-400',
    low_stock: 'bg-amber-500/15 text-amber-400',
    expired: 'bg-amber-500/15 text-amber-400',
    pending: 'bg-amber-500/15 text-amber-400',
    paid: 'bg-[#baf120]/15 text-[#baf120]',
    completed: 'bg-[#baf120]/15 text-[#baf120]',
    live: 'bg-[#baf120]/15 text-[#baf120]',
    draft: 'bg-white/10 text-gray-400',
    connected: 'bg-[#baf120]/15 text-[#baf120]',
    disconnected: 'bg-rose-500/15 text-rose-400',
    refunded: 'bg-rose-500/15 text-rose-400',
    cancelled: 'bg-rose-500/15 text-rose-400',
    received: 'bg-sky-500/15 text-sky-400',
    packing: 'bg-amber-500/15 text-amber-400',
    shipped: 'bg-violet-500/15 text-violet-400',
    delivered: 'bg-[#baf120]/15 text-[#baf120]',
    new: 'bg-sky-500/15 text-sky-400',
    inactive: 'bg-white/10 text-gray-400',
  }
  const cls = map[k] || map[k] || 'bg-white/10 text-gray-400'
  const text = status === 'out_of_stock' || status === 'in_stock' || status === 'low_stock'
    ? status.replace('_', ' ')
    : status
  return <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${cls}`}>{text}</span>
}

export function Toggle({ on, onClick, label }) {
  return (
    <button onClick={onClick} aria-label={label} role="switch" aria-checked={on} className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${on ? 'bg-[#baf120]' : 'bg-white/10'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? 'left-[18px]' : 'left-0.5'}`}></span>
    </button>
  )
}

export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className={`w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#0d1117] z-10">
          <h3 className="text-sm font-black uppercase tracking-wider">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-rose-500 flex items-center justify-center transition-colors">
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

export function Sparkline({ data, color = '#baf120' }) {
  const vals = (data || []).filter((v) => typeof v === 'number')
  if (vals.length < 2) {
    return <div className="w-24 h-8 flex items-end gap-0.5">
      {(data || []).map((v, i) => (
        <div key={i} className="w-1.5 rounded-sm" style={{ height: `${Math.max(4, (v / (Math.max(...data, 1))) * 24)}px`, backgroundColor: color, opacity: 0.5 }}></div>
      ))}
    </div>
  }
  const w = 96
  const h = 30
  const max = Math.max(...vals)
  const min = Math.min(...vals)
  const range = max - min || 1
  const step = w / (vals.length - 1)
  const pts = vals.map((v, i) => [i * step, h - 4 - ((v - min) / range) * (h - 10)])
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-24 h-8 overflow-visible">
      <path d={`${line} L${w},${h} L0,${h} Z`} fill={color} opacity="0.08" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function RevenueChart({ labels = [], values = [], unit = '', hovered, setHovered }) {
  const W = 620
  const H = 210
  const padL = 14
  const padR = 14
  const padT = 18
  const padB = 26
  const plotW = W - padL - padR
  const slot = values.length ? plotW / values.length : plotW
  const barW = Math.min(26, slot * 0.5)
  const max = Math.max(...values, 1) * 1.12
  const baseY = H - padB
  const cy = (v) => baseY - (v / max) * (H - padT - padB)

  const centers = values.map((_, i) => padL + slot * i + slot / 2)
  const topPts = values.map((v, i) => [centers[i], cy(v)])
  const line = topPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = values.length ? `${line} L${centers[values.length - 1]},${baseY} L${centers[0]},${baseY} Z` : ''
  const gridLines = [0, 0.25, 0.5, 0.75, 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <defs>
        <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#baf120" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#baf120" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#baf120" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#7a9e14" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {gridLines.map((g) => {
        const y = padT + (1 - g) * (H - padT - padB)
        return (
          <g key={g}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </g>
        )
      })}

      {values.map((v, i) => {
        const h = baseY - cy(v)
        return (
          <rect key={i} x={centers[i] - barW / 2} y={cy(v)} width={barW} height={h} rx="4" fill={hovered === i ? '#ffffff' : 'url(#barFill)'} className="transition-all duration-150" />
        )
      })}

      {area && <path d={area} fill="url(#revFill)" />}
      {line && <path d={line} fill="none" stroke="#baf120" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

      {values.map((v, i) => (
        <circle key={`c${i}`} cx={centers[i]} cy={cy(v)} r={hovered === i ? 5 : 3} fill="#0d1117" stroke="#baf120" strokeWidth="2" className="transition-all duration-150" />
      ))}

      {values.map((v, i) => (
        <rect key={`hit${i}`} x={padL + slot * i} y={padT} width={slot} height={H - padT - padB} fill="transparent" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
      ))}

      {labels.map((m, i) => (
        <text key={`m${i}`} x={centers[i]} y={H - 6} textAnchor="middle" fontSize="10" fill={hovered === i ? '#baf120' : '#64748b'} className="select-none" style={{ fontWeight: hovered === i ? 700 : 500 }}>
          {m}
        </text>
      ))}

      {hovered !== null && values[hovered] !== undefined && (
        <g transform={`translate(${Math.min(Math.max(centers[hovered], 52), W - 52)}, ${Math.max(cy(values[hovered]) - 46, 6)})`}>
          <rect x="-46" y="-24" width="92" height="38" rx="8" fill="#0d1117" stroke="rgba(255,255,255,0.15)" />
          <text textAnchor="middle" y="-8" fontSize="10" fill="#94a3b8" fontWeight="600">{labels[hovered]}</text>
          <text textAnchor="middle" y="8" fontSize="14" fill="#baf120" fontWeight="800">{fmtCompact(values[hovered])}{unit}</text>
        </g>
      )}
    </svg>
  )
}

export function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-bold shadow-xl ${toast.type === 'ok' ? 'bg-[#0d1117] border-[#baf120]/40 text-[#baf120]' : 'bg-[#0d1117] border-rose-500/40 text-rose-400'}`}>
      <i className={`fa-solid ${toast.type === 'ok' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
      {toast.msg}
    </div>
  )
}

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500 gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#baf120] animate-spin"></div>
      <p className="text-xs font-bold uppercase tracking-widest">{label}</p>
    </div>
  )
}

export function EmptyState({ icon = 'fa-solid fa-inbox', title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center px-6">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mb-3">
        <i className={icon}></i>
      </div>
      <p className="text-sm font-bold text-gray-400">{title}</p>
      {hint && <p className="text-xs text-gray-600 mt-1 max-w-xs">{hint}</p>}
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState(null)
  const push = (type, msg) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3000)
  }
  return { toast, push }
}

export function DeltaPill({ delta }) {
  const num = Number(delta) || 0
  const up = num >= 0
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${up ? 'text-green-400' : 'text-rose-400'}`}>
      <i className={`fa-solid text-[10px] ${up ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i>
      {num >= 0 ? '+' : ''}{num.toFixed(1)}%
    </span>
  )
}
