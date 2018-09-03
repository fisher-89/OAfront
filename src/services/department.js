import request from '../utils/request';

export async function fetchDepart(params) {
  return request('/api/department', {
    method: 'GET',
    body: params,
  });
}

export async function addDepart(params) {
  return request('/api/department', {
    method: 'POST',
    body: params,
  });
}

export async function editDepart(params, id) {
  return request(`/api/department/${id}`, {
    method: 'PATCH',
    body: params,
  });
}

export async function deleteDepart(id) {
  return request(`/api/department/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchTreeDepart(params) {
  return request('/api/department/tree', {
    method: 'GET',
    body: params,
  });
}
