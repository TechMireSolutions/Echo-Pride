import React, { useMemo, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import CategoryCarousel from '../components/CategoryCarousel'
import ProductCarousel from '../components/ProductCarousel'
import { FooterAmazon } from '../components/Footers'
import { getCategoryBySlug, products } from '../data/products'
import { useCurrency } from '../context/CurrencyContext'
import { useProducts } from '../api'
import { productPricing } from '../utils/wholesale'

const shopTabs = [
  { id: 'basketball-tab', label: 'Basketball Uniform', sport: 'Basketball', active: true },
  { id: 'football-tab', label: 'Football Uniform', sport: 'Football', active: false },
  { id: 'soccer-tab', label: 'Soccer Uniform', sport: 'Soccers', active: false },
  { id: 'rugby-tab', label: 'Rugby Uniform', sport: 'Rugby', active: false },
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

function SearchResults({ query, products: source }) {
  const results = useMemo(() => {
    const q = query.toLowerCase()
    return source.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-extrabold uppercase tracking-wide mb-2 text-neutral-900">
          SEARCH RESULTS
        </h2>
        <p className="text-sm text-gray-500 mb-10">
          {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
        </p>

        {results.length === 0 ? (
          <p className="text-gray-500 text-sm md:text-base">
            No products found for &ldquo;{query}&rdquo;. Try a different search term.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {results.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ProductCard({ product }) {
  const { formatPrice } = useCurrency()
  const pr = productPricing(product)
  return (
    <Link
      to={`/product/${product.slug}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="h-64 bg-gray-50 rounded mb-4 overflow-hidden flex items-center justify-center">
        <img src={`/${product.image}`} alt={product.title} className="object-contain h-full w-full" />
      </div>
      <h3 className="text-xs font-extrabold text-black uppercase tracking-wider mb-2">
        {product.title.toUpperCase()}
      </h3>
      <p className="text-sm font-bold text-gray-500">{formatPrice(pr.wholesale || pr.retail)}</p>
      {pr.hasWholesale && <p className="text-xs text-gray-400 line-through">{formatPrice(pr.retail)}</p>}
    </Link>
  )
}

const categoryMeta = {
  Basketball: {
    tag: 'BASKETBALL TEAM GEAR',
    text: 'Custom coaching apparel, hoodies, jackets, and game-ready basketball gear.',
  },
  Football: {
    tag: 'FOOTBALL TEAM GEAR',
    text: 'Custom sublimated jerseys, sideline windbreakers, and training layers for football.',
  },
  Soccers: {
    tag: 'SOCCER TEAM GEAR',
    text: 'Custom sublimated soccer jerseys and performance training wear for your club.',
  },
  SoftBalls: {
    tag: 'SOFTBALL TEAM GEAR',
    text: 'Custom softball jerseys and team hoodies built for tournament season.',
  },
  Rugby: {
    tag: 'RUGBY TEAM GEAR',
    text: 'Heavy-duty custom rugby jerseys and coaching apparel built for contact.',
  },
}

function CategoryResults({ category, products: source }) {
  const results = useMemo(() => source.filter((p) => p.sport === category), [category, source])
  const meta = categoryMeta[category] || { tag: `${category.toUpperCase()} TEAM GEAR`, text: `Browse our ${category} collection.` }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="border-b border-gray-200 pb-8 mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 tracking-wider mb-4">
            <Link to="/" className="text-gray-500 hover:text-black transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="text-gray-500 hover:text-black transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-black">{category}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">{meta.tag}</span>
              <h2 className="text-3xl md:text-5xl font-serif font-extrabold uppercase tracking-wide mt-2 text-neutral-900">
                {category} Products
              </h2>
              <p className="text-sm text-gray-500 mt-3 max-w-xl">{meta.text}</p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-lg transition-colors duration-300 whitespace-nowrap self-start lg:self-auto"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i> View All Products
            </Link>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-10">
          {results.length} product{results.length === 1 ? '' : 's'} in {category}
        </p>

        {results.length === 0 ? (
          <p className="text-gray-500 text-sm md:text-base">
            No products in the {category} category yet. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {results.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default function Shop() {
  const [activeTab, setActiveTab] = useState('basketball-tab')
  const [searchParams] = useSearchParams()
  const { category: categorySlug } = useParams()
  const query = searchParams.get('q') || ''
  const category = getCategoryBySlug(categorySlug) || ''
  const { items: catalogProducts } = useProducts({ limit: 100 }, products)

  if (categorySlug && !category) return <Navigate to="/shop" replace />

  return (
    <div className="font-sans bg-white text-black overflow-x-hidden">
      <section className="relative min-h-screen flex items-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0 flex justify-end">
          <img src="/imgi_133_m3_cat_bg.jpg" alt="Basketball Player" className="h-full w-full md:w-3/4 object-cover object-right opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full py-16 flex justify-center">
          <div className="max-w-xl space-y-7 text-center">
            <div className="opacity-0 animate-fade-in-up delay-2 flex items-center justify-center gap-3 pt-1">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3 transition-colors"
              >
                Home
              </Link>
              <span className="text-white/40 font-bold text-lg">|</span>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#baf120] text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3"
              >
                Shop
              </Link>
              {category && (
                <>
                  <span className="text-white/40 font-bold text-lg">|</span>
                  <span className="inline-flex items-center gap-2 bg-white text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3">
                    {category}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {query && <SearchResults query={query} products={catalogProducts} />}
      {!query && category && <CategoryResults category={category} products={catalogProducts} />}

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
            {shopTabs.map((tab) => (
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

          <div id="tab-contents" className="min-h-[200px]">
            {shopTabs.map((tab) => {
              const tabProducts = catalogProducts.filter((p) => p.sport === tab.sport)
              return (
                <div key={tab.id} className={activeTab === tab.id ? 'tab-pane block' : 'tab-pane hidden'}>
                  {tabProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                      {tabProducts.slice(0, 4).map((product) => (
                        <ProductCard key={product.slug} product={product} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm md:text-base">New {tab.label} arrivals coming soon.</p>
                  )}
                </div>
              )
            })}
          </div>

          <ProductCarousel />
        </div>
      </section>

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
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-center justify-center gap-0">
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
