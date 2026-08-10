import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ORBIT_ICONS = [
  'fa-brands fa-chrome',
  'fa-brands fa-edge',
  'fa-brands fa-facebook-messenger',
  'fa-brands fa-google',
  'fa-brands fa-firefox',
  'fa-brands fa-apple',
  'fa-brands fa-yahoo',
  'fa-brands fa-linkedin-in',
]

const R = 150
const CX = 200
const CY = 200

const orbitNodes = ORBIT_ICONS.map((icon, i) => {
  const angle = i * 45
  const rad = (angle * Math.PI) / 180
  const x = CX + R * Math.cos(rad)
  const y = CY + R * Math.sin(rad)
  return { icon, x, y, left: x / 4, top: y / 4 }
})

export default function AdminLogin() {
  const { isAuthenticated, ready, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!ready) {
    return (
      <div className="min-h-screen flex bg-white text-slate-900 items-center justify-center">
        <span className="text-slate-400 text-sm flex items-center gap-2">
          <i className="fa-solid fa-circle-notch animate-spin"></i>
          Verifying session...
        </span>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (!email.trim() || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (result.ok) {
      navigate('/admin', { replace: true })
    } else {
      setError(result.error || 'Invalid email or password. Please try again.')
    }
  }

  const handleForgot = () => {
    setError(null)
    setInfo('Password reset instructions are sent to your email.')
  }

  return (
    <div className="min-h-screen flex bg-white text-slate-900">
      {/* Left: Login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 text-[16rem] font-black leading-none text-blue-100/70 blur-3xl select-none pointer-events-none">
          E
        </div>

        <div className="w-full max-w-md relative">
          <div className="mx-auto w-fit">
            <span className="mx-auto flex w-12 h-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-xl shadow-lg shadow-blue-600/30 ring-1 ring-blue-200">
              E
            </span>
          </div>

          <div className="mt-6 text-center">
            <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-lg mb-4">
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
            </span>
            <h1 className="text-2xl font-black tracking-tight">Login to your account!</h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your registered email address and password to login!
            </p>
          </div>

          {error && (
            <div className="mt-5 flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm px-3.5 py-2.5">
              <i className="fa-solid fa-circle-exclamation mt-0.5 text-xs"></i>
              <span>{error}</span>
            </div>
          )}

          {info && (
            <div className="mt-5 flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 text-sm px-3.5 py-2.5">
              <i className="fa-solid fa-circle-info mt-0.5 text-xs"></i>
              <span>{info}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eg. your-email@domain.com"
                  autoComplete="username"
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="admin-password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                />
                Remember me
              </label>
              <button type="button" onClick={handleForgot} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 shadow-lg shadow-blue-600/25 transition-all active:scale-[0.99] disabled:opacity-70 disabled:hover:bg-blue-600 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <span className="flex-1 h-px bg-slate-200"></span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Or login with</span>
            <span className="flex-1 h-px bg-slate-200"></span>
          </div>

          <div className="flex items-center justify-center gap-4">
            {[
              { icon: 'fa-brands fa-google', label: 'Google' },
              { icon: 'fa-brands fa-apple', label: 'Apple' },
              { icon: 'fa-brands fa-microsoft', label: 'Microsoft' },
            ].map((s) => (
              <button
                key={s.label}
                type="button"
                aria-label={`Login with ${s.label}`}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-700 text-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center"
              >
                <i className={s.icon}></i>
              </button>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            <Link to="/" className="inline-flex items-center gap-2 font-medium text-slate-600 hover:text-blue-600 transition-colors">
              <i className="fa-solid fa-arrow-left text-xs"></i>
              Back to store
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Echo Pride ecosystem panel */}
      <div className="hidden lg:flex w-[48%] flex-col items-center justify-between bg-gradient-to-br from-[#eaf4ff] via-[#dbeafe] to-[#bfdbfe] px-10 py-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/40 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-blue-200/40 blur-3xl pointer-events-none"></div>

        <h2 className="text-3xl xl:text-4xl font-black text-slate-800 tracking-tight text-center relative">
          Write Better Everywhere
        </h2>

        <div className="relative w-full max-w-sm mx-auto aspect-square my-2">
          <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="constellation-core" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="148" fill="none" stroke="#bfdbfe" strokeWidth="1" />
            <circle
              cx="200"
              cy="200"
              r="96"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="1.5"
              strokeDasharray="5 9"
              style={{ transformOrigin: '200px 200px' }}
              className="animate-[spin_40s_linear_infinite]"
            />
            {orbitNodes.map((n) => (
              <line key={n.icon} x1="200" y1="200" x2={n.x} y2={n.y} stroke="#bfdbfe" strokeWidth="1.2" />
            ))}
            <circle cx="200" cy="200" r="42" fill="url(#constellation-core)" opacity="0.12" />
          </svg>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-black flex items-center justify-center shadow-xl shadow-blue-600/30 ring-4 ring-white/70">
            E
          </div>

          {orbitNodes.map((n) => (
            <div
              key={n.icon}
              className="absolute w-11 h-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border border-blue-100 shadow-md flex items-center justify-center text-slate-700 text-lg"
              style={{ left: `${n.left}%`, top: `${n.top}%` }}
            >
              <i className={n.icon}></i>
            </div>
          ))}
        </div>

        <p className="text-sm text-slate-600 max-w-md text-center leading-relaxed relative">
          Compatible with Gmail, Outlook Web, LinkedIn, and most web editors for a smooth writing experience anywhere online.
        </p>

        <div className="flex items-center gap-2 relative">
          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
          <span className="w-6 h-2 rounded-full bg-blue-600"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
        </div>
      </div>
    </div>
  )
}
