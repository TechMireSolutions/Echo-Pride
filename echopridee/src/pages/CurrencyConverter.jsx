import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const rates = [
  { currency: 'US Dollar', code: 'USD', rate: '1.0000' },
  { currency: 'Euro', code: 'EUR', rate: '0.9210' },
  { currency: 'British Pound', code: 'GBP', rate: '0.7842' },
  { currency: 'Pakistani Rupee', code: 'PKR', rate: '278.4500' },
  { currency: 'UAE Dirham', code: 'AED', rate: '3.6725' },
  { currency: 'Saudi Riyal', code: 'SAR', rate: '3.7500' },
  { currency: 'Canadian Dollar', code: 'CAD', rate: '1.3680' },
  { currency: 'Australian Dollar', code: 'AUD', rate: '1.5245' },
]

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('PKR')

  const rateFrom = rates.find((r) => r.code === from)?.rate
  const rateTo = rates.find((r) => r.code === to)?.rate
  const pair = parseFloat(rateTo) / parseFloat(rateFrom)
  const converted = (parseFloat(amount) || 0) * pair

  const selectable = (code) => (code === from || code === to ? null : code)

  return (
    <InfoPageShell
      heroTag="MULTI-CURRENCY TOOL"
      title="Echo Pride Currency Converter"
      intro="See exactly what you will pay when ordering internationally. Real-time multi-currency rates at checkout, with no hidden conversion fees."
      image="/imgi_27_m3_banner_022.jpg"
      variant="tool"
      heroBottom={
        <div className="bg-white rounded-2xl p-6 md:p-7 shadow-2xl max-w-3xl mx-auto text-left">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#baf120] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">From</label>
              <select
                value={from}
                onChange={(e) => {
                  const v = e.target.value
                  setFrom(v)
                  if (v === to) setTo('USD')
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#baf120]"
              >
                {rates.map((r) => (
                  <option key={r.code} value={r.code}>{r.code}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setFrom(to)
                setTo(from)
              }}
              className="justify-self-center sm:mt-6 w-10 h-10 rounded-full bg-gray-900 text-[#baf120] flex items-center justify-center hover:bg-black transition-colors"
              aria-label="Swap currencies"
            >
              <i className="fa-solid fa-arrow-right-arrow-left"></i>
            </button>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">To</label>
              <select
                value={to}
                onChange={(e) => {
                  const v = e.target.value
                  setTo(v)
                  if (v === from) setFrom('USD')
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#baf120]"
              >
                {rates.map((r) => (
                  <option key={r.code} value={r.code}>{r.code}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-5 rounded-xl bg-[#f8fafc] border border-gray-200 p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Converted Amount</p>
              <p className="text-3xl font-black text-gray-900">
                {to} {converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Rate</p>
              <p className="text-sm font-bold text-gray-900">1 {from} = {pair.toFixed(4)} {to}</p>
            </div>
          </div>
        </div>
      }
    >
      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">SUPPORTED CURRENCIES</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
                Tap a Pair to Convert
              </h2>
            </div>
            <p className="hidden md:block max-w-xs text-sm text-gray-500">Rates refresh through the day — the rate shown is the rate charged at checkout.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {rates.map((r) => {
              const clickable = selectable(r.code)
              const active = r.code === from || r.code === to
              return (
                <button
                  key={r.code}
                  disabled={!clickable}
                  onClick={() => {
                    if (clickable) setTo(clickable)
                  }}
                  className={`px-5 py-3 rounded-xl text-sm font-bold border transition-colors ${
                    active
                      ? 'bg-[#baf120] border-[#baf120] text-black'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-[#baf120] hover:text-gray-900'
                  }`}
                >
                  <span className="font-black mr-2">{r.code}</span>
                  <span className="text-xs text-gray-500">{r.currency}</span>
                </button>
              )
            })}
          </div>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-wider text-xs">Currency</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-wider text-xs">Code</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-wider text-xs">Rate vs USD</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((row, i) => (
                  <tr key={row.code} className={i % 2 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 text-gray-700">{row.currency}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{row.code}</td>
                    <td className="px-6 py-4 text-gray-600">{row.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 md:px-12 bg-[#f8fafc] border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
          {[
            { icon: 'fa-solid fa-cart-shopping', t: 'Locked at checkout', d: 'The rate on your receipt is fixed the moment you pay — no surprises on the final charge.' },
            { icon: 'fa-solid fa-receipt', t: 'Show local prices', d: 'International shoppers see totals in their own currency before placing an order.' },
            { icon: 'fa-solid fa-shield-halved', t: 'No conversion fees', d: 'We never add a hidden margin on currency conversion — the rate you see is the rate.' },
          ].map((f) => (
            <div key={f.t} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-xl bg-[#baf120] text-black flex items-center justify-center text-lg mb-4">
                <i className={f.icon}></i>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{f.t}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-gray-900 mb-2">
              International shipping made clear
            </h2>
            <p className="text-gray-600 text-sm">See your currency, your rate, and your total — before you confirm the order.</p>
          </div>
          <Link to="/shipping-policies" className="shrink-0 inline-block bg-gray-900 hover:bg-black text-white font-bold text-xs sm:text-sm uppercase tracking-widest px-10 py-4 rounded-lg transition-colors duration-300 shadow-lg">
            View Shipping Policies
          </Link>
        </div>
      </section>
    </InfoPageShell>
  )
}
