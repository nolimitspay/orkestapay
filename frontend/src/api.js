import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` :});
  
export const gatewaysApi = {
  getAll: () => api.get('/gateways').then(r => r.data),
  create: (data) => api.post('/gateways', data).then(r => r.data),
  update: (id, data) => api.put(`/gateways/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/gateways/${id}`).then(r => r.data),
};

export const paymentsApi = {
  getAll: (params) => api.get('/payments', { params }).then(r => r.data),
  process: (data) => api.post('/payments', data).then(r => r.data),
  refund: (id) => api.post(`/payments/${id}/refund`).then(r => r.data),
  getKpis: () => api.get('/dashboard/kpis').then(r => r.data),
};

export const subscriptionsApi = {
  getAll: (params) => api.get('/subscriptions', { params }).then(r => r.data),
  create: (data) => api.post('/subscriptions', data).then(r => r.data),
  cancel: (id) => api.delete(`/subscriptions/${id}`).then(r => r.data),
  pause: (id) => api.put(`/subscriptions/${id}/pause`).then(r => r.data),
  resume: (id) => api.put(`/subscriptions/${id}/resume`).then(r => r.data),
};

export const batchApi = {
  fetchCustomers: (data) => api.post('/batch/customers', data).then(r => r.data),
  charge: (data) => api.post('/batch/charge', data).then(r => r.data),
};

export const shopsApi = {
  getAll: () => api.get('/shops').then(r => r.data),
  create: (data) => api.post('/shops', data).then(r => r.data),
  delete: (id) => api.delete(`/shops/${id}`).then(r => r.data),
};

export const webhooksApi = {
  getAll: () => api.get('/webhooks').then(r => r.data),
  create: (data) => api.post('/webhooks', data).then(r => r.data),
  update: (id, data) => api.put(`/webhooks/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/webhooks/${id}`).then(r => r.data),
  getLogs: () => api.get('/webhooks/logs').then(r => r.data),
};

export const pixelsApi = {
  getAll: () => api.get('/pixels').then(r => r.data),
  create: (data) => api.post('/pixels', data).then(r => r.data),
  delete: (id) => api.delete(`/pixels/${id}`).then(r => r.data),
};

export const templatesApi = {
  getAll: () => api.get('/templates').then(r => r.data),
  create: (data) => api.post('/templates', data).then(r => r.data),
  update: (id, data) => api.put(`/templates/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/templates/${id}`).then(r => r.data),
};
