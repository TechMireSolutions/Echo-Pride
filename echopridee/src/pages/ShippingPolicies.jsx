import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const zones = [
  { zone: 'Zone 1 — Local', area: 'Orders within 50 km of our Corona, CA warehouse', standard: '$6.99', express: '$14.99' },
  { zone: 'Zone 2 — National', area: 'All other US states (lower 48)', standard: '$9.99', express: '$19.99' },
  { zone: 'Zone 3 — International', area: 'Select countries via DHL / FedEx', standard: 'From $24.99', express: 'From $39.99' },
  { zone: 'Free Shipping', area: 'Orders over $375 (Zones 1 & 2)', standard: '$0.00', express: '—' },
]

const courierCharges = [
  { carrier: 'EchoPride Standard', service: 'Ground', turnaround: '3–7 days', weight: 'Up to 5 kg', cost: '$6.99–$9.99', speed: 7 },
  { carrier: 'USPS Priority', service: 'Domestic', turnaround: '2–4 days', weight: 'Up to 5 kg', cost: '$9.99–$14.99', speed: 4 },
  { carrier: 'FedEx 2Day', service: 'Express', turnaround: '2 days', weight: 'Up to 10 kg', cost: '$19.99–$29.99', speed: 2 },
  { carrier: 'DHL Express', service: 'International', turnaround: '3–6 days', weight: 'Up to 20 kg', cost: 'From $39.99', speed: 6 },
]

const turnaround = [
  { stage: 'Order placed', window: 'Day 0' },
  { stage: 'Processing & quality check', window: 'Day 0–1' },
  { stage: 'Custom print / production', window: 'Day 1–3' },
  { stage: 'Handover to courier', window: 'Day 3–4' },
  { stage: 'Delivery window starts', window: 'Day 4+' },
]

const shippingNotes = [
  'Custom and sublimated items add 1–3 production days.',
  'Orders ship with tracking; signature may be required over $300.',
  'International duties are shown at checkout and included in the final total.',
  'Remote areas may add 1–2 business days to the estimate.',
]

export default function ShippingPolicies() {
  const [zone, setZone] = useState('Zone 1')
  const zoneData = zones[parseInt(zone.replace('Zone ', '')) - 1]

  return (
    <InfoPageShell
      heroTag="DELIVERY & LOGISTICS"
      title="Shipping Rates & Policies"
      intro="Clear delivery zones, courier charges, and turnaround times — so you always know what your order costs and when it arrives."
      image="/imgi_27_m3_banner_022.jpg"
      variant="split"
      heroAside={
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm max-w-sm ml-auto">
          <p className="text-xs font-black uppercase tracking-wider text-[#baf120] mb-4">Rate Estimator</p>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select your zone</label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#baf120] mb-5"
          >
            {zones.map((z, i) => (
              <option key={z.zone} value={`Zone ${i + 1}`}>{z.zone}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/30 border border-white/10 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-500">Standard</p>
              <p className="text-xl font-black text-white">{zoneData?.standard}</p>
            </div>
            <div className="bg-black/30 border border-white/10 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-500">Express</p>
              <p className="text-xl font-black text-[#baf120]">{zoneData?.express}</p>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-3">{zoneData?.area}</p>
        </div>
      }
    >
      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">DELIVERY ZONES</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              Where We Deliver & What It Costs
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {zones.map((z, i) => (
              <div
                key={z.zone}
                className={`border rounded-2xl p-7 ${i === zones.length - 1 ? 'border-[#baf120] bg-[#fbfee9]' : 'border-gray-200 bg-[#f8fafc]'}`}
              >
                <p className="text-[11px] font-black uppercase tracking-wider text-gray-500">{z.zone}</p>
                <p className="text-3xl font-black text-gray-900 mt-3">{z.standard}</p>
                <p className="text-[11px] text-gray-500 mt-1">Standard · Express {z.express}</p>
                <p className="text-xs text-gray-600 mt-4 leading-relaxed">{z.area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-16 md:py-24 px-6 md:px-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">COURIER CHARGES</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              Cost vs. Speed at a Glance
            </h2>
          </div>
          <div className="space-y-4">
            {courierCharges.map((c) => (
              <div key={c.carrier} className="bg-white border border-gray-200 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-sm font-bold text-gray-900">{c.carrier}</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-gray-900 text-white px-2.5 py-0.5 rounded-full">{c.service}</span>
                    <span className="text-xs text-gray-500">Up to {c.weight}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <span>Delivery speed</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <span key={i} className={`w-2.5 h-2.5 rounded-sm ${i < c.speed ? 'bg-[#baf120]' : 'bg-gray-200'}`}></span>
                      ))}
                    </div>
                    <span className="font-bold text-gray-700">{c.turnaround}</span>
                  </div>
                </div>
                <p className="text-xl font-black text-gray-900 lg:text-right">{c.cost}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">ESTIMATED TIMELINE</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase mb-8">
              From Order to Doorstep
            </h2>
            <div className="space-y-0">
              {turnaround.map((stage, i) => (
                <div key={stage.stage} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${i === turnaround.length - 1 ? 'bg-[#baf120] text-black' : 'bg-gray-900 text-white'}`}>
                      {i === turnaround.length - 1 ? <i className="fa-solid fa-flag-checkered"></i> : i + 1}
                    </span>
                    {i < turnaround.length - 1 && <span className="w-0.5 h-8 bg-gray-200"></span>}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-bold text-gray-900">{stage.stage}</p>
                    <p className="text-xs text-gray-500">{stage.window}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-8">
            <h3 className="text-base font-bold text-gray-900 mb-5">Shipping Notes</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              {shippingNotes.map((n) => (
                <li key={n} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#baf120] text-black flex items-center justify-center text-[10px] mt-0.5 shrink-0"><i className="fa-solid fa-circle-info"></i></span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-[#0a0e14]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white mb-2">
              Calculate your shipping cost
            </h2>
            <p className="text-gray-400 text-sm">Add items to your cart and the exact rate appears before you pay.</p>
          </div>
          <Link to="/shop" className="shrink-0 inline-block bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs sm:text-sm uppercase tracking-widest px-10 py-4 rounded-lg transition-colors duration-300 shadow-lg">
            Start Shopping
          </Link>
        </div>
      </section>
    </InfoPageShell>
  )
}
