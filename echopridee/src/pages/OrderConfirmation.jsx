import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FooterCard } from '../components/Footers'
import { useCurrency } from '../context/CurrencyContext'
import { sizesLabel } from '../utils/sizes'

export default function OrderConfirmation() {
  const { state } = useLocation()
  const order = state?.order || null
  const { formatPrice } = useCurrency()

  return (
    <div className="bg-black text-white font-sans min-h-screen">
      <main className="pt-12 pb-20 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#baf120]/10 border-2 border-[#baf120] flex items-center justify-center mb-6">
            <i className="fa-solid fa-check text-3xl text-[#baf120]"></i>
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#baf120] font-bold">Order Confirmed</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold mt-2">Thank You for Your Purchase!</h1>
          <p className="text-sm text-gray-400 mt-3 max-w-md mx-auto leading-relaxed">
            Your order has been placed successfully. A confirmation has been sent to your delivery details.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">Order Number</p>
              <p className="text-lg sm:text-xl font-extrabold text-[#baf120] font-mono mt-1">
                {order?.orderNumber || 'EP-XXXXXX'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">Total Paid</p>
              <p className="text-xl font-extrabold mt-1">{formatPrice(order?.total || 0)}</p>
            </div>
          </div>

          <div className="py-6 border-b border-neutral-800">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-4">Items</p>
            <div className="space-y-4">
              {(order?.items || []).map((it, i) => (
                <div key={it.id ?? i} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-black/40 border border-neutral-800 flex items-center justify-center text-sm text-gray-400 shrink-0">
                    <i className="fa-solid fa-box"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate">{it.productName || it.name}</p>
                    <p className="text-xs text-gray-500">{it.quantity} × {formatPrice(it.price)}</p>
                    {sizesLabel(it.sizes) && (
                      <p className="text-[11px] text-[#baf120] font-semibold mt-0.5">{sizesLabel(it.sizes)}</p>
                    )}
                  </div>
                  <p className="text-sm font-bold">{formatPrice(it.price * it.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-neutral-800 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{formatPrice(order?.subtotal || 0)}</span></div>
              <div className="flex justify-between text-gray-400"><span>Tax</span><span>{formatPrice(order?.tax || 0)}</span></div>
              <div className="flex justify-between text-gray-400"><span>Shipping</span><span>{(order?.shippingFee || 0) > 0 ? formatPrice(order.shippingFee) : 'Free'}</span></div>
              <div className="flex justify-between font-black text-white pt-1"><span>Total</span><span>{formatPrice(order?.total || 0)}</span></div>
            </div>
          </div>

          <div className="py-6 border-b border-neutral-800">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-4">Ship To</p>
            <p className="text-sm font-bold">{order?.shippingAddress?.fullName || '—'}</p>
            {order?.shippingAddress?.phone && <p className="text-sm text-gray-400 mt-1">{order.shippingAddress.phone}</p>}
            <p className="text-sm text-gray-400 mt-1">{order?.shippingAddress?.addressLine1}</p>
            <p className="text-sm text-gray-400">
              {[order?.shippingAddress?.city, order?.shippingAddress?.country].filter(Boolean).join(', ')}
            </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/orders"
              className="flex-1 bg-[#baf120] hover:bg-[#a6e216] text-black font-extrabold text-xs uppercase tracking-widest py-4 rounded-lg shadow-xl text-center transition-colors"
            >
              View My Orders
            </Link>
            <Link
              to="/shop"
              className="flex-1 border border-neutral-700 hover:border-white text-white font-extrabold text-xs uppercase tracking-widest py-4 rounded-lg text-center transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <FooterCard />
    </div>
  )
}
