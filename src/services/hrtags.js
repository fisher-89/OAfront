import request from '../utils/request';

export async function fetchStaffTags() {
  return request('/api/hr/tags', { method: 'GET' });
}

export async function addStaffTags(params) {
  return request('/api/hr/tags', { method: 'POST', body: params });
}

export async function editStaffTags(params, id) {
  return request(`/api/hr/tags/${id}`, { method: 'PATCH', body: params });
}

export async function deleteStaffTags(id) {
  return request(`/api/hr/tags/${id}`, { method: 'DELETE' });
}

export async function fetchStaffTagCategories() {
  return request('/api/hr/tags/categories', { method: 'GET' });
}

export async function addStaffTagCategories(params) {
  return request('/api/hr/tags/categories', { method: 'POST', body: params });
}

export async function editStaffTagCategories(params, id) {
  return request(`/api/hr/tags/categories/${id}`, { method: 'PATCH', body: params });
}

export async function deleteStaffTagCategories(id) {
  return request(`/api/hr/tags/categories/${id}`, { method: 'DELETE' });
}
