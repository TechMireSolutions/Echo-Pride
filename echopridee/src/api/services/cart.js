import api from '../client.js'

export const cartService = {
  get: () => api.get('/cart'),
  add: (productId, quantity = 1) => api.post('/cart/items', { productId, quantity }),
  update: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete('/cart'),
}

export default cartService
