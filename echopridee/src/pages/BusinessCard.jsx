import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const heroStats = [
  { value: '$100K', label: 'Max credit limit' },
  { value: '2.0%', label: 'Top cash back' },
  { value: '0 fees', label: 'Annual / foreign' },
  { value: '5 min', label: 'Application time' },
]

const creditTiers = [
  { tier: 'Starter Business', limit: '$5,000', features: ['1 virtual card + 1 physical', 'Team spending limits', 'Monthly statements'] },
  { tier: 'Growing Team', limit: '$25,000', features: ['Up to 10 cards', 'Per-card spend controls', 'Accounting exports'] },
  { tier: 'Wholesale Buyer', limit: '$100,000', features: ['Bulk fabric purchase limits', 'Deferred billing terms', 'Dedicated account manager'] },
  { tier: 'Manufacturing Partner', limit: 'Custom', features: ['Contract-based credit', 'Quarterly settlement', 'Priority procurement desk'] },
]

const cashbackRates = [
  { category: 'Bulk fabric & textile purchases', rate: '2.0%' },
  { category: 'Team and school orders', rate: '1.5%' },
  { category: 'Coaching apparel', rate: '1.0%' },
  { category: 'All other eligible purchases', rate: '0.5%' },
]

const cardFeatures = [
  { icon: 'fa-solid fa-id-card', title: 'Instant Issue', text: 'Get a virtual card immediately and a physical card within a week.' },
  { icon: 'fa-solid fa-users-gear', title: 'Team Controls', text: 'Issue cards to staff with individual limits and instant freeze.' },
  { icon: 'fa-solid fa-file-invoice-dollar', title: 'Expense Reports', text: 'Auto-categorized transactions and one-click bookkeeping exports.' },
  { icon: 'fa-solid fa-shield-halved', title: 'Purchase Protection', text: 'Dispute tools and fraud monitoring on every transaction.' },
]

export default function BusinessCard() {
  const [annualSpend, setAnnualSpend] = useState('50000')
  const fabricSpend = (parseFloat(annualSpend) || 0) * 0.6 * 0.02
  const otherSpend = (parseFloat(annualSpend) || 0) * 0.4 * 0.005

  return (
    <InfoPageShell
      heroTag="PAYMENT PRODUCTS"
      title="Echo Pride Business Card"
      intro="A corporate card built for sportswear buyers and teams — extend credit, earn cash back on bulk fabric, and keep every expense organized."
      image="/imgi_27_m3_banner_022.jpg"
      variant="stats"
      heroBottom={
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {heroStats.map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 backdrop-blur-sm">
              <p className="text-2xl md:text-3xl font-black text-[#baf120]">{s.value}</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      }
    >
      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#f8fafc] border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">THE CARD</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase mb-4">
              Built for the Sportswear Business
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              One card for every purchase — uniforms, bulk fabric, travel, and more. Issue cards to staff, set limits,
              and watch every transaction land in your ledger automatically.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cardFeatures.map((feature) => (
                <div key={feature.title} className="border border-gray-200 rounded-2xl p-5 bg-white">
                  <div className="w-10 h-10 rounded-lg bg-[#baf120] text-black flex items-center justify-center text-base mb-3">
                    <i className={feature.icon}></i>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-[#baf120]/20 blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-7 shadow-2xl border border-white/10 max-w-md">
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm font-black text-white tracking-widest uppercase">Echo<span className="text-[#baf120]">Pride</span></p>
                <i className="fa-solid fa-sim-card text-[#baf120] text-2xl"></i>
              </div>
              <p className="text-2xl font-black text-white tracking-[0.2em] mb-8">•••• •••• •••• 4821</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">Card Holder</p>
                  <p className="text-sm font-bold text-white">EP SPORTS CO.</p>
                </div>
                <p className="text-xs text-[#baf120] font-black uppercase tracking-wider">Business</p>
              </div>
            </div>
            <div className="relative mt-6 bg-[#0a0e14] border border-gray-800 rounded-2xl p-6 max-w-md">
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-400">Cash back this quarter</span>
                <span className="font-black text-[#baf120]">$1,240</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-5">
                <div className="h-full w-[72%] bg-gradient-to-r from-[#baf120] to-[#7a9e14] rounded-full"></div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {['$42K', '$18K', '6 cards'].map((v, i) => (
                  <div key={v} className="bg-white/5 border border-white/10 rounded-lg py-3">
                    <p className="text-sm font-black text-white">{v}</p>
                    <p className="text-[9px] uppercase tracking-wider text-gray-500 mt-0.5">{['Fabric spend', 'Other spend', 'Active cards'][i]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">CREDIT LIMITS</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
                Credit That Grows With Your Business
              </h2>
            </div>
            <p className="hidden md:block max-w-xs text-sm text-gray-500">Wholesale and manufacturing tiers include negotiated terms on bulk fabric.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {creditTiers.map((tier) => (
              <div key={tier.tier} className="border border-gray-200 rounded-2xl p-7 bg-[#f8fafc] flex flex-col">
                <p className="text-[11px] font-black uppercase tracking-wider text-gray-500">{tier.tier}</p>
                <p className="text-4xl font-black text-gray-900 my-4">{tier.limit}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <i className="fa-solid fa-check text-[#baf120] mt-0.5"></i>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="text-center text-xs font-bold uppercase tracking-widest border border-gray-300 hover:border-gray-900 px-5 py-3 rounded-lg transition-colors text-gray-700 hover:text-gray-900">
                  Apply
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#0a0e14]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">CASH-BACK REWARDS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 uppercase mb-4">
              Rewards on the Purchases That Matter
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Rates are highest where your business spends most — bulk fabric and team orders.
            </p>
            <div className="space-y-4">
              {cashbackRates.map((row) => (
                <div key={row.category}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-gray-300">{row.category}</span>
                    <span className="font-black text-[#baf120]">{row.rate}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#baf120] to-[#7a9e14] rounded-full" style={{ width: `${(parseFloat(row.rate) / 2) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <p className="text-xs font-black uppercase tracking-wider text-[#baf120] mb-1">Rewards calculator</p>
            <h3 className="text-white font-bold text-lg mb-5">Estimate your annual cash back</h3>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Annual card spend ($)</label>
            <input
              type="number"
              value={annualSpend}
              onChange={(e) => setAnnualSpend(e.target.value)}
              min="0"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#baf120] mb-6"
            />
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/5 border border-white/10 rounded-xl py-4">
                <p className="text-lg font-black text-white">${fabricSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p className="text-[9px] uppercase tracking-wider text-gray-500 mt-1">Fabric @ 2%</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl py-4">
                <p className="text-lg font-black text-white">${otherSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p className="text-[9px] uppercase tracking-wider text-gray-500 mt-1">Other @ 0.5%</p>
              </div>
              <div className="bg-[#baf120] rounded-xl py-4">
                <p className="text-lg font-black text-black">${(fabricSpend + otherSpend).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p className="text-[9px] uppercase tracking-wider text-black/70 mt-1">Total</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-4">Assumes 60% of spend lands in fabric categories. Figures are estimates.</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-gray-900 mb-2">
              Apply for your business card
            </h2>
            <p className="text-gray-600 text-sm">Review takes 1–2 business days with no impact to your credit score.</p>
          </div>
          <Link to="/contact" className="shrink-0 inline-block bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs sm:text-sm uppercase tracking-widest px-10 py-4 rounded-lg transition-colors duration-300 shadow-lg">
            Apply Now
          </Link>
        </div>
      </section>
    </InfoPageShell>
  )
}
