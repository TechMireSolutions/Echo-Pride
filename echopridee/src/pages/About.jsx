import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FooterAbout } from '../components/Footers'

function StatCounter({ target, suffix = '' }) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const duration = 1800
            const start = performance.now()
            const step = (now) => {
              const progress = Math.min((now - start) / duration, 1)
              setValue(Math.floor(target * progress))
              if (progress < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="stat-num text-4xl sm:text-5xl font-black text-[#baf120]">
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

const values = [
  { icon: 'fa-solid fa-trophy', title: 'Excellence', text: 'We pursue the highest standards in every product we create, ensuring athletes get nothing less than the best.', delay: 'reveal-delay-1' },
  { icon: 'fa-solid fa-handshake', title: 'Integrity', text: 'We build trust through transparency, reliability, and a commitment to doing right by our customers and community.', delay: 'reveal-delay-2' },
  { icon: 'fa-solid fa-people-group', title: 'Teamwork', text: 'We collaborate with athletes, coaches, and organizations to create gear that brings teams together and elevates performance.', delay: 'reveal-delay-3' },
  { icon: 'fa-solid fa-lightbulb', title: 'Innovation', text: 'We continuously explore new materials, designs, and technologies to keep athletes ahead of the game.', delay: 'reveal-delay-2' },
  { icon: 'fa-solid fa-heart', title: 'Passion', text: 'Sports is our heartbeat. We pour passion into every product because we understand what it means to compete.', delay: 'reveal-delay-3' },
  { icon: 'fa-solid fa-earth-americas', title: 'Inclusivity', text: 'We believe sports are for everyone. Our products are designed for athletes of all levels, sizes, and backgrounds.', delay: 'reveal-delay-4' },
]

const checkList = [
  { icon: 'fa-solid fa-check', text: 'Custom Team Manufacturing', sub: 'Sublimated jerseys, uniforms, and coaching gear produced in our own facility.' },
  { icon: 'fa-solid fa-check', text: 'Premium Quality & Durability', sub: 'Materials and clothing engineered to support athletes through training, competition, and beyond.' },
  { icon: 'fa-solid fa-check', text: 'Innovative Design', sub: 'Modern, bold styles built for durability, movement, and team pride — because details matter.' },
  { icon: 'fa-solid fa-check', text: 'Dedicated Customer Support', sub: 'Dedicated customer support from real sports enthusiasts.' },
]

const whyPoints = [
  'Premium moisture-wicking & breathable fabrics',
  'Reinforced stitching for long-lasting durability',
  'Custom sizing & team branding options',
  'Fast turnaround & reliable shipping worldwide',
  'Dedicated customer support from real sports enthusiasts',
]

const serviceRow = [
  { icon: 'fa-solid fa-truck', title: 'Ship to Home', text: 'Order online and have products shipped directly to your doorstep.' },
  { icon: 'fa-solid fa-store', title: 'Bulk Order Discounts', text: 'Save more on volume orders for your whole team.' },
  { icon: 'fa-solid fa-credit-card', title: 'Flexible Payment', text: 'Turn big purchases into small, manageable payments.' },
  { icon: 'fa-solid fa-headset', title: '24/7 Support', text: 'Our team is always here to help you find what you need.' },
]

const storyImages = [
  { src: 'imgi_5_m3_cat_01.jpg', alt: 'Basketball Team Gear', tag: 'Basketball' },
  { src: 'imgi_6_m3_cat_02.jpg', alt: 'Football Team Gear', tag: 'Football' },
  { src: 'imgi_7_m3_cat_03.jpg', alt: 'Soccer Team Gear', tag: 'Soccer' },
  { src: 'imgi_8_m3_cat_04.jpg', alt: 'Softball Team Gear', tag: 'Softball' },
  { src: 'imgi_9_m3_cat_05.jpg', alt: 'Rugby Team Gear', tag: 'Rugby' },
  { src: 'imgi_224_m3_deal_bg.jpg', alt: 'Custom Printed Sportswear', tag: 'Custom Print' },
]

const processSteps = [
  { icon: 'fa-solid fa-pen-ruler', title: 'Design & Digitizing', text: 'Our designers work with you to finalize team colors, logos, and artwork before anything is produced.' },
  { icon: 'fa-solid fa-print', title: 'Dye-Sublimation Printing', text: 'Vibrant, fade-proof graphics are printed directly into premium performance fabric.' },
  { icon: 'fa-solid fa-shirt', title: 'Cut, Sew & Finish', text: 'Garments are precision-cut, stitched, and quality-checked by skilled craftspeople.' },
  { icon: 'fa-solid fa-box-open', title: 'Pack & Ship', text: 'Finished gear is inspected, packed, and shipped to your doorstep — usually within 21 days.' },
]

export default function About() {
  return (
    <div className="bg-white text-gray-900 antialiased overflow-x-hidden select-none font-sans">
      <section className="relative min-h-[400px] md:min-h-[460px] flex items-center justify-center bg-[#0f1923] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/imgi_132_m3_slide_01.jpg"
            alt="About EchoPride"
            className="w-full h-full object-cover opacity-25 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] via-[#0f1923]/70 to-[#0f1923]/50"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-5">
          <span className="text-[#baf120] text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] inline-block hero-anim hero-delay-1">
            ABOUT ECHOPRIDE
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight hero-anim hero-delay-2">
            WHERE CHAMPIONS GEAR UP
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light hero-anim hero-delay-3">
            Born from a passion for performance and a commitment to quality — we outfit athletes with custom-manufactured
            gear that looks strong, feels comfortable, and performs beautifully.
          </p>
          <div className="pt-1 text-xs font-semibold text-gray-400 tracking-wider hero-anim hero-delay-3">
            <Link to="/" className="text-[#baf120] hover:underline">
              Home
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-gray-200">About Us</span>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="reveal from-left">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/imgi_26_m3_banner_01.jpg"
                alt="EchoPride Performance Gear"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl mt-8"
              />
              <img
                src="/imgi_18_a-sleek-modern-basketball-coach-s-hoodie-featuri-700x700.webp"
                alt="Custom Basketball Apparel"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl"
              />
              <img
                src="/imgi_27_m3_banner_022.jpg"
                alt="EchoPride Sportswear"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl"
              />
              <img
                src="/imgi_19_a-waterproof-basketball-coach-s-jacket-with-a-bold-700x700.webp"
                alt="Team Coaching Jacket"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl mt-8"
              />
            </div>
          </div>

          <div className="space-y-7 reveal from-right reveal-delay-1">
            <div>
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">OUR STORY</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 leading-tight">
                From a Small Workshop to a Full Custom Sportswear Manufacturer
              </h2>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed space-y-4 font-normal">
              <p>
                EchoPride was founded with a simple belief: every team — from the school court to the professional
                arena — deserves gear built exactly the way they imagine it. What started as a small workshop printing
                custom jerseys has grown into a complete sportswear manufacturer handling design, dye-sublimation
                printing, sewing, and delivery under one roof.
              </p>
              <p>
                Today we outfit basketball, football, soccer, softball, and rugby teams across the globe with uniforms,
                coaching apparel, and training gear that combine modern sports fashion with high-performance athletic
                engineering.
              </p>
            </div>

            <ul className="space-y-4">
              {checkList.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#baf120] flex items-center justify-center shrink-0 mt-0.5">
                    <i className="fa-solid fa-check text-black text-[9px]"></i>
                  </div>
                  <div>
                    <strong className="text-sm text-gray-900 block">{item.text}</strong>
                    <span className="text-xs text-gray-500">{item.sub}</span>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-lg transition-colors duration-300 shadow-md"
            >
              Shop Our Collection <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#0b1324] py-14 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="reveal reveal-delay-1">
            <StatCounter target={10000} suffix="+" />
            <p className="text-xs font-bold text-white uppercase tracking-widest mt-2">Athletes Empowered</p>
          </div>
          <div className="reveal reveal-delay-2">
            <StatCounter target={500} suffix="+" />
            <p className="text-xs font-bold text-white uppercase tracking-widest mt-2">Teams Outfitted</p>
          </div>
          <div className="reveal reveal-delay-3">
            <StatCounter target={18} />
            <p className="text-xs font-bold text-white uppercase tracking-widest mt-2">Sports Categories</p>
          </div>
          <div className="reveal reveal-delay-4">
            <StatCounter target={99} suffix="%" />
            <p className="text-xs font-bold text-white uppercase tracking-widest mt-2">Customer Satisfaction</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">OUR MISSION</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 uppercase tracking-tight">
              SPORTS FOR EVERYONE, GEAR FOR EVERY TEAM
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto mt-4 font-normal">
              Our mission is simple: to make custom, high-performance team sportswear accessible to every athlete and
              club — with premium quality, fast turnaround, and a design process built around you.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {storyImages.map((img, i) => (
              <div
                key={img.tag}
                className={`relative aspect-square rounded-2xl overflow-hidden shadow-md group reveal reveal-delay-${
                  (i % 6) + 1
                }`}
              >
                <img
                  src={`/${img.src}`}
                  alt={img.alt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                <span className="absolute bottom-3 left-3 text-white text-xs sm:text-sm font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  {img.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-20 md:py-28 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">HOW IT'S MADE</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 uppercase tracking-tight">
              OUR CUSTOM MANUFACTURING PROCESS
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto mt-4 font-normal">
              Every order moves through a proven in-house workflow — from first sketch to final stitch — so your team
              gets exactly what it designed.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {processSteps.slice(0, 3).map((step) => (
              <div
                key={step.title}
                className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 sm:p-8 text-center space-y-3 reveal"
              >
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-900 text-2xl">
                  <i className={step.icon}></i>
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">OUR VALUES</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 uppercase tracking-tight">
              WHAT DRIVES US
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className={`value-card bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-3 reveal ${v.delay}`}
              >
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-900 text-2xl">
                  <i className={v.icon}></i>
                </div>
                <h3 className="font-bold text-gray-900 text-base">{v.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-20 md:py-28 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-7 reveal from-left">
            <div>
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">WHY ECHOPRIDE</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 leading-tight">
                Built for Champions, Designed for You
              </h2>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              Every product in our catalog is crafted with meticulous attention to detail. From moisture-wicking fabrics
              to reinforced stitching, we ensure that your gear performs as hard as you do.
            </p>

            <ul className="space-y-3">
              {whyPoints.map((point) => (
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
                src="/imgi_16_a-premium-varsity-style-basketball-coaching-jacket-700x700.webp"
                alt="Why EchoPride"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl"
              />
              <img
                src="/imgi_24_a-moisture-wicking-basketball-coach-s-hoodie-with-1-700x700.webp"
                alt="Moisture Wicking Team Hoodie"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl mt-8"
              />
              <img
                src="/imgi_20_a-zip-up-hoodie-designed-for-basketball-coaches-w-700x700.webp"
                alt="Custom Zip-Up Hoodie"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl"
              />
              <img
                src="/imgi_25_a-moisture-wicking-basketball-coach-s-hoodie-with--700x700.webp"
                alt="Bold Design Team Hoodie"
                className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-xl mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceRow.map((s, i) => (
            <div key={s.title} className={`text-center space-y-3 reveal reveal-delay-${i + 1}`}>
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-gray-800 text-2xl">
                <i className={s.icon}></i>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">{s.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 md:py-20 px-6 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center space-y-6 reveal">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Get Exclusive Offers &amp; Updates</h2>
          <p className="text-sm text-black font-semibold">
            Subscribe to our newsletter and receive 10% off your first order!
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
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <FooterAbout />
    </div>
  )
}
