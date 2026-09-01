import React, { useMemo, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import CategoryCarousel from '../components/CategoryCarousel'
import ProductCarousel from '../components/ProductCarousel'
import { FooterAmazon } from '../components/Footers'
import { getCategoryBySlug, products } from '../data/products'
import { useCurrency } from '../context/CurrencyContext'
import { useCategories, useProducts } from '../api'
import { productPricing } from '../utils/wholesale'

const shopTabs = [
  { id: 'basketball-tab', label: 'Basketball Uniform', sport: 'Basketball', active: true },
  { id: 'football-tab', label: 'Football Uniform', sport: 'Football', active: false },
  { id: 'soccer-tab', label: 'Soccer Uniform', sport: 'Soccers', active: false },
  { id: 'rugby-tab', label: 'Rugby Uniform', sport: 'Rugby', active: false },
  { id: 'boxing-tab', label: 'Boxing Gear', sport: 'Boxing', active: false },
]

const promoBanners = [
  { image: 'imgi_26_m3_banner_01.jpg', tag: 'Up to 50%', title: 'Score Big Savings on Sports Shoes', to: '/shop' },
  { image: 'imgi_27_m3_banner_022.jpg', tag: 'Up to 40%', title: 'Huge Discounts on Sportswear', to: '/shop' },
  { image: 'imgi_28_m3_banner_03.jpg', tag: 'Up to 30%', title: 'Accessories Markdown Madness', to: '/shop' },
]

const serviceFeatures = [
  { icon: 'fa-solid fa-truck-fast', title: 'Ship to Home', text: 'Order online and have products shipped to you.' },
  { icon: 'fa-solid fa-box-open', title: 'Bulk Order Discounts', text: 'Save more on volume orders for your whole team.' },
  { icon: 'fa-solid fa-credit-card', title: 'Credit Offered', text: 'Turn big purchases into small payments.' },
  { icon: 'fa-solid fa-headset', title: 'Customer Support', text: "We're here to help you find what you need." },
]

const categoryDetails = {
  Basketball: {
    tag: 'BASKETBALL TEAM GEAR',
    title: 'Basketball Uniforms & Apparel',
    text: 'Custom coaching pullovers, hoodies, waterproof jackets, and game-ready basketball uniforms for players and coaching staff.',
    banner: 'imgi_133_m3_cat_bg.jpg',
  },
  Football: {
    tag: 'FOOTBALL TEAM GEAR',
    title: 'Football Uniforms & Sideline Apparel',
    text: 'Custom sublimated football jerseys, sideline windbreakers, training hoodies, and weather-resistant gear.',
    banner: 'imgi_6_m3_cat_02.jpg',
  },
  Soccers: {
    tag: 'SOCCER TEAM GEAR',
    title: 'Soccer Uniforms & Training Gear',
    text: 'Custom sublimated soccer jerseys, club warm-up hoodies, and performance athletic wear for team competition.',
    banner: 'imgi_7_m3_cat_03.jpg',
  },
  Soccer: {
    tag: 'SOCCER TEAM GEAR',
    title: 'Soccer Uniforms & Training Gear',
    text: 'Custom sublimated soccer jerseys, club warm-up hoodies, and performance athletic wear for team competition.',
    banner: 'imgi_7_m3_cat_03.jpg',
  },
  SoftBalls: {
    tag: 'SOFTBALL TEAM GEAR',
    title: 'Softball Uniforms & Dugout Apparel',
    text: 'Custom softball jerseys, tournament team hoodies, and high-durability apparel built for fastpitch diamond play.',
    banner: 'imgi_8_m3_cat_04.jpg',
  },
  Softball: {
    tag: 'SOFTBALL TEAM GEAR',
    title: 'Softball Uniforms & Dugout Apparel',
    text: 'Custom softball jerseys, tournament team hoodies, and high-durability apparel built for fastpitch diamond play.',
    banner: 'imgi_8_m3_cat_04.jpg',
  },
  Rugby: {
    tag: 'RUGBY TEAM GEAR',
    title: 'Rugby Uniforms & Contact Gear',
    text: 'Heavy-duty sublimated rugby jerseys, coaching waterproof jackets, and contact-tested teamwear.',
    banner: 'imgi_9_m3_cat_05.jpg',
  },
  Boxing: {
    tag: 'BOXING TEAM GEAR',
    title: 'Boxing Gear & Training Apparel',
    text: 'Custom boxing gloves, corner hoodies, fight robes, and high-performance training gear for fighters and coaches.',
    banner: 'imgi_5_m3_cat_01.jpg',
  },
  'Boxing Gear': {
    tag: 'BOXING TEAM GEAR',
    title: 'Boxing Gear & Training Apparel',
    text: 'Custom boxing gloves, corner hoodies, fight robes, and high-performance training gear for fighters and coaches.',
    banner: 'imgi_5_m3_cat_01.jpg',
  },
  Baseball: {
    tag: 'BASEBALL TEAM GEAR',
    title: 'Baseball Uniforms & Apparel',
    text: 'Custom sublimated baseball jerseys, button-down team tops, and coaching outerwear.',
    banner: 'imgi_26_m3_banner_01.jpg',
  },
  Volleyball: {
    tag: 'VOLLEYBALL TEAM GEAR',
    title: 'Volleyball Uniforms & Gear',
    text: 'High-flex volleyball jerseys, warm-up hoodies, and customized team apparel.',
    banner: 'imgi_27_m3_banner_02.jpg',
  },
  Lacrosse: {
    tag: 'LACROSSE TEAM GEAR',
    title: 'Lacrosse Apparel & Uniforms',
    text: 'Breathable, lightweight lacrosse pinnies, shooter shirts, and customized outerwear.',
    banner: 'imgi_28_m3_banner_03.jpg',
  },
  Cycling: {
    tag: 'CYCLING APPAREL',
    title: 'Cycling Gear & Apparel',
    text: 'Aerodynamic cycling jerseys, bib shorts, and weather-resistant athletic tops.',
    banner: 'imgi_26_m3_banner_01.jpg',
  },
  Running: {
    tag: 'RUNNING APPAREL',
    title: 'Running Gear & Apparel',
    text: 'Lightweight moisture-wicking running singlets, tops, and warm-up track apparel.',
    banner: 'imgi_27_m3_banner_02.jpg',
  },
  Hockey: {
    tag: 'HOCKEY TEAM GEAR',
    title: 'Hockey Uniforms & Outerwear',
    text: 'Durable custom hockey sweaters, warm-up suits, and coaching jackets.',
    banner: 'imgi_28_m3_banner_03.jpg',
  },
  Others: {
    tag: 'SPORTS & ATHLETIC GEAR',
    title: 'Sports & Custom Gear',
    text: 'Explore our full range of custom teamwear, athletic jackets, and accessories.',
    banner: 'imgi_133_m3_cat_bg.jpg',
  },
}

const ALL_SPORTS = [
  { label: 'Basketball', slug: 'basketball' },
  { label: 'Baseball', slug: 'baseball' },
  { label: 'Softball', slug: 'softball' },
  { label: 'Football', slug: 'football' },
  { label: 'Soccer', slug: 'soccers' },
  { label: 'Rugby', slug: 'rugby' },
  { label: 'Volleyball', slug: 'volleyball' },
  { label: 'Lacrosse', slug: 'lacrosse' },
  { label: 'Cycling', slug: 'cycling' },
  { label: 'Running', slug: 'running' },
  { label: 'Hockey', slug: 'hockey' },
]

function matchesSport(productSport = '', targetCategory = '') {
  const p = productSport.toLowerCase().trim()
  const c = targetCategory.toLowerCase().trim()
  if (!p || !c) return false
  if (p === c) return true
  if ((c === 'soccer' || c === 'soccers') && (p === 'soccer' || p === 'soccers')) return true
  if ((c === 'softball' || c === 'softballs') && (p === 'softball' || p === 'softballs')) return true
  return p.includes(c) || c.includes(p)
}

function ProductCard({ product }) {
  const { formatPrice } = useCurrency()
  const pr = productPricing(product)
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block bg-white border border-gray-200 rounded-2xl p-2.5 sm:p-4 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
    >
      <div>
        <div className="relative h-36 sm:h-56 md:h-64 bg-gray-50 rounded-xl mb-2 sm:mb-4 overflow-hidden flex items-center justify-center">
          <img
            src={`/${product.image}`}
            alt={product.title}
            className="object-contain h-full w-full p-2 sm:p-3 transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#baf120] text-black text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded shadow-xs">
            Wholesale
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-blue-600 block mb-1">
          {product.sport || product.category}
        </span>
        <h3 className="text-[11px] sm:text-sm font-extrabold text-gray-900 uppercase tracking-wide leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
      </div>
      <div className="pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between gap-1">
        <div>
          <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 block uppercase leading-none">Wholesale Price</span>
          <span className="text-xs sm:text-base font-extrabold text-gray-900">{formatPrice(pr.wholesale ?? pr.price)}</span>
        </div>
        <span className="bg-gray-100 group-hover:bg-[#baf120] group-hover:text-black text-gray-700 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0">
          View <i className="fa-solid fa-arrow-right text-[8px] sm:text-[10px]"></i>
        </span>
      </div>
    </Link>
  )
}

function PromoCard({ banner }) {
  const titleText = typeof banner.title === 'string' ? banner.title : banner.title.join(' ')

  return (
    <Link
      to={banner.to}
      className="promo-banner relative block overflow-hidden rounded-2xl group h-[340px] sm:h-[360px] md:h-[380px] shadow-lg border border-gray-200/80"
    >
      <img
        src={`/${banner.image}`}
        alt={titleText}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20"></div>

      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-8 space-y-3">
        <span className="inline-block self-start text-xs font-black uppercase tracking-wider bg-[#baf120] text-black px-3.5 py-1 rounded-md shadow-sm">
          {banner.tag}
        </span>
        <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white leading-snug drop-shadow-md">
          {titleText}
        </h3>
        <div className="pt-1">
          <span className="inline-flex items-center gap-2 bg-[#baf120] group-hover:bg-[#a6e216] text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded-lg shadow-md transition-colors duration-300">
            Shop Now
            <i className="fa-solid fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1"></i>
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
  }, [query, source])

  return (
    <section className="py-10 md:py-16 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-serif font-extrabold uppercase tracking-wide mb-2 text-neutral-900">
          SEARCH RESULTS
        </h2>
        <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-10">
          {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
        </p>

        {results.length === 0 ? (
          <p className="text-gray-500 text-sm md:text-base">
            No products found for &ldquo;{query}&rdquo;. Try a different search term.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 text-left">
            {results.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function DedicatedCategoryPage({ categoryName, products: source }) {
  const [sortBy, setSortBy] = useState('featured')
  const meta = categoryDetails[categoryName] || {
    tag: `${categoryName.toUpperCase()} TEAM GEAR`,
    title: `${categoryName} Products & Uniforms`,
    text: `Browse our custom ${categoryName} collection designed for teams and athletes.`,
    banner: 'imgi_133_m3_cat_bg.jpg',
  }

  const categoryProducts = useMemo(() => {
    let filtered = source.filter((p) => matchesSport(p.sport, categoryName))
    if (sortBy === 'price-low') {
      return [...filtered].sort((a, b) => a.price - b.price)
    }
    if (sortBy === 'price-high') {
      return [...filtered].sort((a, b) => b.price - a.price)
    }
    if (sortBy === 'title') {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title))
    }
    return filtered
  }, [categoryName, source, sortBy])

  return (
    <div className="font-sans bg-white text-black min-h-screen">
      {/* Category Hero Banner */}
      <section className="relative bg-black text-white overflow-hidden py-16 md:py-24 px-6">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={`/${meta.banner}`}
            alt={categoryName}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 tracking-wider mb-6">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-white transition-colors">
              Categories
            </Link>
            <span>/</span>
            <span className="text-[#baf120] font-bold">{categoryName}</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <span className="inline-block bg-[#baf120] text-black text-xs font-extrabold uppercase tracking-[0.25em] px-3 py-1 rounded">
              {meta.tag}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-extrabold uppercase tracking-tight text-white leading-tight">
              {meta.title}
            </h1>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">{meta.text}</p>
          </div>
        </div>
      </section>

      {/* Sports Quick Switcher */}
      <section className="bg-neutral-900 border-b border-neutral-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 shrink-0 mr-2">Sports:</span>
          {ALL_SPORTS.map((sport) => {
            const isSelected = matchesSport(sport.label, categoryName)
            return (
              <Link
                key={sport.slug}
                to={`/shop/${sport.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#baf120] text-black shadow-md scale-105'
                    : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700 hover:text-white'
                }`}
              >
                {sport.label}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Main Category Products Section */}
      <section className="py-12 md:py-16 px-6 max-w-7xl mx-auto">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
              {categoryName} Products ({categoryProducts.length})
            </h2>
            <p className="text-xs text-gray-500">Showing wholesale team gear available for bulk order</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-600"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title">Title: A–Z</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {categoryProducts.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mx-auto mb-4">
              <i className="fa-solid fa-shirt"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">New {categoryName} Gear Coming Soon!</h3>
            <p className="text-sm text-gray-600 mb-6">
              We are expanding our {categoryName} collection. Contact our sales specialists for custom team quotes or inquiries.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-[#1e3a5f] hover:bg-[#152a45] text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-colors"
            >
              Request Custom Quote
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Bulk Custom Teamwear Banner */}
      <section className="bg-[#1e3a5f] text-white py-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#baf120]">CUSTOM TEAM APPAREL</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
              Need Custom {categoryName} Uniforms for Your Team?
            </h2>
            <p className="text-sm text-gray-300 max-w-xl">
              Get custom sublimation printing, team logos, player numbers, and wholesale pricing on orders over 12 pieces.
            </p>
          </div>
          <Link
            to="/business-sell"
            className="shrink-0 bg-[#baf120] hover:bg-[#a6e216] text-black font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg transition-transform hover:scale-105"
          >
            Get Team Wholesale Quote
          </Link>
        </div>
      </section>

      <FooterAmazon />
    </div>
  )
}

export default function Shop() {
  const [activeTab, setActiveTab] = useState('basketball-tab')
  const [searchParams] = useSearchParams()
  const { category: categorySlug } = useParams()
  const query = searchParams.get('q') || ''
  const { categories: apiCategories, loading: categoriesLoading } = useCategories([])
  const { items: catalogProducts } = useProducts({ limit: 100 }, products)

  const category = useMemo(() => {
    if (!categorySlug) return ''
    const slug = categorySlug.toLowerCase()
    const staticCategory = getCategoryBySlug(slug)
    if (staticCategory) return staticCategory
    const apiCategory = apiCategories.find((c) => (c.slug || '').toLowerCase() === slug)
    return apiCategory?.name || apiCategory?.label || ''
  }, [categorySlug, apiCategories])

  if (categorySlug && !category && !categoriesLoading) return <Navigate to="/shop" replace />

  // DEDICATED CATEGORY PAGE ROUTE
  if (category) {
    return <DedicatedCategoryPage categoryName={category} products={catalogProducts} />
  }

  // MAIN ALL-PRODUCTS SHOP PAGE ROUTE
  return (
    <div className="font-sans bg-white text-black overflow-x-hidden">
      <section className="relative min-h-[60vh] flex items-center bg-black overflow-hidden py-16">
        <div className="absolute inset-0 z-0 flex justify-end">
          <img src="/imgi_133_m3_cat_bg.jpg" alt="Basketball Player" className="h-full w-full md:w-3/4 object-cover object-right opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full py-8 flex justify-center">
          <div className="max-w-xl space-y-5 text-center">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">ECHOPRIDE CATALOG</span>
            <h1 className="text-3xl md:text-5xl font-serif font-extrabold uppercase tracking-tight text-white">
              All Teamwear & Sports Gear
            </h1>
            <div className="flex items-center justify-center gap-3 pt-1">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3 transition-colors rounded"
              >
                Home
              </Link>
              <span className="text-white/40 font-bold text-lg">|</span>
              <span className="inline-flex items-center gap-2 bg-[#baf120] text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded">
                Shop Catalog
              </span>
            </div>
          </div>
        </div>
      </section>

      {query && <SearchResults query={query} products={catalogProducts} />}

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
            FEATURED SPORTS ARRIVALS
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {shopTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-extrabold text-sm md:text-base px-6 py-3.5 transition-all duration-700 uppercase cursor-pointer ${
                  activeTab === tab.id ? 'tab-btn active-tab' : 'tab-btn inactive-tab'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div id="tab-contents" className="min-h-[200px]">
            {shopTabs.map((tab) => {
              const tabProducts = catalogProducts.filter((p) => matchesSport(p.sport, tab.sport))
              return (
                <div key={tab.id} className={activeTab === tab.id ? 'tab-pane block' : 'tab-pane hidden'}>
                  {tabProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 text-left">
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

      <section className="py-12 md:py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className="w-full sm:w-auto bg-[#baf120] hover:bg-[#a5d81a] text-black font-bold text-sm uppercase tracking-widest px-8 py-3.5 rounded-r-md sm:rounded-l-none rounded-l-md transition-colors duration-500 mt-3 sm:mt-0 cursor-pointer"
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
