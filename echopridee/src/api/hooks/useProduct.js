import { useEffect, useState } from 'react'
import { productService } from '../services/products.js'
import { mapApiProduct } from '../mappers.js'

export function useProduct(slug, fallback = null) {
  const [product, setProduct] = useState(fallback)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(Boolean(slug))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setLoading(true)
    setError(null)
    setRelated([])

    productService
      .getBySlug(slug)
      .then((data) => {
        if (cancelled) return
        const p = data?.product || data
        setProduct(p ? mapApiProduct(p) : null)
        if (Array.isArray(data?.related)) {
          setRelated(data.related.map(mapApiProduct))
        }
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
        if (!fallback) setProduct(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  return { product, related, loading, error }
}

export default useProduct
