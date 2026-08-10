import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { adminService } from '../api'
import HomeView from './admin/HomeView'
import CatalogView from './admin/CatalogView'
import OrdersView from './admin/OrdersView'
import MediaView from './admin/MediaView'
import CategoriesView from './admin/CategoriesView'
import CustomersView from './admin/CustomersView'
import AnalyticsView from './admin/AnalyticsView'
import NotificationsView from './admin/NotificationsView'
import InquiriesView from './admin/InquiriesView'
import SurveysView from './admin/SurveysView'
import SettingsView from './admin/SettingsView'
import PlaceholderView from './admin/PlaceholderView'

/* ============================ NAV STRUCTURE ============================ */

const menuGroups = [
  {
    label: 'Main',
    items: [{ key: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-house' }],
  },
  {
    label: 'Catalog',
    items: [
      { key: 'catalog', label: 'Products', icon: 'fa-solid fa-box-open' },
      { key: 'categories', label: 'Categories', icon: 'fa-solid fa-tags' },
      { key: 'brands', label: 'Brands', icon: 'fa-solid fa-copyright' },
      { key: 'badges', label: 'Badges', icon: 'fa-solid fa-medal' },
      { key: 'media', label: 'Media Library', icon: 'fa-solid fa-photo-film' },
    ],
  },
  {
    label: 'Sales',
    items: [
      { key: 'orders', label: 'Orders', icon: 'fa-solid fa-cart-shopping' },
      { key: 'customers', label: 'Customers', icon: 'fa-solid fa-users' },
    ],
  },
  {
    label: 'Content',
    items: [{ key: 'cms', label: 'CMS', icon: 'fa-solid fa-pen-nib' }],
  },
  {
    label: 'Engagement',
    items: [
      { key: 'locations', label: 'Store Locations', icon: 'fa-solid fa-location-dot' },
      { key: 'inquiries', label: 'Inquiries', icon: 'fa-solid fa-envelope' },
      { key: 'surveys', label: 'Surveys', icon: 'fa-solid fa-clipboard-check' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { key: 'analytics', label: 'Analytics', icon: 'fa-solid fa-chart-line' },
      { key: 'notifications', label: 'Notifications', icon: 'fa-solid fa-bell' },
    ],
  },
  {
    label: 'System',
    items: [
      { key: 'settings', label: 'Settings', icon: 'fa-solid fa-gear' },
      { key: 'storefront', label: 'View Storefront', icon: 'fa-solid fa-arrow-up-right-from-square' },
    ],
  },
]

const viewMeta = {
  dashboard: { label: 'Dashboard', crumb: 'Main / Overview' },
  catalog: { label: 'Products', crumb: 'Catalog / Inventory' },
  categories: { label: 'Categories', crumb: 'Catalog / Categories' },
  brands: { label: 'Brands', crumb: 'Catalog / Brands' },
  badges: { label: 'Badges', crumb: 'Catalog / Badges' },
  media: { label: 'Media Library', crumb: 'Catalog / Uploads & Links' },
  orders: { label: 'Orders', crumb: 'Sales / Lifecycle' },
  customers: { label: 'Customers', crumb: 'Sales / Registered users' },
  cms: { label: 'CMS', crumb: 'Content / Pages & Sections' },
  locations: { label: 'Store Locations', crumb: 'Engagement / Store Locations' },
  inquiries: { label: 'Inquiries', crumb: 'Engagement / Customer messages' },
  surveys: { label: 'Surveys', crumb: 'Engagement / Feedback responses' },
  analytics: { label: 'Analytics', crumb: 'Insights / Traffic & Conversion' },
  notifications: { label: 'Notifications', crumb: 'Insights / Alerts' },
  settings: { label: 'Settings', crumb: 'System / Profile & Store config' },
}

const FLATTENED = menuGroups.flatMap((g) => g.items)

/* ============================ COMMAND PALETTE ============================ */

function CommandPalette({ open, onClose, onSelect }) {
  const [q, setQ] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setQ('')
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  const results = q.trim()
    ? FLATTENED.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())).slice(0, 8)
    : FLATTENED.slice(0, 8)

  const pick = (key) => {
    if (key === 'storefront') {
      window.location.href = '/'
      return
    }
    onSelect(key)
    onClose()
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[12vh] px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-lg bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <i className="fa-solid fa-magnifying-glass text-gray-500 text-sm"></i>
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search admin pages…" className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none" />
          <kbd className="hidden sm:inline-block text-[10px] font-bold text-gray-500 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="p-2 max-h-72 overflow-y-auto">
          <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-600">{q.trim() ? 'Search results' : 'Quick navigation'}</p>
          {results.map((r) => (
            <button key={r.key} onClick={() => pick(r.key)} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
              <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#baf120] shrink-0">
                <i className={`${r.icon} text-xs`}></i>
              </span>
              <span className="truncate">{r.label}</span>
              <i className="fa-solid fa-arrow-right text-[10px] ml-auto text-gray-600"></i>
            </button>
          ))}
          {results.length === 0 && <p className="px-3 py-6 text-center text-sm text-gray-500">No pages match "{q}".</p>}
        </div>
      </div>
    </div>
  )
}

/* ============================ NOTIFICATION POPOVER ============================ */

function NotificationBell({ onOpen }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [unread, setUnread] = useState(0)
  const ref = useRef(null)

  const load = useCallback(() => {
    adminService.listNotifications({ limit: 8 }).then((res) => setItems(res?.data?.items || res?.items || [])).catch(() => {})
  }, [])

  const loadUnread = useCallback(() => {
    adminService.unreadNotificationsCount().then((res) => setUnread(res?.data?.count ?? 0)).catch(() => {})
  }, [])

  useEffect(() => {
    load()
    loadUnread()
  }, [load, loadUnread])

  useEffect(() => {
    if (!open) return undefined
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const markAll = async () => {
    await adminService.markAllNotificationsRead()
    setUnread(0)
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const typeTint = (t) =>
    t === 'order' ? 'bg-[#baf120]/15 text-[#baf120]' : t === 'inventory' ? 'bg-amber-500/15 text-amber-400' : 'bg-sky-500/15 text-sky-400'

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#baf120] transition-colors" aria-label="Notifications">
        <i className="fa-solid fa-bell"></i>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <p className="text-sm font-black uppercase tracking-wider">Notifications</p>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAll} className="text-[11px] font-bold text-[#baf120] hover:underline">Mark all read</button>
              )}
              <button onClick={() => { setOpen(false); onOpen() }} className="text-[11px] font-bold text-gray-500 hover:text-white" aria-label="View all">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {items.length === 0 && <p className="px-4 py-10 text-center text-sm text-gray-500">No notifications yet.</p>}
            {items.map((n) => (
              <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors ${n.isRead ? 'opacity-60' : ''}`}>
                <span className={`w-9 h-9 rounded-full ${typeTint(n.type)} flex items-center justify-center shrink-0 mt-0.5`}>
                  <i className={`${n.type === 'order' ? 'fa-solid fa-truck-fast' : n.type === 'inventory' ? 'fa-solid fa-boxes-stacked' : 'fa-solid fa-circle-info'} text-xs`}></i>
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm truncate ${n.isRead ? 'text-gray-400' : 'text-white font-bold'}`}>{n.title}</p>
                  <p className="text-[11px] text-gray-500 truncate">{n.message}</p>
                </div>
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#baf120] shrink-0 mt-2"></span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ============================ MAIN ============================ */

export default function Admin() {
  const { logout, adminUser } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [view, setView] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [light, setLight] = useState(() => localStorage.getItem('ep_admin_theme') === 'light')
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('ep_admin_theme', light ? 'light' : 'dark')
  }, [light])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
      if (e.key === 'Escape') {
        setPaletteOpen(false)
        setProfileOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!profileOpen) return undefined
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [profileOpen])

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const meta = viewMeta[view]

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <HomeView go={setView} />
      case 'catalog':
        return <CatalogView />
      case 'orders':
        return <OrdersView />
      case 'media':
        return <MediaView />
      case 'categories':
        return <CategoriesView />
      case 'customers':
        return <CustomersView />
      case 'analytics':
        return <AnalyticsView />
      case 'notifications':
        return <NotificationsView />
      case 'inquiries':
        return <InquiriesView />
      case 'surveys':
        return <SurveysView />
      case 'settings':
        return <SettingsView />
      case 'brands':
        return <PlaceholderView title="Brands" hint="Manage the brands behind your products." icon="fa-solid fa-copyright" />
      case 'badges':
        return <PlaceholderView title="Badges" hint="Promotional badges shown across the store." icon="fa-solid fa-medal" />
      case 'cms':
        return <PlaceholderView title="CMS" hint="Edit pages, sections and content blocks." icon="fa-solid fa-pen-nib" />
      case 'locations':
        return <PlaceholderView title="Store Locations" hint="Manage physical store locations." icon="fa-solid fa-location-dot" />
      default:
        return <PlaceholderView title="Coming soon" hint="This section is being built." icon="fa-solid fa-hammer" />
    }
  }

  const sidebarContent = ({ compact = false } = {}) => (
    <>
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0">
        {!compact && (
          <Link to="/" className="text-lg font-black tracking-tight whitespace-nowrap">
            Echo<span className="text-[#baf120]">Pride</span>
          </Link>
        )}
        {!compact && <span className="text-[9px] font-black uppercase tracking-widest bg-[#baf120] text-black px-2 py-0.5 rounded">Admin</span>}
        {compact && (
          <span className="mx-auto text-lg font-black">
            E<span className="text-[#baf120]">P</span>
          </span>
        )}
        {!compact && (
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="ml-auto w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#baf120] transition-colors"
            aria-label="Toggle sidebar"
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {menuGroups.map((group) => (
          <div key={group.label}>
            {!compact && <p className="px-2 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-600">{group.label}</p>}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = view === item.key
                return (
                  <button
                    key={item.key}
                    title={item.label}
                    onClick={() => {
                      if (item.key === 'storefront') {
                        window.location.href = '/'
                        return
                      }
                      setView(item.key)
                      setMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                      isActive ? 'bg-[#baf120] text-black shadow-lg shadow-[#baf120]/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    } ${compact ? 'justify-center px-0' : ''}`}
                  >
                    <i className={`${item.icon} text-sm w-5 text-center shrink-0`}></i>
                    {!compact && <span className="truncate">{item.label}</span>}
                    {!compact && isActive && <i className="fa-solid fa-chevron-right text-[10px] ml-auto"></i>}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={() => {
            setProfileOpen(true)
            setMenuOpen(false)
          }}
          className="w-full flex items-center gap-3 rounded-xl p-2.5 bg-white/5 border border-white/10 hover:border-[#baf120] transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-[#baf120] text-black flex items-center justify-center text-xs font-black shrink-0">
            {String(adminUser?.name || 'Admin').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          {!compact && (
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm font-bold truncate">{adminUser?.name || 'Admin'}</p>
              <p className="text-[11px] text-gray-500 truncate">{adminUser?.email}</p>
            </div>
          )}
          {!compact && <i className="fa-solid fa-chevron-up text-[10px] text-gray-500"></i>}
        </button>
      </div>
    </>
  )

  return (
    <div className={`${light ? 'admin-light ' : ''}flex h-screen overflow-hidden bg-[#0a0e14] text-white font-sans antialiased`}>
      {/* ---------- Sidebar (desktop) ---------- */}
      <aside className={`hidden lg:flex shrink-0 flex-col border-r border-white/10 bg-[#0d1117] transition-all duration-300 ${collapsed ? 'w-[76px]' : 'w-64'}`}>
        {sidebarContent({ compact: collapsed })}
      </aside>

      {/* ---------- Mobile Drawer & Backdrop ---------- */}
      <div className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        ></div>
        <aside
          className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-[#0d1117] border-r border-white/10 flex flex-col shadow-2xl transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0">
            <Link to="/" className="text-lg font-black tracking-tight whitespace-nowrap">
              Echo<span className="text-[#baf120]">Pride</span>
            </Link>
            <span className="text-[9px] font-black uppercase tracking-widest bg-[#baf120] text-black px-2 py-0.5 rounded">Admin</span>
            <button onClick={() => setMenuOpen(false)} className="ml-auto w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-rose-500 transition-colors" aria-label="Close menu">
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>

          <div className="px-3 py-4 border-b border-white/10 shrink-0">
            <button onClick={() => { setMenuOpen(false); setPaletteOpen(true) }} className="w-full flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-left focus-within:border-[#baf120] transition-colors">
              <i className="fa-solid fa-magnifying-glass text-gray-500 text-xs"></i>
              <span className="flex-1 text-sm text-gray-500">Search…</span>
              <kbd className="text-[10px] font-bold text-gray-500 border border-white/10 rounded px-1.5 py-0.5">⌘K</kbd>
            </button>
          </div>

          {sidebarContent()}

          <div className="border-t border-white/10 p-3 grid grid-cols-2 gap-2">
            <button onClick={() => { setMenuOpen(false); setView('settings') }} className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white border border-white/10 hover:border-[#baf120] rounded-xl px-2 py-2.5 transition-colors">
              <i className="fa-solid fa-gear text-[11px]"></i>
              Settings
            </button>
            <button onClick={handleLogout} className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400 hover:text-rose-400 border border-white/10 hover:border-rose-500 rounded-xl px-2 py-2.5 transition-colors">
              <i className="fa-solid fa-arrow-right-from-bracket text-[11px]"></i>
              Log out
            </button>
          </div>
        </aside>
      </div>

      {/* ---------- Command Palette ---------- */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelect={setView} />

      {/* ---------- Main ---------- */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="shrink-0 border-b border-white/10 bg-[#0d1117]/80 backdrop-blur px-5 md:px-8 py-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          <button onClick={() => setMenuOpen((v) => !v)} className="lg:hidden w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300" aria-label="Menu">
            <i className="fa-solid fa-bars"></i>
          </button>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm">
            <button onClick={() => setPaletteOpen(true)} className="w-full flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-left transition-colors hover:border-white/20 group">
              <i className="fa-solid fa-magnifying-glass text-gray-500 text-xs group-hover:text-[#baf120]"></i>
              <span className="flex-1 text-sm text-gray-500">Search admin…</span>
              <kbd className="text-[10px] font-bold text-gray-500 border border-white/10 rounded px-1.5 py-0.5">⌘K</kbd>
            </button>
          </div>

          <div className="flex-1 min-w-[200px] space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none">Echo Pride Admin · {meta.crumb}</p>
            <h1 className="text-lg md:text-xl font-black tracking-tight leading-tight">
              {meta.label}
            </h1>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setLight((v) => !v)}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#baf120] transition-colors"
              aria-label="Toggle theme"
              title={light ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <i className={`fa-solid ${light ? 'fa-moon' : 'fa-sun'} text-sm`}></i>
            </button>
            <NotificationBell onOpen={() => setView('notifications')} />
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-[#baf120] hover:border-[#baf120] transition-colors"
                aria-label="Profile"
              >
                {String(adminUser?.name || 'Admin').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-4 border-b border-white/10">
                    <p className="text-sm font-black truncate">{adminUser?.name || 'Admin'}</p>
                    <p className="text-[11px] text-gray-500 truncate">{adminUser?.email}</p>
                    <span className="inline-block mt-1.5 text-[9px] font-black uppercase tracking-widest bg-[#baf120] text-black px-2 py-0.5 rounded-full">Administrator</span>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => { setProfileOpen(false); setView('settings') }}
                      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <i className="fa-solid fa-gear text-xs w-5 text-center"></i>
                      Settings
                    </button>
                    <Link to="/" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                      <i className="fa-solid fa-globe text-xs w-5 text-center"></i>
                      View Storefront
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors">
                      <i className="fa-solid fa-arrow-right-from-bracket text-xs w-5 text-center"></i>
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6">
          {renderView()}

          <footer className="pt-2 pb-6 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#baf120] transition-colors">
              <i className="fa-solid fa-arrow-left text-[10px]"></i>
              Back to Echo Pride site
            </Link>
          </footer>
        </main>
      </div>
    </div>
  )
}
