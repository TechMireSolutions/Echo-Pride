import React, { useEffect, useRef, useState } from 'react'
import { currencies } from '../data/currencies'
import { useCurrency } from '../context/CurrencyContext'

export default function CurrencySelector({ align = 'right', variant = 'dark', inline = false }) {
  const { currency, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (inline) return undefined
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [inline])

  const list = (
    <div
      className={`bg-white text-gray-900 shadow-2xl border border-gray-100 rounded-lg py-2 z-50 max-h-[420px] overflow-y-auto ${
        inline ? 'w-full' : `absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-3 w-64`
      }`}
    >
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Select Country</p>
        <p className="text-[11px] text-gray-400 mt-0.5">Prices update across the store</p>
      </div>
      {currencies.map((c) => (
        <button
          key={c.code}
          onClick={() => {
            setCurrency(c.code)
            setOpen(false)
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
            c.code === currency.code ? 'bg-[#baf120]/10 text-black' : 'text-gray-700 hover:bg-gray-50 hover:text-black'
          }`}
        >
          <span className="text-base leading-none">{c.flag}</span>
          <span className="flex-1 font-medium truncate">{c.name}</span>
          <span className={`text-xs font-bold ${c.code === currency.code ? 'text-black' : 'text-gray-500'}`}>
            {c.code}
          </span>
          {c.code === currency.code && <i className="fa-solid fa-check text-[#baf120]"></i>}
        </button>
      ))}
    </div>
  )

  return (
    <div className={inline ? 'w-full' : 'relative'} ref={ref}>
      {!inline && (
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Select country and currency"
          className="inline-flex items-center gap-2 hover:opacity-75 cursor-pointer leading-none"
        >
          {variant === 'light' ? (
            <i className="fa-solid fa-globe text-xl"></i>
          ) : (
            <span className="w-7 h-7 flex items-center justify-center">
              <i className="fa-solid fa-globe text-xl"></i>
            </span>
          )}
          <span className="text-sm font-semibold tracking-wider hidden lg:inline">{currency.country}</span>
          <i
            className={`fa-solid fa-chevron-down text-[10px] hidden sm:inline transition-transform duration-300 ${
              open ? 'rotate-180' : ''
            }`}
          ></i>
        </button>
      )}
      {(inline || open) && list}
    </div>
  )
}
