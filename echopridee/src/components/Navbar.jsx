import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import CurrencySelector from './CurrencySelector'

const fullDropdown = [
  {
    label: 'Basketball',
    slug: '/shop/basketball',
    items: [
      { label: "Basketball Coach's Gear", to: '/shop/basketball' },
      { label: 'Basketball Jackets/Hoodies', to: '/shop/basketball' },
      { label: 'Basketball Jersey', to: '/shop/basketball' },
      { label: 'Basketball Pants/Shorts', to: '/shop/basketball' },
      { label: 'Basketball Referee Uniforms', to: '/shop/basketball' },
      { label: 'Basketball Socks', to: '/shop/basketball' },
    ],
  },
  {
    label: 'Football Uniform',
    slug: '/shop/football',
    items: [
      { label: "Football Coach's Gear", to: '/shop/football' },
      { label: 'Football Jackets/Hoodies', to: '/shop/football' },
      { label: 'Football Jersey', to: '/shop/football' },
      { label: 'Football Pants/Shorts', to: '/shop/football' },
      { label: 'Football Referee Uniforms', to: '/shop/football' },
      { label: 'Football Socks', to: '/shop/football' },
    ],
  },
  {
    label: 'Rugby Uniform',
    slug: '/shop/rugby',
    items: [
      { label: "Rugby Coach's Gear", to: '/shop/rugby' },
      { label: 'Rugby Jackets/Hoodies', to: '/shop/rugby' },
      { label: 'Rugby Jersey', to: '/shop/rugby' },
      { label: 'Rugby Pants/Shorts', to: '/shop/rugby' },
      { label: 'Rugby Referee Uniforms', to: '/shop/rugby' },
      { label: 'Rugby Socks', to: '/shop/rugby' },
    ],
  },
  {
    label: 'Soccer Uniform',
    slug: '/shop/soccers',
    items: [
      { label: "Soccer Coach's Gear", to: '/shop/soccers' },
      { label: 'Soccer Jackets/Hoodies', to: '/shop/soccers' },
      { label: 'Soccer Jersey', to: '/shop/soccers' },
      { label: 'Soccer Pants/Shorts', to: '/shop/soccers' },
      { label: 'Soccer Referee Uniforms', to: '/shop/soccers' },
      { label: 'Soccer Socks', to: '/shop/soccers' },
    ],
  },
  {
    label: 'Softball Uniform',
    slug: '/shop/softballs',
    items: [
      { label: "Softball Coach's Gear", to: '/shop/softballs' },
      { label: 'Softball Jackets/Hoodies', to: '/shop/softballs' },
      { label: 'Softball Jersey', to: '/shop/softballs' },
      { label: 'Softball Pants/Shorts', to: '/shop/softballs' },
      { label: 'Softball Referee Uniforms', to: '/shop/softballs' },
      { label: 'Softball Socks', to: '/shop/softballs' },
    ],
  },
]

const simpleDropdown = [
  {
    label: 'Basketball',
    items: [
      { label: "Basketball Coach's Gear", to: '/shop/basketball' },
      { label: 'Basketball Jackets/Hoodies', to: '/shop/basketball' },
      { label: 'Basketball Jersey', to: '/shop/basketball' },
      { label: 'Basketball Pants/Shorts', to: '/shop/basketball' },
    ],
  },
  {
    label: 'Football Uniform',
    items: [
      { label: 'Football Jersey', to: '/shop/football' },
      { label: 'Football Pants', to: '/shop/football' },
    ],
  },
]

export default function Navbar({
  variant = 'dark',
  links = [],
  showDropdown = false,
  dropdownType = 'full',
  topOffset = 'top-9',
  logoSize = 'h-12 md:h-14',
}) {
  const { totalCount, openSearch, openLogin, openCart, isLoggedIn, user, logout } = useStore()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isLight = variant === 'light'
  const dropdown = dropdownType === 'full' ? fullDropdown : simpleDropdown

  return (
    <>
      <header
        id="navbar"
      className={`${isLight ? 'w-full bg-white text-gray-900 border-b border-gray-200 sticky top-0 z-40 shadow-sm' : `fixed ${topOffset} left-0 w-full z-40 text-white transition-all duration-700`} ${
        !isLight && scrolled ? 'scrolled-nav [&_*]:!text-black [&_svg]:!text-black [&_svg]:!stroke-black' : ''
      }`}
    >
      <div
        className={`${
          isLight
            ? 'max-w-7xl mx-auto px-6 sm:px-10 py-4 w-full flex items-center justify-between'
            : 'max-w-7xl mx-auto px-8 py-5 w-full flex items-center justify-between'
        }`}
      >
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => setMenuOpen(true)}
            className={`md:hidden inline-flex items-center justify-center hover:opacity-75 cursor-pointer leading-none ${
              isLight ? 'hover:text-[#baf120] transition-colors' : 'text-white'
            }`}
            aria-label="Menu"
          >
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
          <Link to="/" className="flex items-center">
            {isLight ? (
              <img src="/imgi_1_BLogowithicon.webp" alt="EchoPride Logo" className="h-10 md:h-12 w-auto object-contain" />
            ) : (
              <>
                <img
                  src="/imgi_2_WLogowithicon.webp"
                  alt="Echo Pride Logo"
                  className={`logo-white ${logoSize} w-auto object-contain block`}
                />
                <img
                  src="/imgi_1_BLogowithicon.webp"
                  alt="Echo Pride Logo"
                  className={`logo-black ${logoSize} w-auto object-contain hidden`}
                />
              </>
            )}
          </Link>
        </div>

        <nav
          className={`hidden md:flex items-center font-bold text-xs tracking-widest ${
            isLight ? 'space-x-8 tracking-wider uppercase' : 'space-x-10'
          }`}
        >
          {showDropdown && (
            <div className="dropdown py-2">
              <Link
                to="/shop"
                className={`flex items-center gap-1.5 ${
                  isLight ? 'hover:text-[#baf120] transition-colors' : 'hover:opacity-75'
                }`}
              >
                SHOP <i className="fa-solid fa-chevron-down text-[10px]"></i>
              </Link>
              <div className="dropdown-menu mega-menu">
                <div
                  className="mega-inner max-w-7xl mx-auto px-6 sm:px-10 py-6"
                  style={{ gridTemplateColumns: `repeat(${Math.min(dropdown.length, 5)}, minmax(160px, 1fr))` }}
                >
                  {dropdown.map((cat) => (
                    <div key={cat.label} className="mega-column">
                      <Link to={cat.slug || cat.items[0].to} className="mega-heading">
                        {cat.label}
                      </Link>
                      <div className="mega-links">
                        {cat.items.map((item) => (
                          <Link key={item.label} to={item.to} className="mega-link">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {links.map((link) => {
            const active = location.pathname === link.to
            return isLight ? (
              <Link
                key={link.label}
                to={link.to}
                className={
                  active
                    ? 'text-black font-extrabold border-b-2 border-[#baf120] pb-0.5'
                    : 'hover:text-[#baf120] transition-colors'
                }
              >
                {link.label}
              </Link>
            ) : (
              <Link key={link.label} to={link.to} className="hover:opacity-75">
                {link.label.toUpperCase()}
              </Link>
            )
          })}
        </nav>

        <div className={`flex items-center shrink-0 ${isLight ? 'gap-5 text-gray-700' : 'gap-6 text-base'}`}>
          {/* Desktop-only: currency selector & account (hidden on mobile — moved into the menu drawer) */}
          <div className="hidden md:block">
            <CurrencySelector variant={isLight ? 'light' : 'dark'} />
          </div>
          <div className="relative hidden md:block">
            <button
              onClick={() => (isLoggedIn ? setUserMenuOpen((v) => !v) : openLogin())}
              className={`inline-flex items-center justify-center hover:opacity-75 cursor-pointer leading-none ${
                isLight ? 'hover:text-[#baf120] transition-colors' : ''
              }`}
              aria-label="Account"
            >
              {isLight ? (
                <i className="fa-regular fa-user text-xl"></i>
              ) : (
                <img src="/download (4).svg" alt="Login" className="nav-icon w-7 h-7 object-contain" />
              )}
            </button>
            {isLoggedIn && userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-3 w-60 bg-white text-gray-900 shadow-2xl border border-gray-100 rounded-lg py-3 z-50"
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <div className="px-4 pb-3 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Account'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                </div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false)
                    logout()
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors flex items-center gap-2"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i> Logout
                </button>
              </div>
            )}
          </div>
          <button
            onClick={openSearch}
            className={`inline-flex items-center justify-center hover:opacity-75 cursor-pointer leading-none ${
              isLight ? 'hover:text-[#baf120] transition-colors' : ''
            }`}
            aria-label="Search"
          >
            {isLight ? (
              <i className="fa-solid fa-magnifying-glass text-xl"></i>
            ) : (
              <img src="/download (3).svg" alt="Search" className="nav-icon w-7 h-7 object-contain" />
            )}
          </button>
          <button
            onClick={openCart}
            className={`relative inline-flex items-center justify-center hover:opacity-75 cursor-pointer leading-none ${
              isLight ? 'hover:text-[#baf120] transition-colors' : ''
            }`}
            aria-label="Cart"
          >
            {isLight ? (
              <i className="fa-solid fa-bag-shopping text-xl"></i>
            ) : (
              <img src="/download (2).svg" alt="Cart" className="nav-icon w-7 h-7 object-contain" />
            )}
            <span
              className={`cart-nav-badge absolute -top-1.5 -right-2 bg-[#baf120] text-black text-[9px] font-extrabold rounded-full h-4 w-4 flex items-center justify-center`}
            >
              {totalCount}
            </span>
          </button>
        </div>
      </div>
      </header>

      {/* ---------- Mobile Menu Drawer & Backdrop ---------- */}      <div className={`fixed inset-0 z-50 md:hidden ${menuOpen ? '' : 'pointer-events-none'}`}>
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

          <nav className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
            {showDropdown && (
              <div>
                <button
                  onClick={() => setShopOpen((v) => !v)}
                  aria-expanded={shopOpen}
                  className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-sm text-black cursor-pointer"
                >
                  Shop{' '}
                  <i
                    className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${
                      shopOpen ? 'rotate-180' : ''
                    }`}
                  ></i>
                </button>
                <div
                  className={`overflow-y-auto transition-all duration-300 ${
                    shopOpen ? 'max-h-[60vh] opacity-100 mt-3' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="space-y-4">
                    {dropdown.map((cat) => (
                      <div key={cat.label}>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">{cat.label}</p>
                        <div className="space-y-1">
                          {cat.items.map((item) => (
                            <Link
                              key={item.label}
                              to={item.to}
                              onClick={() => setMenuOpen(false)}
                              className="block py-1 text-sm text-gray-700 hover:text-black transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {links.map((link) => {
                const active = location.pathname === link.to
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-2 text-sm font-bold uppercase tracking-widest transition-colors ${
                      active ? 'text-black border-b-2 border-[#baf120] inline-block' : 'text-gray-700 hover:text-black'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Account</p>
                {isLoggedIn ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Account'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                    <Link
                      to="/account"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-sm font-bold uppercase tracking-widest text-gray-700 hover:text-black transition-colors"
                    >
                      <i className="fa-solid fa-user text-xs"></i> My Account
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        logout()
                      }}
                      className="flex items-center gap-2 py-2 text-sm font-bold uppercase tracking-widest text-gray-700 hover:text-black transition-colors"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i> Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      to="/account"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-sm font-bold uppercase tracking-widest text-gray-700 hover:text-black transition-colors"
                    >
                      <i className="fa-solid fa-user text-xs"></i> My Account
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        openLogin()
                      }}
                      className="flex items-center gap-2 py-2 text-sm font-bold uppercase tracking-widest text-gray-700 hover:text-black transition-colors"
                    >
                      <i className="fa-solid fa-arrow-right-to-bracket text-xs"></i> Sign In / Create Account
                    </button>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Country / Currency</p>
                <CurrencySelector variant="light" inline />
              </div>
            </div>
          </nav>
        </aside>
      </div>
    </>
  )
}
