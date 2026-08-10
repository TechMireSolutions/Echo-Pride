import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { settingsService } from '../../api'
import { Card, SectionTitle, Toast, useToast, inputCls, labelCls } from './ui'

export default function SettingsView() {
  const { adminUser } = useAuth()
  const [store, setStore] = useState(null)
  const [form, setForm] = useState({ storeName: '', supportEmail: '', phone: '', address: '' })
  const [saved, setSaved] = useState(false)
  const { toast, push } = useToast()

  useEffect(() => {
    settingsService
      .get()
      .then((data) => {
        const s = data?.settings || data || {}
        setStore(s)
        setForm({
          storeName: s.storeName || s.store_name || 'EchoPride Store',
          supportEmail: s.supportEmail || '',
          phone: s.phone || '',
          address: s.address || '',
        })
      })
      .catch(() => setStore({}))
  }, [])

  const save = async () => {
    try {
      await settingsService.update({ ...(store || {}), ...form })
      push('ok', 'Settings saved successfully.')
      setSaved(true)
    } catch (err) {
      push('error', err.message || 'Could not save settings.')
    }
  }

  const initial = (adminUser?.name || 'Admin').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="space-y-4">
      {toast && <Toast toast={toast} />}

      <div>
        <h2 className="text-lg font-black tracking-tight">Settings</h2>
        <p className="text-xs text-gray-500">Store configuration and admin profile.</p>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-6">
          <SectionTitle icon="fa-solid fa-user-gear" tint="bg-[#baf120]/15 text-[#baf120]" title="Admin profile" />
          <div className="flex items-center gap-4 mb-5">
            <span className="w-16 h-16 rounded-full bg-[#baf120] text-black flex items-center justify-center text-xl font-black">{initial}</span>
            <div>
              <p className="text-sm font-bold text-white">{adminUser?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">{adminUser?.email}</p>
              <span className="inline-block mt-1.5 text-[10px] font-black uppercase tracking-widest bg-[#baf120] text-black px-2 py-0.5 rounded-full">Administrator</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Display name</label>
              <input value={form.storeName} onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))} placeholder="Store name" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Support email</label>
              <input value={form.supportEmail} onChange={(e) => setForm((f) => ({ ...f, supportEmail: e.target.value }))} placeholder="support@echopride.com" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Support phone</label>
              <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+1 (555) 000-0000" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Address</label>
              <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Store address" className={inputCls} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle icon="fa-solid fa-shield-halved" tint="bg-sky-500/15 text-sky-400" title="Account security" />
          <div className="space-y-4">
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Password</p>
                <p className="text-[11px] text-gray-500">Last changed recently</p>
              </div>
              <button className="text-xs font-bold text-gray-300 border border-white/10 hover:border-[#baf120] hover:text-white rounded-lg px-4 py-2 transition-colors">Change</button>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Two-factor auth</p>
                <p className="text-[11px] text-gray-500">Not enabled</p>
              </div>
              <button className="text-xs font-bold text-[#baf120] border border-[#baf120]/40 hover:bg-[#baf120]/10 rounded-lg px-4 py-2 transition-colors">Enable</button>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Sessions</p>
                <p className="text-[11px] text-gray-500">1 active session</p>
              </div>
              <button className="text-xs font-bold text-rose-400 border border-rose-500/40 hover:bg-rose-500/10 rounded-lg px-4 py-2 transition-colors">Revoke</button>
            </div>
          </div>
        </Card>
      </section>

      <div className="flex items-center justify-end gap-2">
        <button onClick={save} className="px-5 py-2.5 rounded-xl text-sm font-black bg-[#baf120] text-black hover:bg-[#a6e216] transition-colors">
          Save changes
        </button>
      </div>
    </div>
  )
}
