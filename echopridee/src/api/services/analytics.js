import api from '../client.js'

export const analyticsService = {
  overview: (period) => api.get(`/analytics/overview?period=${encodeURIComponent(period)}`),
  chart: (period, metric) =>
    api.get(`/analytics/chart?period=${encodeURIComponent(period)}&metric=${encodeURIComponent(metric)}`),
  traffic: (period) => api.get(`/analytics/traffic?period=${encodeURIComponent(period)}`),
  advisor: () => api.get('/analytics/advisor'),
}

export default analyticsService
