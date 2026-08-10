import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const faqCategories = [
  { label: 'Orders', icon: 'fa-solid fa-box', topics: ['track order', 'delivery'] },
  { label: 'Returns', icon: 'fa-solid fa-rotate-left', topics: ['return policy', 'refund', 'exchange', 'claim'] },
  { label: 'Payments', icon: 'fa-solid fa-wallet', topics: ['points', 'redeem', 'balance', 'gift card', 'reload', 'currency'] },
  { label: 'Selling', icon: 'fa-solid fa-store', topics: ['wholesale', 'sell', 'vendor', 'affiliate', 'b2b'] },
  { label: 'Devices', icon: 'fa-solid fa-tag', topics: ['device', 'app', 'sdk', 'sync', 'tag'] },
  { label: 'Account', icon: 'fa-solid fa-user', topics: ['account', 'password', 'sign in', 'security', 'invoice'] },
]

const faqs = [
  {
    q: 'How do I track my order?',
    a: 'Open Your Orders, pick the order, and the live timeline shows every status from confirmed to delivered.',
    cat: 'Orders',
  },
  {
    q: 'What is your return policy?',
    a: 'Most items can be returned within 30 days in original condition. Custom gear is non-returnable unless defective.',
    cat: 'Returns',
  },
  {
    q: 'How long does custom printing take?',
    a: 'Custom and sublimated items add 1–3 production days on top of the standard delivery window.',
    cat: 'Orders',
  },
  {
    q: 'How do I redeem my points?',
    a: 'At checkout, choose Shop with Points and select how many points to apply. 100 points = $1 off.',
    cat: 'Payments',
  },
  {
    q: 'Do you offer wholesale pricing?',
    a: 'Yes — Sell on Echo Pride Business covers bulk B2B orders from 50 units up to full manufacturing runs.',
    cat: 'Selling',
  },
  {
    q: 'Can I connect my Echo Pride Tag to third-party apps?',
    a: 'Yes, via the developer program. Check Manage Devices to see which apps are currently connected.',
    cat: 'Devices',
  },
  {
    q: 'How do I update my password?',
    a: 'Go to Your Account → Security, enter a new password, and confirm. Two-step verification is recommended.',
    cat: 'Account',
  },
  {
    q: 'How do I contact support?',
    a: 'Use live chat below, email support@echopride.com, or call +1 (909) 555-0148 during business hours.',
    cat: 'Account',
  },
]

const contactChannels = [
  { icon: 'fa-solid fa-comment-dots', title: 'Live Chat', text: 'Fastest — average reply under 2 minutes during support hours.', action: 'Start Chat' },
  { icon: 'fa-solid fa-envelope', title: 'Email Support', text: 'support@echopride.com · replies within 24 hours.', action: 'Send Email' },
  { icon: 'fa-solid fa-phone', title: 'Call Us', text: '+1 (909) 555-0148 · Mon–Fri, 9am–6pm PST.', action: 'Call Now' },
]

export default function Help() {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState(0)
  const [chatOpen, setChatOpen] = useState(false)
  const [sent, setSent] = useState(false)

  const q = query.trim().toLowerCase()
  const filtered = faqs.filter((faq) => {
    const inCat = cat === 'All' || faq.cat === cat
    const matches =
      !q ||
      faq.q.toLowerCase().includes(q) ||
      faq.a.toLowerCase().includes(q) ||
      faq.cat.toLowerCase().includes(q)
    return inCat && matches
  })

  return (
    <InfoPageShell
      heroTag="HELP CENTER"
      title="Help"
      intro="Answers to the questions we hear most, a live chat widget, and direct lines to our support team — however you prefer to reach us."
      image="/imgi_26_m3_banner_01.jpg"
      variant="tool"
      heroBottom={
        <div className="max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 shadow-xl">
            <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help — try 'return', 'points', or 'track'"
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
      }
    >
      <section className="py-16 md:py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[{ label: 'All', icon: 'fa-solid fa-border-all' }, ...faqCategories].map((c) => (
              <button
                key={c.label}
                onClick={() => setCat(c.label)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-colors ${
                  cat === c.label ? 'bg-[#baf120] border-[#baf120] text-black' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-900'
                }`}
              >
                <i className={c.icon}></i>
                {c.label}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-10">No answers found for “{query}”. Try a different topic or reach out below.</p>
            ) : (
              <div className="space-y-3">
                {filtered.map((faq, i) => (
                  <div key={faq.q} className="bg-[#f8fafc] border border-gray-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpen(open === i ? -1 : i)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="text-sm font-bold text-gray-900">{faq.q}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider bg-white border border-gray-200 px-2.5 py-1 rounded-full text-gray-500">{faq.cat}</span>
                        <i className={`fa-solid fa-chevron-down text-[#baf120] transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}></i>
                      </div>
                    </button>
                    {open === i && <p className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">{faq.a}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#f8fafc] border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">CONTACT CHANNELS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              Reach Us Your Way
            </h2>
            <p className="text-gray-600 text-sm mt-3">Every channel is staffed by our support team, no bots.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactChannels.map((channel) => (
              <div key={channel.title} className="border border-gray-200 rounded-2xl p-8 bg-white text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#baf120] text-black flex items-center justify-center text-2xl mx-auto mb-4">
                  <i className={channel.icon}></i>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{channel.title}</h3>
                <p className="text-sm text-gray-600 mb-5">{channel.text}</p>
                <button
                  onClick={() => channel.title === 'Live Chat' && setChatOpen(true)}
                  className="inline-block text-xs font-bold text-gray-900 uppercase tracking-wider border border-gray-300 hover:border-gray-900 px-5 py-2.5 rounded-lg transition-colors"
                >
                  {channel.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-[#0a0e14]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white mb-2">
              Still need a hand?
            </h2>
            <p className="text-gray-400 text-sm">Our team responds to every message within 24 hours.</p>
          </div>
          <Link to="/contact" className="shrink-0 inline-block bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs sm:text-sm uppercase tracking-widest px-10 py-4 rounded-lg transition-colors duration-300 shadow-lg">
            Open Contact Page
          </Link>
        </div>
      </section>

      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-900 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              <p className="text-sm font-bold">EchoPride Support</p>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm text-gray-600 bg-gray-100 rounded-xl px-4 py-3">
              Hi! How can we help you today? Ask about orders, returns, or anything else.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
              className="flex gap-2"
            >
              <input type="text" placeholder="Type your message..." className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#baf120]" />
              <button type="submit" className="bg-[#baf120] hover:bg-[#a6e216] text-black text-sm rounded-lg px-4 transition-colors">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
            {sent && <p className="text-xs font-bold text-green-600">Message sent — we will reply shortly!</p>}
          </div>
        </div>
      )}

      <button
        onClick={() => setChatOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#baf120] hover:bg-[#a6e216] text-black flex items-center justify-center text-xl shadow-xl transition-colors"
        aria-label="Open live chat"
      >
        <i className={chatOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-comment-dots'}></i>
      </button>
    </InfoPageShell>
  )
}
