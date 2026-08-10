import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FooterAmazon } from '../components/Footers'

const hubBenefits = [
  { icon: 'fa-solid fa-sack-dollar', title: 'Earn per Package', text: 'Get paid for every package you receive and hand over, with predictable weekly payouts.' },
  { icon: 'fa-solid fa-person-walking', title: 'More Foot Traffic', text: 'Turn delivery pick-ups and returns into repeat visits and extra in-store sales.' },
  { icon: 'fa-solid fa-bolt', title: 'Easy to Run', text: 'Scanning tools, customer notifications, and pickup flows handled for you.' },
  { icon: 'fa-solid fa-location-dot', title: 'Community Value', text: 'Become the go-to delivery point in your neighborhood and a trusted local service.' },
  { icon: 'fa-solid fa-laptop', title: 'Hub Toolkit', text: 'Dedicated signage, training, and a Hub dashboard to manage everything.' },
  { icon: 'fa-solid fa-headset', title: 'Dedicated Support', text: 'A Hub operations team that helps you get set up and stay running smoothly.' },
]

const hubRequirements = [
  { icon: 'fa-solid fa-map-location-dot', title: 'Accessible Location', text: 'A storefront or space that customers can reach easily during operating hours.' },
  { icon: 'fa-solid fa-clock', title: 'Reliable Hours', text: 'Consistent opening hours you can commit to, with set pick-up windows.' },
  { icon: 'fa-solid fa-box-open', title: 'Storage Space', text: 'Dedicated shelving or storage area to keep packages organized and secure.' },
  { icon: 'fa-solid fa-laptop', title: 'Basic Equipment', text: 'A smartphone, tablet, or computer with internet to run the Hub tools.' },
  { icon: 'fa-solid fa-user', title: 'On-Site Staff', text: 'Someone available to receive, scan, and hand over packages during hub hours.' },
  { icon: 'fa-solid fa-file-signature', title: 'Agreement', text: 'Accept the Hub operating agreement, including service standards and reporting.' },
]

const initialForm = {
  contactName: '',
  email: '',
  phone: '',
  spaceName: '',
  spaceType: 'Retail Store',
  address: '',
  city: '',
  hours: '',
  packages: '',
  message: '',
}

export default function HostHub() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-white text-gray-900 antialiased overflow-x-hidden select-none font-sans">
      <section className="relative min-h-[420px] md:min-h-[480px] flex items-center justify-center bg-black overflow-hidden py-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/imgi_26_m3_banner_01.jpg"
            alt="Host an Echo Pride Hub Background"
            className="w-full h-full object-cover opacity-35 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/70"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-4">
          <span className="text-[#baf120] text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] inline-block animate-fade-in-up delay-1">
            ECHO PRIDE HUB PROGRAM
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white animate-fade-in-up delay-2">
            Host an Echo Pride Hub
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light animate-fade-in-up delay-3">
            Bring fast, convenient delivery closer to your community. Local stores and community centers host pick-ups
            and returns, earn per package, and turn delivery traffic into loyal foot traffic.
          </p>
          <div className="pt-2 text-xs font-semibold text-gray-400 tracking-wider">
            <Link to="/" className="text-[#baf120] hover:underline">
              Home
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-gray-200">Host an Echo Pride Hub</span>
          </div>
        </div>
      </section>

      {submitted && (
        <div className="bg-[#baf120] text-black px-6 py-4 text-center">
          <p className="text-sm font-bold uppercase tracking-wider">
            <i className="fa-solid fa-circle-check mr-2"></i>
            Application received! Our Hub team will review your space and get back to you within 5 business days.
          </p>
        </div>
      )}

      <section className="bg-[#f8fafc] py-16 md:py-24 px-6 md:px-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">WHY BECOME A HUB</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              Serve Your Neighborhood, Grow Your Business
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              Echo Pride Hubs are local pick-up and drop-off points that bring deliveries closer to customers — while
              creating a new revenue stream and regular visits for your space.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hubBenefits.map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#baf120] text-black flex items-center justify-center text-lg shrink-0 shadow-md">
                  <i className={benefit.icon}></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{benefit.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">REQUIREMENTS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              What You Need to Qualify
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              Most retail stores, sports facilities, and community centers qualify. Here is what we look for.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hubRequirements.map((req) => (
              <div key={req.title} className="rounded-2xl border border-gray-200 bg-[#f8fafc] p-6">
                <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center text-lg shrink-0 shadow-md mb-4">
                  <i className={req.icon}></i>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{req.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{req.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="py-16 md:py-24 px-6 md:px-12 bg-[#0a0e14]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">APPLY TO HOST</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 uppercase">
              Hub Application Form
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mt-3 max-w-2xl mx-auto">
              Tell us about your space and how you would operate. Our Hub team reviews every application and responds
              within 5 business days.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 md:p-10 shadow-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Contact Name</label>
                <input
                  type="text"
                  name="contactName"
                  required
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#baf120] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#baf120] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 555 000 0000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#baf120] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Business / Space Name</label>
                <input
                  type="text"
                  name="spaceName"
                  required
                  value={form.spaceName}
                  onChange={handleChange}
                  placeholder="Your store or center name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#baf120] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Space Type</label>
                <select
                  name="spaceType"
                  value={form.spaceType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#baf120] transition-colors bg-white"
                >
                  <option>Retail Store</option>
                  <option>Sports Facility</option>
                  <option>Community Center</option>
                  <option>Cafe / Restaurant</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#baf120] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Street Address</label>
              <input
                type="text"
                name="address"
                required
                value={form.address}
                onChange={handleChange}
                placeholder="Street address of your space"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#baf120] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Operating Hours</label>
                <input
                  type="text"
                  name="hours"
                  required
                  value={form.hours}
                  onChange={handleChange}
                  placeholder="e.g. Mon–Sat, 9am–6pm"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#baf120] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Estimated Packages per Day</label>
                <input
                  type="text"
                  name="packages"
                  value={form.packages}
                  onChange={handleChange}
                  placeholder="e.g. 20–50"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#baf120] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Why do you want to host?</label>
              <textarea
                name="message"
                required
                rows="4"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your space, your community, and why you would make a great Hub."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#baf120] transition-colors resize-y"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-lg transition-colors duration-300 shadow-lg"
            >
              Submit Application
            </button>
          </form>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold uppercase tracking-wide text-gray-900 mb-3">
            Questions about becoming a Hub?
          </h2>
          <p className="text-gray-600 text-sm mb-8 max-w-2xl mx-auto">
            Talk to the Hub operations team about requirements, earnings, or timelines before you apply.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-gray-900 hover:bg-black text-white font-bold text-xs sm:text-sm uppercase tracking-widest px-10 py-4 rounded-lg transition-colors duration-300 shadow-lg"
          >
            Contact the Hub Team
          </Link>
        </div>
      </section>

      <FooterAmazon />
    </div>
  )
}
