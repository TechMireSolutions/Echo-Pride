import api from '../client.js'

export const settingsService = {
  get: () => api.get('/settings'),
  update: (settings) => api.put('/settings', { settings }),
  updateDeal: (deal) => api.put('/settings/deal', { deal }),
}

export default settingsService
