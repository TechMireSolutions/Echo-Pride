import React from 'react'
import { Link } from 'react-router-dom'
import InfoPageShell from '../components/InfoPageShell'

const apiSteps = [
  { icon: 'fa-solid fa-id-card', title: 'Get API Credentials', text: 'Register as a developer and generate sandbox keys to start integrating safely.', tag: '5 min' },
  { icon: 'fa-solid fa-plug', title: 'Connect Your App', text: 'Use our REST APIs and SDKs to sync sports tracking data, gear libraries, and player profiles.', tag: 'SDK' },
  { icon: 'fa-solid fa-vial', title: 'Test in Sandbox', text: 'Validate against mock data and device simulators before you submit.', tag: 'Sandbox' },
  { icon: 'fa-solid fa-rocket', title: 'Publish to Production', text: 'Go live with real credentials, then manage releases from the developer console.', tag: 'Live' },
]

const guidelineChecks = [
  'Apps must handle device offline mode gracefully.',
  'Health and performance data requires explicit user consent.',
  'No hidden subscriptions — pricing must be disclosed at install.',
  'Screenshots must reflect the actual app interface.',
  'Tracking apps must state data sync frequency and battery impact.',
  'Accessibility labels required for all interactive elements.',
  'Test builds must pass our automated compatibility suite.',
  'Apps cannot collect location when running in the background.',
]

const reviewSteps = [
  { label: 'Submitted', detail: 'Queue begins immediately' },
  { label: 'Auto compatibility', detail: 'Runs in ~30 minutes' },
  { label: 'Human review', detail: 'Privacy + UX pass' },
  { label: 'Published', detail: 'Live on the app store' },
]

const codeSnippet = `// EchoPride Tracking SDK
import { EchoPrideTracker } from '@echopride/sdk'

const tracker = new EchoPrideTracker({
  apiKey: process.env.EP_API_KEY,
  device: 'echopride-tag-01',
})

tracker.on('sync', ({ session, metrics }) => {
  await pushWorkout({ session, metrics })
  console.log('Workout synced:', session.id)
})`

export default function SellApps() {
  return (
    <InfoPageShell
      heroTag="DEVELOPER PROGRAM"
      title="Sell apps on Echo Pride"
      intro="Build sports tracking apps and smart integrations for Echo Pride devices. We provide the APIs, you ship the experience."
      image="/imgi_5_m3_cat_01.jpg"
      variant="split"
      heroAside={
        <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-black/40">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="ml-3 text-xs text-gray-500 font-mono">integrations/tracker.js</span>
          </div>
          <pre className="p-5 text-xs text-[#baf120] font-mono overflow-x-auto leading-relaxed">{codeSnippet}</pre>
        </div>
      }
    >
      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">API INTEGRATION</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 uppercase mb-4">
              Plug Into the Echo Pride Platform
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Connect your app to Echo Pride fitness tags and IoT sportswear in four steps. Full docs and live-key
              management live in the developer console.
            </p>
          </div>
          <div className="lg:col-span-3">
            <div className="space-y-3">
              {apiSteps.map((step, i) => (
                <div key={step.title} className="flex items-center gap-4 border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center text-lg">
                      <i className={step.icon}></i>
                    </div>
                    {i < apiSteps.length - 1 && <span className="hidden lg:block absolute left-1/2 top-full w-0.5 h-3 bg-gray-300 -translate-x-1/2"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-bold text-gray-900">{step.title}</h3>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#baf120] text-black px-2.5 py-0.5 rounded-full">{step.tag}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0a0e14] py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">SUBMISSION GUIDELINES</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 uppercase mb-6">
              Checklist Before You Submit
            </h2>
            <div className="space-y-2.5">
              {guidelineChecks.map((item, i) => (
                <div key={item} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <span className="w-6 h-6 rounded-lg bg-[#baf120] text-black flex items-center justify-center text-xs font-black shrink-0">{i + 1}</span>
                  <span className="text-sm text-gray-300 leading-snug flex-1">{item}</span>
                  <i className="fa-solid fa-check text-[#baf120] shrink-0"></i>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[#baf120] text-xs font-extrabold uppercase tracking-[0.25em]">REVIEW PIPELINE</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 uppercase mb-6">
              From Submit to Published
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
              {reviewSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${i === reviewSteps.length - 1 ? 'bg-[#baf120] text-black' : 'bg-gray-700 text-white'}`}>
                      {i === reviewSteps.length - 1 ? <i className="fa-solid fa-rocket"></i> : i + 1}
                    </span>
                    {i < reviewSteps.length - 1 && <span className="w-0.5 h-6 bg-gray-700"></span>}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{step.label}</p>
                    <p className="text-xs text-gray-400">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-gray-500 leading-relaxed">
              Most apps clear review within 5 business days. You can resubmit unlimited times after fixes.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-gray-900 mb-2">
              Request developer access
            </h2>
            <p className="text-gray-600 text-sm">Get sandbox keys and a developer account to start building today.</p>
          </div>
          <Link to="/contact" className="shrink-0 inline-block bg-gray-900 hover:bg-black text-white font-bold text-xs sm:text-sm uppercase tracking-widest px-10 py-4 rounded-lg transition-colors duration-300 shadow-lg">
            Get Developer Access
          </Link>
        </div>
      </section>
    </InfoPageShell>
  )
}
