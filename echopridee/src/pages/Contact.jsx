import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FooterContact } from '../components/Footers'

const contactDetails = [
  {
    icon: 'fa-solid fa-location-dot',
    title: 'Store Address',
    content: '730 W Sixth St, Suite 214, Corona, CA 92882, United States',
    isLink: false,
  },
  {
    icon: 'fa-solid fa-phone',
    title: 'Call Us',
    content: '+1 (909) 555-0148',
    isLink: true,
    href: 'tel:+19095550148',
  },
  {
    icon: 'fa-solid fa-envelope',
    title: 'Email',
    content: 'support@echopride.com',
    isLink: true,
    href: 'mailto:support@echopride.com',
  },
  {
    icon: 'fa-solid fa-headset',
    title: 'Live Support',
    content: 'Available Mon - Fri, 9am - 6pm PST',
    isLink: false,
  },
]

const contactFeatures = [
  { icon: 'fa-solid fa-truck', title: 'Ship to Home', text: 'Order online and have products shipped to you.' },
  { icon: 'fa-solid fa-store', title: 'Bulk Order Discounts', text: 'Save more on volume orders for your whole team.' },
  { icon: 'fa-solid fa-credit-card', title: 'Credit Offered', text: 'Turn big purchases into small payments.' },
  { icon: 'fa-solid fa-headset', title: 'Customer Support', text: "We're here to help you find what you need." },
]

export default function Contact() {
  const [showToast, setShowToast] = useState(false)

  return (
    <div className="bg-white text-gray-900 antialiased overflow-x-hidden select-none font-sans">
      <section className="relative min-h-[380px] md:min-h-[440px] flex items-center justify-center bg-black overflow-hidden py-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/imgi_132_m3_slide_01.jpg"
            alt="Contact Us Background"
            className="w-full h-full object-cover opacity-35 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/70"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-4">
          <span className="text-[#b5f500] text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] inline-block animate-fade-in-up delay-1">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white animate-fade-in-up delay-2">
            CONTACT US
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light animate-fade-in-up delay-3">
            Need support with an order or want to talk about custom team apparel? Our dedicated team is here to help
            every step of the way.
          </p>
          <div className="pt-2 text-xs font-semibold text-gray-400 tracking-wider">
            <Link to="/" className="text-[#b5f500] hover:underline">
              Home
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-gray-200">Contact Us</span>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-16 md:py-24 px-6 md:px-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                We're Here for Your Team
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-normal">
                If you have a question about sizing, shipping, wholesale pricing, or custom uniforms, send us a message
                and our support team will respond within 24 hours.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              {contactDetails.map((detail) => (
                <div key={detail.title} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center text-base shrink-0 shadow-md">
                    <i className={detail.icon}></i>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">{detail.title}</h4>
                    {detail.isLink ? (
                      <a
                        href={detail.href}
                        className="text-xs text-gray-700 font-semibold hover:text-[#b5f500] transition-colors"
                      >
                        {detail.content}
                      </a>
                    ) : (
                      <p className="text-xs text-gray-600 leading-normal">{detail.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-sm space-y-4 mt-8">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-[#b5f500]/20 text-black flex items-center justify-center text-sm">
                  <i className="fa-regular fa-clock"></i>
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Business Hours</h3>
              </div>

              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-gray-700">Monday – Friday</span>
                  <span className="font-bold text-gray-900">9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-gray-100">
                  <span className="font-medium text-gray-700">Saturday</span>
                  <span className="font-bold text-gray-900">10:00 AM – 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-gray-100">
                  <span className="font-medium text-gray-700">Sunday</span>
                  <span className="font-bold text-red-500">Closed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#0b1324] text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800">
            <div className="mb-8 space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">Send Us a Message</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
                Fill out the form below and one of our team members will reach out to you shortly.
              </p>
            </div>

            <div
              className={`${showToast ? 'flex' : 'hidden'} mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs items-center gap-3`}
            >
              <i className="fa-solid fa-circle-check text-lg text-emerald-400"></i>
              <div>
                <strong className="block text-sm text-white">Message Sent Successfully!</strong>
                Thank you for reaching out to EchoPride. Our support team will get back to you within 24 hours.
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setShowToast(true)
                e.target.reset()
                setTimeout(() => setShowToast(false), 7000)
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="w-full bg-[#131e36] border border-slate-700/70 rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b5f500] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="w-full bg-[#131e36] border border-slate-700/70 rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b5f500] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number (optional)"
                  className="w-full bg-[#131e36] border border-slate-700/70 rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b5f500] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Subject *</label>
                <select
                  required
                  defaultValue=""
                  className="w-full bg-[#131e36] border border-slate-700/70 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#b5f500] transition-colors cursor-pointer"
                >
                  <option value="" disabled>
                    Select a subject
                  </option>
                  <option value="General Support">General Support</option>
                  <option value="Custom Team Uniforms">Custom Team Uniforms</option>
                  <option value="Order Status & Shipping">Order Status & Shipping</option>
                  <option value="Wholesale & Bulk Orders">Wholesale & Bulk Orders</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Your Message *
                </label>
                <textarea
                  rows="5"
                  required
                  placeholder="Write your message here..."
                  className="w-full bg-[#131e36] border border-slate-700/70 rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b5f500] transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#b5f500] hover:bg-[#a1dc00] text-black font-extrabold text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-[#b5f500]/25 hover:scale-[1.01] mt-2"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[#b5f500] text-black py-10 px-6 sm:px-12 border-b border-black/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactFeatures.map((f) => (
            <div key={f.title} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center shrink-0">
                <i className={`${f.icon} text-lg text-black`}></i>
              </div>
              <div>
                <h4 className="font-extrabold text-xs uppercase text-black tracking-wider">{f.title}</h4>
                <p className="text-[11px] text-gray-800 leading-snug mt-0.5">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FooterContact />
    </div>
  )
}
