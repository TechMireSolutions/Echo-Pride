import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CategoryCarousel from '../components/CategoryCarousel'
import ProductCarousel from '../components/ProductCarousel'
import { FooterAmazon } from '../components/Footers'
import { parseUsdPrice } from '../data/currencies'
import { useCurrency } from '../context/CurrencyContext'
import { useSettings } from '../api'

const DEFAULT_DEAL = {
  enabled: true,
  subtitle: 'SKYWALKER SPECIALS',
  title: "High-Flyin' Deals on Basketball Gear!",
  targetUrl: '/shop/basketball',
  category: 'basketball',
  dealEndDate: '2026-12-31T23:59:59.000Z',
  backgroundImage: 'imgi_224_m3_deal_bg.jpg',
  buttonText: 'Shop now',
}

const dealBgSrc = (src) => {
  if (!src) return '/imgi_224_m3_deal_bg.jpg'
  return src.startsWith('http') || src.startsWith('/') ? src : `/${src}`
}

const isExternalUrl = (url) => /^(https?:)?\/\//i.test(url || '')

const getRemainingTime = (endDate) => {
  const end = endDate ? Date.parse(endDate) : NaN
  if (Number.isNaN(end)) return null
  const diff = Math.max(0, end - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

const pad = (n) => String(n).padStart(2, '0')

const newArrivalTabs = [
  {
    id: 'football-tab',
    label: 'Football Uniform',
    products: [
      { title: 'MATCH HOME JERSEY', price: '$85.00', image: 'imgi_26_m3_banner_01.jpg', slug: 'quarter-zip-basketball-coachs-pullover' },
      { title: 'MATCH AWAY JERSEY', price: '$85.00', image: 'imgi_25_a-moisture-wicking-basketball-coach-s-hoodie-with--700x700.webp', slug: 'moisture-wicking-hoodie-bold-design' },
      { title: 'THIRD ELITE KIT', price: '$90.00', image: 'imgi_24_a-moisture-wicking-basketball-coach-s-hoodie-with-1-700x700.webp', slug: 'moisture-wicking-basketball-coachs-hoodie' },
      { title: 'PITCH PLAYER SHORTS', price: '$45.00', image: 'imgi_23_a-minimalist-basketball-coach-s-jacket-with-subtle-700x700.webp', slug: 'basketball-coachs-minimalist-hoodie' },
    ],
  },
  {
    id: 'accessories-tab',
    label: 'Accessories',
    products: [
      { title: 'PREMIUM PITCH CAPTAIN BAND', price: '$25.00', image: 'imgi_23_a-minimalist-basketball-coach-s-jacket-with-subtle-700x700.webp', slug: 'basketball-coachs-minimalist-hoodie' },
      { title: 'ELITE SHINGUARDS PRO', price: '$40.00', image: 'imgi_18_a-sleek-modern-basketball-coach-s-hoodie-featuri-700x700.webp', slug: 'quarter-zip-basketball-coachs-pullover' },
      { title: 'STRIKER FOOTBALL SIZE 5', price: '$35.00', image: 'imgi_17_a-quarter-zip-basketball-coach-s-pullover-with-a-s-700x700.webp', slug: 'quarter-zip-basketball-coachs-pullover-alternate' },
      { title: 'PERFORMANCE CREW SOCKS', price: '$18.00', image: 'imgi_16_a-premium-varsity-style-basketball-coaching-jacket-700x700.webp', slug: 'premium-varsity-style-basketball-coaching-jacket' },
    ],
  },
  {
    id: 'tracksuits-tab',
    label: 'Tracksuits',
    products: [
      { title: 'ELITE HYBRID DRY TRACKSUIT', price: '$140.00', image: 'imgi_19_a-waterproof-basketball-coach-s-jacket-with-a-bold-700x700.webp', slug: 'waterproof-basketball-coachs-jacket' },
      { title: 'WARM-UP FLEECE JACKET', price: '$85.00', image: 'imgi_20_a-zip-up-hoodie-designed-for-basketball-coaches-w-700x700.webp', slug: 'basketball-coachs-zip-up-hoodie' },
      { title: 'CORE TRAINING PANTS', price: '$65.00', image: 'imgi_21_a-high-performance-fleece-lined-hoodie-for-basketb-700x700.webp', slug: 'high-performance-basketball-fleece-hoodie' },
      { title: 'CHAMPION TRACK SET', price: '$150.00', image: 'imgi_224_m3_deal_bg.jpg', slug: 'basketball-coachs-lightweight-windbreaker' },
    ],
  },
]

const promoBanners = [
  { image: 'imgi_26_m3_banner_01.jpg', tag: 'Up to 50%', title: ['Score Big', 'Savings on', 'Sports Shoes'], to: '/shop' },
  { image: 'imgi_27_m3_banner_022.jpg', tag: 'Up to 40%', title: ['Huge Discounts on', 'Sportswear'], to: '/shop' },
  { image: 'imgi_28_m3_banner_03.jpg', tag: 'Up to 30%', title: ['Accessories', 'Markdown Madness'], to: '/shop' },
]

const serviceFeatures = [
  { icon: 'fa-solid fa-truck-fast', title: 'Ship to Home', text: 'Order online and have products shipped to you.' },
  { icon: 'fa-solid fa-box-open', title: 'Free In-Store Pickup', text: 'Order online and pick up in store.' },
  { icon: 'fa-solid fa-credit-card', title: 'Credit Offered', text: 'Turn big purchases into small payments.' },
  { icon: 'fa-solid fa-headset', title: 'Customer Support', text: "We're here to help you find what you need." },
]

function PromoCard({ banner, wide = false }) {
  return (
    <Link
      to={banner.to}
      className={`promo-banner relative block overflow-hidden rounded-lg group ${
        wide ? 'h-[320px] md:h-[420px]' : 'h-[300px] sm:h-[320px] md:h-[340px]'
      }`}
    >
      <img
        src={`/${banner.image}`}
        alt={banner.title.join(' ')}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20"></div>
      <div
        className={`absolute inset-0 z-10 flex flex-col justify-center space-y-2.5 px-6 md:px-8 ${
          wide ? 'items-center text-center' : 'items-start'
        }`}
      >
        <span className="text-sm font-semibold text-[#baf120] tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {banner.tag}
        </span>
        <h3 className="text-2xl md:text-[1.65rem] font-extrabold text-white leading-snug max-w-[90%] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          {banner.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h3>
        <div className="pt-2">
          <span className="inline-flex items-center gap-2 bg-[#baf120] text-black text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded shadow-md transition-all duration-500 group-hover:bg-white group-hover:shadow-lg">
            Shop Now
            <i className="fa-solid fa-arrow-right transition-transform duration-500 group-hover:translate-x-1"></i>
          </span>
        </div>
      </div>
    </Link>
  )
}

function CountdownBadge({ value, label }) {
  return (
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#baf120] text-black flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
      <span className="text-lg sm:text-2xl font-extrabold leading-none">{value}</span>
      <span className="text-[10px] sm:text-xs font-semibold uppercase mt-0.5">{label}</span>
    </div>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('football-tab')
  const { formatPrice } = useCurrency()
  const { settings } = useSettings({})

  const deal = { ...DEFAULT_DEAL, ...(settings.deal || {}) }
  const [remaining, setRemaining] = useState(() => getRemainingTime(deal.dealEndDate))

  useEffect(() => {
    const update = () => setRemaining(getRemainingTime(deal.dealEndDate))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [deal.dealEndDate])

  return (
    <div className="font-sans bg-white text-black overflow-x-hidden">
      <section className="relative min-h-screen flex items-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0 flex justify-end">
          <img
            src="/imgi_132_m3_slide_01.jpg"
            alt="Basketball Player"
            className="h-full w-full md:w-3/4 object-cover object-right opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full py-16">
          <div className="max-w-xl space-y-7">
            <p className="text-sm md:text-base uppercase tracking-[0.25em] text-gray-300 font-semibold opacity-0 animate-fade-in-up delay-1">
              BASKETBALL UNIFORM
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold uppercase leading-[1.1] tracking-normal text-white opacity-0 animate-fade-in-up delay-2">
              SHOP THE BEST <br />
              BASKETBALL <br />
              ACCESSORIES
            </h1>
            <div className="opacity-0 animate-fade-in-up delay-3 pt-3">
              <Link
                to="/shop"
                className="inline-block bg-[#baf120] text-black font-semibold px-10 py-4 rounded hover:bg-lime-500 transition duration-300 text-sm tracking-wide shadow-md"
              >
                Shop now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6 overflow-hidden bg-neutral-900 text-white">
        <div className="absolute inset-0 z-0">
          <img src="/imgi_133_m3_cat_bg.jpg" alt="Category Background" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight mb-10 text-white">
            SHOP BY CATEGORY
          </h2>
          <CategoryCarousel />
        </div>
      </section>

      <section className="py-16 px-6 bg-white text-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-extrabold uppercase tracking-wide mb-10 text-neutral-900">
            NEW ARRIVALS
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {newArrivalTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-extrabold text-sm md:text-base px-6 py-3.5 transition-all duration-700 uppercase ${
                  activeTab === tab.id ? 'tab-btn active-tab' : 'tab-btn inactive-tab'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {newArrivalTabs.map((tab) => (
              <div key={tab.id} className={activeTab === tab.id ? 'tab-pane block' : 'hidden'}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  {tab.products.map((product) => (
                    <Link
                      key={product.title}
                      to={`/product/${product.slug}`}
                      className="block bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <div className="h-64 bg-gray-50 rounded mb-4 overflow-hidden flex items-center justify-center">
                        <img src={`/${product.image}`} alt={product.title} className="object-contain h-full w-full" />
                      </div>
                      <h3 className="text-xs font-extrabold text-black uppercase tracking-wider mb-2">{product.title}</h3>
                      <p className="text-sm font-bold text-gray-500">{formatPrice(parseUsdPrice(product.price))}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <ProductCarousel />
        </div>
      </section>

      {deal.enabled !== false && (
        <section className="relative py-16 md:py-24 px-6 bg-black overflow-hidden border-y border-white/10">
          <div className="absolute inset-0 z-0">
            <img
              src={dealBgSrc(deal.backgroundImage)}
              alt={deal.subtitle || 'Special Deals'}
              className="w-full h-full object-cover object-center opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/70"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10 flex justify-center md:justify-end">
            <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
              <span className="text-sm md:text-base font-serif tracking-[0.25em] text-[#e2db99] font-semibold uppercase">
                {deal.subtitle}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-white leading-tight">
                {deal.title}
              </h2>

              {remaining && (
                <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4 my-2">
                  <CountdownBadge value={pad(remaining.days)} label="Days" />
                  <CountdownBadge value={pad(remaining.hours)} label="Hours" />
                  <CountdownBadge value={pad(remaining.minutes)} label="Minutes" />
                  <CountdownBadge value={pad(remaining.seconds)} label="Seconds" />
                </div>
              )}

              <div className="pt-2">
                {isExternalUrl(deal.targetUrl) ? (
                  <a
                    href={deal.targetUrl}
                    className="inline-block bg-[#121212] hover:bg-[#baf120] text-[#baf120] hover:text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 rounded shadow-xl border border-[#baf120]/30 transition-all duration-300 hover:scale-105"
                  >
                    {deal.buttonText || 'Shop now'}
                  </a>
                ) : (
                  <Link
                    to={deal.targetUrl || '/shop'}
                    className="inline-block bg-[#121212] hover:bg-[#baf120] text-[#baf120] hover:text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 rounded shadow-xl border border-[#baf120]/30 transition-all duration-300 hover:scale-105"
                  >
                    {deal.buttonText || 'Shop now'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-10 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {promoBanners.map((banner) => (
            <PromoCard key={banner.tag} banner={banner} />
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-extrabold uppercase tracking-wide text-black mb-2">
            GET EXCLUSIVE OFFERS &<br />UPDATES
          </h2>
          <div className="mt-8">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row items-center justify-center gap-0"
            >
              <input
                type="email"
                placeholder="Enter your email address..."
                className="w-full sm:w-[380px] border border-gray-300 px-5 py-3.5 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:border-black transition-colors duration-500 rounded-l-md sm:rounded-r-none rounded-r-md"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#baf120] hover:bg-[#a5d81a] text-black font-bold text-sm uppercase tracking-widest px-8 py-3.5 rounded-r-md sm:rounded-l-none rounded-l-md transition-colors duration-500 mt-3 sm:mt-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 bg-[#baf120]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-extrabold uppercase tracking-wide text-black text-center mb-12">
            WE'RE HERE FOR YOU
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceFeatures.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-14 h-14 flex-shrink-0 rounded-full border-2 border-black/20 flex items-center justify-center bg-transparent">
                  <i className={`${f.icon} text-xl text-black`}></i>
                </div>
                <div>
                  <h3 className="text-base font-bold text-black mb-1">{f.title}</h3>
                  <p className="text-sm text-black/70 leading-relaxed">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterAmazon />
    </div>
  )
}
