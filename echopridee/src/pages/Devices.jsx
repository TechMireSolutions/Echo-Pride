import React from 'react'
import { Link } from 'react-router-dom'
import { FooterAmazon } from '../components/Footers'
import { parseUsdPrice } from '../data/currencies'
import { useCurrency } from '../context/CurrencyContext'

const devices = [
  {
    name: 'EchoSmart Jersey',
    tagline: 'Performance-tracking team jersey',
    icon: 'fa-solid fa-shirt',
    price: '$89.00',
    status: 'Available 2026',
    specs: ['Built-in heart-rate tracking', 'Hydration & fatigue alerts', 'Machine-washable sensors'],
  },
  {
    name: 'PrideBand Pro',
    tagline: 'Coach control wristband',
    icon: 'fa-solid fa-clock',
    price: '$49.00',
    status: 'Available 2026',
    specs: ['Live team vitals dashboard', 'Playbook sync via app', '7-day battery life'],
  },
  {
    name: 'CourtSense Ball',
    tagline: 'Smart basketball with shot analytics',
    icon: 'fa-solid fa-volleyball',
    price: '$129.00',
    status: 'Coming Soon',
    specs: ['Shot & arc tracking', 'Real-time coaching feed', 'Bluetooth app pairing'],
  },
  {
    name: 'EchoFit Insoles',
    tagline: 'Biometric foot pressure insoles',
    icon: 'fa-solid fa-shoe-prints',
    price: '$59.00',
    status: 'Available 2026',
    specs: ['Pressure & gait analysis', 'Injury-risk scoring', 'Charges in 90 minutes'],
  },
  {
    name: 'TeamHub Tablet',
    tagline: 'Sideline command center',
    icon: 'fa-solid fa-tablet-screen-button',
    price: '$249.00',
    status: 'Coming Soon',
    specs: ['Waterproof rugged build', 'Live stat overlays', 'Camera-based form review'],
  },
  {
    name: 'ThermoKnit Vest',
    tagline: 'Body-temperature regulating vest',
    icon: 'fa-solid fa-temperature-half',
    price: '$139.00',
    status: 'Available 2026',
    specs: ['Active cooling & heating', 'Zone temperature control', 'Lightweight compression fit'],
  },
]

const connected = [
  { icon: 'fa-solid fa-mobile-screen', title: 'EchoPride App', text: 'One dashboard for players, coaches, and team managers.' },
  { icon: 'fa-solid fa-wifi', title: 'Bluetooth & LTE Sync', text: 'Devices talk to each other and to your phone in real time.' },
  { icon: 'fa-solid fa-cloud', title: 'Cloud Analytics', text: 'Session history, trends, and reports stored securely in the cloud.' },
  { icon: 'fa-solid fa-shield-halved', title: 'Team Privacy', text: 'Player data stays with the team — never sold, never shared.' },
]

export default function Devices() {
  const { formatPrice } = useCurrency()
  return (
    <div className="bg-white text-gray-900 antialiased overflow-x-hidden select-none font-sans">
      <section className="relative min-h-[400px] md:min-h-[460px] flex items-center justify-center bg-[#0f1923] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/imgi_132_m3_slide_01.jpg"
            alt="EchoPride Devices"
            className="w-full h-full object-cover opacity-25 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] via-[#0f1923]/70 to-[#0f1923]/50"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-5">
          <span className="text-[#baf120] text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] inline-block hero-anim hero-delay-1">
            ECHOPRIDE DEVICES
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight hero-anim hero-delay-2">
            SMART GEAR FOR SMARTER TEAMS
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light hero-anim hero-delay-3">
            Wearable tech that pairs with our performance apparel — turning every practice and game into data your
            coaches can use.
          </p>
          <div className="pt-1 text-xs font-semibold text-gray-400 tracking-wider hero-anim hero-delay-3">
            <Link to="/" className="text-[#baf120] hover:underline">
              Home
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-gray-200">Devices</span>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">THE LINEUP</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 uppercase tracking-tight">
              OUR SMART DEVICES
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto mt-4 font-normal">
              Wearables, sensors, and sideline tools designed for basketball, football, soccer, and every team sport we
              outfit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {devices.map((d, i) => (
              <div
                key={d.name}
                className="group bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 reveal"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gray-900 text-[#baf120] flex items-center justify-center text-2xl group-hover:bg-[#baf120] group-hover:text-black transition-colors duration-500">
                    <i className={d.icon}></i>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 border border-gray-200 px-3 py-1.5 rounded-full">
                    {d.status}
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-gray-900">{d.name}</h2>
                <p className="text-xs text-gray-500 mt-1 mb-5">{d.tagline}</p>

                <ul className="space-y-2.5 mb-6">
                  {d.specs.map((spec) => (
                    <li key={spec} className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                      <i className="fa-solid fa-circle-check text-[#baf120] text-sm"></i>
                      {spec}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                  <span className="text-lg font-extrabold text-gray-900">{formatPrice(parseUsdPrice(d.price))}</span>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="bg-gray-900 hover:bg-[#baf120] hover:text-black text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg transition-colors duration-300"
                  >
                    Notify Me
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-20 md:py-28 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-7 reveal from-left">
            <div>
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">ONE ECOSYSTEM</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 leading-tight">
                Everything Connected, Everything Yours
              </h2>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              Every EchoPride device pairs with the EchoPride app, so coaches get a live view of player load, fatigue,
              and form — while players stay focused on the game.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {connected.map((c) => (
                <div key={c.title} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-gray-900 text-[#baf120] flex items-center justify-center mb-1">
                    <i className={`${c.icon} text-sm`}></i>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{c.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal from-right reveal-delay-2">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/imgi_26_m3_banner_01.jpg"
                alt="EchoPride Smart Tech"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl mt-8"
              />
              <img
                src="/imgi_18_a-sleek-modern-basketball-coach-s-hoodie-featuri-700x700.webp"
                alt="EchoSmart Jersey"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl"
              />
              <img
                src="/imgi_28_m3_banner_03.jpg"
                alt="EchoPride Devices Ecosystem"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl"
              />
              <img
                src="/imgi_21_a-high-performance-fleece-lined-hoodie-for-basketb-700x700.webp"
                alt="Connected Sportswear"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6 reveal">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Ready to Go Smart?</h2>
          <p className="text-sm text-black font-semibold">
            Be first to know when EchoPride devices launch. Join the waitlist.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address..."
              required
              className="flex-1 border border-gray-300 rounded-lg px-5 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#baf120] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#0b1324] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest px-7 py-3.5 rounded-lg transition-colors duration-300 whitespace-nowrap"
            >
              Join Waitlist
            </button>
          </form>
        </div>
      </section>

      <FooterAmazon />
    </div>
  )
}
