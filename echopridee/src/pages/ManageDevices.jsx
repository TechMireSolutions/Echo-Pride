import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const connectedApps = [
  { name: 'EchoPride Tracker', type: 'Fitness tracking', status: true, icon: 'fa-solid fa-heart-pulse' },
  { name: 'Coach Playbook', type: 'Training analytics', status: true, icon: 'fa-solid fa-clipboard-list' },
  { name: 'Team Roster Sync', type: 'Roster management', status: true, icon: 'fa-solid fa-users' },
  { name: 'Strava', type: 'Activity sync', status: false, icon: 'fa-solid fa-route' },
]

const authorizedDevices = [
  { name: 'EchoPride Tag — Home', type: 'Fitness tracking tag', last: 'Synced 2 min ago', icon: 'fa-solid fa-tag' },
  { name: 'EchoPride Tag — Gym Bag', type: 'Fitness tracking tag', last: 'Synced 1 hr ago', icon: 'fa-solid fa-tag' },
  { name: 'Samsung Galaxy S24', type: 'Mobile phone', last: 'Active now', icon: 'fa-solid fa-mobile-screen' },
  { name: 'iPad (Team Facility)', type: 'Tablet', last: 'Synced 2 days ago', icon: 'fa-solid fa-tablet-screen-button' },
  { name: 'Desktop — Headquarters', type: 'Web browser', last: 'Synced 1 week ago', icon: 'fa-solid fa-desktop' },
]

const auditMetrics = [
  { label: 'Active sessions', value: '2', pct: 40 },
  { label: 'Connected apps', value: '3', pct: 75 },
  { label: 'Data synced (30d)', value: '1.2 GB', pct: 60 },
  { label: 'Security score', value: 'A-', pct: 88 },
]

export default function ManageDevices() {
  const [apps, setApps] = useState(connectedApps)
  const [signedOut, setSignedOut] = useState(false)

  const toggle = (name) => setApps((prev) => prev.map((a) => (a.name === name ? { ...a, status: !a.status } : a)))

  return (
    <InfoPageShell
      heroTag="DEVICE & CONTENT MANAGER"
      title="Manage Your Content and Devices"
      intro="Review every app connected to your account and every device with access — and revoke anything you no longer use."
      image="/imgi_5_m3_cat_01.jpg"
    >
      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">CONNECTED APPS</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
                Apps Connected to Your Account
              </h2>
              <p className="text-gray-600 text-sm mt-3 max-w-2xl">
                These apps can read your workout data and profile. Toggle access off anytime — your data stops syncing immediately.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {apps.map((app) => (
              <div key={app.name} className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-[#baf120] text-black flex items-center justify-center text-xl shrink-0">
                  <i className={app.icon}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900">{app.name}</h3>
                  <p className="text-xs text-gray-500">{app.type}</p>
                </div>
                <button
                  onClick={() => toggle(app.name)}
                  className={`w-12 h-7 rounded-full relative transition-colors shrink-0 ${app.status ? 'bg-[#baf120]' : 'bg-gray-300'}`}
                  aria-label={`Toggle ${app.name}`}
                >
                  <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${app.status ? 'left-[22px]' : 'left-0.5'}`}></span>
                </button>
                <span className={`text-[10px] font-black uppercase tracking-wider shrink-0 ${app.status ? 'text-[#7a9e14]' : 'text-gray-400'}`}>
                  {app.status ? 'On' : 'Off'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">AUTHORIZED DEVICES</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase">
                  Where You Are Signed In
                </h2>
              </div>
              <button
                onClick={() => setSignedOut(true)}
                className="text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg transition-colors"
              >
                Sign Out All Devices
              </button>
            </div>
            {signedOut && (
              <p className="mb-6 text-sm font-bold text-green-600">
                <i className="fa-solid fa-circle-check mr-2"></i>
                Signed out from all other devices. You remain signed in here.
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {authorizedDevices.map((device) => (
                <div key={device.name} className="border border-gray-200 rounded-2xl p-5 bg-[#f8fafc]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center text-base shrink-0">
                      <i className={device.icon}></i>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{device.name}</h3>
                      <p className="text-xs text-gray-500">{device.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500"><i className="fa-solid fa-arrows-rotate text-[#baf120] mr-1"></i>{device.last}</span>
                    <button className="font-bold text-gray-600 uppercase tracking-wider hover:text-red-600 hover:underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside>
            <div className="bg-[#0a0e14] rounded-2xl p-7 border border-gray-800">
              <p className="text-xs font-black uppercase tracking-wider text-[#baf120] mb-5">Security audit</p>
              <div className="space-y-5">
                {auditMetrics.map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-gray-300">{m.label}</span>
                      <span className="font-black text-white">{m.value}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#baf120] to-[#7a9e14] rounded-full" style={{ width: `${m.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  <i className="fa-solid fa-shield-halved text-[#baf120] mr-1"></i>
                  Review your sessions monthly. Anything unfamiliar can be removed or signed out instantly.
                </p>
              </div>
            </div>
            <div className="mt-5 bg-[#fbfee9] border border-[#baf120]/60 rounded-2xl p-5">
              <p className="text-sm font-bold text-gray-900 mb-1"><i className="fa-solid fa-triangle-exclamation text-[#7a9e14] mr-2"></i>Lost a device?</p>
              <p className="text-xs text-gray-600 leading-relaxed">Remove it instantly and we will also pause data syncs from that device.</p>
            </div>
          </aside>
        </div>
      </section>
    </InfoPageShell>
  )
}
