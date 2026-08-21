import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const CATEGORIES = [
  { label: 'Baseball', slug: 'baseball' },
  { label: 'Softball', slug: 'softball' },
  { label: 'Basketball', slug: 'basketball' },
  { label: 'Volleyball', slug: 'volleyball' },
  { label: 'Soccer', slug: 'soccers' },
  { label: 'Lacrosse', slug: 'lacrosse' },
  { label: 'Rugby', slug: 'rugby' },
  { label: 'Cycling', slug: 'cycling' },
  { label: 'Running', slug: 'running' },
  { label: 'Football', slug: 'football' },
  { label: 'Hockey', slug: 'hockey' },
  { label: 'Others', slug: 'others' },
]

const FEATURES = [
  {
    icon: 'fa-solid fa-tags',
    title: 'Special Offer',
    line1: 'New Year',
    highlight: '10% Off',
  },
  {
    icon: 'fa-solid fa-clock',
    title: 'Turnaround',
    line1: 'Quick',
    highlight: '21-Day Turnaround',
  },
  {
    icon: 'fa-solid fa-truck-fast',
    title: 'Shipping',
    line1: 'Express Shipping',
    highlight: 'Worldwide',
  },
  {
    icon: 'fa-solid fa-palette',
    title: 'Printing',
    line1: 'Dye Sublimation',
    highlight: 'Printing',
  },
]

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const SUPPORT_PHONE = '+1 (713) 997-5586'
const SUPPORT_EMAIL = 'support@echopride.com'

export default function Navbar() {
  const { totalCount, openSearch, openLogin, openCart, isLoggedIn, user, logout } = useStore()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <header id="navbar" className="w-full bg-white text-gray-900 sticky top-0 z-40 shadow-sm">

        {/* ======================== TOP INFO BAR ======================== */}
        <div className="border-b border-gray-100">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">

            {/* Mobile Header Bar (< lg) */}
            <div className="flex lg:hidden items-center justify-between py-3 gap-3">
              <button
                onClick={() => setMenuOpen(true)}
                className="inline-flex items-center justify-center text-gray-600 hover:text-black transition-colors cursor-pointer leading-none shrink-0"
                aria-label="Menu"
              >
                <i className="fa-solid fa-bars text-xl"></i>
              </button>

              <Link to="/" className="flex items-center shrink-0">
                <img
                  src="/imgi_1_BLogowithicon.webp"
                  alt="EchoPride Logo"
                  className="h-9 w-auto object-contain"
                />
              </Link>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={openSearch}
                  className="inline-flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors cursor-pointer leading-none"
                  aria-label="Search"
                >
                  <i className="fa-solid fa-magnifying-glass text-xl"></i>
                </button>

                <button
                  onClick={openCart}
                  className="relative inline-flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors cursor-pointer leading-none"
                  aria-label="Cart"
                >
                  <i className="fa-solid fa-bag-shopping text-xl"></i>
                  <span className="absolute -top-1.5 -right-2 bg-[#baf120] text-black text-[9px] font-extrabold rounded-full h-4 w-4 flex items-center justify-center">
                    {totalCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Desktop Structured Header (>= lg) */}
            <div className="hidden lg:flex items-center justify-between gap-8 py-3.5">

              {/* LEFT COLUMN: Brand Logo */}
              <div className="shrink-0 flex items-center">
                <Link to="/" className="flex items-center">
                  <img
                    src="/imgi_1_BLogowithicon.webp"
                    alt="EchoPride Logo"
                    className="h-12 xl:h-14 w-auto object-contain transition-transform hover:scale-[1.02]"
                  />
                </Link>
              </div>

              {/* RIGHT COLUMN: 2-Row Vertical Stack (Search Widget on Top, Account & Cart Below) */}
              <div className="flex-1 flex flex-col justify-center gap-2.5">

                {/* ROW 1: Contact Info (Left) + Search Widget ABOVE Account & Cart (Right) */}
                <div className="flex items-center justify-between gap-6 border-b border-gray-100 pb-2">
                  {/* Phone number & Support Email side-by-side */}
                  <div className="flex items-center gap-4 text-[13px] text-gray-600">
                    <a
                      href={'tel:' + SUPPORT_PHONE.replace(/\s/g, '')}
                      className="flex items-center gap-1.5 hover:text-blue-600 transition-colors font-medium whitespace-nowrap"
                    >
                      <i className="fa-solid fa-phone text-xs text-blue-600"></i>
                      <span>{SUPPORT_PHONE}</span>
                    </a>

                    <span className="w-px h-3.5 bg-gray-200"></span>

                    <a
                      href={'mailto:' + SUPPORT_EMAIL}
                      className="flex items-center gap-1.5 hover:text-blue-600 transition-colors font-medium whitespace-nowrap"
                    >
                      <i className="fa-solid fa-envelope text-xs text-blue-600"></i>
                      <span>{SUPPORT_EMAIL}</span>
                    </a>
                  </div>

                  {/* Search Widget positioned ABOVE Account & Cart (Compact Width) */}
                  <form
                    onSubmit={(e) => { e.preventDefault(); openSearch() }}
                    className="w-64 xl:w-72 shrink-0"
                  >
                    <div className="relative w-full">
                      <input
                        name="searchQuery"
                        type="text"
                        placeholder="What are you looking for?"
                        readOnly
                        onClick={openSearch}
                        className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-1.5 text-xs text-gray-700 placeholder-gray-400 bg-gray-50/80 hover:bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={openSearch}
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Search"
                      >
                        <i className="fa-solid fa-magnifying-glass text-[11px]"></i>
                      </button>
                    </div>
                  </form>
                </div>

                {/* ROW 2: Navigation Links (CENTERED) + ACCOUNT & CART (Right) */}
                <div className="relative flex items-center justify-between gap-6 pt-1 min-h-[36px]">
                  {/* Centered Navigation Links */}
                  <nav className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center gap-6">
                    {QUICK_LINKS.map((link) => (
                      <Link
                        key={link.label}
                        to={link.to}
                        className={
                          'font-semibold text-[12px] uppercase tracking-wider transition-colors whitespace-nowrap ' +
                          (location.pathname === link.to
                            ? 'text-blue-600 font-bold'
                            : 'text-gray-600 hover:text-blue-600')
                        }
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Account & Cart positioned on the right */}
                  <div className="ml-auto flex items-center gap-4 text-sm shrink-0">
                    {/* Account */}
                    <div className="relative">
                      <button
                        onClick={() => (isLoggedIn ? setUserMenuOpen((v) => !v) : openLogin())}
                        className="flex items-center gap-2 font-semibold uppercase tracking-wide text-gray-700 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap py-1 px-2.5 rounded-lg hover:bg-gray-50"
                      >
                        <i className="fa-regular fa-user text-base text-blue-600"></i>
                        <span>{isLoggedIn ? (user?.name?.split(' ')[0] || 'Account') : 'Sign In'}</span>
                        <i className="fa-solid fa-chevron-down text-[10px] text-gray-400"></i>
                      </button>

                      {isLoggedIn && userMenuOpen && (
                        <div
                          className="absolute right-0 top-full mt-2 w-52 bg-white shadow-xl border border-gray-100 rounded-lg py-2 z-50"
                          onMouseLeave={() => setUserMenuOpen(false)}
                        >
                          <div className="px-4 pb-2 border-b border-gray-100">
                            <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Account'}</p>
                            <p className="text-[11px] text-gray-500 truncate">{user?.email || ''}</p>
                          </div>
                          <Link
                            to="/account"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <i className="fa-solid fa-user-gear text-xs mr-2"></i> My Account
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <i className="fa-solid fa-box text-xs mr-2"></i> Orders
                          </Link>
                          <button
                            onClick={() => { setUserMenuOpen(false); logout() }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <i className="fa-solid fa-arrow-right-from-bracket text-xs mr-2"></i> Logout
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="w-px h-5 bg-gray-200"></span>

                    {/* Cart with Item Count Badge */}
                    <button
                      onClick={openCart}
                      className="inline-flex items-center gap-2.5 font-semibold uppercase tracking-wide text-gray-700 hover:text-blue-600 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-gray-50"
                      aria-label="Cart"
                    >
                      <i className="fa-solid fa-bag-shopping text-lg text-blue-600"></i>
                      <span className="text-xs font-bold uppercase tracking-wider">Cart</span>
                      <span className="bg-[#baf120] text-black text-[11px] font-black rounded-full min-w-[20px] h-[20px] px-1 flex items-center justify-center leading-none shadow-sm">
                        {totalCount}
                      </span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* ======================== CATEGORY BAR ======================== */}
        <div className="bg-[#1e3a5f] hidden lg:block">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-center overflow-x-auto no-scrollbar">
              {CATEGORIES.map((cat) => (
                <div key={cat.slug} className="dropdown">
                  <Link
                    to={'/shop/' + cat.slug}
                    className="cat-bar-link inline-flex items-center gap-1 text-white text-[13px] font-semibold uppercase tracking-wide px-3 xl:px-4 py-2.5 whitespace-nowrap hover:bg-white/10 transition-colors"
                  >
                    {cat.label}
                    <i className="fa-solid fa-chevron-down text-[9px] opacity-60"></i>
                  </Link>
                  <div className="dropdown-menu">
                    <div className="mega-inner max-w-7xl mx-auto px-6 sm:px-10 py-6">
                      <div className="mega-column">
                        <Link to={'/shop/' + cat.slug} className="mega-heading">
                          {cat.label}
                        </Link>
                        <div className="mega-links">
                          <Link to={'/shop/' + cat.slug} className="mega-link">
                            View All {cat.label}
                          </Link>
                          <Link to={'/shop/' + cat.slug + '?featured=true'} className="mega-link">
                            Featured {cat.label}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================== FEATURE STRIP ======================== */}
        <div className="bg-[#f8f9fb] border-b border-gray-200 hidden lg:block">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-4 divide-x divide-gray-200">
              {FEATURES.map((feat) => (
                <div
                  key={feat.title}
                  className="flex items-center gap-3 py-3 px-5 xl:px-6"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <i className={feat.icon + ' text-blue-600 text-base'}></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-0.5">
                      {feat.title}
                    </p>
                    <p className="text-[13px] font-semibold text-gray-800 leading-tight">
                      {feat.line1}{' '}
                      <span className="text-blue-600">{feat.highlight}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </header>

      {/* ---------- Mobile Menu Drawer & Backdrop ---------- */}
      <div className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        ></div>
        <aside
          className={`absolute inset-y-0 right-0 w-80 max-w-[85vw] bg-white text-gray-900 shadow-2xl flex flex-col transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center">
              <img src="/imgi_1_BLogowithicon.webp" alt="EchoPride Logo" className="h-10 w-auto object-contain" />
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-colors"
              aria-label="Close menu"
            >
              <i className="fa-solid fa-xmark text-base"></i>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {/* Mobile Search */}
            <form
              onSubmit={(e) => { e.preventDefault(); setMenuOpen(false); openSearch() }}
              className="relative"
            >
              <input
                type="text"
                placeholder="What are you looking for?"
                readOnly
                onClick={() => { setMenuOpen(false); openSearch() }}
                className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2.5 text-sm text-gray-700 placeholder-gray-400 bg-gray-50 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => { setMenuOpen(false); openSearch() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <i className="fa-solid fa-magnifying-glass text-sm"></i>
              </button>
            </form>

            {/* Mobile Categories */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Categories</p>
              <div className="space-y-0.5">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={'/shop/' + cat.slug}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-sm text-gray-700 hover:text-black transition-colors"
                  >
                    <span>{cat.label}</span>
                    <i className="fa-solid fa-chevron-right text-[10px] text-gray-400"></i>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Quick Links */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Quick Links</p>
              <div className="space-y-0.5">
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 text-sm font-semibold text-gray-700 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Support Info */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Contact</p>
              <div className="space-y-2 text-sm text-gray-600">
                <a href={'tel:' + SUPPORT_PHONE.replace(/\s/g, '')} className="flex items-center gap-2">
                  <i className="fa-solid fa-phone text-xs text-gray-400"></i> {SUPPORT_PHONE}
                </a>
                <a href={'mailto:' + SUPPORT_EMAIL} className="flex items-center gap-2">
                  <i className="fa-solid fa-envelope text-xs text-gray-400"></i> {SUPPORT_EMAIL}
                </a>
              </div>
            </div>

            {/* Mobile Account */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Account</p>
              {isLoggedIn ? (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Account'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-sm font-bold text-gray-700 hover:text-black transition-colors"
                  >
                    <i className="fa-solid fa-user text-xs"></i> My Account
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); logout() }}
                    className="flex items-center gap-2 py-2 text-sm font-bold text-gray-700 hover:text-black transition-colors"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i> Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMenuOpen(false); openLogin() }}
                  className="flex items-center gap-2 py-2 text-sm font-bold text-gray-700 hover:text-black transition-colors"
                >
                  <i className="fa-solid fa-arrow-right-to-bracket text-xs"></i> Sign In / Create Account
                </button>
              )}
            </div>
          </nav>
        </aside>
      </div>
    </>
  )
}
