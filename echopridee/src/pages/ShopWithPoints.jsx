import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const redemptionSteps = [
  { icon: 'fa-solid fa-bag-shopping', title: 'Add to Cart', text: 'Shop as normal and add items to your cart. Your point balance shows right above checkout.' },
  { icon: 'fa-solid fa-coins', title: 'Choose Points', text: 'Pick how many points to apply — cover part or all of your order total.' },
  { icon: 'fa-solid fa-circle-check', title: 'See the Savings', text: 'The discounted total updates instantly so you know exactly what you pay.' },
  { icon: 'fa-solid fa-truck-fast', title: 'Checkout & Enjoy', text: 'Confirm and your order ships as usual. Points used are deducted instantly.' },
]

const pointValues = [
  { label: '1 point', value: '0.01 off' },
  { label: '100 points', value: '$1.00 off' },
  { label: '500 points', value: '$5.00 off' },
  { label: '2,500 points', value: '$25.00 off' },
]

const earnWays = [
  { icon: 'fa-solid fa-cart-plus', title: 'Every Purchase', text: 'Earn 1 point per $1 spent on eligible items.' },
  { icon: 'fa-solid fa-star', title: 'Double-Point Days', text: 'Seasonal events and new-arrival drops double your points.' },
  { icon: 'fa-solid fa-calendar-plus', title: 'Birthday Bonus', text: 'Get a one-time 500-point bonus on your account anniversary.' },
  { icon: 'fa-solid fa-gift', title: 'Referrals', text: 'Earn 1,000 points when a friend places their first order.' },
]

export default function ShopWithPoints() {
  const [points, setPoints] = useState('1250')
  const savings = (parseFloat(points) || 0) * 0.01
  const nextReward = 2500 - (parseFloat(points) || 0)

  return (
    <InfoPageShell
      heroTag="LOYALTY PROGRAM"
      title="Shop with Points"
      intro="Turn points earned from shopping into instant savings at checkout. A simple loyalty program that pays you back on every order."
      image="/imgi_28_m3_banner_03.jpg"
    >
      <section className="bg-[#0a0e14] py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">POINTS CALCULATOR</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 uppercase mb-4">
              See What Your Points Are Worth
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Every 100 points equals $1 off your order. Points never expire as long as your account stays active, and
              redemption is instant at checkout.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Points to redeem</label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  min="0"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#baf120]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <p className="text-3xl font-black text-[#baf120]">${savings.toFixed(2)}</p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">Your savings</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <p className="text-3xl font-black text-white">{Math.max(nextReward, 0).toLocaleString()}</p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">To next reward</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-gray-500 mb-1.5">
                  <span>{points.toLocaleString()} pts</span>
                  <span className="text-[#baf120]">2,500 pts = $25</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#baf120] to-[#7a9e14] rounded-full" style={{ width: `${Math.min((parseFloat(points) || 0) / 2500 * 100, 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">REDEMPTION GUIDE</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 uppercase mb-6">
              Four Steps at Checkout
            </h2>
            <div className="space-y-3">
              {redemptionSteps.map((step, i) => (
                <div key={step.title} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex flex-col items-center shrink-0">
                    <span className="w-10 h-10 rounded-full bg-[#baf120] text-black flex items-center justify-center text-sm font-black">{i + 1}</span>
                    {i < redemptionSteps.length - 1 && <span className="w-0.5 h-5 bg-white/10"></span>}
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center text-base text-[#baf120] shrink-0">
                    <i className={step.icon}></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{step.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">POINT VALUES</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase mb-4">
              Quick Value Lookup
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              A simple 1:100 ratio — 1 point is worth one cent. Here is how that scales across typical order sizes.
            </p>
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {pointValues.map((row) => (
                <div key={row.label} className="border border-gray-200 rounded-2xl p-6 bg-[#f8fafc] text-center">
                  <p className="text-xl font-black text-gray-900">{row.value}</p>
                  <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider">{row.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#f8fafc] border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">WAYS TO EARN</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              Points Add Up Fast
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {earnWays.map((way) => (
              <div key={way.title} className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl mx-auto mb-4">
                  <i className={way.icon}></i>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">{way.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{way.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-gray-900 mb-2">
              Check your point balance
            </h2>
            <p className="text-gray-600 text-sm">Sign in to see how much you can save on your next order.</p>
          </div>
          <Link to="/account" className="shrink-0 inline-block bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs sm:text-sm uppercase tracking-widest px-10 py-4 rounded-lg transition-colors duration-300 shadow-lg">
            View My Points
          </Link>
        </div>
      </section>
    </InfoPageShell>
  )
}
