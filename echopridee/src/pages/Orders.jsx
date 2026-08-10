import React from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const timeline = [
  { time: 'Aug 01, 09:24 AM', title: 'Order Confirmed', text: 'Payment verified — #EP-2041', active: true, done: true },
  { time: 'Aug 01, 02:10 PM', title: 'In Production', text: 'Custom jersey being printed & stitched', active: true, done: true },
  { time: 'Aug 03, 11:45 AM', title: 'Shipped', text: 'Parcel handed to courier — tracking EP-77891', active: true, done: true },
  { time: 'Aug 05, 04:30 PM', title: 'Out for Delivery', text: 'Arriving today before 8 PM', active: true, done: false },
  { time: 'Aug 05, ~06:00 PM', title: 'Delivered', text: 'Expected delivery window', active: false, done: false },
]

const recentOrders = [
  { id: '#EP-2041', date: 'Aug 01, 2026', total: '$95.00', status: 'Out for Delivery', statusColor: 'text-[#baf120]', items: 'Basketball Jersey ×2, Hoodie ×1', progress: 80 },
  { id: '#EP-2036', date: 'Jul 24, 2026', total: '$50.00', status: 'Delivered', statusColor: 'text-green-600', items: 'Training Hoodie ×1', progress: 100 },
  { id: '#EP-2029', date: 'Jul 12, 2026', total: '$60.00', status: 'Delivered', statusColor: 'text-green-600', items: 'Coach Jacket ×1', progress: 100 },
]

export default function Orders() {
  return (
    <InfoPageShell
      heroTag="ORDER MANAGEMENT"
      title="Your Orders"
      intro="Track every order in real time, download invoices, and reorder favorites — all from a single history timeline."
      image="/imgi_132_m3_slide_01.jpg"
    >
      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">LIVE TRACKING</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
              Status Timeline
            </h2>
            <p className="text-gray-600 text-sm mt-3">Order #EP-2041 — estimated delivery before 8 PM today.</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-2 bottom-2 w-0.5 bg-gray-200 -translate-x-1/2"></div>
            <div className="space-y-8">
              {timeline.map((step, i) => {
                const right = i % 2 === 0
                return (
                  <div key={step.title} className={`relative flex ${right ? 'md:justify-start' : 'md:justify-end'}`}>
                    <span
                      className={`absolute left-4 md:left-1/2 top-6 md:top-1/2 md:-translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center text-[11px] z-10 border-4 border-[#f8fafc] ${
                        step.done ? 'bg-[#baf120] text-black' : step.active ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <i className={step.done ? 'fa-solid fa-check' : step.active ? 'fa-solid fa-truck-fast' : 'fa-solid fa-pause'}></i>
                    </span>
                    <div className={`ml-14 md:ml-0 md:w-[calc(50%-40px)] ${right ? '' : 'md:text-right'}`}>
                      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                        <p className="text-xs text-gray-400 mb-1">{step.time}</p>
                        <h3 className={`text-sm font-bold ${step.active || step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{step.text}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">ORDER HISTORY</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
                Recent Orders
              </h2>
            </div>
            <p className="hidden md:block text-sm text-gray-500">Receipts for every order are available as PDFs.</p>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#f8fafc] border border-gray-200 flex items-center justify-center text-lg text-[#7a9e14]">
                      <i className="fa-solid fa-shirt"></i>
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{order.id}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{order.items}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">{order.total}</p>
                    <p className={`text-xs font-bold ${order.statusColor}`}>{order.status}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1.5">
                    <span>Placed</span>
                    <span>{order.status}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${order.progress === 100 ? 'bg-green-500' : 'bg-[#baf120]'}`} style={{ width: `${order.progress}%` }}></div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-5 text-xs">
                  <button className="font-bold text-[#baf120] uppercase tracking-wider hover:underline"><i className="fa-solid fa-location-arrow mr-1"></i>Track</button>
                  <button className="font-bold text-gray-600 uppercase tracking-wider hover:underline"><i className="fa-solid fa-file-invoice mr-1"></i>Download Invoice</button>
                  <button className="font-bold text-gray-600 uppercase tracking-wider hover:underline"><i className="fa-solid fa-rotate-left mr-1"></i>Return</button>
                  <button className="font-bold text-gray-600 uppercase tracking-wider hover:underline"><i className="fa-solid fa-cart-plus mr-1"></i>Buy Again</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-[#0a0e14]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white mb-2">
              Download invoices anytime
            </h2>
            <p className="text-gray-400 text-sm">Every receipt is available as a PDF in your order history, ready for expense claims.</p>
          </div>
          <Link to="/account" className="md:justify-self-end inline-block bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs sm:text-sm uppercase tracking-widest px-10 py-4 rounded-lg transition-colors duration-300 shadow-lg">
            View All Orders
          </Link>
        </div>
      </section>
    </InfoPageShell>
  )
}
