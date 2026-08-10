import api from '../client.js'

export const orderService = {
  place: (payload) => api.post('/orders', payload),
  list: (params = {}) => {
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    )
    const qs = new URLSearchParams(clean).toString()
    return api.get(`/orders${qs ? `?${qs}` : ''}`)
  },
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, orderStatus, note = '') =>
    api.put(`/orders/${id}/status`, { orderStatus, note }),
  remove: (id) => api.delete(`/orders/${id}`),
}

export default orderService
