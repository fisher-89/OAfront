import request from '../utils/request';

export async function fetchApprovers() {
  return request('/api/finance/reimburse/admin/approvers', { method: 'GET' });
}

export async function addApprovers(params) {
  return request('/api/finance/reimburse/admin/approvers', { method: 'POST', body: params });
}

export async function editApprovers(params, id) {
  return request(`/api/finance/reimburse/admin/approvers/${id}`, { method: 'PUT', body: params });
}

export async function deleteApprovers(id) {
  return request(`/api/finance/reimburse/admin/approvers/${id}`, { method: 'DELETE' });
}

export async function fetchReimDepartment() {
  return request('/api/finance/reimburse/admin/funding-brands', { method: 'GET' });
}

export async function addReimDepartment(params) {
  return request('/api/finance/reimburse/admin/funding-brands', { method: 'POST', body: params });
}

export async function editReimDepartment(params, id) {
  return request(`/api/finance/reimburse/admin/funding-brands/${id}`, { method: 'PUT', body: params });
}

export async function deleteReimDepartment(id) {
  return request(`/api/finance/reimburse/admin/funding-brands/${id}`, { method: 'DELETE' });
}
