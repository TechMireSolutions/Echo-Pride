import React from 'react'
import { useStore } from '../context/StoreContext'

export default function Backdrop() {
  const { activeOverlay, closeAll } = useStore()
  const show = activeOverlay === 'login' || activeOverlay === 'cart'

  return (
    <div
      onClick={closeAll}
      className={`fixed inset-0 bg-black/70 z-50 transition-opacity duration-700 ${
        show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    ></div>
  )
}
