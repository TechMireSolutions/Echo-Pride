import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  authService,
  cartService,
  getToken,
  mapApiCartItem,
  productService,
  setToken,
  settingsService,
} from '../api'

const StoreContext = createContext(null)

const CART_KEY = 'echopride_cart'

const FALLBACK_SETTINGS = {
  storeName: 'Echo Pride',
  tagline: 'Premium sports apparel & custom team uniforms',
  currency: 'PKR',
  taxPercent: 5,
  shippingFee: 0,
  shippingTiers: [{ minQuantity: 50, fee: 0 }],
  contact: { email: 'support@echopride.com', phone: '', address: '' },
  heroBanners: [],
  currencyRates: {},
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || []
  } catch {
    return []
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(loadCart)
  const [activeOverlay, setActiveOverlay] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getToken()))
  const [user, setUser] = useState(null)
  const [settings, setSettings] = useState(FALLBACK_SETTINGS)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [settingsError, setSettingsError] = useState(null)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  const refreshSettings = useCallback(async () => {
    setSettingsLoading(true)
    setSettingsError(null)
    try {
      const data = await settingsService.get()
      setSettings({ ...FALLBACK_SETTINGS, ...data })
    } catch (err) {
      setSettingsError(err)
      setSettings(FALLBACK_SETTINGS)
    } finally {
      setSettingsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshSettings()
  }, [refreshSettings])

  const openSearch = () => setActiveOverlay('search')
  const openLogin = () => setActiveOverlay('login')
  const openCart = () => setActiveOverlay('cart')

  const closeAll = () => setActiveOverlay(null)
  const closeSearch = closeAll
  const closeLogin = closeAll
  const closeCart = closeAll

  const resolveProductId = useCallback(async (product) => {
    if (typeof product.id === 'number') return product.id
    if (!product.slug) return null
    try {
      const { items } = await productService.list({ search: product.slug, limit: 5 })
      const match = items.find((p) => p.slug === product.slug) || items[0]
      return match ? match.id : null
    } catch {
      return null
    }
  }, [])

  const loadBackendCart = useCallback(async () => {
    try {
      const data = await cartService.get()
      if (data?.items?.length) {
        setCart(data.items.map(mapApiCartItem))
      } else {
        setCart([])
      }
    } catch {
      /* backend unavailable: keep local cart */
    }
  }, [])

  const syncLocalCartToBackend = useCallback(async () => {
    const local = cart.filter((item) => !item.cartItemId)
    if (!local.length) return
    for (const item of local) {
      const productId = await resolveProductId(item)
      if (productId) {
        await cartService.add(productId, item.qty).catch(() => {})
      }
    }
  }, [cart, resolveProductId])

  const setSessionToken = useCallback(
    async (token) => {
      setToken(token)
      setIsLoggedIn(Boolean(token))
      if (token) {
        try {
          const { user: profileUser } = await authService.profile()
          setUser(profileUser)
        } catch {
          setUser(null)
        }
        await syncLocalCartToBackend()
        await loadBackendCart()
        refreshSettings()
      } else {
        setUser(null)
      }
    },
    [loadBackendCart, syncLocalCartToBackend, refreshSettings],
  )

  const clearSession = useCallback(() => {
    setToken(null)
    setIsLoggedIn(false)
    setUser(null)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      /* refresh cookie may already be gone */
    }
    clearSession()
    setCart([])
  }, [clearSession])

  const addToCart = (product, options = {}) => {
    const { openCart: shouldOpenCart = true } = options
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === product.id &&
          (item.orderType || 'retail') === (product.orderType || 'retail') &&
          JSON.stringify(item.sizes || null) === JSON.stringify(product.sizes || null),
      )
      if (existingIndex > -1) {
        const next = [...prev]
        next[existingIndex] = {
          ...next[existingIndex],
          qty: next[existingIndex].qty + product.qty,
        }
        return next
      }
      return [...prev, { ...product }]
    })

    if (isLoggedIn) {
      resolveProductId(product).then((productId) => {
        if (productId) {
          cartService
            .add(productId, product.qty)
            .then(loadBackendCart)
            .catch(() => {})
        }
      })
    }
    if (shouldOpenCart) {
      openCart()
    }
  }

  const changeQty = (index, delta) => {
    setCart((prev) => {
      const next = [...prev]
      if (!next[index]) return prev
      const updated = { ...next[index], qty: next[index].qty + delta }
      next[index] = updated
      if (updated.qty <= 0) {
        next.splice(index, 1)
        if (isLoggedIn && updated.cartItemId) {
          cartService.remove(updated.cartItemId).catch(() => {})
        }
      } else if (isLoggedIn && updated.cartItemId) {
        cartService.update(updated.cartItemId, updated.qty).catch(() => {})
      }
      return next
    })
  }

  const removeFromCart = (index) => {
    setCart((prev) => {
      const next = [...prev]
      const removed = next[index]
      next.splice(index, 1)
      if (isLoggedIn && removed?.cartItemId) {
        cartService.remove(removed.cartItemId).catch(() => {})
      }
      return next
    })
  }

  const clearCart = () => {
    setCart([])
    if (isLoggedIn) {
      cartService.clear().catch(() => {})
    }
  }

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const value = {
    cart,
    totalCount,
    subtotal,
    activeOverlay,
    isLoggedIn,
    user,
    settings,
    settingsLoading,
    settingsError,
    openSearch,
    openLogin,
    openCart,
    closeSearch,
    closeLogin,
    closeCart,
    closeAll,
    addToCart,
    changeQty,
    removeFromCart,
    clearCart,
    setSessionToken,
    clearSession,
    logout,
    refreshSettings,
    loadBackendCart,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
