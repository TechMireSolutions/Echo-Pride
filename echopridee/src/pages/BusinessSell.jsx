import React from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const bulkTiers = [
  { tier: 'Standard', minQty: '50+ units', discount: '10% off list', leadTime: '14–21 days', moq: 'Mixed styles allowed', highlight: false },
  { tier: 'Team', minQty: '200+ units', discount: '18% off list', leadTime: '10–14 days', moq: 'Unified team sets', highlight: true },
  { tier: 'Wholesale', minQty: '1,000+ units', discount: '25% off list', leadTime: '7–10 days', moq: 'Per-style orders', highlight: false },
  { tier: 'Manufacturing Partner', minQty: '5,000+ units', discount: 'Custom contract', leadTime: 'Rolling schedule', moq: 'Full manufacturing run', highlight: false },
]

const partnershipSteps = [
  { num: 'A', title: 'Share Your Specs', text: 'Send your designs, fabrics, and size runs. Our production planners build a quote and sample plan.', icon: 'fa-solid fa-file-lines' },
  { num: 'B', title: 'Approve Samples', text: 'Review physical samples and confirm quality, colors, and trims before full production.', icon: 'fa-solid fa-shirt' },
  { num: 'C', title: 'Production', text: 'Our factories cut, sew, and finish your order under a dedicated quality-control workflow.', icon: 'fa-solid fa-industry' },
  { num: 'D', title: 'Bulk Delivery', text: 'Inventory ships in scheduled batches, with docs, packing lists, and freight coordination handled.', icon: 'fa-solid fa-truck-fast' },
]

const partnerPerks = [
  { icon: 'fa-solid fa-industry', title: 'In-House Production', text: 'Cut-and-sew and sublimation under one roof for full control.' },
  { icon: 'fa-solid fa-ruler-combined', title: 'Custom Specs', text: 'Custom fabrics, trims, and sizing built to your exact brand standards.' },
  { icon: 'fa-solid fa-boxes-packing', title: 'Private Label', text: 'Your branding, hangtags, and packaging — we stay invisible.' },
  { icon: 'fa-solid fa-calendar-check', title: 'Reliable Lead Times', text: 'Contract schedules with committed production windows.' },
]

const processStrip = [
  { num: '50K+', label: 'Units shipped monthly' },
  { num: '120+', label: 'Partner brands' },
  { num: '98%', label: 'On-time delivery' },
  { num: '24h', label: 'Quote turnaround' },
]

export default function BusinessSell() {
  return (
    <InfoPageShell
      heroTag="B2B WHOLESALE"
      title="Sell on Echo Pride Business"
      intro="Bulk orders, wholesale pricing, and manufacturing partnerships for teams, retailers, and sportswear brands that need gear at scale."
      image="/imgi_6_m3_cat_02.jpg"
      variant="split"
      heroAside={
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm max-w-sm ml-auto">
          <p className="text-xs font-black uppercase tracking-wider text-[#baf120] mb-3">Request a wholesale quote</p>
          <div className="space-y-3">
            <input type="text" placeholder="Company name" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#baf120]" />
            <input type="text" placeholder="Est. order size" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#baf120]" />
            <Link to="/contact" className="block text-center bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-lg transition-colors">
              Request a Quote
            </Link>
          </div>
          <p className="text-[11px] text-gray-500 mt-3">We reply within one business day.</p>
        </div>
      }
    >
      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">BULK ORDER TIERS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              Pricing That Scales With You
            </h2>
          </div>
          <div className="space-y-4">
            {bulkTiers.map((row) => (
              <div
                key={row.tier}
                className={`flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 border rounded-2xl p-6 transition-colors ${
                  row.highlight ? 'border-[#baf120] bg-[#fbfee9] shadow-md' : 'border-gray-200 bg-[#f8fafc]'
                }`}
              >
                <div className="lg:w-56 shrink-0">
                  <p className="text-sm font-black text-gray-900 uppercase tracking-wider">{row.tier}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{row.minQty}</p>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <p className="text-sm text-gray-600"><span className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-0.5">Discount</span><span className="font-bold text-gray-900">{row.discount}</span></p>
                  <p className="text-sm text-gray-600"><span className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-0.5">Lead Time</span>{row.leadTime}</p>
                  <p className="text-sm text-gray-600"><span className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-0.5">Order Types</span>{row.moq}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-16 md:py-24 px-6 md:px-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">WHOLESALE PARTNERSHIPS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              From Sample to Shipping
            </h2>
          </div>
          <div className="space-y-10">
            {partnershipSteps.map((step, i) => (
              <div key={step.num} className={`flex flex-col md:flex-row gap-6 items-center ${i % 2 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full">
                  <div className="border border-gray-200 bg-white rounded-2xl p-7 shadow-sm">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="w-11 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black">{step.num}</span>
                      <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.text}</p>
                  </div>
                </div>
                <div className="md:w-48 shrink-0">
                  <div className="bg-[#0a0e14] rounded-2xl p-6 text-center border border-gray-800">
                    <i className={`${step.icon} text-[#baf120] text-2xl mb-2`}></i>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Phase {step.num}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div>
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">WHY PARTNER</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              A Factory That Behaves Like Your Team
            </h2>
            <p className="text-sm text-gray-600 mt-3">Every manufacturing partner gets a dedicated production channel — spec, sample, produce, and deliver in one managed workflow.</p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {partnerPerks.map((perk) => (
              <div key={perk.title} className="border border-gray-200 rounded-2xl p-6 bg-[#f8fafc] flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-[#baf120] text-black flex items-center justify-center text-lg shrink-0">
                  <i className={perk.icon}></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{perk.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{perk.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-6 md:px-12 bg-[#0a0e14]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {processStrip.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-[#baf120]">{s.num}</p>
              <p className="text-[11px] uppercase tracking-wider text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </InfoPageShell>
  )
}
