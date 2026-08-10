import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const commissionTable = [
  { category: 'Custom Jerseys & Uniforms', rate: '8%' },
  { category: 'Coaching Apparel & Jackets', rate: '7%' },
  { category: 'Training & Fitness Gear', rate: '6%' },
  { category: 'Accessories & Equipment', rate: '5%' },
  { category: 'Digital Books & Guides', rate: '12%' },
]

const payoutSchedule = [
  { window: 'Order Placed', event: 'Cookie-attributed sale', detail: 'Referral tracked against your link' },
  { window: 'Net-30', event: 'Balance confirmed', detail: 'After the return window closes' },
  { window: 'Net-60', event: 'Payout issued', detail: 'Direct to your bank or PayPal' },
]

const stickyLinks = [
  { href: '#rates', label: 'Commission Rates' },
  { href: '#generator', label: 'Link Generator' },
  { href: '#payouts', label: 'Payout Schedule' },
]

export default function Affiliate() {
  const [productUrl, setProductUrl] = useState('')
  const [affId, setAffId] = useState('EP-12045')
  const [copied, setCopied] = useState(false)
  const generated = `https://echopride.example/?ref=${affId}${productUrl ? `&url=${encodeURIComponent(productUrl)}` : ''}`

  const maxRate = 12

  return (
    <InfoPageShell
      heroTag="AFFILIATE PROGRAM"
      title="Become an Affiliate"
      intro="Earn commission on every order you refer. Generate tracking links, share them anywhere, and get paid on a predictable schedule."
      image="/imgi_28_m3_banner_03.jpg"
      variant="left"
    >
      <div className="py-16 md:py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-28 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">On this page</p>
              {stickyLinks.map((l) => (
                <a key={l.href} href={l.href} className="block text-sm text-gray-600 hover:text-gray-900 hover:pl-2 transition-all border-l-2 border-gray-200 hover:border-[#baf120] pl-3">
                  {l.label}
                </a>
              ))}
              <div className="mt-6 bg-[#f8fafc] border border-gray-200 rounded-2xl p-5">
                <p className="text-xs font-bold text-gray-900 mb-1">Free to join</p>
                <p className="text-xs text-gray-500">No minimum sales, approved in under 48 hours.</p>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-16">
            <section id="rates">
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">COMMISSION RATES</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase mb-3">
                Earn More on What You Promote
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                Commission is calculated on the final sale value after discounts, per product category. All rates apply
                from your very first sale.
              </p>
              <div className="space-y-5">
                {commissionTable.map((row) => (
                  <div key={row.category}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-bold text-gray-900">{row.category}</span>
                      <span className="font-black text-[#baf120]">{row.rate}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#baf120] to-[#7a9e14] rounded-full" style={{ width: `${(parseInt(row.rate) / maxRate) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="generator" className="bg-[#0a0e14] rounded-3xl p-8 md:p-10">
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">TRACKING LINKS</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 uppercase mb-3">
                Generate a Link in Seconds
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Paste any product URL and copy your personalized tracking link. Every click and order is attributed to
                your ID automatically.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Product URL</label>
                  <input
                    type="text"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="https://echopride.example/shop/basketball"
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#baf120] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Affiliate ID</label>
                  <input
                    type="text"
                    value={affId}
                    onChange={(e) => setAffId(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#baf120] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Generated Link</label>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={generated}
                      className="w-full bg-black/30 border border-dashed border-white/20 rounded-lg px-4 py-3 text-sm text-gray-300 font-mono focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(generated)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 1500)
                      }}
                      className="shrink-0 bg-[#baf120] hover:bg-[#a6e216] text-black text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg transition-colors"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section id="payouts">
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">PAYOUTS</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase mb-6">
                From Sale to Bank in Three Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {payoutSchedule.map((step, i) => (
                  <div key={step.window} className="relative border border-gray-200 rounded-2xl p-6 bg-[#f8fafc]">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-black">{i + 1}</span>
                      <span className="text-xs font-black text-[#baf120] uppercase tracking-wider">{step.window}</span>
                    </div>
                    {i < payoutSchedule.length - 1 && (
                      <i className="fa-solid fa-arrow-right-long absolute -right-4 top-1/2 -translate-y-1/2 text-gray-300 hidden md:block"></i>
                    )}
                    <h3 className="text-base font-bold text-gray-900 mb-1">{step.event}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.detail}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-gray-500 max-w-3xl leading-relaxed">
                Cookie attribution lasts 30 days. Orders cancelled or returned within the return window are excluded from
                your balance. Payouts below $25 roll over to the next cycle.
              </p>
            </section>

            <section className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-extrabold uppercase tracking-wide text-gray-900 mb-2">Join the affiliate program</h2>
                <p className="text-sm text-gray-600">Free to join, no minimum sales, and approved in under 48 hours.</p>
              </div>
              <Link to="/contact" className="shrink-0 inline-block bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs sm:text-sm uppercase tracking-widest px-10 py-4 rounded-lg transition-colors duration-300 shadow-lg">
                Apply to Become an Affiliate
              </Link>
            </section>
          </div>
        </div>
      </div>
    </InfoPageShell>
  )
}
