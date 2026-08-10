import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Admin from '../pages/Admin'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, ready } = useAuth()
  if (!ready) {
    return (
      <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center text-slate-400 text-sm">
        Verifying session...
      </div>
    )
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

export function AdminGate() {
  return (
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  )
}
