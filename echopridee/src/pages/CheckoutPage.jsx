import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FooterCard } from '../components/Footers'
import { useStore } from '../context/StoreContext'
import { useCurrency } from '../context/CurrencyContext'
import { orderService } from '../api'
import { sizesLabel } from '../utils/sizes'

const MIN_ORDER_QTY = 12

const inputCls =
  'w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#baf120]'

export default function CheckoutPage() {
  const { cart, totalCount, subtotal, settings, clearCart } = useStore()
  const { formatPrice } = useCurrency()
  const navigate = useNavigate()

  const [form, setForm] = useState(() => ({
    name: '',
    phone: '',
    city: '',
    address: '',
    color: '',
    printDesign: cart[0]?.printDesign || 'Dye Sublimation Printing',
    instructions: '',
    logoName: cart[0]?.logoName || '',
  }))
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(() => cart[0]?.logoPreview || null)
  const [isDragging, setIsDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orderError, setOrderError] = useState(null)

  const PRINT_PLACEMENTS = [
    { id: 'front', label: 'Front Chest Logo', icon: 'fa-shirt' },
    { id: 'back', label: 'Back Design & Number', icon: 'fa-user-tag' },
    { id: 'sleeve', label: 'Sleeve / Shoulder', icon: 'fa-tag' },
    { id: 'extra', label: 'Full Pattern / Extra', icon: 'fa-images' },
  ]

  const [activePlacement, setActivePlacement] = useState('front')
  const [placementFiles, setPlacementFiles] = useState({})
  const [placementPreviews, setPlacementPreviews] = useState({})

  const handleFileSelect = (file) => {
    if (!file) return
    setLogoFile(file)
    setForm((f) => ({ ...f, logoName: file.name }))
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
    setForm((f) => ({ ...f, logoName: '' }))
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

  const taxPercent = Number(settings?.taxPercent) || 0
  const tax = (subtotal * taxPercent) / 100

  const totalQuantity = cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0)
  const shippingTiers = Array.isArray(settings?.shippingTiers) ? settings.shippingTiers : []
  const appliedShippingTier = shippingTiers
    .filter((t) => totalQuantity >= Number(t.minQuantity))
    .sort((a, b) => Number(b.minQuantity) - Number(a.minQuantity))[0]
  const shipping = appliedShippingTier ? Number(appliedShippingTier.fee) || 0 : Number(settings?.shippingFee) || 0
  const shippingDiscounted = Boolean(appliedShippingTier)
  const shippingLabel = shipping === 0 && shippingDiscounted ? 'Free Shipping' : 'Discounted'
  const total = subtotal + tax + shipping

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    const lowQtyItem = cart.find((item) => item.qty < (item.minQuantity || MIN_ORDER_QTY))
    if (lowQtyItem) {
      alert(`Minimum wholesale order quantity is ${lowQtyItem.minQuantity || MIN_ORDER_QTY} pieces`)
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
          country: 'United States',
        },
        paymentMethod: 'card',
        color: form.color.trim(),
        printDesign: form.printDesign,
        logo: form.logoName,
        specialInstructions: form.instructions.trim(),
        items: cart.map((item) => ({ productId: item.id, quantity: item.qty, sizes: item.sizes || {} })),
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
                  <input type="tel" value={form.phone} onChange={setField('phone')} placeholder="e.g. +1 555 0000000" autoComplete="tel" required className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">City *</label>
                  <input type="text" value={form.city} onChange={setField('city')} placeholder="Enter your city" autoComplete="address-level2" required className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Country</label>
                  <input type="text" value="United States" readOnly className={`${inputCls} opacity-60 cursor-not-allowed`} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Complete Delivery Address *</label>
                  <textarea value={form.address} onChange={setField('address')} placeholder="House / building, street, area, landmark" autoComplete="street-address" required rows="3" className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Color Selection *</label>
                  <input type="text" value={form.color} onChange={setField('color')} placeholder="e.g. Royal Blue / White" required className={inputCls} />
                </div>
                <div className="sm:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                      Print Design / Technique & Multi-Location Artwork *
                    </label>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#baf120] bg-[#baf120]/10 px-2 py-0.5 rounded border border-[#baf120]/30">
                      PNG, WEBP, JPG, SVG, PDF & More
                    </span>
                  </div>

                  <div>
                    <select
                      value={form.printDesign || 'Dye Sublimation Printing'}
                      onChange={setField('printDesign')}
                      required
                      className={inputCls}
                    >
                      <option value="Dye Sublimation Printing">Full Dye Sublimation Printing</option>
                      <option value="Screen Printing">Screen Printing</option>
                      <option value="Custom Embroidery">Custom Embroidery</option>
                      <option value="DTF Heat Transfer">DTF / Heat Transfer</option>
                      <option value="Tackle Twill Stitching">Tackle Twill Stitching</option>
                      <option value="No Printing (Blank)">No Printing (Blank Gear)</option>
                    </select>
                  </div>

                  {/* Print Artwork Placement Tabs & Uploaders */}
                  <div className="bg-black/50 border border-neutral-800 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <i className="fa-solid fa-paintbrush text-[#baf120]"></i> Upload Design Image Per Print Location
                      </span>
                      {Object.keys(placementFiles).length > 0 && (
                        <span className="text-[10px] font-extrabold bg-[#baf120] text-black px-2 py-0.5 rounded uppercase tracking-wider">
                          {Object.keys(placementFiles).length} Image(s) Attached
                        </span>
                      )}
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3">
                      {PRINT_PLACEMENTS.map((item) => {
                        const hasFile = Boolean(placementFiles[item.id] || (item.id === 'front' && logoFile))
                        const isActive = activePlacement === item.id
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActivePlacement(item.id)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                              isActive
                                ? 'bg-[#baf120] text-black shadow-md'
                                : 'bg-neutral-900 text-gray-300 border border-neutral-800 hover:border-gray-600'
                            }`}
                          >
                            <i className={`fa-solid ${item.icon}`}></i>
                            {item.label}
                            {hasFile && (
                              <i className={`fa-solid fa-circle-check text-xs ${isActive ? 'text-black' : 'text-[#baf120]'}`}></i>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Active Tab Dropzone / Card */}
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
                              className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                                isDragging
                                  ? 'border-[#baf120] bg-[#baf120]/10 scale-[1.01]'
                                  : 'border-neutral-800 bg-neutral-900/60 hover:border-[#baf120]/60'
                              }`}
                            >
                              <label className="cursor-pointer block">
                                <div className="w-10 h-10 rounded-full bg-[#baf120]/10 border border-[#baf120]/30 text-[#baf120] flex items-center justify-center mx-auto mb-2 text-lg">
                                  <i className="fa-solid fa-cloud-arrow-up"></i>
                                </div>
                                <p className="text-xs font-bold text-white mb-0.5">
                                  Upload {activeLabel} Artwork Image
                                </p>
                                <p className="text-[11px] text-gray-400 max-w-sm mx-auto mb-2">
                                  Supports PNG, WEBP, JPG, JPEG, SVG, GIF, AVIF, HEIC, BMP, TIFF & PDF
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-1">
                                  {['PNG', 'WEBP', 'JPG', 'JPEG', 'SVG', 'GIF', 'AVIF', 'HEIC', 'PDF'].map((ext) => (
                                    <span key={ext} className="text-[9px] font-black bg-black text-gray-400 px-1.5 py-0.5 rounded border border-neutral-800">
                                      {ext}
                                    </span>
                                  ))}
                                </div>
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
                            <div className="bg-neutral-900 border border-[#baf120]/40 rounded-xl p-3.5 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3.5 min-w-0">
                                {preview ? (
                                  <div className="w-12 h-12 rounded-lg bg-black border border-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
                                    <img src={preview} alt="Artwork Preview" className="w-full h-full object-contain" />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-black border border-neutral-800 flex items-center justify-center text-[#baf120] text-lg shrink-0">
                                    <i className="fa-solid fa-file-image"></i>
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-[240px]">
                                      {file ? file.name : 'Attached Artwork'}
                                    </span>
                                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#baf120]/20 text-[#baf120] border border-[#baf120]/30 shrink-0">
                                      {(file ? file.name : '').split('.').pop()?.toUpperCase() || 'IMAGE'}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-gray-400 mt-0.5">
                                    Location: <span className="text-[#baf120] font-bold">{activeLabel}</span> · {file ? (file.size / (1024 * 1024) >= 1 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${Math.round(file.size / 1024)} KB`) : 'Attached'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <label className="cursor-pointer text-xs font-bold text-gray-300 hover:text-white bg-black border border-neutral-800 hover:border-gray-600 px-3 py-1.5 rounded-lg transition-colors">
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
                                  className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-3 py-1.5 rounded-lg transition-colors"
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

                  <p className="text-[11px] text-gray-500">
                    <i className="fa-solid fa-shield-halved text-[#baf120] mr-1"></i>
                    Upload design images for Front, Back, Sleeves, or Full Pattern. Digital proof sent before printing.
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Any Special Instructions</label>
                  <textarea value={form.instructions} onChange={setField('instructions')} placeholder="Tell us anything else — font styles, team name placement, number preferences..." rows="3" className={`${inputCls} resize-none`} />
                </div>
              </div>
            </section>

            <section className="bg-[#baf120]/10 border border-[#baf120]/40 rounded-xl p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <span className="w-11 h-11 rounded-lg bg-[#baf120] text-black flex items-center justify-center text-xl shrink-0">
                  <i className="fa-solid fa-envelope-circle-check"></i>
                </span>
                <div>
                  <h3 className="font-serif font-extrabold text-base sm:text-lg uppercase tracking-wide text-white">
                    Order Received! Before production begins, we will contact you to confirm:
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {['Artwork & Digital Mockup', 'Size & Fit Breakdown', 'Final Customization Details'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-gray-200">
                        <i className="fa-solid fa-circle-check text-[#baf120]"></i>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-9 h-9 rounded-lg bg-[#baf120] text-black flex items-center justify-center font-black text-sm">2</span>
                <h2 className="font-serif font-extrabold text-xl uppercase tracking-wide">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="cursor-pointer rounded-xl border-2 border-[#baf120] bg-[#baf120]/5 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <i className="fa-solid fa-credit-card text-2xl text-[#baf120]"></i>
                    <span className="w-5 h-5 rounded-full border-2 border-[#baf120] flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#baf120]"></span>
                    </span>
                  </div>
                  <p className="font-bold text-sm">Credit / Debit Card</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Pay securely with Visa, Mastercard, or your bank card. Your payment details are fully encrypted.
                  </p>
                </label>

                <div className="rounded-xl border-2 border-neutral-800 bg-neutral-900/40 p-5 opacity-80">
                  <div className="flex items-start justify-between mb-3">
                    <i className="fa-solid fa-money-check-dollar text-2xl text-gray-500"></i>
                    <span className="w-5 h-5 rounded-full border-2 border-neutral-700"></span>
                  </div>
                  <p className="font-bold text-sm">Bank Transfer / Wire</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Contact our team to arrange a bank transfer after your order is confirmed.
                  </p>
                </div>
              </div>

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
                    <div key={`${item.id}-${index}-${JSON.stringify(item.sizes || item.size || 'L')}`} className="flex items-center gap-4 pb-4 border-b border-neutral-800 last:border-0">
                      <div className="relative shrink-0">
                        <img src={`/${item.image}`} alt={item.title} className="w-16 h-16 object-cover rounded-lg border border-neutral-800" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#baf120] text-black text-[10px] font-black flex items-center justify-center">
                          {item.qty}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold leading-snug truncate">{item.title}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {sizesLabel(item.sizes) || `Size: ${item.size || 'L'}`} · {formatPrice(item.price)}
                        </p>
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
                <div className="flex justify-between text-gray-400">
                  <span className="flex items-center gap-2">
                    Shipping
                    {shippingDiscounted && (
                      <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-full">
                        {shippingLabel}
                      </span>
                    )}
                  </span>
                  <span className="text-white font-bold">{shipping > 0 ? formatPrice(shipping) : 'Free'}</span>
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
