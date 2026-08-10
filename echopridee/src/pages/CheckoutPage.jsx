import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FooterCard } from '../components/Footers'
import { useStore } from '../context/StoreContext'
import { useCurrency } from '../context/CurrencyContext'
import { orderService } from '../api'

const MIN_ORDER_QTY = 12

const inputCls =
  'w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#baf120]'

export default function CheckoutPage() {
  const { cart, totalCount, subtotal, settings, clearCart } = useStore()
  const { formatPrice } = useCurrency()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '' })
  const [submitting, setSubmitting] = useState(false)
  const [orderError, setOrderError] = useState(null)

  const taxPercent = Number(settings?.taxPercent) || 0
  const tax = (subtotal * taxPercent) / 100
  const total = subtotal + tax

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    const lowQtyItem = cart.find((item) => item.qty < MIN_ORDER_QTY)
    if (lowQtyItem) {
      alert(`Minimum wholesale order quantity is ${MIN_ORDER_QTY} pieces`)
      return
    }
    if (!form.name.trim()) {
      alert('Please enter your delivery name.')
      return
    }

    setSubmitting(true)
    setOrderError(null)

    try {
      const result = await orderService.place({
        shippingAddress: {
          fullName: form.name.trim(),
          phone: form.phone.trim(),
          addressLine1: form.address.trim(),
          city: form.city.trim(),
          country: 'Pakistan',
        },
        paymentMethod,
        items: cart.map((item) => ({ productId: item.id, quantity: item.qty })),
      })
      const order = result?.order || result
      clearCart()
      navigate('/order-confirmation', { state: { order } })
    } catch (err) {
      setSubmitting(false)
      setOrderError(err?.message || 'Unable to place your order. Please try again.')
    }
  }

  if (cart.length === 0) {
    return (
      <div className="bg-black text-white font-sans min-h-screen">
        <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-2xl mb-4">
            <i className="fa-solid fa-bag-shopping text-gray-500"></i>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold mb-3">Your cart is empty</h1>
          <p className="text-sm text-gray-400 mb-8">Add some gear to your cart before heading to checkout.</p>
          <Link
            to="/shop"
            className="bg-[#baf120] hover:bg-[#a6e216] text-black font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded shadow-xl transition-colors"
          >
            Back to Shop
          </Link>
        </main>
        <FooterCard />
      </div>
    )
  }

  return (
    <div className="bg-black text-white font-sans min-h-screen">
      <main className="pt-12 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 font-medium">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-white transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-white font-semibold">Checkout</span>
        </div>

        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#baf120] font-bold">Secure Checkout</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold mt-2">
            <i className="fa-solid fa-lock text-[#baf120] mr-3"></i>
            Complete Your Order
          </h1>
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-gray-400">
            <i className="fa-solid fa-shield-halved text-[#baf120]"></i>
            <span>Encrypted payment · {totalCount} item{totalCount === 1 ? '' : 's'} in your cart</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 space-y-8">
            <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-9 h-9 rounded-lg bg-[#baf120] text-black flex items-center justify-center font-black text-sm">1</span>
                <h2 className="font-serif font-extrabold text-xl uppercase tracking-wide">Shipping Details</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Full Name *</label>
                  <input type="text" value={form.name} onChange={setField('name')} placeholder="Enter your full name" autoComplete="name" required className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Phone Number *</label>
                  <input type="tel" value={form.phone} onChange={setField('phone')} placeholder="e.g. +92 300 0000000" autoComplete="tel" required className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">City *</label>
                  <input type="text" value={form.city} onChange={setField('city')} placeholder="Enter your city" autoComplete="address-level2" required className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Country</label>
                  <input type="text" value="Pakistan" readOnly className={`${inputCls} opacity-60 cursor-not-allowed`} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Complete Delivery Address *</label>
                  <textarea value={form.address} onChange={setField('address')} placeholder="House / building, street, area, landmark" autoComplete="street-address" required rows="3" className={`${inputCls} resize-none`} />
                </div>
              </div>
            </section>

            <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-9 h-9 rounded-lg bg-[#baf120] text-black flex items-center justify-center font-black text-sm">2</span>
                <h2 className="font-serif font-extrabold text-xl uppercase tracking-wide">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${
                    paymentMethod === 'card' ? 'border-[#baf120] bg-[#baf120]/5' : 'border-neutral-800 hover:border-neutral-600'
                  }`}
                >
                  <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                  <div className="flex items-start justify-between mb-3">
                    <i className="fa-solid fa-credit-card text-2xl text-[#baf120]"></i>
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#baf120]' : 'border-neutral-600'}`}>
                      {paymentMethod === 'card' && <span className="w-2.5 h-2.5 rounded-full bg-[#baf120]"></span>}
                    </span>
                  </div>
                  <p className="font-bold text-sm">Credit / Debit Card</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Pay securely with Visa, Mastercard, or your bank card. Your payment details are fully encrypted.
                  </p>
                </label>

                <label
                  className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${
                    paymentMethod === 'cod' ? 'border-[#baf120] bg-[#baf120]/5' : 'border-neutral-800 hover:border-neutral-600'
                  }`}
                >
                  <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                  <div className="flex items-start justify-between mb-3">
                    <i className="fa-solid fa-money-bill-wave text-2xl text-emerald-400"></i>
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#baf120]' : 'border-neutral-600'}`}>
                      {paymentMethod === 'cod' && <span className="w-2.5 h-2.5 rounded-full bg-[#baf120]"></span>}
                    </span>
                  </div>
                  <p className="font-bold text-sm">Cash on Delivery</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Pay with cash when your order arrives at your doorstep. Please have the exact amount ready.
                  </p>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-5 space-y-4 bg-black/30 border border-neutral-800 rounded-xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Enter Card Information</span>
                    <img src="/imgi_30_payment_icon.svg" alt="Payments" className="h-4 w-auto object-contain" />
                  </div>
                  <input type="text" placeholder="Card Number (e.g. 4111 2222 3333 4444)" maxLength="19" autoComplete="cc-number" required className={`${inputCls} font-mono`} />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM / YY" maxLength="5" autoComplete="cc-exp" required className={`${inputCls} font-mono`} />
                    <input type="password" placeholder="CVV" maxLength="4" autoComplete="cc-csc" required className={`${inputCls} font-mono`} />
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-2 lg:sticky lg:top-8 space-y-6">
            <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 sm:p-7">
              <h2 className="font-serif font-extrabold text-xl uppercase tracking-wide mb-6 flex items-center gap-3">
                <i className="fa-solid fa-bag-shopping text-[#baf120]"></i> Order Summary
              </h2>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {cart.map((item, index) => {
                  const lineTotal = item.price * item.qty
                  return (
                    <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 pb-4 border-b border-neutral-800 last:border-0">
                      <div className="relative shrink-0">
                        <img src={`/${item.image}`} alt={item.title} className="w-16 h-16 object-cover rounded-lg border border-neutral-800" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#baf120] text-black text-[10px] font-black flex items-center justify-center">
                          {item.qty}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold leading-snug truncate">{item.title}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">Size: {item.size || 'L'} · {formatPrice(item.price)}</p>
                      </div>
                      <span className="text-sm font-extrabold whitespace-nowrap">{formatPrice(lineTotal)}</span>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-neutral-800 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax ({taxPercent}%)</span>
                  <span className="text-white font-bold">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-neutral-800 text-base">
                  <span className="font-bold uppercase tracking-wider">Total</span>
                  <span className="text-xl font-extrabold text-[#baf120]">{formatPrice(total)}</span>
                </div>
              </div>
            </section>

            {orderError && (
              <div className="bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-medium px-4 py-3 rounded-lg flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                {orderError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#baf120] hover:bg-[#a6e216] text-black font-extrabold text-sm uppercase tracking-widest py-5 rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Placing Order...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-lock"></i> Place Order Now
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-gray-500">
              <i className="fa-solid fa-shield-halved text-[#baf120] mr-1"></i>
              Your order is protected by secure, encrypted payment processing.
            </p>
          </aside>
        </form>
      </main>
      <FooterCard />
    </div>
  )
}
