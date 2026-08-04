// frontend/src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(localStorage.getItem('token') && { Authorization: `Bearer ${localStorage.getItem('token')}` })
});

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, { headers: getHeaders(), ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
};

export const jobAPI = {
  getAll: (params = '') => request(`/jobs?${params}`),
  search: (params) => request(`/jobs/search?${params}`),
  getById: (id) => request(`/jobs/${id}`),
  create: (body) => request('/jobs', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/jobs/${id}`, { method: 'DELETE' }),
  save: (id) => request(`/jobs/${id}/save`, { method: 'POST' }),
  getSaved: () => request('/jobs/saved/all'),
};

export const applicationAPI = {
  apply: (jobId, body) => request(`/applications/${jobId}/apply`, { method: 'POST', body: JSON.stringify(body) }),
  getMine: () => request('/applications/my'),
  getForJob: (jobId) => request(`/applications/job/${jobId}`),
  updateStatus: (id, status) => request(`/applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  withdraw: (id) => request(`/applications/${id}`, { method: 'DELETE' }),
};

export const userAPI = {
  getProfile: () => request('/users/profile'),
  updateProfile: (body) => request('/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
  getDashboard: () => request('/users/dashboard'),
};

export const companyAPI = {
  getAll: () => request('/companies'),
  getById: (id) => request(`/companies/${id}`),
  create: (body) => request('/companies', { method: 'POST', body: JSON.stringify(body) }),
};
