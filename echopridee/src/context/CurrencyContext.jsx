import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getCurrency } from '../data/currencies'

const CurrencyContext = createContext(null)

const STORAGE_KEY = 'echopride_currency'

function loadCurrency() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && getCurrency(saved)) return saved
  } catch {
    /* ignore */
  }
  return 'USD'
}

export function CurrencyProvider({ children }) {
  const [code, setCode] = useState(loadCurrency)

  const setCurrency = useCallback((next) => {
    if (!getCurrency(next)) return
    setCode(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(() => {
    const currency = getCurrency(code)
    const convertPrice = (usd) => parseFloat(usd || 0) * currency.rate
    const formatPrice = (usd, { showCode = true } = {}) => {
      const converted = convertPrice(usd)
      const formatted = converted.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      return showCode ? `${currency.code} ${formatted}` : `${currency.symbol}${formatted}`
    }
    return { currency, code, setCurrency, convertPrice, formatPrice }
  }, [code, setCurrency])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export const useCurrency = () => useContext(CurrencyContext)
