import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FooterAmazon } from '../components/Footers'

const jobOpenings = [
  {
    title: 'Apparel Production Manager',
    dept: 'Manufacturing',
    location: 'Faisalabad, Pakistan',
    type: 'Full-time',
    tag: 'Popular',
  },
  {
    title: 'Sublimation Print Technician',
    dept: 'Manufacturing',
    location: 'Faisalabad, Pakistan',
    type: 'Full-time',
    tag: 'Urgent',
  },
  {
    title: 'Team Sports Sales Executive',
    dept: 'Sales & Marketing',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    tag: 'Hot',
  },
  {
    title: 'Graphic Designer (Sportswear)',
    dept: 'Design Studio',
    location: 'Remote',
    type: 'Full-time',
    tag: '',
  },
  {
    title: 'Quality Control Specialist',
    dept: 'Manufacturing',
    location: 'Faisalabad, Pakistan',
    type: 'Full-time',
    tag: '',
  },
  {
    title: 'Supply Chain Coordinator',
    dept: 'Operations',
    location: 'Lahore, Pakistan',
    type: 'Full-time',
    tag: 'New',
  },
]

const perks = [
  { icon: 'fa-solid fa-rocket', title: 'Fast-Growing Team', text: 'Join a company scaling from local workshop to global sportswear brand.' },
  { icon: 'fa-solid fa-shield-halved', title: 'Health Coverage', text: 'Comprehensive health insurance for you and your family.' },
  { icon: 'fa-solid fa-graduation-cap', title: 'Learning Budget', text: 'Annual budget for courses, certifications, and trade skills.' },
  { icon: 'fa-solid fa-volleyball', title: 'Team Activities', text: 'Weekly sports sessions, tournaments, and company outings.' },
  { icon: 'fa-solid fa-house-laptop', title: 'Flexible Work', text: 'Hybrid roles with flexible hours across departments.' },
  { icon: 'fa-solid fa-trophy', title: 'Growth Paths', text: 'Clear promotion tracks from production floor to leadership.' },
]

export default function Careers() {
  const [submitted, setSubmitted] = useState(false)

  const scrollToApply = () => {
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="bg-white text-gray-900 antialiased overflow-x-hidden select-none font-sans">
      <section className="relative min-h-[400px] md:min-h-[460px] flex items-center justify-center bg-[#0f1923] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/imgi_224_m3_deal_bg.jpg"
            alt="Careers at EchoPride"
            className="w-full h-full object-cover opacity-25 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] via-[#0f1923]/70 to-[#0f1923]/50"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-5">
          <span className="text-[#baf120] text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] inline-block hero-anim hero-delay-1">
            CAREERS AT ECHOPRIDE
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight hero-anim hero-delay-2">
            BUILD YOUR CAREER IN SPORTS
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light hero-anim hero-delay-3">
            We're growing fast — and we're looking for passionate people who want to make world-class team sportswear.
            If you love sports and care about craft, there's a place for you here.
          </p>
          <div className="pt-1 text-xs font-semibold text-gray-400 tracking-wider hero-anim hero-delay-3">
            <Link to="/" className="text-[#baf120] hover:underline">
              Home
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-gray-200">Careers</span>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-7 reveal from-left">
            <div>
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">OUR CULTURE</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 leading-tight">
                A Team That Plays as Hard as It Works
              </h2>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed space-y-4 font-normal">
              <p>
                From the cutting table to the delivery box, every EchoPride teammate is part of one mission: giving
                athletes gear they're proud to wear. We hire for attitude, train for skill, and grow people alongside
                the brand.
              </p>
              <p>
                Whether you're a veteran of garment manufacturing or entering the industry for the first time, you'll
                find mentorship, modern tools, and a culture that celebrates the wins — on and off the field.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#baf120] flex items-center justify-center mb-3">
                  <i className="fa-solid fa-eye text-black text-sm"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Our Mission</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Make custom, high-performance sportswear accessible to every team on earth.
                </p>
              </div>
              <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#baf120] flex items-center justify-center mb-3">
                  <i className="fa-solid fa-bullseye text-black text-sm"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Our Promise</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Quality craftsmanship, fair treatment, and a career that grows with you.
                </p>
              </div>
            </div>
          </div>

          <div className="reveal from-right reveal-delay-2">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/imgi_18_a-sleek-modern-basketball-coach-s-hoodie-featuri-700x700.webp"
                alt="Craftsmanship at EchoPride"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl mt-8"
              />
              <img
                src="/imgi_132_m3_slide_01.jpg"
                alt="EchoPride Sports Culture"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl"
              />
              <img
                src="/imgi_27_m3_banner_022.jpg"
                alt="Production at EchoPride"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl"
              />
              <img
                src="/imgi_24_a-moisture-wicking-basketball-coach-s-hoodie-with-1-700x700.webp"
                alt="Team Spirit"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-20 md:py-28 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">WHY JOIN US</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 uppercase tracking-tight">
              PERKS &amp; BENEFITS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((p, i) => (
              <div key={p.title} className="bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-3 reveal">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-900 text-2xl">
                  <i className={p.icon}></i>
                </div>
                <h3 className="font-bold text-gray-900 text-base">{p.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28 px-6" id="openings">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">OPEN ROLES</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 uppercase tracking-tight">
              JOB OPENINGS
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto mt-4 font-normal">
              Browse open positions below. Don't see your dream role? Send us an open application via the form.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobOpenings.map((job, i) => (
              <div key={job.title} className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-7 space-y-4 hover:shadow-lg transition-shadow duration-300 reveal">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-gray-900 text-base leading-snug">{job.title}</h3>
                  {job.tag && (
                    <span className="bg-[#baf120] text-black text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded whitespace-nowrap">
                      {job.tag}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <p className="flex items-center gap-2">
                    <i className="fa-solid fa-folder text-[#baf120]"></i> {job.dept}
                  </p>
                  <p className="flex items-center gap-2">
                    <i className="fa-solid fa-location-dot text-[#baf120]"></i> {job.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <i className="fa-solid fa-clock text-[#baf120]"></i> {job.type}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={scrollToApply}
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-[#baf120] hover:text-black text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-lg transition-colors duration-300"
                >
                  Apply Now <i className="fa-solid fa-arrow-right text-xs"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="bg-[#0b1324] py-20 md:py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">APPLY TODAY</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 uppercase tracking-tight">
              APPLICATION FORM
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto mt-4 font-light">
              Tell us who you are and what you're great at. Our talent team reviews every application.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white/5 border border-[#baf120]/40 rounded-2xl p-10 text-center reveal visible">
              <div className="w-16 h-16 rounded-full bg-[#baf120] flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-check text-black text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Application Received!</h3>
              <p className="text-sm text-gray-400">
                Thank you for applying to EchoPride. Our team will get back to you within 5 business days.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-10 space-y-6 reveal"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full bg-[#131e36] border border-slate-700 rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#baf120] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full bg-[#131e36] border border-slate-700 rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#baf120] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 0000000"
                    className="w-full bg-[#131e36] border border-slate-700 rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#baf120] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Position Applying For *</label>
                  <select
                    required
                    defaultValue=""
                    className="w-full bg-[#131e36] border border-slate-700 rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#baf120] transition-colors"
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    {jobOpenings.map((job) => (
                      <option key={job.title} value={job.title} className="bg-[#131e36] text-white">
                        {job.title}
                      </option>
                    ))}
                    <option value="open" className="bg-[#131e36] text-white">
                      Open Application
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Why EchoPride? *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your experience, skills, and why you want to join us..."
                  className="w-full bg-[#131e36] border border-slate-700 rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#baf120] transition-colors resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Resume / CV (link)</label>
                <input
                  type="url"
                  placeholder="Link to your resume (Google Drive, LinkedIn, etc.)"
                  className="w-full bg-[#131e36] border border-slate-700 rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#baf120] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-colors duration-300"
              >
                <i className="fa-solid fa-paper-plane mr-2"></i> Submit Application
              </button>
            </form>
          )}
        </div>
      </section>

      <FooterAmazon />
    </div>
  )
}
