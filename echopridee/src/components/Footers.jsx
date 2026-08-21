import React from 'react'
import { Link } from 'react-router-dom'

function BackToTop({ className = '' }) {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`block w-full bg-black hover:bg-neutral-900 border-b border-neutral-800 text-center text-xs font-semibold py-4 text-white transition-colors duration-300 cursor-pointer ${className}`}
    >
      Back to top
    </button>
  )
}

const footerColumns = [
  {
    title: 'Get to Know Us',
    links: [
      { label: 'Careers', to: '/careers' },
      { label: 'Blog', to: '/blog' },
      { label: 'About Echo Pride', to: '/about-us' },
      { label: 'Investor Relations', to: '/investor-relations' },
      { label: 'Echo Pride Devices', to: '/devices' },
      { label: 'Echo Science', to: '/science' },
    ],
  },
  {
    title: 'Make Money with Us',
    links: [
      { label: 'Sell products on Echo Pride', to: '/sell-products' },
      { label: 'Sell on Echo Pride Business', to: '/business-sell' },
      { label: 'Sell apps on Echo Pride', to: '/sell-apps' },
      { label: 'Become an Affiliate', to: '/affiliate' },
      { label: 'Advertise Your Products', to: '/advertise' },
      { label: 'Self-Publish with Us', to: '/self-publishing' },
      { label: 'Host an Echo Pride Hub', to: '/host-hub' },
    ],
  },
  {
    title: 'Echo Pride Payment Products',
    links: [
      { label: 'Echo Pride Business Card', to: '/business-card' },
      { label: 'Shop with Points', to: '/shop-with-points' },
      { label: 'Reload Your Balance', to: '/reload-balance' },
      { label: 'Echo Pride Currency Converter', to: '/currency-converter' },
    ],
  },
  {
    title: 'Let Us Help You',
    links: [
      { label: 'Your Account', to: '/account' },
      { label: 'Your Orders', to: '/orders' },
      { label: 'Shipping Rates & Policies', to: '/shipping-policies' },
      { label: 'Returns & Replacements', to: '/returns' },
      { label: 'Manage Your Content and Devices', to: '/manage-devices' },
      { label: 'Help', to: '/help' },
    ],
  },
]

function SelectorButtons({ small = false }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start text-xs text-gray-300">
      <button className="border border-gray-600 hover:border-gray-300 rounded px-3 py-1.5 flex items-center gap-2 bg-transparent transition-colors">
        <i className="fa-solid fa-globe text-sm"></i>
        <span>English</span>
        <i className="fa-solid fa-sort text-[10px] text-gray-400"></i>
      </button>
      <button className="border border-gray-600 hover:border-gray-300 rounded px-3 py-1.5 flex items-center gap-2 bg-transparent transition-colors font-medium">
        <span className="font-semibold text-gray-400">USD</span>
        <span>US Dollar</span>
      </button>
      <button className="border border-gray-600 hover:border-gray-300 rounded px-3 py-1.5 flex items-center gap-2 bg-transparent transition-colors">
        <span className="text-sm">🇺🇸</span>
        <span>United States</span>
      </button>
    </div>
  )
}

export function FooterAmazon() {
  return (
    <footer className="bg-black text-white select-none">
      <BackToTop />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="font-bold text-white text-base mb-3">{col.title}</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="hover:underline hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-black border-t border-neutral-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
            <Link to="/" className="flex items-center">
              <img src="/imgi_2_WLogowithicon.webp" alt="Echo Pride Logo" className="h-10 w-auto object-contain" />
            </Link>
            <SelectorButtons />
          </div>
          <p className="text-xs text-white text-center md:text-right">
            &copy; 2026 Echo Pride. All rights reserved. Developed by{" "}
            <a href="https://techmiresolutions.com/" target="_blank" rel="noopener noreferrer" className="text-[#EC6929] hover:text-[#f5854d] transition-colors">
              Techmire Solutions
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}

const cardFeatures = [
  { icon: 'fa-solid fa-truck', title: 'Ship to Home', text: 'Order online and have products shipped to you.' },
  { icon: 'fa-solid fa-box', title: 'Bulk Order Discounts', text: 'Save more on volume orders for your whole team.' },
  { icon: 'fa-solid fa-credit-card', title: 'Credit Offered', text: 'Turn big purchases into small payments.' },
  { icon: 'fa-solid fa-headset', title: 'Customer Support', text: "We're here to help you find what you need." },
]

export function FooterCard() {
  return (
    <footer className="w-full font-sans">
      <div className="bg-[#baf120] text-black py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cardFeatures.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center flex-shrink-0 text-xl">
                <i className={f.icon}></i>
              </div>
              <div>
                <h4 className="font-extrabold text-sm mb-1">{f.title}</h4>
                <p className="text-xs font-medium text-black/80 leading-relaxed">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BackToTop className="py-3 text-xs" />
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="font-bold text-sm mb-3 text-white">{col.title}</h3>
              <ul className="space-y-2 text-xs text-gray-300">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="hover:underline hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-black border-t border-neutral-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center">
            <img src="/imgi_2_WLogowithicon.webp" alt="Echo Pride Logo" className="h-8 w-auto object-contain" />
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end text-xs text-gray-300">
            <button className="border border-gray-600 rounded px-3 py-1.5 flex items-center gap-2 hover:border-white transition-colors">
              <i className="fa-solid fa-globe text-gray-400"></i>
              <span>English</span>
              <i className="fa-solid fa-sort text-[10px] text-gray-400 ml-1"></i>
            </button>
            <button className="border border-gray-600 rounded px-3 py-1.5 flex items-center gap-2 hover:border-white transition-colors">
              <span className="font-semibold text-gray-400">USD</span>
              <span>US Dollar</span>
            </button>
            <button className="border border-gray-600 rounded px-3 py-1.5 flex items-center gap-2 hover:border-white transition-colors">
              <span className="font-semibold text-gray-400">us</span>
              <span>United States</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function FooterAbout() {
  return (
    <footer className="bg-[#0a0e14] text-gray-300">
      <div className="max-w-7xl mx-auto px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-4">
          <img src="/imgi_2_WLogowithicon.webp" alt="EchoPride" className="h-10 w-auto object-contain" />
          <p className="text-xs text-gray-400 leading-relaxed">
            Join the ECHOPRIDE Movement. This isn't just gear. This is your story in motion.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="text-gray-400 hover:text-[#baf120] transition-colors">
              <i className="fa-brands fa-facebook text-base"></i>
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-[#baf120] transition-colors">
              <i className="fa-brands fa-instagram text-base"></i>
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-[#baf120] transition-colors">
              <i className="fa-brands fa-twitter text-base"></i>
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-[#baf120] transition-colors">
              <i className="fa-brands fa-pinterest text-base"></i>
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Useful Links</h3>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <Link to="/shop" className="hover:text-[#baf120] transition-colors">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#baf120] transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#baf120] transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-[#baf120] transition-colors">
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#baf120] transition-colors">
                Order Status
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#baf120] transition-colors">
                Help & FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Top Categories</h3>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <Link to="/shop/basketball" className="hover:text-[#baf120] transition-colors">
                Basketball
              </Link>
            </li>
            <li>
              <Link to="/shop/football" className="hover:text-[#baf120] transition-colors">
                Football
              </Link>
            </li>
            <li>
              <Link to="/shop/rugby" className="hover:text-[#baf120] transition-colors">
                Rugby
              </Link>
            </li>
            <li>
              <Link to="/shop/soccers" className="hover:text-[#baf120] transition-colors">
                Soccer
              </Link>
            </li>
            <li>
              <Link to="/shop/softballs" className="hover:text-[#baf120] transition-colors">
                Softball
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Let's Get in Touch</h3>
          <p className="text-xs text-gray-400 mb-4">Sign up for our newsletter and receive 10% off your first order!</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-2"
          >
            <input
              type="email"
              placeholder="Enter your email address..."
              required
              className="w-full bg-[#131e36] border border-slate-700 rounded-lg px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#baf120] transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs uppercase tracking-widest py-3 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </form>
        </div>
      </div>

    </footer>
  )
}

export function FooterContact() {
  return (
    <footer className="bg-[#11161d] text-[#ddd] border-t border-gray-800">
      <div className="bg-[#232f3e] py-4 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-white text-xs font-bold uppercase tracking-wider hover:underline cursor-pointer"
        >
          Back to top <i className="fa-solid fa-chevron-up text-[10px] ml-1"></i>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-bold text-white text-base mb-3">Get to Know Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/about" className="hover:underline">
                  About EchoPride
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Store Locations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-base mb-3">Shop Categories</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/shop/basketball" className="hover:underline">
                  Basketball Uniforms
                </Link>
              </li>
              <li>
                <Link to="/shop/basketball" className="hover:underline">
                  Coach's Gear
                </Link>
              </li>
              <li>
                <Link to="/shop/football" className="hover:underline">
                  Football Uniforms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-base mb-3">Customer Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/contact" className="hover:underline">
                  Help & Contact Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-base mb-3">EchoPride Store</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Premium basketball uniforms, coaching apparel, and sublimated sports wear.
            </p>
            <div className="flex items-center gap-3 text-[#b5f500]">
              <Link to="/contact" className="hover:text-white transition-colors">
                <i className="fa-brands fa-facebook text-base"></i>
              </Link>
              <Link to="/contact" className="hover:text-white transition-colors">
                <i className="fa-brands fa-instagram text-base"></i>
              </Link>
              <Link to="/contact" className="hover:text-white transition-colors">
                <i className="fa-brands fa-twitter text-base"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#131a22] border-t border-gray-700/60 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="text-white">
            &copy; 2026 Echo Pride. All rights reserved. Developed by{" "}
            <a href="https://techmiresolutions.com/" target="_blank" rel="noopener noreferrer" className="text-[#EC6929] hover:text-[#f5854d] transition-colors">
              Techmire Solutions
            </a>
            .
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:underline">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
