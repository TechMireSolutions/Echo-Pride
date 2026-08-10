import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const topUpMethods = [
  { icon: 'fa-solid fa-credit-card', title: 'Card', text: 'Add funds instantly from any debit or credit card. Min. $10, max. $500 per reload.', timing: 'Instant', fee: 'No fee' },
  { icon: 'fa-solid fa-building-columns', title: 'Bank Transfer', text: 'Link a bank account for larger top-ups. Available same-day before 3 PM PST.', timing: 'Same day', fee: 'No fee' },
  { icon: 'fa-solid fa-gift', title: 'Gift Card Code', text: 'Redeem any Echo Pride gift card and the full value lands in your balance at once.', timing: 'Instant', fee: 'No fee' },
  { icon: 'fa-solid fa-mobile-screen', title: 'Wallet App', text: 'Pay through supported digital wallets for instant, fee-free reloads.', timing: 'Instant', fee: 'No fee' },
]

const walletFeatures = [
  { icon: 'fa-solid fa-bell', title: 'Low-Balance Alerts', text: 'We ping you before your balance runs out, so you never miss checkout.' },
  { icon: 'fa-solid fa-arrow-rotate-right', title: 'Auto-Reload', text: 'Schedule automatic top-ups when your balance drops below a set amount.' },
  { icon: 'fa-solid fa-history', title: 'Reload History', text: 'Every reload, gift card, and redemption logged in your account.' },
]

export default function ReloadBalance() {
  const [method, setMethod] = useState(0)
  const [giftCode, setGiftCode] = useState('')
  const [redeemed, setRedeemed] = useState(false)
  const [autoReload, setAutoReload] = useState(false)

  const handleRedeem = (e) => {
    e.preventDefault()
    if (giftCode.trim()) setRedeemed(true)
  }

  return (
    <InfoPageShell
      heroTag="DIGITAL WALLET"
      title="Reload Your Balance"
      intro="Top up your Echo Pride balance with cards, bank transfers, wallet apps, or gift cards — and check out without a single delay."
      image="/imgi_26_m3_banner_01.jpg"
      variant="split"
      heroAside={
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm max-w-sm ml-auto">
          <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">Your Echo Pride Wallet</p>
          <p className="text-4xl font-black text-white">$184.50</p>
          <p className="text-[11px] text-gray-500 mt-1">Available for checkout</p>
          <div className="mt-5 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Points balance</span>
              <span className="font-bold text-white">1,250 pts</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Pending reload</span>
              <span className="font-bold text-[#baf120]">$50.00</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Gift cards</span>
              <span className="font-bold text-white">2 active</span>
            </div>
          </div>
          <button className="mt-5 w-full bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-lg transition-colors">
            Top Up Now
          </button>
        </div>
      }
    >
      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">TOP-UP OPTIONS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              Four Ways to Add Funds
            </h2>
            <p className="text-gray-600 text-sm mt-3 max-w-2xl">
              Pick whichever is fastest for you. All methods update your balance instantly and are covered by standard
              purchase protection.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {topUpMethods.map((m, i) => (
              <button
                key={m.title}
                onClick={() => setMethod(i)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-colors border ${
                  method === i ? 'bg-[#baf120] border-[#baf120] text-black' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                }`}
              >
                <i className={`${m.icon} text-lg`}></i>
                <span className="text-sm font-bold">{m.title}</span>
              </button>
            ))}
          </div>

          <div className="border border-gray-200 rounded-2xl p-7 md:p-8 bg-[#f8fafc] grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center text-lg">
                  <i className={topUpMethods[method].icon}></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{topUpMethods[method].title} Top-Up</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">{topUpMethods[method].text}</p>
              <div className="flex flex-wrap items-center gap-3">
                <input type="number" placeholder="Amount ($)" className="w-40 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#baf120]" />
                <button className="bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-lg transition-colors">
                  Add Funds
                </button>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span><i className="fa-solid fa-bolt text-[#baf120] mr-1"></i>{topUpMethods[method].timing}</span>
                  <span><i className="fa-solid fa-circle-check text-[#baf120] mr-1"></i>{topUpMethods[method].fee}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {walletFeatures.map((feature) => (
                <div key={feature.title} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <i className={`${feature.icon} text-[#baf120]`}></i>
                    <h4 className="text-xs font-bold text-gray-900">{feature.title}</h4>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0a0e14] py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">GIFT CARD REDEMPTION</span>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase mb-2">
              Add a Gift Card
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Enter the 16-digit code printed on the back of your card. The full value is added immediately and never expires.
            </p>
            <form onSubmit={handleRedeem} className="space-y-4">
              <input
                type="text"
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value)}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#baf120] transition-colors font-mono tracking-widest"
              />
              <button type="submit" className="w-full bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-lg transition-colors">
                Redeem Gift Card
              </button>
              {redeemed && (
                <p className="text-sm font-bold text-green-600">
                  <i className="fa-solid fa-circle-check mr-2"></i>
                  Gift card redeemed! Balance updated instantly.
                </p>
              )}
            </form>
          </div>

          <div>
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">HOW IT WORKS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 uppercase mb-6">
              Redeem in Three Steps
            </h2>
            <div className="space-y-4">
              {[
                { n: '1', t: 'Scratch the code', d: 'Remove the strip on the back of the card to reveal the 16-digit code.' },
                { n: '2', t: 'Enter it above', d: 'Type the code into the form and hit redeem — no account lock required.' },
                { n: '3', t: 'Spend instantly', d: 'The full value lands in your wallet and is ready at your next checkout.' },
              ].map((s) => (
                <div key={s.n} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
                  <span className="w-11 h-11 rounded-full bg-[#baf120] text-black flex items-center justify-center font-black shrink-0">{s.n}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{s.t}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Auto-Reload</p>
                <p className="text-xs text-gray-400">Top up automatically when balance drops below $20.</p>
              </div>
              <button
                onClick={() => setAutoReload((v) => !v)}
                className={`w-12 h-7 rounded-full relative transition-colors ${autoReload ? 'bg-[#baf120]' : 'bg-gray-600'}`}
              >
                <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${autoReload ? 'left-[22px]' : 'left-0.5'}`}></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-gray-900 mb-2">
              Keep your balance topped up
            </h2>
            <p className="text-gray-600 text-sm">Set up auto-reload so you are always ready to check out.</p>
          </div>
          <Link to="/account" className="shrink-0 inline-block bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs sm:text-sm uppercase tracking-widest px-10 py-4 rounded-lg transition-colors duration-300 shadow-lg">
            Manage My Balance
          </Link>
        </div>
      </section>
    </InfoPageShell>
  )
}
