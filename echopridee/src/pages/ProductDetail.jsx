import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FooterCard } from '../components/Footers'
import { getProduct, products } from '../data/products'
import { useStore } from '../context/StoreContext'
import { useCurrency } from '../context/CurrencyContext'
import { useProduct } from '../api'
import { productPricing } from '../utils/wholesale'

const sizes = ['S', 'M', 'L', 'XL', 'XXL']

const ORDER_TYPES = [
  { id: 'retail', label: 'Retail Order' },
  { id: 'wholesale', label: 'Wholesale Order' },
]

export default function ProductDetail() {
  const { slug } = useParams()
  const { product, related } = useProduct(slug, getProduct(slug))
  const { addToCart } = useStore()
  const { formatPrice } = useCurrency()
  const navigate = useNavigate()

  const [orderType, setOrderType] = useState('retail')
  const [selectedSize, setSelectedSize] = useState('L')
  const [qty, setQty] = useState(1)
  const [qtyError, setQtyError] = useState('')

  if (!product) {
    return (
      <div className="bg-black text-white font-sans min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-serif font-extrabold mb-4">Product Not Found</h1>
        <p className="text-gray-400 text-sm mb-8">The product you are looking for doesn't exist.</p>
        <Link
          to="/shop"
          className="bg-[#baf120] hover:bg-[#a6e216] text-black font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded shadow-xl transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    )
  }

  const others = related.length > 0 ? related : products.filter((p) => p.slug !== product.slug).slice(0, 4)

  const pricing = productPricing(product)
  const isWholesale = orderType === 'wholesale'
  const minQty = isWholesale ? Math.max(1, pricing.threshold || 1) : 1
  const unitPrice = isWholesale
    ? pricing.wholesale !== null && pricing.wholesale !== undefined
      ? pricing.wholesale
      : pricing.retail
    : pricing.retail
  const totalPrice = Math.round(unitPrice * qty * 100) / 100
  const compareAt = product.oldPrice && product.oldPrice > pricing.retail ? product.oldPrice : null
  const retailSavePct = compareAt ? Math.round((1 - pricing.retail / compareAt) * 100) : 0

  const payload = {
    id: product.id,
    title: product.title,
    price: unitPrice,
    size: selectedSize,
    qty,
    image: product.image,
    orderType,
    minQuantity: minQty,
  }

  const switchMode = (mode) => {
    setOrderType(mode)
    setQty(mode === 'wholesale' ? Math.max(1, pricing.threshold || 1) : 1)
    setQtyError('')
  }

  const handleQtyStep = (next) => {
    setQty(Math.max(minQty, next))
    setQtyError('')
  }

  const handleQtyInput = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, '')
    const next = raw === '' ? 0 : Number(raw)
    setQty(next)
    if (next < minQty) {
      setQtyError(
        isWholesale
          ? `Minimum wholesale order quantity is ${minQty} pieces`
          : 'Minimum quantity is 1 piece',
      )
    } else {
      setQtyError('')
    }
  }

  const validateQty = () => {
    if (qty < minQty) {
      alert(
        isWholesale
          ? `Minimum wholesale order quantity is ${minQty} pieces`
          : 'Minimum quantity is 1 piece',
      )
      return false
    }
    return true
  }

  const handleAddToCart = () => {
    if (!validateQty()) return
    addToCart(payload)
  }

  const handleExpressCheckout = () => {
    if (!validateQty()) return
    addToCart(payload, { openCart: false })
    navigate('/checkout')
  }

  return (
    <div className="bg-black text-white font-sans antialiased select-none overflow-x-hidden">
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
          <span className="text-white font-semibold">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group shadow-2xl">
              <img
                src={`/${product.image}`}
                alt={product.title}
                className="w-full h-[520px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 bg-[#baf120] text-black text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                In Stock
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#baf120] font-bold">{product.category}</span>
              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-white mt-1 leading-tight">
                {product.title}
              </h1>
              <p className="text-xs text-gray-400 mt-1">{product.subtitle}</p>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex text-[#baf120]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <i key={i} className="fa-solid fa-star"></i>
                ))}
              </div>
              <span className="text-gray-400 text-xs font-medium">({product.reviews} Customer Reviews)</span>
            </div>

            <div
              className="inline-flex w-full sm:w-auto grid grid-cols-2 rounded-xl bg-neutral-900 border border-neutral-800 p-1.5"
              role="tablist"
              aria-label="Order type"
            >
              {ORDER_TYPES.map((mode) => (
                <button
                  key={mode.id}
                  role="tab"
                  aria-selected={orderType === mode.id}
                  onClick={() => switchMode(mode.id)}
                  className={`px-5 py-3 rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-colors duration-300 ${
                    orderType === mode.id
                      ? 'bg-[#baf120] text-black shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <div className="border-y border-white/10 py-4 space-y-2.5">
              {isWholesale ? (
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-4xl font-extrabold text-white">{formatPrice(unitPrice)}</span>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#baf120]">Per Piece</span>
                  <p className="w-full flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <i className="fa-solid fa-boxes-stacked text-[#baf120]"></i>
                    Minimum Order: {minQty} Pieces
                  </p>
                </div>
              ) : (
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl font-extrabold text-white">{formatPrice(unitPrice)}</span>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#baf120]">Retail Price</span>
                  {compareAt && (
                    <>
                      <span className="text-sm text-gray-500 line-through">{formatPrice(compareAt)}</span>
                      <span className="bg-[#baf120]/10 text-[#baf120] text-xs font-bold px-2.5 py-1 rounded">
                        SAVE {retailSavePct}%
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">Select Size:</label>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-btn border border-gray-700 px-4 py-2 text-xs font-bold rounded hover:border-white transition-colors ${
                      selectedSize === size ? 'active' : ''
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                Quantity{isWholesale ? ` (Min. ${minQty} Pieces)` : ''}:
              </label>
              <div className="inline-flex items-center border border-gray-700 rounded bg-neutral-900">
                <button
                  onClick={() => handleQtyStep(qty - 1)}
                  disabled={qty <= minQty}
                  className="px-3 py-2 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm"
                >
                  -
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={qty}
                  onChange={handleQtyInput}
                  aria-label="Quantity"
                  className="w-20 bg-transparent text-center px-2 py-2 text-sm font-bold text-white outline-none"
                />
                <button
                  onClick={() => handleQtyStep(qty + 1)}
                  className="px-3 py-2 text-gray-300 hover:text-white font-bold text-sm"
                >
                  +
                </button>
              </div>
              {qtyError && (
                <p className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-exclamation"></i> {qtyError}
                </p>
              )}
              {!qtyError && qty > 0 && (
                <div className="flex items-center justify-between gap-4 rounded bg-neutral-900 border border-neutral-800 px-4 py-2.5 max-w-sm">
                  <span className="text-xs text-gray-400 font-medium">
                    Total ({qty} pieces × {formatPrice(unitPrice, { showCode: false })})
                  </span>
                  <span className="text-sm font-extrabold text-[#baf120]">{formatPrice(totalPrice)}</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <p className="text-xs text-gray-400 mb-1.5 font-medium">Guaranteed Safe & Secure Checkout Options:</p>
              <img
                src="/imgi_30_payment_icon.svg"
                alt="Payment Icons"
                className="h-6 w-auto object-contain bg-white/5 p-2 rounded border border-white/10"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#baf120] hover:bg-[#a6e216] text-black font-extrabold text-xs uppercase tracking-widest py-4 px-6 rounded shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <i className="fa-solid fa-cart-shopping"></i> Add to Cart
              </button>
              <button
                onClick={handleExpressCheckout}
                className="flex-1 bg-white hover:bg-gray-200 text-black font-extrabold text-xs uppercase tracking-widest py-4 px-6 rounded shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <i className="fa-solid fa-bolt"></i> Express Checkout
              </button>
            </div>
          </div>
        </div>

        {others.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl md:text-3xl font-serif font-extrabold uppercase tracking-wide text-white mb-10 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {others.map((other) => {
                const op = productPricing(other)
                return (
                  <Link
                    key={other.slug}
                    to={`/product/${other.slug}`}
                    className="block bg-neutral-900 border border-neutral-800 rounded-lg p-4 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div className="h-56 bg-neutral-800 rounded mb-4 overflow-hidden flex items-center justify-center">
                      <img src={`/${other.image}`} alt={other.title} className="object-contain h-full w-full" />
                    </div>
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-2">
                      {other.title.toUpperCase()}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-bold text-[#baf120]">{formatPrice(op.wholesale || op.retail)}</p>
                      {op.hasWholesale && <p className="text-xs text-gray-500 line-through">{formatPrice(op.retail)}</p>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </main>

      <FooterCard />
    </div>
  )
}
