import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const processSteps = [
  { n: '01', t: 'Start a return', d: 'Open your order history and pick the item to return.', icon: 'fa-solid fa-file-circle-plus' },
  { n: '02', t: 'Print the label', d: 'A prepaid label is emailed to you instantly for eligible items.', icon: 'fa-solid fa-print' },
  { n: '03', t: 'Refund processed', d: 'Refund posts within 5–7 business days of us receiving the parcel.', icon: 'fa-solid fa-money-bill-transfer' },
]

const returnRules = [
  { icon: 'fa-solid fa-calendar-days', title: '30-Day Window', text: 'Start a return within 30 days of delivery for most items.', tone: 'lime' },
  { icon: 'fa-solid fa-shirt', title: 'Original Condition', text: 'Unworn, unwashed items with tags and packaging attached.', tone: 'gray' },
  { icon: 'fa-solid fa-pen-ruler', title: 'Custom Items', text: 'Personalized or sublimated gear is non-returnable unless defective.', tone: 'gray' },
  { icon: 'fa-solid fa-sack-dollar', title: 'Refund Method', text: 'Refunds go to the original payment method within 5–7 business days of receipt.', tone: 'lime' },
]

const exchangeGuide = [
  { icon: 'fa-solid fa-ruler', title: 'Size Exchange', text: 'Swap a size within 14 days for free when the new size is in stock.' },
  { icon: 'fa-solid fa-palette', title: 'Color Exchange', text: 'Change color on non-custom items, subject to stock availability.' },
  { icon: 'fa-solid fa-shield-halved', title: 'Defective Item', text: 'Free replacement or refund for manufacturing faults — no questions asked.' },
]

const initialClaim = {
  orderId: '',
  name: '',
  email: '',
  issue: 'Damaged in transit',
  details: '',
}

export default function Returns() {
  const [form, setForm] = useState(initialClaim)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <InfoPageShell
      heroTag="RETURNS & REFUNDS"
      title="Returns & Replacements"
      intro="Clear return windows, a simple claim process for damaged items, and easy exchanges — so gear issues get resolved fast."
      image="/imgi_28_m3_banner_03.jpg"
      variant="left"
    >
      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">RETURN PROCESS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              Three Steps, No Headaches
            </h2>
            <p className="text-gray-600 text-sm mt-3 max-w-2xl">Returns are free on eligible items — prepaid label, no restocking fees, no call required.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processSteps.map((step, i) => (
              <div key={step.n} className="relative border border-gray-200 rounded-2xl p-7 bg-[#f8fafc]">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-4xl font-black text-gray-100">{step.n}</span>
                  <div className="w-12 h-12 rounded-xl bg-[#baf120] text-black flex items-center justify-center text-lg">
                    <i className={step.icon}></i>
                  </div>
                </div>
                {i < processSteps.length - 1 && <i className="fa-solid fa-arrow-right-long absolute -right-4 top-1/2 -translate-y-1/2 text-gray-300 hidden md:block z-10"></i>}
                <h3 className="text-base font-bold text-gray-900 mb-2">{step.t}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-16 md:py-24 px-6 md:px-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">RETURN WINDOW RULES</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase mb-6">
              Know Before You Return
            </h2>
            <div className="space-y-3">
              {returnRules.map((rule) => (
                <div key={rule.title} className="flex items-start gap-4 bg-white border border-gray-200 rounded-2xl p-5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${rule.tone === 'lime' ? 'bg-[#baf120] text-black' : 'bg-gray-900 text-white'}`}>
                    <i className={rule.icon}></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{rule.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{rule.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">EXCHANGE GUIDELINES</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase mb-6">
              Size, Color & Defect Swaps
            </h2>
            <div className="space-y-3">
              {exchangeGuide.map((item) => (
                <div key={item.title} className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg shrink-0">
                    <i className={item.icon}></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-0.5">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.text}</p>
                  </div>
                  <i className="fa-solid fa-chevron-right text-gray-300 ml-auto shrink-0"></i>
                </div>
              ))}
            </div>
            <div className="mt-5 bg-[#fbfee9] border border-[#baf120]/60 rounded-2xl p-5 text-sm text-gray-700 leading-relaxed">
              <i className="fa-solid fa-lightbulb text-[#7a9e14] mr-2"></i>
              Exchanges ship free both ways. If the new size is out of stock, we refund you automatically.
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#0a0e14]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">DAMAGED ITEM CLAIM</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 uppercase mb-3">
              File a Claim Form
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Received a damaged or defective item? Submit the form below and our team will arrange a free replacement
              or refund.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
              className="bg-white rounded-2xl p-8 shadow-xl space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Order ID</label>
                  <input type="text" name="orderId" required value={form.orderId} onChange={handleChange} placeholder="#EP-XXXXX" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#baf120]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Issue Type</label>
                  <select name="issue" value={form.issue} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#baf120]">
                    <option>Damaged in transit</option>
                    <option>Defective stitching / print</option>
                    <option>Wrong item received</option>
                    <option>Missing item</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Your name" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#baf120]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#baf120]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Describe the Issue</label>
                <textarea name="details" required rows="4" value={form.details} onChange={handleChange} placeholder="Describe the damage or problem in detail." className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#baf120] resize-y"></textarea>
              </div>
              <button type="submit" className="w-full bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-lg transition-colors duration-300 shadow-lg">
                Submit Claim
              </button>
              {submitted && (
                <p className="text-center text-sm font-bold text-green-600">
                  <i className="fa-solid fa-circle-check mr-2"></i>
                  Claim submitted! You will hear from our team within 24 hours.
                </p>
              )}
            </form>
          </div>

          <aside className="space-y-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-xs font-black uppercase tracking-wider text-[#baf120] mb-4">Claim status</p>
              <div className="space-y-3">
                {['Claim received', 'Review by team', 'Resolution'].map((s, i) => (
                  <div key={s} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${i === 0 ? 'bg-[#baf120] text-black' : 'bg-white/10 text-gray-500'}`}>
                      {i === 0 ? <i className="fa-solid fa-check"></i> : i + 1}
                    </span>
                    <p className={`text-sm ${i === 0 ? 'text-white font-bold' : 'text-gray-500'}`}>{s}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 mt-5 leading-relaxed">Most claims are resolved within 24 hours. Resolution replaces the item or refunds the order.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-xs font-black uppercase tracking-wider text-[#baf120] mb-3">Prefer to talk?</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">Live chat is available 9am–6pm PST, or start a return straight from your orders.</p>
              <Link to="/orders" className="block text-center bg-white text-gray-900 hover:bg-gray-100 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-lg transition-colors">
                Go to Your Orders
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </InfoPageShell>
  )
}
