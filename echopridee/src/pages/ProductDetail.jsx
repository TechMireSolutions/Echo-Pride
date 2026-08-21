import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FooterCard } from '../components/Footers'
import { getProduct, products } from '../data/products'
import { useStore } from '../context/StoreContext'
import { useCurrency } from '../context/CurrencyContext'
import { useProduct } from '../api'
import { productPricing } from '../utils/wholesale'
import { SIZES } from '../utils/sizes'

function initialBreakdown(minQty) {
  const base = Math.floor(minQty / SIZES.length)
  const remainder = minQty % SIZES.length
  return Object.fromEntries(SIZES.map((size, i) => [size, base + (i < remainder ? 1 : 0)]))
}

export default function ProductDetail() {
  const { slug } = useParams()
  const { product, related } = useProduct(slug, getProduct(slug))
  const { addToCart } = useStore()
  const { formatPrice } = useCurrency()
  const navigate = useNavigate()

  const [breakdown, setBreakdown] = useState(() => {
    const pr = productPricing(getProduct(slug))
    return initialBreakdown(Math.max(1, pr.threshold || 12))
  })

  const PRINT_PLACEMENTS = [
    { id: 'front', label: 'Front Chest Logo', icon: 'fa-shirt' },
    { id: 'back', label: 'Back Design & Number', icon: 'fa-user-tag' },
    { id: 'sleeve', label: 'Sleeve / Shoulder', icon: 'fa-tag' },
    { id: 'extra', label: 'Full Pattern / Extra', icon: 'fa-images' },
  ]

  const [activePlacement, setActivePlacement] = useState('front')
  const [placementFiles, setPlacementFiles] = useState({})
  const [placementPreviews, setPlacementPreviews] = useState({})

  const [printDesign, setPrintDesign] = useState('Dye Sublimation Printing')
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (file) => {
    if (!file) return
    setLogoFile(file)
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setLogoPreview(url)
    } else {
      setLogoPreview(null)
    }
  }

  const handleRemoveFile = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  const handlePlacementFile = (placementId, file) => {
    if (!file) return
    setPlacementFiles((prev) => ({ ...prev, [placementId]: file }))
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPlacementPreviews((prev) => ({ ...prev, [placementId]: url }))
    } else {
      setPlacementPreviews((prev) => ({ ...prev, [placementId]: null }))
    }
  }

  const handlePlacementRemove = (placementId) => {
    setPlacementFiles((prev) => {
      const next = { ...prev }
      delete next[placementId]
      return next
    })
    setPlacementPreviews((prev) => {
      const next = { ...prev }
      delete next[placementId]
      return next
    })
  }

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
  const minQty = Math.max(1, pricing.threshold || 12)
  const unitPrice = pricing.wholesale !== null && pricing.wholesale !== undefined ? pricing.wholesale : pricing.price
  const totalPieces = SIZES.reduce((sum, size) => sum + (breakdown[size] || 0), 0)
  const totalPrice = Math.round(unitPrice * totalPieces * 100) / 100
  const meetMin = totalPieces >= minQty
  const orderedSizes = Object.fromEntries(
    SIZES.filter((size) => (breakdown[size] || 0) > 0).map((size) => [size, breakdown[size]]),
  )

  const payload = {
    id: product.id,
    title: product.title,
    price: unitPrice,
    qty: totalPieces,
    sizes: orderedSizes,
    image: product.image,
    orderType: 'wholesale',
    minQuantity: minQty,
    printDesign,
    logoName: logoFile ? logoFile.name : '',
    logoPreview: logoPreview || null,
  }

  const setSizeQty = (size, value) => {
    setBreakdown((prev) => {
      const raw = String(value).replace(/[^\d]/g, '')
      return { ...prev, [size]: raw === '' ? 0 : Number(raw) }
    })
  }

  const stepSizeQty = (size, delta) => {
    setBreakdown((prev) => ({ ...prev, [size]: Math.max(0, (prev[size] || 0) + delta) }))
  }

  const validateQty = () => {
    if (!meetMin) {
      alert(`Minimum wholesale order quantity is ${minQty} pieces. You entered ${totalPieces}.`)
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
                className="w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover transition-transform duration-700 group-hover:scale-105"
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

            <div className="border-y border-white/10 py-4 space-y-2.5">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-4xl font-extrabold text-white">{formatPrice(unitPrice)}</span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#baf120] bg-[#baf120]/10 px-2.5 py-1 rounded border border-[#baf120]/30">Wholesale Bulk Rate</span>
              </div>
              <p className="w-full flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <i className="fa-solid fa-boxes-stacked text-[#baf120]"></i>
                Minimum Bulk Order: {minQty} Pieces Total
              </p>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>

            <div className="space-y-4 bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-white">
                  Bulk Size Selection (Enter Quantity Per Size)
                </label>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#baf120] bg-[#baf120]/10 px-2 py-0.5 rounded">
                  Bulk Wholesale Only
                </span>
              </div>

              {/* Quick Bulk Presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-gray-400">Quick Bulk Presets (Auto-Split Across Sizes):</span>
                <div className="flex flex-wrap gap-2">
                  {[12, 24, 36, 48, 100].map((presetQty) => (
                    <button
                      key={presetQty}
                      type="button"
                      onClick={() => setBreakdown(initialBreakdown(presetQty))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition-all cursor-pointer ${
                        totalPieces === presetQty
                          ? 'bg-[#baf120] text-black border-[#baf120] shadow-md scale-105'
                          : 'bg-black/60 text-gray-300 border-neutral-700 hover:border-white hover:text-white'
                      }`}
                    >
                      {presetQty} Pcs
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-black/40 border border-neutral-800 divide-y divide-neutral-800/80">
                {SIZES.map((size) => {
                  const value = breakdown[size] || 0
                  return (
                    <div key={size} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white w-12">{size}</span>
                        <span className="text-[10px] text-gray-500 font-medium hidden sm:inline">Size {size}</span>
                      </div>
                      <div className="inline-flex items-center border border-gray-700 rounded-lg bg-black/60">
                        <button
                          onClick={() => stepSizeQty(size, -1)}
                          disabled={value <= 0}
                          className="px-3.5 py-2 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm cursor-pointer"
                          aria-label={`Decrease quantity for size ${size}`}
                        >
                          −
                        </button>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={value}
                          onChange={(e) => setSizeQty(size, e.target.value)}
                          aria-label={`Quantity for size ${size}`}
                          className="w-16 bg-transparent text-center px-1 py-2 text-sm font-extrabold text-white outline-none"
                        />
                        <button
                          onClick={() => stepSizeQty(size, 1)}
                          className="px-3.5 py-2 text-gray-300 hover:text-white font-bold text-sm cursor-pointer"
                          aria-label={`Increase quantity for size ${size}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div
                className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 ${
                  meetMin ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-red-500/30 bg-red-500/10'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Total Bulk Order:{' '}
                  <span className={meetMin ? 'text-emerald-400 font-extrabold text-sm' : 'text-red-400 font-extrabold text-sm'}>
                    {totalPieces} / {minQty}
                  </span>{' '}
                  Pieces
                </span>
                {!meetMin && (
                  <span className="text-[10px] font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded">Add {minQty - totalPieces} more pieces</span>
                )}
              </div>
              {!meetMin && (
                <p className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-exclamation"></i> Minimum wholesale order is {minQty} pieces total across selected sizes.
                </p>
              )}

              {/* Custom Printing & Multi-Location Artwork Upload */}
              <div className="pt-4 border-t border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-white">
                    Custom Print Technique & Artwork Upload (Optional)
                  </label>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#baf120] bg-[#baf120]/10 px-2 py-0.5 rounded border border-[#baf120]/30">
                    PNG, WEBP, JPG, SVG, PDF
                  </span>
                </div>

                <div>
                  <select
                    value={printDesign}
                    onChange={(e) => setPrintDesign(e.target.value)}
                    className="w-full bg-black/60 border border-neutral-800 rounded-lg px-4 py-2.5 text-xs text-white outline-none focus:border-[#baf120]"
                  >
                    <option value="Dye Sublimation Printing">Full Dye Sublimation Printing</option>
                    <option value="Screen Printing">Screen Printing</option>
                    <option value="Custom Embroidery">Custom Embroidery</option>
                    <option value="DTF Heat Transfer">DTF / Heat Transfer</option>
                    <option value="Tackle Twill Stitching">Tackle Twill Stitching</option>
                    <option value="No Printing (Blank)">No Printing (Blank Gear)</option>
                  </select>
                </div>

                {/* Print Placement Tabs */}
                <div className="bg-black/40 border border-neutral-800 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                      <i className="fa-solid fa-paintbrush text-[#baf120]"></i> Print Location Image Upload
                    </span>
                    {Object.keys(placementFiles).length > 0 && (
                      <span className="text-[10px] font-extrabold bg-[#baf120] text-black px-2 py-0.5 rounded uppercase tracking-wider">
                        {Object.keys(placementFiles).length} Uploaded
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 border-b border-neutral-800 pb-2.5">
                    {PRINT_PLACEMENTS.map((item) => {
                      const hasFile = Boolean(placementFiles[item.id] || (item.id === 'front' && logoFile))
                      const isActive = activePlacement === item.id
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActivePlacement(item.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isActive
                              ? 'bg-[#baf120] text-black shadow-md'
                              : 'bg-black/60 text-gray-400 border border-neutral-800 hover:border-gray-600 hover:text-gray-200'
                          }`}
                        >
                          <i className={`fa-solid ${item.icon}`}></i>
                          {item.label}
                          {hasFile && (
                            <i className={`fa-solid fa-circle-check text-[10px] ${isActive ? 'text-black' : 'text-[#baf120]'}`}></i>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {(() => {
                    const curId = activePlacement
                    const file = placementFiles[curId] || (curId === 'front' ? logoFile : null)
                    const preview = placementPreviews[curId] || (curId === 'front' ? logoPreview : null)
                    const activeLabel = PRINT_PLACEMENTS.find((p) => p.id === curId)?.label || 'Print Design'

                    return (
                      <div>
                        {!file && !preview ? (
                          <div
                            onDragOver={(e) => {
                              e.preventDefault()
                              setIsDragging(true)
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                              e.preventDefault()
                              setIsDragging(false)
                              const droppedFile = e.dataTransfer.files?.[0]
                              if (droppedFile) {
                                handlePlacementFile(curId, droppedFile)
                                if (curId === 'front') handleFileSelect(droppedFile)
                              }
                            }}
                            className={`border border-dashed rounded-xl p-4 text-center transition-all ${
                              isDragging
                                ? 'border-[#baf120] bg-[#baf120]/10'
                                : 'border-neutral-800 bg-black/40 hover:border-[#baf120]/50'
                            }`}
                          >
                            <label className="cursor-pointer block">
                              <i className="fa-solid fa-cloud-arrow-up text-[#baf120] text-base mb-1 block"></i>
                              <span className="text-xs font-bold text-gray-200 block">
                                Upload {activeLabel} Artwork Image
                              </span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">
                                Drag and drop or click to upload (PNG, WEBP, JPG, SVG, GIF, AVIF, HEIC, PDF)
                              </span>
                              <input
                                type="file"
                                accept="image/*,.png,.jpg,.jpeg,.webp,.svg,.gif,.avif,.heic,.heif,.bmp,.tiff,.pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const selectedFile = e.target.files?.[0]
                                  if (selectedFile) {
                                    handlePlacementFile(curId, selectedFile)
                                    if (curId === 'front') handleFileSelect(selectedFile)
                                  }
                                }}
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="bg-black/60 border border-[#baf120]/40 rounded-xl p-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              {preview ? (
                                <div className="w-10 h-10 rounded-lg bg-black border border-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
                                  <img src={preview} alt="Artwork Preview" className="w-full h-full object-contain" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-black border border-neutral-800 flex items-center justify-center text-[#baf120] text-sm shrink-0">
                                  <i className="fa-solid fa-file-image"></i>
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate max-w-[160px]">
                                  {file ? file.name : 'Attached Artwork'}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                  <span className="text-[#baf120] font-bold">{activeLabel}</span> · {file ? (file.size / (1024 * 1024) >= 1 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${Math.round(file.size / 1024)} KB`) : 'Attached'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <label className="cursor-pointer text-[11px] font-bold text-gray-300 hover:text-white px-2.5 py-1 bg-black rounded border border-neutral-800">
                                Change
                                <input
                                  type="file"
                                  accept="image/*,.png,.jpg,.jpeg,.webp,.svg,.gif,.avif,.heic,.heif,.bmp,.tiff,.pdf"
                                  className="hidden"
                                  onChange={(e) => {
                                    const selectedFile = e.target.files?.[0]
                                    if (selectedFile) {
                                      handlePlacementFile(curId, selectedFile)
                                      if (curId === 'front') handleFileSelect(selectedFile)
                                    }
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  handlePlacementRemove(curId)
                                  if (curId === 'front') handleRemoveFile()
                                }}
                                className="text-[11px] font-bold text-red-400 hover:text-red-300 px-2.5 py-1 bg-red-500/10 rounded border border-red-500/20"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl bg-black/60 border border-neutral-800 px-4 py-3">
                <span className="text-xs text-gray-400 font-medium">
                  Subtotal ({totalPieces} pieces × {formatPrice(unitPrice, { showCode: false })})
                </span>
                <span className="text-base font-extrabold text-[#baf120]">{formatPrice(totalPrice)}</span>
              </div>
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
                disabled={!meetMin}
                className="flex-1 bg-[#baf120] hover:bg-[#a6e216] text-black font-extrabold text-xs uppercase tracking-widest py-4 px-6 rounded shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <i className="fa-solid fa-cart-shopping"></i> Add to Cart
              </button>
              <button
                onClick={handleExpressCheckout}
                disabled={!meetMin}
                className="flex-1 bg-white hover:bg-gray-200 text-black font-extrabold text-xs uppercase tracking-widest py-4 px-6 rounded shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                      <p className="text-sm font-bold text-[#baf120]">{formatPrice(op.wholesale ?? op.price)}</p>
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
