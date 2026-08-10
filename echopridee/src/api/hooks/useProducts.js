import { useEffect, useState } from 'react'
import { productService } from '../services/products.js'
import { mapApiProduct } from '../mappers.js'

export function useProducts(params = {}, fallback = []) {
  const [items, setItems] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usingFallback, setUsingFallback] = useState(fallback.length > 0)

  const key = JSON.stringify(params)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    productService
      .list(params)
      .then(({ items: list }) => {
        if (cancelled) return
        setItems(list.length ? list.map(mapApiProduct) : fallback)
        setUsingFallback(!list.length && fallback.length > 0)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
        setItems(fallback)
        setUsingFallback(fallback.length > 0)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return { items, loading, error, usingFallback }
}

export default useProducts
