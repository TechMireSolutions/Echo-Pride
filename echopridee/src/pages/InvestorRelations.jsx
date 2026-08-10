import React from 'react'
import { Link } from 'react-router-dom'
import { FooterAmazon } from '../components/Footers'

const highlights = [
  { value: '$12.4M', label: 'FY 2025 Revenue', delta: '+38% YoY', up: true },
  { value: '2,800', label: 'Orders Shipped / Month', delta: '+52% YoY', up: true },
  { value: '64%', label: 'Gross Margin', delta: '+6 pts', up: true },
  { value: '21', label: 'Countries Served', delta: '+9 new', up: true },
]

const governance = [
  { icon: 'fa-solid fa-building-columns', title: 'Board of Directors', text: 'A diverse board guiding strategy, risk, and long-term value creation.' },
  { icon: 'fa-solid fa-scale-balanced', title: 'Ethics & Compliance', text: 'Robust policies covering anti-corruption, fair labor, and data privacy.' },
  { icon: 'fa-solid fa-user-tie', title: 'Executive Leadership', text: 'An experienced leadership team spanning manufacturing, design, and retail.' },
  { icon: 'fa-solid fa-chart-line', title: 'Audit Committee', text: 'Independent oversight of financial reporting and internal controls.' },
]

const reports = [
  { title: 'Annual Report 2025', date: 'March 2026', tag: 'PDF', size: '4.2 MB' },
  { title: 'ESG & Sustainability Report', date: 'February 2026', tag: 'PDF', size: '2.8 MB' },
  { title: 'Q1 2026 Financial Results', date: 'April 2026', tag: 'PDF', size: '1.6 MB' },
  { title: 'Investor Presentation 2026', date: 'January 2026', tag: 'PDF', size: '6.1 MB' },
  { title: 'Corporate Governance Charter', date: 'November 2025', tag: 'PDF', size: '0.9 MB' },
  { title: 'Supply Chain Transparency Report', date: 'October 2025', tag: 'PDF', size: '3.4 MB' },
]

const faqs = [
  {
    q: 'Is EchoPride publicly traded?',
    a: 'Not yet. EchoPride is a privately held company. We share this information to keep our community, partners, and prospective investors informed about our growth.',
  },
  {
    q: 'How can I invest in EchoPride?',
    a: 'Our doors are open to strategic and growth-stage investors. Reach out through our contact form and the investor relations team will respond.',
  },
  {
    q: 'Where can I find your financial statements?',
    a: 'Key financial highlights are published here each quarter, and full reports are available in the Reports & Filings section above.',
  },
]

export default function InvestorRelations() {
  return (
    <div className="bg-white text-gray-900 antialiased overflow-x-hidden select-none font-sans">
      <section className="relative min-h-[400px] md:min-h-[460px] flex items-center justify-center bg-[#0f1923] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/imgi_27_m3_banner_022.jpg"
            alt="EchoPride Investor Relations"
            className="w-full h-full object-cover opacity-25 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] via-[#0f1923]/70 to-[#0f1923]/50"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-5">
          <span className="text-[#baf120] text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] inline-block hero-anim hero-delay-1">
            INVESTOR RELATIONS
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight hero-anim hero-delay-2">
            GROWTH. TRANSPARENCY. PERFORMANCE.
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light hero-anim hero-delay-3">
            EchoPride is scaling from a regional workshop into a global sportswear manufacturer. Here you'll find our
            financial highlights, governance practices, and published reports.
          </p>
          <div className="pt-1 text-xs font-semibold text-gray-400 tracking-wider hero-anim hero-delay-3">
            <Link to="/" className="text-[#baf120] hover:underline">
              Home
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-gray-200">Investor Relations</span>
          </div>
        </div>
      </section>

      <section className="bg-[#0b1324] py-14 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {highlights.map((h, i) => (
            <div key={h.label} className={`reveal reveal-delay-${i + 1}`}>
              <p className="text-3xl sm:text-4xl font-black text-[#baf120]">{h.value}</p>
              <p className="text-xs font-bold text-white uppercase tracking-widest mt-2">{h.label}</p>
              <p className={`text-[11px] font-bold mt-1 ${h.up ? 'text-emerald-400' : 'text-red-400'}`}>
                <i className={`fa-solid ${h.up ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} mr-1`}></i>
                {h.delta}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-7 reveal from-left">
            <div>
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">WHY INVEST</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 leading-tight">
                A High-Growth Player in Custom Team Sportswear
              </h2>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed space-y-4 font-normal">
              <p>
                The global sports apparel market continues to expand, and custom team wear is one of its fastest-growing
                segments. EchoPride sits at the heart of that trend — with our own manufacturing, a dedicated design
                studio, and a direct-to-team sales model.
              </p>
              <p>
                We keep our operations lean, our margins healthy, and our turnaround fast. That focus has driven steady,
                compounding growth year over year.
              </p>
            </div>

            <ul className="space-y-3">
              {[
                'Vertically integrated in-house manufacturing',
                'Recurring demand from schools, clubs & leagues',
                'Dye-sublimation technology for low-cost customization',
                'Expanding international shipping network',
              ].map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-black font-semibold">
                  <i className="fa-solid fa-circle-check text-base text-[#baf120]"></i>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal from-right reveal-delay-2">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/imgi_5_m3_cat_01.jpg"
                alt="EchoPride Growth"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl mt-8"
              />
              <img
                src="/imgi_19_a-waterproof-basketball-coach-s-jacket-with-a-bold-700x700.webp"
                alt="EchoPride Products"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl"
              />
              <img
                src="/imgi_26_m3_banner_01.jpg"
                alt="EchoPride Scale"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl"
              />
              <img
                src="/imgi_21_a-high-performance-fleece-lined-hoodie-for-basketb-700x700.webp"
                alt="EchoPride Quality"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-20 md:py-28 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">CORPORATE GOVERNANCE</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 uppercase tracking-tight">
              HOW WE'RE GOVERNED
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {governance.map((g) => (
              <div key={g.title} className="bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-3 reveal">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-900 text-2xl">
                  <i className={g.icon}></i>
                </div>
                <h3 className="font-bold text-gray-900 text-base">{g.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">DOCUMENTS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 uppercase tracking-tight">
              REPORTS &amp; FILINGS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((r) => (
              <div
                key={r.title}
                className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-7 flex items-start justify-between gap-4 hover:shadow-lg transition-shadow duration-300 reveal"
              >
                <div className="space-y-2">
                  <span className="bg-[#baf120] text-black text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded">
                    {r.tag}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug">{r.title}</h3>
                  <p className="text-[11px] text-gray-400">
                    {r.date} · {r.size}
                  </p>
                </div>
                <a
                  href="#reports"
                  onClick={(e) => e.preventDefault()}
                  className="w-10 h-10 shrink-0 rounded-full bg-gray-900 hover:bg-[#baf120] text-white hover:text-black flex items-center justify-center transition-colors duration-300"
                  aria-label={`Download ${r.title}`}
                >
                  <i className="fa-solid fa-download text-sm"></i>
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            Demo reports are placeholders. Contact our team for official investor documents.
          </p>
        </div>
      </section>

      <section className="bg-[#0b1324] py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">INVESTOR FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 uppercase tracking-tight">
              COMMON QUESTIONS
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="group bg-white/5 border border-white/10 rounded-xl p-6 reveal">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-bold text-white list-none">
                  {f.q}
                  <i className="fa-solid fa-chevron-down text-xs text-[#baf120] group-open:rotate-180 transition-transform duration-300"></i>
                </summary>
                <p className="text-xs text-gray-400 leading-relaxed mt-4">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="text-center mt-12 reveal">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-colors duration-300"
            >
              Contact Investor Relations <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>
        </div>
      </section>

      <FooterAmazon />
    </div>
  )
}
