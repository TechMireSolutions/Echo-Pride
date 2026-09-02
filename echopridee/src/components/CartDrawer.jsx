import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useCurrency } from '../context/CurrencyContext'
import { sizesLabel } from '../utils/sizes'

const MIN_ORDER_QTY = 12
export default function CartDrawer() {
  const { cart, totalCount, subtotal, activeOverlay, closeCart, changeQty, removeFromCart } = useStore()
  const { formatPrice } = useCurrency()
  const navigate = useNavigate()
  const open = activeOverlay === 'cart'

  return (
    <aside
      className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white text-black z-50 transition-transform duration-700 ease-in-out shadow-2xl flex flex-col ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-serif font-bold text-gray-900">Shopping Cart</h2>
          <span className="bg-[#baf120] text-black text-xs font-extrabold px-2.5 py-0.5 rounded-full">
            {totalCount}
          </span>
        </div>
        <button onClick={closeCart} className="text-gray-400 hover:text-black p-1 focus:outline-none group">
          <img
            src="/download (1).svg"
            alt="Close"
            className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-all duration-700 ease-in-out transform group-hover:rotate-180"
          />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
            <i className="fa-solid fa-bag-shopping text-4xl mb-3 opacity-40"></i>
            <p className="text-sm font-medium">Your cart is currently empty.</p>
          </div>
        ) : (
          cart.map((item, index) => {
            const itemTotal = item.price * item.qty
            const orderLabel = 'Wholesale'
            const minQty = item.minQuantity || MIN_ORDER_QTY
            const breakdownLabel = sizesLabel(item.sizes)
            return (
              <div
                key={`${item.id}-wholesale-${JSON.stringify(item.sizes || item.size || 'L')}`}
                className="flex items-center gap-4 pb-4 border-b border-gray-100"
              >
                <img
                  src={`/${item.image}`}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded border border-gray-200"
                />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-900 leading-snug">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {breakdownLabel || `Size: ${item.size || 'L'}`} | {orderLabel}: {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => changeQty(index, -1)}
                      className="w-5 h-5 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-gray-800">{item.qty}</span>
                    <button
                      onClick={() => changeQty(index, 1)}
                      className="w-5 h-5 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="ml-auto text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  {item.qty < minQty && (
                    <p className="text-[10px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                      <i className="fa-solid fa-circle-exclamation"></i> Min. {minQty} pieces required
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-black">{formatPrice(itemTotal)}</span>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-4">
        <div className="flex justify-between items-center text-sm font-bold text-gray-900">
          <span>Subtotal:</span>
          <span className="text-base text-black">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-center pt-1">
          <img
            src="/imgi_30_payment_icon.svg"
            alt="Accepted Payment Methods"
            width="240"
            height="32"
            loading="lazy"
            decoding="async"
            className="h-4 w-auto object-contain opacity-80"
          />
        </div>
        <button
          onClick={() => {
            closeCart()
            navigate('/checkout')
          }}
          className="w-full bg-[#baf120] hover:bg-[#a6e216] text-black font-extrabold text-xs uppercase tracking-widest py-4 rounded shadow-md transition-colors duration-300"
        >
          Proceed to Checkout
        </button>
      </div>
    </aside>
  )
}
