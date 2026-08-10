import React, { useCallback, useEffect, useState } from 'react'
import { api, adminService } from '../../api'
import { Card, Loading, EmptyState, Modal, Toast, useToast, inputCls, labelCls, thCls, tdCls } from './ui'

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

const EMPTY = { name: '', slug: '', image: '' }

export default function CategoriesView() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const { toast, push } = useToast()

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    api
      .get('/categories')
      .then((data) => setItems(data?.items || data?.categories || []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm({ name: c.name, slug: c.slug, image: c.image || '' })
    setModalOpen(true)
  }

  const save = async () => {
    if (!form.name.trim()) {
      push('error', 'Category name is required.')
      return
    }
    setBusy(true)
    try {
      const payload = { name: form.name.trim(), slug: form.slug || slugify(form.name), image: form.image.trim() }
      if (editing) {
        await adminService.updateCategory(editing.id, payload)
        push('ok', `"${payload.name}" updated.`)
      } else {
        await adminService.createCategory(payload)
        push('ok', `"${payload.name}" created.`)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      push('error', err.message || 'Could not save category.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (c) => {
    if (!window.confirm(`Delete "${c.name}"? Products in this category will be unlinked.`)) return
    setBusy(true)
    try {
      await adminService.deleteCategory(c.id)
      push('ok', `"${c.name}" deleted.`)
      load()
    } catch (err) {
      push('error', err.message || 'Could not delete category.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      {toast && <Toast toast={toast} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-tight">Categories</h2>
          <p className="text-xs text-gray-500">Organize your catalog into browsable groups.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 bg-[#baf120] hover:bg-[#a6e216] text-black font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-colors">
          <i className="fa-solid fa-plus text-[11px]"></i>
          Add category
        </button>
      </div>

      {loading ? (
        <Loading label="Loading categories…" />
      ) : error ? (
        <Card className="p-6">
          <EmptyState icon="fa-solid fa-triangle-exclamation" title="Could not load categories" hint={error.message} />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className={thCls}>Category</th>
                  <th className={thCls}>Slug</th>
                  <th className={thCls}>Products</th>
                  <th className={`${thCls} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                    <td className={tdCls}>
                      <div className="flex items-center gap-3">
                        {c.image ? (
                          <img src={c.image} alt={c.name} className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0" />
                        ) : (
                          <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#baf120] shrink-0">
                            <i className="fa-solid fa-tag text-sm"></i>
                          </span>
                        )}
                        <span className="font-bold text-white">{c.name}</span>
                      </div>
                    </td>
                    <td className={`${tdCls} text-gray-500 font-mono text-xs`}>{c.slug}</td>
                    <td className={`${tdCls} text-gray-300`}>{c.productCount ?? 0}</td>
                    <td className={`${tdCls} text-right whitespace-nowrap`}>
                      <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-[#baf120] hover:border-[#baf120] transition-colors mr-1.5" aria-label="Edit">
                        <i className="fa-solid fa-pen text-[11px]"></i>
                      </button>
                      <button onClick={() => remove(c)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-rose-400 hover:border-rose-500 transition-colors" aria-label="Delete">
                        <i className="fa-solid fa-trash text-[11px]"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-10 text-center text-sm text-gray-500">No categories yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit category' : 'Add category'}>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Name</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: editing ? f.slug : '' }))} placeholder="e.g. Apparel" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">/</span>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="apparel" className={inputCls} />
              <button onClick={() => setForm((f) => ({ ...f, slug: slugify(f.name) }))} className="shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-[#baf120] hover:border-[#baf120] flex items-center justify-center transition-colors" aria-label="Auto slug">
                <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
              </button>
            </div>
          </div>
          <div>
            <label className={labelCls}>Image URL (optional)</label>
            <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://…" className={inputCls} />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-400 border border-white/10 hover:text-white hover:border-white/20 transition-colors">
              Cancel
            </button>
            <button onClick={save} disabled={busy} className="px-5 py-2.5 rounded-xl text-sm font-black bg-[#baf120] text-black hover:bg-[#a6e216] disabled:opacity-50 transition-colors">
              {busy ? 'Saving…' : editing ? 'Save changes' : 'Add category'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
