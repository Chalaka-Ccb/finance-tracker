
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('access_token');
}

// Generic function to make API requests with proper headers and error handling.
async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });// Handle non-2xx HTTP responses

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.status === 204 ? null : res.json();
}

// Authentication-related API calls: register, login, logout.
export const authApi = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  logout:   ()     => request('/auth/logout',   { method: 'POST' }),
};

// Transaction-related API calls: get all with optional filters, get by ID, create, update, delete. Filters for getAll can include category_id and type (income or expense).
export const transactionsApi = {
  getAll:    (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/transactions${qs ? `?${qs}` : ''}`);
  },
  getById:  (id)     => request(`/transactions/${id}`),
  create:   (body)   => request('/transactions',     { method: 'POST',   body: JSON.stringify(body) }),
  update:   (id, body) => request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove:   (id)     => request(`/transactions/${id}`, { method: 'DELETE' }),
};

// Budget-related API calls: get all, get progress, create, update, delete.
export const budgetsApi = {
  getAll:       ()       => request('/budgets'),
  getProgress:  ()       => request('/budgets/progress'),
  create:   (body)       => request('/budgets',     { method: 'POST', body: JSON.stringify(body) }),
  update:   (id, body)   => request(`/budgets/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove:   (id)         => request(`/budgets/${id}`, { method: 'DELETE' }),
};

// Category-related API calls: get all, create, delete.
export const categoriesApi = {
  getAll: () => request('/categories'),
  create: (body) => request('/categories', { method: 'POST', body: JSON.stringify(body) }),
  remove: (id)   => request(`/categories/${id}`, { method: 'DELETE' }),
};