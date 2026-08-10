import React, { useEffect, useRef } from 'react'
import { useStore } from '../context/StoreContext'
import { useNavigate } from 'react-router-dom'

export default function SearchOverlay() {
  const { activeOverlay, closeSearch } = useStore()
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const open = activeOverlay === 'search'

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 300)
      return () => clearTimeout(t)
    }
  }, [open])

  return (
    <div
      className={`fixed inset-0 bg-white z-50 transition-all duration-700 ease-in-out flex flex-col justify-center items-center px-4 ${
        open ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <button
        onClick={closeSearch}
        className="absolute top-8 right-8 md:top-12 md:right-12 w-12 h-12 md:w-14 md:h-14 border border-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:text-black hover:border-black transition-all duration-700 focus:outline-none group"
      >
        <img
          src="/download (1).svg"
          alt="Close"
          className="w-5 h-5 md:w-6 md:h-6 object-contain opacity-60 group-hover:opacity-100 transition-all duration-700 ease-in-out transform group-hover:rotate-180"
        />
      </button>
      <div className="w-full max-w-3xl px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const q = inputRef.current?.value.trim()
            closeSearch()
            navigate(`/shop${q ? `?q=${encodeURIComponent(q)}` : ''}`)
          }}
          className="relative border-b border-gray-300 pb-2"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Product Search"
            className="w-full bg-transparent text-gray-500 placeholder-gray-400 text-2xl md:text-3xl font-medium focus:outline-none pr-10 text-left"
          />
          <button
            type="submit"
            className="absolute right-0 top-1/2 -translate-y-1/2 focus:outline-none group"
          >
            <img
              src="/download (3).svg"
              alt="Search"
              className="w-6 h-6 md:w-7 md:h-7 object-contain opacity-60 group-hover:opacity-100 transition-all duration-700 ease-in-out transform group-hover:scale-110"
            />
          </button>
        </form>
      </div>
    </div>
  )
}
