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

export function UltimateFooterBottom() {
  return (
    <div className="bg-black text-white border-t border-neutral-800 py-10 px-6 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-8 border-b border-neutral-800/80">
        
        {/* Contact Us Section */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <h3 className="font-extrabold text-white text-base tracking-wide mb-1">Contact Us</h3>
          <a
            href="tel:+1-424-470-7920"
            className="text-sm md:text-base font-bold text-white hover:text-[#baf120] transition-colors"
          >
            +1-424-470-7920
          </a>
          <a
            href="mailto:support@echopride.com"
            className="text-xs md:text-sm text-gray-300 hover:text-[#baf120] transition-colors"
          >
            support@echopride.com
          </a>
        </div>

        {/* We Accept Section */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <h3 className="font-extrabold text-white text-base tracking-wide mb-1">We Accept</h3>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* PayPal */}
            <div className="bg-white rounded px-2.5 py-1.5 flex items-center justify-center shadow-sm h-8 w-14">
              <span className="font-extrabold italic text-xs text-[#003087]">Pay<span className="text-[#0079C1]">Pal</span></span>
            </div>
            {/* VISA */}
            <div className="bg-white rounded px-2.5 py-1.5 flex items-center justify-center shadow-sm h-8 w-14">
              <span className="font-black italic text-xs tracking-wider text-[#1A1F71]">VISA</span>
            </div>
            {/* MasterCard */}
            <div className="bg-white rounded px-2.5 py-1.5 flex items-center justify-center shadow-sm h-8 w-14">
              <div className="flex items-center -space-x-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#EB001B] inline-block opacity-90"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] inline-block opacity-90"></span>
              </div>
            </div>
            {/* Discover */}
            <div className="bg-white rounded px-2.5 py-1.5 flex items-center justify-center shadow-sm h-8 w-14">
              <span className="font-bold text-[10px] text-gray-800 uppercase tracking-tighter">DISCOVER</span>
            </div>
            {/* AMEX */}
            <div className="bg-[#016FD0] rounded px-2.5 py-1.5 flex items-center justify-center shadow-sm h-8 w-14">
              <span className="font-black text-[9px] text-white uppercase tracking-tighter">AMEX</span>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright & Developed By */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <p className="text-gray-300 text-center md:text-left">
          &copy; 2026 Echo Pride. All rights reserved. Developed by{" "}
          <a
            href="https://techmiresolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#EC6929] font-bold hover:text-[#f5854d] transition-colors"
          >
            Techmire Solutions
          </a>
          .
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  )
}

export function FooterAmazon() {
  return (
    <footer className="bg-black text-white select-none">
      <BackToTop />
      <div className="py-12 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 justify-between">
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
      <UltimateFooterBottom />
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
      <div className="bg-[#baf120] text-black py-10 px-6 sm:px-8">
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
      <div className="bg-black text-white py-12 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 justify-between">
          {footerColumns.map((col, index) => (
            <div key={col.title} className={index === 3 ? 'md:text-right' : ''}>
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
      <UltimateFooterBottom />
    </footer>
  )
}

export function FooterAbout() {
  return (
    <footer className="bg-[#0a0e14] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        <div className="col-span-2 sm:col-span-1 space-y-4">
          <img src="/imgi_2_WLogowithicon.webp" alt="EchoPride" width="160" height="40" loading="lazy" decoding="async" className="h-10 w-auto object-contain" />
          <p className="text-xs text-gray-400 leading-relaxed">
            Join the ECHOPRIDE Movement. This isn't just gear. This is your story in motion.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/contact" aria-label="Follow EchoPride on Facebook" className="text-gray-400 hover:text-[#baf120] transition-colors">
              <i className="fa-brands fa-facebook text-base" aria-hidden="true"></i>
            </Link>
            <Link to="/contact" aria-label="Follow EchoPride on Instagram" className="text-gray-400 hover:text-[#baf120] transition-colors">
              <i className="fa-brands fa-instagram text-base" aria-hidden="true"></i>
            </Link>
            <Link to="/contact" aria-label="Follow EchoPride on Twitter" className="text-gray-400 hover:text-[#baf120] transition-colors">
              <i className="fa-brands fa-twitter text-base" aria-hidden="true"></i>
            </Link>
            <Link to="/contact" aria-label="Follow EchoPride on Pinterest" className="text-gray-400 hover:text-[#baf120] transition-colors">
              <i className="fa-brands fa-pinterest text-base" aria-hidden="true"></i>
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
              <Link to="/orders" className="hover:text-[#baf120] transition-colors">
                Order Status
              </Link>
            </li>
            <li>
              <Link to="/help" className="hover:text-[#baf120] transition-colors">
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
            <li>
              <Link to="/shop/boxing" className="hover:text-[#baf120] transition-colors">
                Boxing Gear
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <h3 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Let's Get in Touch</h3>
          <p className="text-xs text-gray-400 mb-4">Sign up for our newsletter and receive 10% off your first order!</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-2"
          >
            <input
              type="email"
              placeholder="Enter your email address..."
              aria-label="Email address for newsletter"
              required
              className="w-full bg-[#131e36] border border-slate-700 rounded-lg px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#baf120] transition-colors"
            />
            <button
              type="submit"
              aria-label="Subscribe to newsletter"
              className="w-full bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs uppercase tracking-widest py-3 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </button>
          </form>
        </div>
      </div>
      <UltimateFooterBottom />
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
                <Link to="/careers" className="hover:underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/store-locations" className="hover:underline">
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
                <Link to="/help" className="hover:underline">
                  Help & Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping-policies" className="hover:underline">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:underline">
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
      <UltimateFooterBottom />
    </footer>
  )
}
