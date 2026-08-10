import React from 'react'
import { Link } from 'react-router-dom'
import { FooterAmazon } from '../components/Footers'

const techCards = [
  {
    icon: 'fa-solid fa-droplet',
    title: 'Moisture-Wicking Core',
    text: 'Hydrophilic yarns pull sweat from the skin and spread it across the fabric surface, where it evaporates fast — keeping you dry through the longest sessions.',
  },
  {
    icon: 'fa-solid fa-wind',
    title: 'Breathable Mesh Zones',
    text: 'Strategically placed ventilation panels increase airflow where athletes heat up most — the back, underarms, and side seams.',
  },
  {
    icon: 'fa-solid fa-shield-halved',
    title: '4-Way Stretch Weave',
    text: 'Elastane-blended weaves move with the body in every direction, preventing restriction during sprints, jumps, and direction changes.',
  },
  {
    icon: 'fa-solid fa-sun',
    title: 'UV Protection & Thermo-Regulation',
    text: 'Sun-safe coatings and lightweight thermal layers regulate body temperature from blazing summer courts to cold early-season fields.',
  },
]

const fabrics = [
  { name: 'EchoDry™ Pro', use: 'Match-day jerseys & game shorts', stat: '300% faster drying' },
  { name: 'BreatheKnit™', use: 'Training tops & practice wear', stat: '2.4x more airflow' },
  { name: 'ThermoFlex™', use: 'Hoodies, jackets & sideline wear', stat: '-2°C skin temp' },
  { name: 'DuraStitch™', use: 'High-contact rugby & football gear', stat: '5x seam strength' },
]

const stats = [
  { value: '300%', label: 'Faster Moisture Evaporation' },
  { value: '98%', label: 'Sweat Wicked Away From Skin' },
  { value: '40g', label: 'Lighter Than Standard Kits' },
  { value: '21d', label: 'Average Design-to-Door Turnaround' },
]

export default function Science() {
  return (
    <div className="bg-white text-gray-900 antialiased overflow-x-hidden select-none font-sans">
      <section className="relative min-h-[400px] md:min-h-[460px] flex items-center justify-center bg-[#0f1923] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/imgi_224_m3_deal_bg.jpg"
            alt="EchoPride Sport Science"
            className="w-full h-full object-cover opacity-25 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] via-[#0f1923]/70 to-[#0f1923]/50"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-5">
          <span className="text-[#baf120] text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] inline-block hero-anim hero-delay-1">
            ECHOPRIDE SCIENCE
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight hero-anim hero-delay-2">
            THE SCIENCE BEHIND EVERY STITCH
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light hero-anim hero-delay-3">
            Performance starts in the lab. Explore the fabric technologies, moisture-wicking materials, and sports
            science engineered into every EchoPride product.
          </p>
          <div className="pt-1 text-xs font-semibold text-gray-400 tracking-wider hero-anim hero-delay-3">
            <Link to="/" className="text-[#baf120] hover:underline">
              Home
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-gray-200">Science</span>
          </div>
        </div>
      </section>

      <section className="bg-[#0b1324] py-14 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={s.label} className={`reveal reveal-delay-${i + 1}`}>
              <p className="text-3xl sm:text-4xl font-black text-[#baf120]">{s.value}</p>
              <p className="text-xs font-bold text-white uppercase tracking-widest mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">FABRIC TECHNOLOGY</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 uppercase tracking-tight">
              ENGINEERED FOR THE ATHLETE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {techCards.map((t, i) => (
              <div
                key={t.title}
                className="flex items-start gap-5 bg-[#f8fafc] border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 reveal"
              >
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-gray-900 text-[#baf120] flex items-center justify-center text-2xl">
                  <i className={t.icon}></i>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900 text-base">{t.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.text}</p>
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
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">MOISTURE MANAGEMENT</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 leading-tight">
                How Sweat Works, and How We Beat It
              </h2>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed space-y-4 font-normal">
              <p>
                When your body heats up, it sweats to cool down. If that sweat stays trapped against your skin, it
                drags you down — literally, with added weight, and figuratively, with discomfort and chafing.
              </p>
              <p>
                Our moisture-wicking fabrics use a capillary effect: hydrophilic (water-loving) yarns pull sweat away
                from your body toward the fabric's outer surface, where it spreads over a larger area and evaporates
                far faster than on bare skin.
              </p>
              <p>
                The result is a lighter, drier, cooler layer between you and the game — so your energy stays where it
                belongs: on the court, pitch, or field.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {fabrics.map((f) => (
                <div key={f.name} className="bg-white border border-gray-100 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 text-sm">{f.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{f.use}</p>
                  <span className="inline-block mt-3 bg-[#baf120] text-black text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded">
                    {f.stat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal from-right reveal-delay-2">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/imgi_24_a-moisture-wicking-basketball-coach-s-hoodie-with-1-700x700.webp"
                alt="Moisture Wicking Fabric"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl mt-8"
              />
              <img
                src="/imgi_18_a-sleek-modern-basketball-coach-s-hoodie-featuri-700x700.webp"
                alt="Performance Apparel"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl"
              />
              <img
                src="/imgi_25_a-moisture-wicking-basketball-coach-s-hoodie-with--700x700.webp"
                alt="Bold Performance Fabric"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl"
              />
              <img
                src="/imgi_21_a-high-performance-fleece-lined-hoodie-for-basketb-700x700.webp"
                alt="Breathable Training Gear"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">PERFORMANCE SCIENCE</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 uppercase tracking-tight">
              DESIGNED WITH ATHLETES, TESTED ON THE FIELD
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto mt-4 font-normal">
              Every EchoPride garment goes through real-world testing with teams before it reaches our catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-8 space-y-3 reveal">
              <i className="fa-solid fa-flask text-3xl text-[#baf120]"></i>
              <h3 className="font-bold text-gray-900 text-base">Lab Tested</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Fabric strength, colorfastness, and drying rates are measured under controlled conditions in our
                quality lab.
              </p>
            </div>
            <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-8 space-y-3 reveal">
              <i className="fa-solid fa-stopwatch text-3xl text-[#baf120]"></i>
              <h3 className="font-bold text-gray-900 text-base">Athlete Verified</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Partner teams wear-test prototypes across a full season before we sign off on any new material.
              </p>
            </div>
            <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-8 space-y-3 reveal">
              <i className="fa-solid fa-recycle text-3xl text-[#baf120]"></i>
              <h3 className="font-bold text-gray-900 text-base">Sustainably Made</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Low-waste sublimation printing and responsibly sourced fabrics reduce our footprint from factory to
                field.
              </p>
            </div>
          </div>

          <div className="text-center mt-12 reveal">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-colors duration-300"
            >
              Shop Science-Backed Gear <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>
        </div>
      </section>

      <FooterAmazon />
    </div>
  )
}
