import { useEffect, useState } from 'react'
import api from '../client.js'

export function useCategories(fallback = []) {
  const [categories, setCategories] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    api
      .get('/categories')
      .then((data) => {
        if (cancelled) return
        const list = data?.items || data?.categories || []
        if (list.length) setCategories(list)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { categories, loading, error }
}

export default useCategories
