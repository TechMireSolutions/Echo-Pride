import React, { useEffect, useState } from 'react'
import { productService, adminService, useCategories, ApiError, getImageUrl } from '../../api'
import {
  Card, Modal, Loading, EmptyState, Toast, useToast, StatusBadge, Toggle,
  inputCls, labelCls, thCls, tdCls, fmtMoney,
} from './ui'

const PAGE_SIZE = 10

const EMPTY_FORM = {
  name: '',
  slug: '',
  sku: '',
  categoryId: '',
  description: '',
  price: '',
  wholesaleMinQuantity: '',
  stockQuantity: '',
  isFeatured: false,
  sizes: '',
  images: [],
  tiers: [],
  videos: [],
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function WholesalePreview({ form }) {
  const [qty, setQty] = useState(10)
  const wholesalePrice = Number(form.price) || 0
  const wholesaleMinQuantity = Math.max(1, Math.floor(Number(form.wholesaleMinQuantity) || 1))
  const tiers = (form.tiers || [])
    .filter((t) => Number(t.minQuantity) > 0 && Number(t.price) > 0)
    .map((t) => ({ minQuantity: Number(t.minQuantity), price: Number(t.price), label: t.label }))
    .sort((a, b) => a.minQuantity - b.minQuantity)
  const appliedTier = tiers.filter((t) => qty >= t.minQuantity).slice(-1)[0] || null
  const unitPrice = appliedTier ? appliedTier.price : wholesalePrice
  const total = Math.round(unitPrice * qty * 100) / 100
  const minMet = qty >= wholesaleMinQuantity

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live wholesale preview</p>
        <span className="text-[10px] font-black uppercase tracking-widest bg-[#baf120] text-black px-2 py-0.5 rounded-full">Engine</span>
      </div>
      <div>
        <label className={labelCls}>Quantity — {qty}</label>
        <input
          type="range"
          min="1"
          max="500"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-full accent-[#baf120]"
        />
      </div>
      {!minMet && (
        <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
          <i className="fa-solid fa-circle-exclamation"></i>
          Minimum order is {wholesaleMinQuantity} pieces — current quantity is below it.
        </p>
      )}
      {appliedTier ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Applied tier</span>
          <span className="font-bold text-[#baf120]">{appliedTier.minQuantity}+ · {fmtMoney(appliedTier.price)}/unit</span>
        </div>
      ) : (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Wholesale unit price</span>
          <span className="font-bold text-[#baf120]">{fmtMoney(wholesalePrice)}/unit</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-sm">
        <div>
          <p className="text-xs text-gray-500">Unit price</p>
          <p className="font-black">{fmtMoney(unitPrice)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-black">{fmtMoney(total)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Min order</p>
          <p className="font-black">{wholesaleMinQuantity} pieces</p>
        </div>
      </div>
    </div>
  )
}

export default function CatalogView() {
  const { categories } = useCategories([])
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [catModal, setCatModal] = useState(false)
  const [catForm, setCatForm] = useState({ name: '' })
  const { toast, push } = useToast()

  const load = () => {
    setLoading(true)
    setError(null)
    productService
      .list({ search: query, category, status, sort, page, limit: PAGE_SIZE })
      .then((res) => {
        setProducts(res?.items || [])
        setTotal(res?.total || 0)
        setPages(res?.pages || 1)
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }

  useEffect(load, [category, status, sort, page])
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1)
      load()
    }, 350)
    return () => clearTimeout(t)
  }, [query])

  const openAdd = () => {
    setEditing(null)
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id || '' })
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      name: p.name,
      slug: p.slug,
      sku: p.sku || '',
      categoryId: p.category?.id || '',
      description: p.description || '',
      price: p.price !== undefined ? String(p.price) : '',
      wholesaleMinQuantity: p.wholesaleMinQuantity !== undefined && p.wholesaleMinQuantity !== null ? String(p.wholesaleMinQuantity) : '',
      stockQuantity: String(p.stockQuantity ?? ''),
      isFeatured: Boolean(p.isFeatured),
      sizes: (p.sizes || []).join(', '),
      images: p.images || [],
      tiers: (p.tiers || []).filter((t) => t.type !== 'retail'),
      videos: p.videos || [],
    })
    setModalOpen(true)
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const updateTier = (i, k) => (e) =>
    setForm((f) => ({
      ...f,
      tiers: f.tiers.map((t, idx) => (idx === i ? { ...t, [k]: e.target.value } : t)),
    }))

  const addTier = () =>
    setForm((f) => ({ ...f, tiers: [...f.tiers, { minQuantity: '', price: '', label: '' }] }))

  const removeTier = (i) =>
    setForm((f) => ({ ...f, tiers: f.tiers.filter((_, idx) => idx !== i) }))

  const uploadImage = (file) => {
    productService
      .uploadSingle(file)
      .then((res) => {
        const url = res?.url
        if (url) {
          setForm((f) => ({ ...f, images: [...f.images, url] }))
          push('ok', 'Image uploaded.')
        }
      })
      .catch((err) => push('err', err instanceof ApiError ? err.message : 'Upload failed.'))
  }

  const removeImage = (url) => setForm((f) => ({ ...f, images: f.images.filter((x) => x !== url) }))

  const addVideo = () =>
    setForm((f) => ({ ...f, videos: [...f.videos, { url: '', poster: '', title: '', kind: 'link' }] }))

  const updateVideo = (i, k) => (e) =>
    setForm((f) => ({
      ...f,
      videos: f.videos.map((v, idx) => (idx === i ? { ...v, [k]: e.target.value } : v)),
    }))

  const removeVideo = (i) =>
    setForm((f) => ({ ...f, videos: f.videos.filter((_, idx) => idx !== i) }))

  const save = () => {
    if (!form.name.trim()) {
      push('err', 'Product name is required.')
      return
    }
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      sku: form.sku.trim(),
      categoryId: form.categoryId || null,
      description: form.description,
      price: Number(form.price) || 0,
      wholesaleMinQuantity: Math.max(0, Math.floor(Number(form.wholesaleMinQuantity) || 0)),
      stockQuantity: Number(form.stockQuantity) || 0,
      isFeatured: form.isFeatured,
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images,
      tiers: form.tiers
        .filter((t) => Number(t.minQuantity) > 0 && Number(t.price) > 0)
        .map((t) => ({ type: 'wholesale', minQuantity: Number(t.minQuantity), price: Number(t.price), label: t.label || `Wholesale ${t.minQuantity}+` })),
      videos: form.videos
        .filter((v) => String(v.url || '').trim())
        .map((v) => ({ url: v.url.trim(), poster: v.poster, title: v.title, kind: v.kind === 'upload' ? 'upload' : 'link' })),
    }

    setSaving(true)
    const req = editing ? productService.update(editing.id, payload) : productService.create(payload)
    req
      .then(() => {
        setModalOpen(false)
        push('ok', editing ? `"${payload.name}" updated.` : `"${payload.name}" added to catalog.`)
        load()
      })
      .catch((err) => push('err', err instanceof ApiError ? err.message : 'Could not save product.'))
      .finally(() => setSaving(false))
  }

  const toggleFeatured = (p) => {
    productService
      .update(p.id, { isFeatured: !p.isFeatured })
      .then(() => load())
      .catch((err) => push('err', err instanceof ApiError ? err.message : 'Could not update product.'))
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    productService
      .remove(deleteTarget.id)
      .then(() => {
        setDeleteTarget(null)
        push('ok', `"${deleteTarget.name}" removed.`)
        load()
      })
      .catch((err) => push('err', err instanceof ApiError ? err.message : 'Could not delete product.'))
  }

  const addCategory = () => {
    if (!catForm.name.trim()) return
    adminService
      .createCategory({ name: catForm.name.trim() })
      .then(() => {
        setCatModal(false)
        setCatForm({ name: '' })
        push('ok', 'Category created.')
      })
      .catch((err) => push('err', err instanceof ApiError ? err.message : 'Could not create category.'))
  }

  return (
    <>
      <Toast toast={toast} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-tight">Catalog & Inventory</h2>
          <p className="text-xs text-gray-500">{total} products · Drizzle price tiers & video sync</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCatModal(true)} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:border-[#baf120] text-xs font-bold text-gray-300 hover:text-white rounded-xl px-4 py-2.5 transition-colors">
            <i className="fa-solid fa-tag text-[11px]"></i>
            New category
          </button>
          <button onClick={openAdd} className="inline-flex items-center gap-2 bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-colors">
            <i className="fa-solid fa-plus text-[11px]"></i>
            Add product
          </button>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-white/10">
          <div className="relative flex-1 min-w-[200px]">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, SKU or slug…" className={`${inputCls} pl-10`} />
          </div>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1) }} className={`${inputCls} w-auto`}>
            <option value="" className="bg-[#0d1117]">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug} className="bg-[#0d1117]">{c.name}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className={`${inputCls} w-auto`}>
            <option value="" className="bg-[#0d1117]">All stock</option>
            <option value="in_stock" className="bg-[#0d1117]">In stock</option>
            <option value="low_stock" className="bg-[#0d1117]">Low stock</option>
            <option value="out_of_stock" className="bg-[#0d1117]">Sold out</option>
          </select>
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1) }} className={`${inputCls} w-auto`}>
            <option value="" className="bg-[#0d1117]">Newest</option>
            <option value="price_asc" className="bg-[#0d1117]">Price · low to high</option>
            <option value="price_desc" className="bg-[#0d1117]">Price · high to low</option>
            <option value="stock_asc" className="bg-[#0d1117]">Stock · low to high</option>
            <option value="stock_desc" className="bg-[#0d1117]">Stock · high to low</option>
          </select>
        </div>

        {loading ? (
          <Loading label="Loading catalog…" />
        ) : error ? (
          <div className="p-6">
            <EmptyState icon="fa-solid fa-triangle-exclamation" title="Could not load catalog" hint={error.message} />
          </div>
        ) : products.length === 0 ? (
          <EmptyState icon="fa-solid fa-box-open" title="No products found" hint="Try adjusting your filters or add your first product." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className={thCls}>Product</th>
                  <th className={thCls}>SKU</th>
                  <th className={thCls}>Category</th>
                  <th className={thCls}>Pricing</th>
                  <th className={thCls}>Stock</th>
                  <th className={thCls}>Status</th>
                  <th className={thCls}>Featured</th>
                  <th className={`${thCls} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                    <td className={tdCls}>
                      <div className="flex items-center gap-3">
                        <span className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm text-gray-400 shrink-0 overflow-hidden">
                          {p.images?.[0] ? <img src={getImageUrl(p.images[0])} alt="" className="w-full h-full object-cover" /> : <i className="fa-solid fa-box"></i>}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-[220px]">{p.name}</p>
                          <p className="text-xs text-gray-500 truncate">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`${tdCls} text-gray-500 font-mono text-xs`}>{p.sku || '—'}</td>
                    <td className={`${tdCls} text-gray-400`}>{p.category?.name || '—'}</td>
                    <td className={tdCls}>
                      <p className="text-gray-200 font-bold">{fmtMoney(Number(p.price) || 0)}/u</p>
                      {Number(p.wholesaleMinQuantity) > 0 && (
                        <p className="text-[11px] text-[#baf120] whitespace-nowrap">min {p.wholesaleMinQuantity}+</p>
                      )}
                    </td>
                    <td className={tdCls}>
                      <span className={`font-bold ${p.stockQuantity === 0 ? 'text-rose-400' : p.stockQuantity < 20 ? 'text-amber-400' : 'text-white'}`}>{p.stockQuantity}</span>
                    </td>
                    <td className={tdCls}>
                      <StatusBadge status={p.inventoryStatus} />
                    </td>
                    <td className={tdCls}>
                      <Toggle on={p.isFeatured} onClick={() => toggleFeatured(p)} label={`Featured: ${p.name}`} />
                    </td>
                    <td className={`${tdCls} text-right whitespace-nowrap`}>
                      <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white hover:text-[#baf120] hover:border-[#baf120] transition-colors mr-1.5" aria-label="Edit">
                        <i className="fa-solid fa-pen text-[11px]"></i>
                      </button>
                      <button onClick={() => setDeleteTarget(p)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white hover:text-rose-400 hover:border-rose-500 transition-colors" aria-label="Delete">
                        <i className="fa-solid fa-trash text-[11px]"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
            <p className="text-xs text-gray-500">Page {page} of {pages}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 flex items-center justify-center transition-colors" aria-label="Previous page">
                <i className="fa-solid fa-chevron-left text-[10px]"></i>
              </button>
              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 flex items-center justify-center transition-colors" aria-label="Next page">
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </div>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit · ${editing.name}` : 'Add product'} wide>
        <div className="space-y-5">
          <div>
            <label className={labelCls}>Product name *</label>
            <input value={form.name} onChange={set('name')} placeholder="e.g. Pro Basketball Jersey" className={inputCls} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Slug</label>
              <input value={form.slug} onChange={set('slug')} placeholder="auto-generated" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>SKU</label>
              <input value={form.sku} onChange={set('sku')} placeholder="EP-JER-002" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select value={form.categoryId} onChange={set('categoryId')} className={inputCls}>
              <option value="" className="bg-[#0d1117]">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0d1117]">{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Sizes</label>
            <input value={form.sizes} onChange={set('sizes')} placeholder="e.g. S, M, L, XL" className={inputCls} />
            <p className="text-[11px] text-gray-600 mt-1">Comma-separated list of sizes.</p>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows="3" value={form.description} onChange={set('description')} placeholder="Product description…" className={inputCls}></textarea>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Wholesale pricing</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Wholesale price ($) *</label>
                <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} placeholder="0.00" className={inputCls} />
                <p className="text-[11px] text-gray-600 mt-1">Per-unit wholesale price.</p>
              </div>
              <div>
                <label className={labelCls}>Wholesale min qty</label>
                <input type="number" min="0" step="1" value={form.wholesaleMinQuantity} onChange={set('wholesaleMinQuantity')} placeholder="e.g. 12" className={inputCls} />
                <p className="text-[11px] text-gray-600 mt-1">Minimum pieces required per wholesale order.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Stock quantity</label>
              <input type="number" min="0" value={form.stockQuantity} onChange={set('stockQuantity')} placeholder="0" className={inputCls} />
            </div>
            <div className="flex items-end pb-2">
              <div className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3 hover:border-[#baf120] transition-colors">
                <div className="text-left">
                  <p className="text-sm font-bold">Featured</p>
                  <p className="text-[11px] text-gray-500">Show in featured carousel</p>
                </div>
                <Toggle on={form.isFeatured} onClick={() => setForm((f) => ({ ...f, isFeatured: !f.isFeatured }))} label="Featured" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Product images</p>
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-[#baf120] hover:underline">
                <i className="fa-solid fa-upload text-[10px]"></i>
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = '' }} />
              </label>
            </div>
            {form.images.length === 0 && <p className="text-xs text-gray-600">No images yet.</p>}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {form.images.map((url) => (
                <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5">
                  <img src={getImageUrl(url)} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(url)} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/70 border border-white/20 text-rose-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity" aria-label="Remove image">
                    <i className="fa-solid fa-trash text-[10px]"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Wholesale price tiers</p>
              <button onClick={addTier} className="text-xs font-bold text-[#baf120] hover:underline">
                <i className="fa-solid fa-plus text-[10px]"></i> Add tier
              </button>
            </div>
            {form.tiers.length === 0 && <p className="text-xs text-gray-600 mb-3">No extra tiers — the wholesale min qty above applies to the base wholesale price.</p>}
            <div className="space-y-2 mb-4">
              {form.tiers.map((t, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1.4fr_auto] items-center gap-2">
                  <input type="number" min="2" value={t.minQuantity} onChange={updateTier(i, 'minQuantity')} placeholder="Min qty" className={inputCls} />
                  <input type="number" min="0" step="0.01" value={t.price} onChange={updateTier(i, 'price')} placeholder="Price" className={inputCls} />
                  <input value={t.label} onChange={updateTier(i, 'label')} placeholder={`Label · e.g. ${Math.max(2, Number(t.minQuantity) || 2)}+`} className={inputCls} />
                  <button onClick={() => removeTier(i)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-rose-400 hover:border-rose-500 flex items-center justify-center transition-colors" aria-label="Remove tier">
                    <i className="fa-solid fa-trash text-[10px]"></i>
                  </button>
                </div>
              ))}
            </div>
            <WholesalePreview form={form} />
          </div>

          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Product videos</p>
              <button onClick={addVideo} className="text-xs font-bold text-[#baf120] hover:underline">
                <i className="fa-solid fa-plus text-[10px]"></i> Add video
              </button>
            </div>
            {form.videos.length === 0 && <p className="text-xs text-gray-600">No videos — add an external stream URL or uploaded file.</p>}
            <div className="space-y-3">
              {form.videos.map((v, i) => (
                <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-400">Video {i + 1}</p>
                    <button onClick={() => removeVideo(i)} className="text-[11px] font-bold text-gray-500 hover:text-rose-400 transition-colors">
                      <i className="fa-solid fa-trash text-[10px] mr-1"></i>Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input value={v.url} onChange={updateVideo(i, 'url')} placeholder="Video URL (http(s)://…)" className={inputCls} />
                    <input value={v.title} onChange={updateVideo(i, 'title')} placeholder="Video title" className={inputCls} />
                  </div>
                  <input value={v.poster} onChange={updateVideo(i, 'poster')} placeholder="Poster image URL (optional)" className={inputCls} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-400 border border-white/10 hover:text-white hover:border-white/20 transition-colors">
              Cancel
            </button>
            <button onClick={save} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-black bg-[#baf120] text-black hover:bg-[#a6e216] disabled:opacity-50 transition-colors">
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Add product'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete product">
        <p className="text-sm text-gray-400">
          Are you sure you want to delete <span className="font-bold text-white">"{deleteTarget?.name}"</span>? This permanently removes the product, its price tiers and videos.
        </p>
        <div className="flex items-center justify-end gap-2 mt-6">
          <button onClick={() => setDeleteTarget(null)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-400 border border-white/10 hover:text-white hover:border-white/20 transition-colors">
            Cancel
          </button>
          <button onClick={confirmDelete} className="px-5 py-2.5 rounded-xl text-sm font-black bg-rose-500 text-white hover:bg-rose-600 transition-colors">
            Delete
          </button>
        </div>
      </Modal>

      <Modal open={catModal} onClose={() => setCatModal(false)} title="New category">
        <div>
          <label className={labelCls}>Category name</label>
          <input value={catForm.name} onChange={(e) => setCatForm({ name: e.target.value })} placeholder="e.g. Apparel" className={inputCls} />
        </div>
        <div className="flex items-center justify-end gap-2 mt-6">
          <button onClick={() => setCatModal(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-400 border border-white/10 hover:text-white hover:border-white/20 transition-colors">
            Cancel
          </button>
          <button onClick={addCategory} className="px-5 py-2.5 rounded-xl text-sm font-black bg-[#baf120] text-black hover:bg-[#a6e216] transition-colors">
            Create
          </button>
        </div>
      </Modal>
    </>
  )
}
