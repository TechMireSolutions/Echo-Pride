export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export function getImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:')) return url
  const cleanUrl = url.replace(/^\/+/, '')
  const base = import.meta.env.VITE_API_BASE_URL 
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '') 
    : ''
  return `${base}/${cleanUrl}`
}

const TOKEN_KEY = 'ep_access_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export class ApiError extends Error {
  constructor(status, message, errors = [], data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
    this.data = data
  }
}

export async function apiFetch(path, { method = 'GET', body, token, ...options } = {}) {
  const headers = { ...(options.headers || {}) }
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  if (body !== undefined && !isFormData) {
    headers['Content-Type'] = 'application/json'
  }
  const authToken = token ?? getToken()
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  let res
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
      credentials: 'include',
    })
  } catch (err) {
    throw new ApiError(0, 'Unable to reach the server. Is the backend running on port 5005?')
  }

  let payload = null
  const text = await res.text()
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = { message: text }
    }
  }

  if (!res.ok) {
    throw new ApiError(
      res.status,
      payload?.message || `Request failed (${res.status})`,
      payload?.errors || [],
      payload,
    )
  }

  if (payload && typeof payload === 'object' && 'success' in payload) {
    return payload.data
  }

  return payload
}

export const api = {
  get: (path, opts) => apiFetch(path, { method: 'GET', ...opts }),
  post: (path, body, opts) => apiFetch(path, { method: 'POST', body, ...opts }),
  put: (path, body, opts) => apiFetch(path, { method: 'PUT', body, ...opts }),
  patch: (path, body, opts) => apiFetch(path, { method: 'PATCH', body, ...opts }),
  delete: (path, opts) => apiFetch(path, { method: 'DELETE', ...opts }),
}

export default api
