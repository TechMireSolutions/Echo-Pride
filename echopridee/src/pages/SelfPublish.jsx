import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FooterAmazon } from '../components/Footers'

const publishSteps = [
  {
    icon: 'fa-solid fa-pen-nib',
    step: '01',
    title: 'Write & Prepare',
    text: 'Draft your training manual, coaching playbook, or sports guide in any format. We accept Word, PDF, and EPUB files for review.',
  },
  {
    icon: 'fa-solid fa-cloud-arrow-up',
    step: '02',
    title: 'Submit Your Work',
    text: 'Upload your manuscript through the submission form below, add your title and description, and choose your content type.',
  },
  {
    icon: 'fa-solid fa-eye',
    step: '03',
    title: 'Review & Format',
    text: 'Our publishing team reviews your work, formats it for print and digital reading, and helps you polish covers and metadata.',
  },
  {
    icon: 'fa-solid fa-rocket',
    step: '04',
    title: 'Publish & Sell',
    text: 'Go live across Echo Pride in print and digital formats. Track sales, earn royalties, and keep the rights to your work.',
  },
]

const publishFeatures = [
  { icon: 'fa-solid fa-feather-pointed', title: 'Keep Your Rights', text: 'You retain full ownership of your content and can publish elsewhere anytime.' },
  { icon: 'fa-solid fa-book-bookmark', title: 'Print & Digital', text: 'Offer print-on-demand books and digital editions with a single submission.' },
  { icon: 'fa-solid fa-percent', title: 'Fair Royalties', text: 'Earn competitive royalties on every print and digital sale with clear statements.' },
  { icon: 'fa-solid fa-globe', title: 'Global Reach', text: 'Make your work available to coaches, players, and teams around the world.' },
  { icon: 'fa-solid fa-chart-line', title: 'Sales Analytics', text: 'Track sales, royalties, and reader engagement from one publishing dashboard.' },
  { icon: 'fa-solid fa-users', title: 'Athlete Audience', text: 'Publish directly to a built-in audience of athletes and sports professionals.' },
]

const initialForm = {
  fullName: '',
  email: '',
  contentType: 'Training Manual',
  title: '',
  sport: '',
  description: '',
  file: '',
}

export default function SelfPublish() {
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
            src="/imgi_133_m3_cat_bg.jpg"
            alt="Self-Publish with Us Background"
            className="w-full h-full object-cover opacity-35 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/70"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-4">
          <span className="text-[#baf120] text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] inline-block animate-fade-in-up delay-1">
            SELF-PUBLISHING PROGRAM
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white animate-fade-in-up delay-2">
            Self-Publish with Us
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light animate-fade-in-up delay-3">
            Publish training manuals, coaching playbooks, and digital sports guides for the athletes and teams who need
            them. You write, we publish — and you keep the rights.
          </p>
          <div className="pt-2 text-xs font-semibold text-gray-400 tracking-wider">
            <Link to="/" className="text-[#baf120] hover:underline">
              Home
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-gray-200">Self-Publish with Us</span>
          </div>
        </div>
      </section>

      {submitted && (
        <div className="bg-[#baf120] text-black px-6 py-4 text-center">
          <p className="text-sm font-bold uppercase tracking-wider">
            <i className="fa-solid fa-circle-check mr-2"></i>
            Submission received! Our publishing team will review your work and get back to you within 3–5 business days.
          </p>
        </div>
      )}

      <section className="bg-[#f8fafc] py-16 md:py-24 px-6 md:px-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">HOW IT WORKS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              From Manuscript to Marketplace
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              A simple, guided process built for sport authors, coaches, and content creators — no publisher, no
              gatekeepers, no minimum print runs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {publishSteps.map((item) => (
              <div key={item.step} className="relative bg-white rounded-2xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition-shadow">
                <span className="absolute top-5 right-6 text-4xl font-black text-gray-100">{item.step}</span>
                <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center text-lg shrink-0 shadow-md mb-5">
                  <i className={item.icon}></i>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">WHY PUBLISH HERE</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              Built for Sport Creators
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishFeatures.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4 bg-[#f8fafc] border border-gray-200 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-[#baf120] text-black flex items-center justify-center text-lg shrink-0 shadow-md">
                  <i className={feature.icon}></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="submit" className="py-16 md:py-24 px-6 md:px-12 bg-[#0a0e14]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">SUBMIT YOUR WORK</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 uppercase">
              Send Us Your Manuscript
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mt-3 max-w-2xl mx-auto">
              Fill in the details below and attach your manuscript, guide, or digital book. Our team will review it and
              reply with next steps within 3–5 business days.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 md:p-10 shadow-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={form.fullName}
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
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Content Type</label>
                <select
                  name="contentType"
                  value={form.contentType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#baf120] transition-colors bg-white"
                >
                  <option>Training Manual</option>
                  <option>Coaching Playbook</option>
                  <option>Sports Guide</option>
                  <option>Digital Book</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Target Sport (optional)</label>
                <input
                  type="text"
                  name="sport"
                  value={form.sport}
                  onChange={handleChange}
                  placeholder="e.g. Basketball, Football, Rugby"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#baf120] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Title of Your Work</label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="Your book or guide title"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#baf120] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Short Description</label>
              <textarea
                name="description"
                required
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell us what your work is about — audience, format, and why it helps athletes or coaches."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#baf120] transition-colors resize-y"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Manuscript File (optional)</label>
              <div className="flex items-center justify-center flex-col border-2 border-dashed border-gray-300 rounded-lg px-4 py-8 text-center hover:border-[#baf120] transition-colors">
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-300 mb-3"></i>
                <p className="text-sm text-gray-500 mb-1">Drag & drop your file here or click to browse</p>
                <p className="text-xs text-gray-400">PDF, Word, or EPUB — up to 50 MB</p>
                <input
                  type="file"
                  name="file"
                  value={form.file}
                  onChange={handleChange}
                  className="mt-4 text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-900 file:text-white file:text-xs file:font-bold hover:file:bg-black cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-lg transition-colors duration-300 shadow-lg"
            >
              Submit for Review
            </button>
          </form>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold uppercase tracking-wide text-gray-900 mb-3">
            Have questions about publishing?
          </h2>
          <p className="text-gray-600 text-sm mb-8 max-w-2xl mx-auto">
            Talk to our publishing team about royalties, formatting, or timelines before you submit.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-gray-900 hover:bg-black text-white font-bold text-xs sm:text-sm uppercase tracking-widest px-10 py-4 rounded-lg transition-colors duration-300 shadow-lg"
          >
            Contact the Publishing Team
          </Link>
        </div>
      </section>

      <FooterAmazon />
    </div>
  )
}
