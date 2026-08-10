import api, { apiFetch } from '../client.js'

export const productService = {
  list: (params = {}) => {
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    )
    const qs = new URLSearchParams(clean).toString()
    return api.get(`/products${qs ? `?${qs}` : ''}`)
  },
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getCategory: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
  uploadSingle: (file) => {
    const fd = new FormData()
    fd.append('image', file)
    return apiFetch('/products/upload/single', { method: 'POST', body: fd })
  },
}

export default productService
