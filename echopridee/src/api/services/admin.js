import api, { apiFetch } from '../client.js'

export const adminService = {
  /* ------------------------- Categories ------------------------- */
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  /* ---------------------------- Media --------------------------- */
  listMedia: (params = {}) => {
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    )
    const qs = new URLSearchParams(clean).toString()
    return api.get(`/media${qs ? `?${qs}` : ''}`)
  },
  uploadMedia: (file, { title, productId } = {}) => {
    const fd = new FormData()
    fd.append('file', file)
    if (title) fd.append('title', title)
    if (productId) fd.append('productId', String(productId))
    return apiFetch('/media/upload', { method: 'POST', body: fd })
  },
  linkMedia: (data) => api.post('/media/link', data),
  linkMediaToProduct: (id, productId) => api.post(`/media/${id}/link`, { productId }),
  deleteMedia: (id) => api.delete(`/media/${id}`),

  /* ------------------------- Notifications ---------------------- */
  listNotifications: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')),
    ).toString()
    return api.get(`/notifications${qs ? `?${qs}` : ''}`)
  },
  unreadNotificationsCount: () => api.get('/notifications/unread-count'),
  markNotificationsRead: (ids) => api.post('/notifications/read', { ids }),
  markAllNotificationsRead: () => api.post('/notifications/read-all'),

  /* ------------------------- Wholesale quote -------------------- */
  wholesaleQuote: (productId, quantity) =>
    api.get(`/products/${productId}/wholesale?qty=${encodeURIComponent(quantity)}`),

  /* ------------------------- Admin stats & lists -------------------- */
  stats: () => api.get('/admin/stats'),
  listCustomers: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')),
    ).toString()
    return api.get(`/admin/customers${qs ? `?${qs}` : ''}`)
  },
  listInquiries: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')),
    ).toString()
    return api.get(`/admin/inquiries${qs ? `?${qs}` : ''}`)
  },
  listSurveys: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')),
    ).toString()
    return api.get(`/admin/surveys${qs ? `?${qs}` : ''}`)
  },
}

export default adminService
