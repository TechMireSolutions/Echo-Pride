import React from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const heroStats = [
  { value: '12,400+', label: 'Active sellers' },
  { value: '$28M', label: 'Monthly GMV' },
  { value: '4.8/5', label: 'Seller rating' },
  { value: '48h', label: 'Avg. approval' },
]

const onboardingSteps = [
  { num: '01', title: 'Create Your Seller Account', text: 'Register with your business details, tax info, and a payout bank account. Approval typically takes 1–2 business days.' },
  { num: '02', title: 'Build Your Catalog', text: 'Add products with images, sizes, and descriptions. Bulk upload templates make it fast for large inventories.' },
  { num: '03', title: 'Set Pricing & Shipping', text: 'Choose your price, shipping options, and fulfillment method — self-fulfill or use our managed program.' },
  { num: '04', title: 'Go Live & Get Paid', text: 'Your listings go live, orders start flowing, and your earnings are paid out on a weekly schedule.' },
]

const commissionTiers = [
  { tier: 'Starter', monthlySales: 'Up to $1,000', rate: '15%', payout: 'Weekly', note: 'For sellers testing the waters' },
  { tier: 'Pro', monthlySales: '$1,000 – $10,000', rate: '12%', payout: 'Weekly', note: 'Most new sellers land here' },
  { tier: 'Growth', monthlySales: '$10,000 – $50,000', rate: '10%', payout: 'Weekly + priority', note: 'Includes priority support' },
  { tier: 'Enterprise', monthlySales: '$50,000+', rate: 'Custom', payout: 'Flexible terms', note: 'Dedicated account manager' },
]

const dashboardCards = [
  { icon: 'fa-solid fa-cube', label: 'Active Listings', value: '128', delta: '+12 this week' },
  { icon: 'fa-solid fa-bag-shopping', label: 'Orders Today', value: '46', delta: '+8% vs yesterday' },
  { icon: 'fa-solid fa-sack-dollar', label: 'Net Revenue', value: '$3,210', delta: 'After fees' },
  { icon: 'fa-solid fa-star', label: 'Seller Rating', value: '4.8 / 5', delta: '97% positive' },
]

export default function SellProducts() {
  return (
    <InfoPageShell
      heroTag="VENDOR PROGRAM"
      title="Sell Products on Echo Pride"
      intro="List sportswear, custom gear, and accessories on the Echo Pride marketplace. You control pricing and inventory; we handle the traffic."
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
      <section className="bg-white py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">VENDOR ONBOARDING</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
                Four Steps to Your First Sale
              </h2>
            </div>
            <p className="hidden md:block max-w-xs text-sm text-gray-500">Most sellers go from sign-up to first order inside 2 weeks.</p>
          </div>
          <div className="relative">
            <div className="absolute left-[22px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#baf120] to-gray-200 hidden md:block"></div>
            <div className="space-y-8 md:space-y-0">
              {onboardingSteps.map((step, i) => (
                <div key={step.num} className="relative md:pl-20 pb-8 md:pb-10">
                  <div className="hidden md:flex absolute left-0 top-0 w-11 h-11 rounded-xl bg-gray-900 text-white items-center justify-center font-black shadow-md z-10">
                    {step.num}
                  </div>
                  <div className="md:ml-0 border border-gray-200 rounded-2xl p-6 md:p-7 shadow-sm bg-white">
                    <span className="md:hidden inline-block text-[#baf120] font-black text-sm mb-2">STEP {step.num}</span>
                    <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0a0e14] py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">COMMISSION RATES</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 uppercase">
                Simple, Tiered Fees
              </h2>
            </div>
            <p className="hidden md:block max-w-xs text-sm text-gray-400">No listing fees, no hidden charges — one clear rate per tier.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {commissionTiers.map((tier) => (
              <div key={tier.tier} className="relative bg-white/5 border border-white/10 rounded-2xl p-7 overflow-hidden">
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-[#baf120]/10"></div>
                <p className="text-xs font-black uppercase tracking-wider text-gray-400">{tier.tier}</p>
                <p className="mt-4 text-4xl font-black text-white">{tier.rate}</p>
                <p className="text-[11px] text-gray-500 mt-1">commission</p>
                <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
                  <p className="text-gray-300">
                    <span className="text-[#baf120] font-bold mr-2">Sales</span>
                    {tier.monthlySales}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-[#baf120] font-bold mr-2">Payout</span>
                    {tier.payout}
                  </p>
                  <p className="text-xs text-gray-500 italic mt-3">{tier.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">SELLER DASHBOARD</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              Run Your Store From One Screen
            </h2>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-200 bg-gray-50">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
              <span className="ml-3 text-xs text-gray-500 font-mono">seller.echopride.com/dashboard</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4">
              <aside className="lg:col-span-1 bg-gray-900 text-white p-6 hidden lg:block">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-4 font-bold">Seller Console</p>
                {['Overview', 'Listings', 'Orders', 'Payments', 'Reports'].map((item, i) => (
                  <p key={item} className={`text-xs py-2 ${i === 0 ? 'text-[#baf120] font-bold' : 'text-gray-400'}`}>{item}</p>
                ))}
              </aside>
              <div className="lg:col-span-3 p-6 md:p-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {dashboardCards.map((card) => (
                    <div key={card.label} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#baf120] text-black flex items-center justify-center">
                          <i className={card.icon}></i>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{card.label}</span>
                      </div>
                      <p className="text-xl font-black text-gray-900">{card.value}</p>
                      <p className="text-[11px] text-[#baf120] mt-0.5">{card.delta}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Inventory Alerts</h3>
                    {['Quarter-Zip Pullover', 'Coach Jacket', 'Rugby Jersey'].map((item) => (
                      <div key={item} className="flex items-center justify-between text-sm py-1.5 border-b border-dashed border-gray-100 last:border-0">
                        <span className="text-gray-600">{item}</span>
                        <span className="text-[11px] font-bold text-amber-500">Low stock</span>
                      </div>
                    ))}
                  </div>
                  <div className="border border-gray-200 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Recent Orders</h3>
                    {['#EP-2041 · Basketball Jersey', '#EP-2039 · Training Hoodie', '#EP-2036 · Windbreaker'].map((o) => (
                      <div key={o} className="flex items-center justify-between text-sm py-1.5 border-b border-dashed border-gray-100 last:border-0">
                        <span className="text-gray-600">{o}</span>
                        <span className="text-[11px] font-bold text-[#7a9e14]">Shipped</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-[#0a0e14]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white mb-3">
              Ready to launch your store?
            </h2>
            <p className="text-gray-400 text-sm">Our seller support team will walk you through onboarding step by step.</p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 inline-block bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs sm:text-sm uppercase tracking-widest px-10 py-4 rounded-lg transition-colors duration-300 shadow-lg"
          >
            Apply to Sell
          </Link>
        </div>
      </section>
    </InfoPageShell>
  )
}
