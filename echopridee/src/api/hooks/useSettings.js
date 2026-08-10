import { useEffect, useState } from 'react'
import { settingsService } from '../services/settings.js'

export function useSettings(fallback = {}) {
  const [settings, setSettings] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    settingsService
      .get()
      .then((data) => {
        if (cancelled) return
        setSettings(data && typeof data === 'object' ? data : fallback)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
        setSettings(fallback)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { settings, loading, error }
}

export default useSettings
