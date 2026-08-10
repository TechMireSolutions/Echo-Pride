import React, { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { useCurrency } from '../context/CurrencyContext'
import { orderService } from '../api'

const MIN_ORDER_QTY = 12

export default function CheckoutModal() {
  const { cart, totalCount, subtotal, activeOverlay, closeCheckout, clearCart } = useStore()
  const { formatPrice } = useCurrency()
  const open = activeOverlay === 'checkout'

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [placed, setPlaced] = useState(false)
  const [orderId, setOrderId] = useState('#EP-98231')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [orderError, setOrderError] = useState(null)

  const handleProcessOrder = async (e) => {
    e.preventDefault()
    const lowQtyItem = cart.find((item) => item.qty < MIN_ORDER_QTY)
    if (lowQtyItem) {
      alert(`Minimum wholesale order quantity is ${MIN_ORDER_QTY} pieces`)
      return
    }
    if (!name) {
      alert('Please enter your delivery name.')
      return
    }
    setSubmitting(true)
    setOrderError(null)

    try {
      const result = await orderService.place({
        shippingAddress: {
          fullName: name,
          phone,
          addressLine1: address,
          city,
          country: 'Pakistan',
        },
        paymentMethod,
        items: cart.map((item) => ({ productId: item.id, quantity: item.qty })),
      })
      setOrderId(result?.order?.orderNumber ? `#${result.order.orderNumber}` : `#EP-${Math.floor(100000 + Math.random() * 900000)}`)
    } catch (err) {
      setSubmitting(false)
      setOrderError(err?.message || 'Unable to place your order. Please try again.')
      return
    }

    setPlaced(true)
    setSubmitting(false)
    clearCart()
  }

  const handleClose = () => {
    closeCheckout()
    setTimeout(() => {
      setPlaced(false)
      setName('')
      setPhone('')
      setCity('')
      setAddress('')
      setPaymentMethod('card')
    }, 700)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white text-black w-full max-w-xl rounded-xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        <div className="bg-[#111] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
          <h3 className="text-lg font-bold tracking-wide flex items-center gap-2">
            <i className="fa-solid fa-lock text-[#baf120]"></i> Secure Checkout & Purchasing
          </h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {!placed ? (
          <form onSubmit={handleProcessOrder} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 leading-snug">Echo Pride Order Summary</p>
                <p className="text-xs text-gray-500">
                  {totalCount} Item(s) | {cart.length} Product Type(s)
                </p>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-black">{formatPrice(subtotal)}</span>
              </div>
            </div>

            {cart.some((item) => item.qty < MIN_ORDER_QTY) && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation"></i>
                Minimum wholesale order quantity is {MIN_ORDER_QTY} pieces per product. Please increase the quantity
                in your cart before placing the order.
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider">Shipping Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="border border-gray-300 rounded px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-black"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  required
                  className="border border-gray-300 rounded px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-black"
                />
              </div>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoComplete="address-level2"
                required
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-black"
              />
              <input
                type="text"
                placeholder="Delivery Street Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="street-address"
                required
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider">Select Payment Method</h4>
              <div className="grid grid-cols-2 gap-3">
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`payment-option-card border-2 border-gray-300 rounded-lg p-3 cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                    paymentMethod === 'card' ? 'active' : ''
                  }`}
                >
                  <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} className="hidden" readOnly />
                  <i className="fa-solid fa-credit-card text-xl text-black mb-1"></i>
                  <span className="font-bold text-xs">Credit / Debit Card</span>
                </label>
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`payment-option-card border-2 border-gray-300 rounded-lg p-3 cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                    paymentMethod === 'cod' ? 'active' : ''
                  }`}
                >
                  <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} className="hidden" readOnly />
                  <i className="fa-solid fa-money-bill-wave text-xl text-gray-700 mb-1"></i>
                  <span className="font-bold text-xs">Cash on Delivery (COD)</span>
                </label>
              </div>
            </div>

            {paymentMethod === 'card' ? (
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-700">Enter Card Information</span>
                  <img src="/imgi_30_payment_icon.svg" alt="Payments" className="h-4 w-auto object-contain" />
                </div>
                <input
                  type="text"
                  placeholder="Card Number (e.g. 4111 2222 3333 4444)"
                  maxLength="19"
                  autoComplete="cc-number"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-black font-mono"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    maxLength="5"
                    autoComplete="cc-exp"
                    required
                    className="border border-gray-300 rounded px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-black font-mono"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    maxLength="4"
                    autoComplete="cc-csc"
                    required
                    className="border border-gray-300 rounded px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-black font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <i className="fa-solid fa-circle-check"></i> Cash on Delivery Enabled
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Pay with cash when your basketball gear arrives at your doorstep. Please ensure the exact amount is
                  available upon delivery.
                </p>
              </div>
            )}

            {orderError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-3 rounded">
                {orderError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#baf120] hover:bg-[#a6e216] text-black font-extrabold text-sm uppercase tracking-wider py-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Placing Order...
                </>
              ) : (
                'Place Order Now'
              )}
            </button>
          </form>
        ) : (
          <div className="p-8 text-center flex-1 flex flex-col justify-center items-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-3xl">
              <i className="fa-solid fa-check"></i>
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900">Order Confirmed!</h3>
            <p className="text-xs text-gray-500 max-w-sm">
              Thank you for purchasing with Echo Pride! Your order{' '}
              <span className="font-bold text-black">{orderId}</span> has been placed successfully.
            </p>
            <button
              onClick={handleClose}
              className="bg-black text-white font-bold text-xs uppercase tracking-wider px-8 py-3 rounded shadow hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
