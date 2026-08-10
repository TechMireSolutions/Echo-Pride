import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { authService } from '../api'

export default function LoginDrawer() {
  const { activeOverlay, closeLogin, setSessionToken } = useStore()
  const open = activeOverlay === 'login'

  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { accessToken } =
        mode === 'register'
          ? await authService.register({ name, email, password })
          : await authService.login({ email, password })
      await setSessionToken(accessToken)
      closeLogin()
    } catch (err) {
      setError(err?.message || (mode === 'register' ? 'Registration failed. Please try again.' : 'Login failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (next) => {
    setMode(next)
    setError(null)
  }

  return (
    <aside
      className={`fixed top-0 right-0 h-full w-full sm:w-[522px] bg-white text-black z-50 transition-transform duration-700 ease-in-out shadow-2xl flex flex-col ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between px-8 pt-8 pb-4">
        <h2 className="text-xl font-serif font-bold tracking-wider text-gray-900 uppercase">
          {mode === 'register' ? 'REGISTER' : 'LOGIN'}
        </h2>
        <button onClick={closeLogin} className="text-gray-400 hover:text-black p-1 focus:outline-none group">
          <img
            src="/download (1).svg"
            alt="Close"
            className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-all duration-700 ease-in-out transform group-hover:rotate-180"
          />
        </button>
      </div>
      <div className="p-8 pt-2 flex-1">
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div>
              <input
                type="text"
                placeholder="Full name"
                autoComplete="name"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 px-5 py-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-black transition-colors duration-500"
              />
            </div>
          )}
          <div>
            <input
              type="email"
              placeholder="Email address"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-5 py-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-black transition-colors duration-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder={mode === 'register' ? 'Password (min 8 characters)' : 'Password'}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              required
              minLength={mode === 'register' ? 8 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-5 py-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-black transition-colors duration-500"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-3 rounded">
              {error}
            </div>
          )}
          {mode === 'login' && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 border-gray-300 rounded text-black focus:ring-0 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm font-medium text-gray-800 cursor-pointer">
                Remember me
              </label>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#baf119] hover:bg-black text-white font-bold text-xs uppercase tracking-widest py-3.5 mt-2 transition-colors duration-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>{' '}
                {mode === 'register' ? 'Creating account...' : 'Logging in...'}
              </>
            ) : mode === 'register' ? (
              'Create Account'
            ) : (
              'Log In'
            )}
          </button>
          <div className="pt-2 flex items-center justify-between text-xs text-gray-700">
            {mode === 'login' ? (
              <button type="button" onClick={() => switchMode('register')} className="font-semibold underline hover:text-black transition-colors duration-500">
                Create a new account
              </button>
            ) : (
              <button type="button" onClick={() => switchMode('login')} className="font-semibold underline hover:text-black transition-colors duration-500">
                Already have an account? Log in
              </button>
            )}
            {mode === 'login' && (
              <Link
                to="/contact"
                onClick={closeLogin}
                className="text-gray-800 underline font-medium hover:text-black transition-colors duration-500"
              >
                Lost your password?
              </Link>
            )}
          </div>
        </form>
      </div>
    </aside>
  )
}
