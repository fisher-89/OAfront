import request from '../utils/request';

export async function fetchExpense() {
  return request('/api/hr/cost_brands', { method: 'GET' });
}

export async function addExpense(params) {
  return request('/api/hr/cost_brands', { method: 'POST', body: params });
}

export async function editExpense(params, id) {
  return request(`/api/hr/cost_brands/${id}`, { method: 'PATCH', body: params });
}

export async function deleteExpense(id) {
  return request(`/api/hr/cost_brands/${id}`, { method: 'DELETE' });
}
