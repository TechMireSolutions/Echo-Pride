import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const settingsTabs = [
  { label: 'Profile', icon: 'fa-solid fa-user' },
  { label: 'Addresses', icon: 'fa-solid fa-location-dot' },
  { label: 'Security', icon: 'fa-solid fa-shield-halved' },
]

const activity = [
  { icon: 'fa-solid fa-bag-shopping', text: 'Order #EP-2041 shipped', time: '2 hours ago', color: 'text-[#baf120]' },
  { icon: 'fa-solid fa-coins', text: 'Earned 95 points on your last order', time: 'Yesterday', color: 'text-[#7a9e14]' },
  { icon: 'fa-solid fa-shield-halved', text: 'Two-step verification enabled', time: '3 days ago', color: 'text-gray-500' },
  { icon: 'fa-solid fa-address-book', text: 'New address added: Team Facility', time: '1 week ago', color: 'text-gray-500' },
]

export default function Account() {
  const [tab, setTab] = useState('Profile')
  const [saved, setSaved] = useState(false)

  return (
    <InfoPageShell
      heroTag="ACCOUNT CENTER"
      title="Your Account"
      intro="Manage your profile, saved addresses, and password from one secure dashboard. Every change syncs across your devices instantly."
      image="/imgi_132_m3_slide_01.jpg"
      variant="left"
    >
      <section className="bg-[#f8fafc] py-16 md:py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#baf120] text-black flex items-center justify-center text-2xl font-black mx-auto mb-3">
                  A
                </div>
                <h3 className="text-base font-bold text-gray-900">Athlete Store</h3>
                <p className="text-xs text-gray-500">athlete@echopride.example</p>
                <p className="mt-2 inline-block text-[10px] font-black uppercase tracking-wider bg-[#baf120] text-black px-3 py-1 rounded-full">
                  Gold Member
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-2 space-y-1">
                {settingsTabs.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setTab(t.label)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors ${
                      tab === t.label ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`${t.icon} ${tab === t.label ? 'text-[#baf120]' : 'text-gray-400'}`}></i>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Quick links</p>
                <div className="space-y-1.5">
                  <Link to="/orders" className="flex items-center justify-between text-xs text-gray-600 hover:text-gray-900"><span>Your Orders</span><i className="fa-solid fa-arrow-right text-gray-400"></i></Link>
                  <Link to="/shop-with-points" className="flex items-center justify-between text-xs text-gray-600 hover:text-gray-900"><span>Shop with Points</span><i className="fa-solid fa-arrow-right text-gray-400"></i></Link>
                  <Link to="/reload-balance" className="flex items-center justify-between text-xs text-gray-600 hover:text-gray-900"><span>Reload Balance</span><i className="fa-solid fa-arrow-right text-gray-400"></i></Link>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              {tab === 'Profile' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Profile Settings</h2>
                  <p className="text-sm text-gray-500 mb-6">Your name and contact details appear on receipts and support conversations.</p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setSaved(true)
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">First Name</label>
                      <input type="text" defaultValue="Alex" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#baf120]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Last Name</label>
                      <input type="text" defaultValue="Reyes" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#baf120]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email</label>
                      <input type="email" defaultValue="athlete@echopride.example" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#baf120]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone</label>
                      <input type="tel" defaultValue="+1 555 012 3456" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#baf120]" />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-4">
                      <button type="submit" className="bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-lg transition-colors">
                        Save Changes
                      </button>
                      {saved && <span className="text-sm font-bold text-green-600"><i className="fa-solid fa-circle-check mr-1"></i>Saved</span>}
                    </div>
                  </form>
                </div>
              )}

              {tab === 'Addresses' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Saved Addresses</h2>
                  <p className="text-sm text-gray-500 mb-6">Choose a default for shipping and billing. Addresses are validated before checkout.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { label: 'Home', address: '730 W Sixth St, Suite 214, Corona, CA 92882' },
                      { label: 'Team Facility', address: '1482 Sports Park Way, Anaheim, CA 92806' },
                    ].map((a) => (
                      <div key={a.label} className="border border-gray-200 rounded-2xl p-5 bg-[#f8fafc]">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-gray-900">{a.label}</h4>
                          <span className="text-[10px] font-black uppercase tracking-wider bg-gray-900 text-white px-2.5 py-1 rounded-full">Default</span>
                        </div>
                        <p className="text-sm text-gray-600">{a.address}</p>
                        <button className="mt-4 text-xs font-bold text-[#baf120] uppercase tracking-wider hover:underline">Edit Address</button>
                      </div>
                    ))}
                    <button className="border-2 border-dashed border-gray-300 rounded-2xl p-5 text-gray-500 hover:border-[#baf120] hover:text-gray-700 transition-colors">
                      <i className="fa-solid fa-plus mr-2"></i>
                      Add a New Address
                    </button>
                  </div>
                </div>
              )}

              {tab === 'Security' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Password & Security</h2>
                  <p className="text-sm text-gray-500 mb-6">Keep your account protected with a strong password and optional two-step verification.</p>
                  <form
                    className="space-y-5 max-w-xl"
                    onSubmit={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">New Password</label>
                      <input type="password" placeholder="••••••••••••" autoComplete="new-password" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#baf120]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Confirm New Password</label>
                      <input type="password" placeholder="••••••••••••" autoComplete="new-password" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#baf120]" />
                    </div>
                    <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3.5 bg-[#f8fafc]">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Two-Step Verification</p>
                        <p className="text-xs text-gray-500">Add an extra code on every new sign-in.</p>
                      </div>
                      <span className="w-11 h-6 rounded-full bg-[#baf120] relative">
                        <span className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow"></span>
                      </span>
                    </div>
                    <button type="submit" className="bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-lg transition-colors">
                      Update Password
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-7">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#baf120] text-black px-3 py-1 rounded-full">Live</span>
              </div>
              <div className="space-y-4">
                {activity.map((a) => (
                  <div key={a.text} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#f8fafc] border border-gray-200 flex items-center justify-center">
                      <i className={`${a.icon} ${a.color}`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">{a.text}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </InfoPageShell>
  )
}
