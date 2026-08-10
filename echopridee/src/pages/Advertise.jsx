import React from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const adPackages = [
  { name: 'Sponsored Product', tag: 'PAY-PER-CLICK', price: 'CPC', priceNote: 'bid-based', features: ['Search & category placement', 'Budget caps from $10/day', 'Automatic keyword bidding', 'Basic attribution reports'], best: false, highlight: false },
  { name: 'Display Banner', tag: 'MOST POPULAR', price: '$0.50', priceNote: 'per 1,000 impressions', features: ['Homepage & category banners', 'Fixed 728×90 and 300×250 slots', 'Audience by sport & region', 'CTR and viewability tracking'], best: true, highlight: true },
  { name: 'Sponsored Brand', tag: 'PREMIUM', price: 'Custom', priceNote: 'monthly contract', features: ['Brand storefront takeover', 'Video and rich media units', 'Retargeting campaigns', 'Dedicated campaign manager'], best: false, highlight: false },
]

const placementSlots = [
  { icon: 'fa-solid fa-house', title: 'Homepage Hero', text: 'Full-width banner above the fold for maximum reach during seasonal peaks.', dim: '1500×500', w: '100%' },
  { icon: 'fa-solid fa-tags', title: 'Category Strip', text: 'Native placements inside Shop by Category with contextual targeting.', dim: '1200×200', w: '80%' },
  { icon: 'fa-solid fa-magnifying-glass', title: 'Search Results', text: 'Sponsored products at the top of search results when intent is highest.', dim: '300×250', w: '240px' },
  { icon: 'fa-solid fa-bag-shopping', title: 'Cart & Checkout', text: 'Cross-sell placements shown to shoppers right before they pay.', dim: '728×90', w: '60%' },
]

export default function Advertise() {
  return (
    <InfoPageShell
      heroTag="ADVERTISING SOLUTIONS"
      title="Advertise Your Products"
      intro="Put your brand in front of shoppers at the moment of intent with banner slots, sponsored placements, and measurable campaigns."
      image="/imgi_26_m3_banner_01.jpg"
      variant="split"
      heroAside={
        <div className="rounded-2xl overflow-hidden bg-white/10 border border-white/10 backdrop-blur-sm">
          <div className="px-5 py-3 flex items-center justify-between border-b border-white/10">
            <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Homepage Banner</span>
            <span className="text-[10px] text-gray-500 font-mono">728×90</span>
          </div>
          <div className="p-5">
            <div className="relative h-16 rounded-lg overflow-hidden bg-gradient-to-r from-[#baf120] via-black to-[#baf120] flex items-center px-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(186,241,32,0.4),transparent_60%)]"></div>
              <div className="relative">
                <p className="text-sm font-black text-white uppercase tracking-wider">Big Game Collection</p>
                <p className="text-[10px] text-[#baf120] font-bold">Shop now — up to 40% off</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#baf120] text-black px-3 py-1 rounded-full">CTR 1.8%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white px-3 py-1 rounded-full">Viewable 94%</span>
            </div>
          </div>
        </div>
      }
    >
      <section className="bg-[#f8fafc] py-16 md:py-24 px-6 md:px-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">AD PACKAGES</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              Choose How You Show Up
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              Three formats, three goals — awareness, clicks, or conversions. Every package is measurable.
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr>
                  <th className="bg-white px-6 py-5 text-left text-xs font-black uppercase tracking-wider text-gray-400 w-1/4"></th>
                  {adPackages.map((pkg) => (
                    <th key={pkg.name} className={`px-6 py-5 text-left ${pkg.highlight ? 'bg-[#0a0e14] text-[#baf120]' : 'bg-white text-gray-900'}`}>
                      <span className="block text-[10px] font-black uppercase tracking-wider mb-1">{pkg.tag}</span>
                      <span className="text-lg font-black">{pkg.name}</span>
                      <span className="block text-3xl font-black mt-3">{pkg.price}</span>
                      <span className={`block text-[11px] mt-1 ${pkg.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{pkg.priceNote}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="bg-white px-6 py-4 text-[11px] font-black uppercase tracking-wider text-gray-400">Includes</td>
                  {adPackages.map((pkg, i) => (
                    <td key={pkg.name} className={`px-6 py-4 align-top ${pkg.highlight ? 'bg-[#0a0e14] text-gray-300' : i === 0 ? 'bg-[#f8fafc]' : 'bg-white text-gray-600'}`}>
                      <ul className="space-y-3">
                        {pkg.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <i className="fa-solid fa-check text-[#baf120] mt-0.5"></i>
                            <span className="text-sm">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="bg-white px-6 py-4"></td>
                  {adPackages.map((pkg, i) => (
                    <td key={pkg.name} className={`px-6 py-5 ${pkg.highlight ? 'bg-[#0a0e14]' : i === 0 ? 'bg-[#f8fafc]' : 'bg-white'}`}>
                      <Link
                        to="/contact"
                        className={`block text-center font-bold text-xs uppercase tracking-widest px-4 py-3 rounded-lg transition-colors ${
                          pkg.highlight ? 'bg-[#baf120] hover:bg-[#a6e216] text-black' : 'bg-gray-900 hover:bg-black text-white'
                        }`}
                      >
                        Get This Package
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">PLACEMENTS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              Where Your Ads Appear
            </h2>
            <p className="text-gray-600 text-sm mt-3 max-w-2xl">Every slot is sold as a real position in the storefront — sized, measured, and reported like a live campaign.</p>
          </div>
          <div className="space-y-5">
            {placementSlots.map((slot) => (
              <div key={slot.title} className="flex flex-col md:flex-row items-center gap-6 border border-gray-200 rounded-2xl p-5 bg-[#f8fafc]">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-lg bg-[#baf120] text-black flex items-center justify-center">
                      <i className={slot.icon}></i>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">{slot.title}</h3>
                    <span className="text-[10px] font-mono text-gray-500 bg-white border border-gray-200 rounded px-2 py-0.5">{slot.dim}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mt-2">{slot.text}</p>
                </div>
                <div className="shrink-0 w-full md:w-auto">
                  <div
                    className="relative bg-gradient-to-r from-[#0a0e14] to-gray-700 rounded-md overflow-hidden flex items-center justify-center text-white"
                    style={{ height: slot.dim === '300×250' ? '100px' : '56px', width: slot.dim === '300×250' ? '160px' : slot.dim === '728×90' ? '320px' : slot.dim === '1200×200' ? '360px' : '400px', maxWidth: '100%' }}
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#baf120]">{slot.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-[#0a0e14]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white mb-3">
              Launch your first campaign
            </h2>
            <p className="text-gray-400 text-sm">Talk to our ads team about budgets, creative specs, and expected reach.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
            <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-center">
              <p className="text-xs text-gray-400">Min. budget</p>
              <p className="text-lg font-black text-[#baf120]">$10/day</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-center">
              <p className="text-xs text-gray-400">Reporting</p>
              <p className="text-lg font-black text-[#baf120]">Real-time</p>
            </div>
            <Link to="/contact" className="inline-flex items-center justify-center bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs sm:text-sm uppercase tracking-widest px-10 py-4 rounded-lg transition-colors duration-300 shadow-lg">
              Contact the Ads Team
            </Link>
          </div>
        </div>
      </section>
    </InfoPageShell>
  )
}
