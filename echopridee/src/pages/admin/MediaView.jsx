import React, { useEffect, useRef, useState } from 'react'
import { adminService, productService, ApiError } from '../../api'
import {
  Card, Modal, Loading, EmptyState, Toast, useToast,
  inputCls, labelCls, fmtCompact, timeAgo,
} from './ui'

function fileKind(file) {
  return /^image\//.test(file.type) ? 'image' : /^video\//.test(file.type) ? 'video' : null
}

function MediaCard({ asset, onPreview, onDelete, onLink }) {
  return (
    <div className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-[#baf120]/40 transition-colors">
      <button onClick={() => onPreview(asset)} className="block w-full aspect-video bg-black/40 overflow-hidden relative">
        {asset.type === 'image' ? (
          <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <>
            {asset.thumb ? (
              <img src={asset.thumb} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : asset.kind === 'upload' ? (
              <video src={asset.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" muted playsInline />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-transparent">
                <i className="fa-solid fa-circle-play text-4xl text-violet-400"></i>
              </div>
            )}
            <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-widest bg-violet-500 text-white px-2 py-0.5 rounded-full">Video</span>
          </>
        )}
        <span className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-widest bg-black/60 text-white px-2 py-0.5 rounded-full">{asset.kind === 'upload' ? 'Uploaded' : 'External'}</span>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="w-11 h-11 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
            <i className="fa-solid fa-eye text-[#baf120]"></i>
          </span>
        </div>
      </button>
      <div className="p-3">
        <p className="text-sm font-bold truncate">{asset.title}</p>
        <p className="text-[11px] text-gray-500 truncate">{asset.productName ? `Linked to ${asset.productName}` : 'Unlinked asset'}</p>
        <p className="text-[10px] text-gray-600 mt-0.5">{asset.mime} · {asset.size ? fmtCompact(asset.size) : ''}{asset.duration ? ` · ${asset.duration}s` : ''}</p>
        <div className="flex items-center gap-2 mt-3">
          <button onClick={() => onPreview(asset)} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-gray-300 border border-white/10 hover:border-[#baf120] hover:text-white rounded-lg px-3 py-2 transition-colors">
            <i className="fa-solid fa-eye text-[10px]"></i>
            Preview
          </button>
          <button onClick={() => onLink(asset)} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-[#baf120] hover:border-[#baf120] flex items-center justify-center transition-colors" aria-label="Link to product">
            <i className="fa-solid fa-link text-[10px]"></i>
          </button>
          <button onClick={() => onDelete(asset)} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-rose-400 hover:border-rose-500 flex items-center justify-center transition-colors" aria-label="Delete">
            <i className="fa-solid fa-trash text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MediaView() {
  const [assets, setAssets] = useState([])
  const [total, setTotal] = useState(0)
  const [type, setType] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
  const [linkTarget, setLinkTarget] = useState(null)
  const [linkProduct, setLinkProduct] = useState('')
  const [products, setProducts] = useState([])
  const [linkBusy, setLinkBusy] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [delBusy, setDelBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [linkModal, setLinkModal] = useState(false)
  const [linkForm, setLinkForm] = useState({ url: '', title: '', thumb: '', type: 'video' })
  const { toast, push } = useToast()
  const fileRef = useRef(null)

  const load = () => {
    setLoading(true)
    setError(null)
    adminService
      .listMedia({ type, search: query, limit: 200 })
      .then((res) => {
        setAssets(res?.items || [])
        setTotal(res?.total || 0)
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }

  useEffect(load, [type])
  useEffect(() => {
    const t = setTimeout(load, 350)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    if (!linkTarget) return
    productService
      .list({ limit: 500 })
      .then((res) => setProducts(res?.items || []))
      .catch(() => {})
  }, [linkTarget])

  const doUpload = (file) => {
    const kind = fileKind(file)
    if (!kind) {
      push('err', 'Only image or video files are allowed.')
      return
    }
    setUploading(true)
    adminService
      .uploadMedia(file, { title: file.name })
      .then(() => {
        push('ok', 'Upload complete.')
        load()
      })
      .catch((err) => push('err', err instanceof ApiError ? err.message : 'Upload failed.'))
      .finally(() => setUploading(false))
  }

  const submitLink = () => {
    if (!/^https?:\/\//i.test(linkForm.url)) {
      push('err', 'Enter a valid http(s) URL.')
      return
    }
    setUploading(true)
    adminService
      .linkMedia(linkForm)
      .then(() => {
        setLinkModal(false)
        setLinkForm({ url: '', title: '', thumb: '', type: 'video' })
        push('ok', 'External media registered.')
        load()
      })
      .catch((err) => push('err', err instanceof ApiError ? err.message : 'Could not register link.'))
      .finally(() => setUploading(false))
  }

  const saveLink = () => {
    if (!linkTarget || !linkProduct) {
      push('err', 'Select a product to link this asset to.')
      return
    }
    setLinkBusy(true)
    adminService
      .linkMediaToProduct(linkTarget.id, Number(linkProduct))
      .then(() => {
        setLinkTarget(null)
        push('ok', 'Asset linked to product.')
        load()
      })
      .catch((err) => push('err', err instanceof ApiError ? err.message : 'Could not link asset.'))
      .finally(() => setLinkBusy(false))
  }

  const unlink = () => {
    if (!linkTarget) return
    setLinkBusy(true)
    adminService
      .linkMediaToProduct(linkTarget.id, null)
      .then(() => {
        setLinkTarget(null)
        push('ok', 'Asset unlinked.')
        load()
      })
      .catch((err) => push('err', err instanceof ApiError ? err.message : 'Could not unlink asset.'))
      .finally(() => setLinkBusy(false))
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setDelBusy(true)
    adminService
      .deleteMedia(deleteTarget.id)
      .then(() => {
        setDeleteTarget(null)
        push('ok', 'Asset deleted.')
        load()
      })
      .catch((err) => push('err', err instanceof ApiError ? err.message : 'Could not delete asset.'))
      .finally(() => setDelBusy(false))
  }

  return (
    <>
      <Toast toast={toast} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-tight">Media Library</h2>
          <p className="text-xs text-gray-500">{total} assets · uploads & external links</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLinkModal(true)} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:border-[#baf120] text-xs font-bold text-gray-300 hover:text-white rounded-xl px-4 py-2.5 transition-colors">
            <i className="fa-solid fa-link text-[11px]"></i>
            External link
          </button>
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl disabled:opacity-50 transition-colors">
            <i className={`fa-solid ${uploading ? 'fa-spinner fa-spin' : 'fa-upload'} text-[11px]`}></i>
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
          <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) doUpload(f); e.target.value = '' }} />
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-white/10">
          <div className="relative flex-1 min-w-[200px]">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title or URL…" className={`${inputCls} pl-10`} />
          </div>
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            {[
              { key: '', label: 'All' },
              { key: 'image', label: 'Images' },
              { key: 'video', label: 'Videos' },
            ].map((t) => (
              <button key={t.key} onClick={() => setType(t.key)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${type === t.key ? 'bg-[#baf120] text-black' : 'text-gray-400 hover:text-white'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Loading label="Loading media…" />
        ) : error ? (
          <div className="p-6">
            <EmptyState icon="fa-solid fa-triangle-exclamation" title="Could not load media" hint={error.message} />
          </div>
        ) : assets.length === 0 ? (
          <EmptyState icon="fa-solid fa-photo-film" title="No media found" hint="Upload an image or video, or register an external streaming link." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {assets.map((a) => (
              <MediaCard key={a.id} asset={a} onPreview={setPreview} onDelete={setDeleteTarget} onLink={setLinkTarget} />
            ))}
          </div>
        )}
      </Card>

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.title || 'Preview'} wide>
        {preview && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/50 aspect-video flex items-center justify-center">
              {preview.type === 'image' ? (
                <img src={preview.url} alt={preview.title} className="w-full h-full object-contain" />
              ) : (
                <video src={preview.url} controls className="w-full h-full" playsInline>
                  Your browser does not support video playback.
                </video>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <p className="font-bold capitalize">{preview.type} · {preview.kind}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">MIME</p>
                <p className="font-bold truncate">{preview.mime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Added</p>
                <p className="font-bold">{timeAgo(preview.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Linked product</p>
                <p className="font-bold truncate">{preview.productName || 'None'}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setPreview(null)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-400 border border-white/10 hover:text-white hover:border-white/20 transition-colors">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!linkTarget} onClose={() => setLinkTarget(null)} title={`Link · ${linkTarget?.title || ''}`}>
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            {linkTarget?.productName
              ? `This asset is currently linked to "${linkTarget.productName}". Choose another product or unlink it.`
              : 'Link this asset to a product so it appears in the product editor.'}
          </p>
          <div>
            <label className={labelCls}>Product</label>
            <select value={linkProduct} onChange={(e) => setLinkProduct(e.target.value)} className={inputCls}>
              <option value="" className="bg-[#0d1117]">Select a product…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0d1117]">{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            {linkTarget?.productName && (
              <button onClick={unlink} disabled={linkBusy} className="px-4 py-2.5 rounded-xl text-sm font-bold text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 disabled:opacity-50 transition-colors">
                Unlink
              </button>
            )}
            <button onClick={saveLink} disabled={linkBusy || !linkProduct} className="px-5 py-2.5 rounded-xl text-sm font-black bg-[#baf120] text-black hover:bg-[#a6e216] disabled:opacity-50 transition-colors">
              {linkBusy ? 'Saving…' : 'Link asset'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete asset">
        <p className="text-sm text-gray-400">
          Delete <span className="font-bold text-white">"{deleteTarget?.title}"</span>? {deleteTarget?.kind === 'upload' ? 'The local file will also be removed.' : ''}
        </p>
        <div className="flex items-center justify-end gap-2 mt-6">
          <button onClick={() => setDeleteTarget(null)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-400 border border-white/10 hover:text-white hover:border-white/20 transition-colors">
            Cancel
          </button>
          <button onClick={confirmDelete} disabled={delBusy} className="px-5 py-2.5 rounded-xl text-sm font-black bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50 transition-colors">
            Delete
          </button>
        </div>
      </Modal>

      <Modal open={linkModal} onClose={() => setLinkModal(false)} title="Register external media">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Media type</label>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
              <button onClick={() => setLinkForm((f) => ({ ...f, type: 'video' }))} className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${linkForm.type === 'video' ? 'bg-[#baf120] text-black' : 'text-gray-400 hover:text-white'}`}>
                Video stream
              </button>
              <button onClick={() => setLinkForm((f) => ({ ...f, type: 'image' }))} className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${linkForm.type === 'image' ? 'bg-[#baf120] text-black' : 'text-gray-400 hover:text-white'}`}>
                Image URL
              </button>
            </div>
          </div>
          <div>
            <label className={labelCls}>URL *</label>
            <input value={linkForm.url} onChange={(e) => setLinkForm((f) => ({ ...f, url: e.target.value }))} placeholder="https://…" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Title</label>
            <input value={linkForm.title} onChange={(e) => setLinkForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Product demo reel" className={inputCls} />
          </div>
          {linkForm.type === 'video' && (
            <div>
              <label className={labelCls}>Poster image URL (optional)</label>
              <input value={linkForm.thumb} onChange={(e) => setLinkForm((f) => ({ ...f, thumb: e.target.value }))} placeholder="https://…" className={inputCls} />
            </div>
          )}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={() => setLinkModal(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-400 border border-white/10 hover:text-white hover:border-white/20 transition-colors">
              Cancel
            </button>
            <button onClick={submitLink} disabled={uploading} className="px-5 py-2.5 rounded-xl text-sm font-black bg-[#baf120] text-black hover:bg-[#a6e216] disabled:opacity-50 transition-colors">
              Register
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
