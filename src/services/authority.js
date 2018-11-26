import request from '../utils/request';

export async function fetchAuth(params) {
  return request('/api/hr/authorities', {
    method: 'GET',
    body: params,
  });
}

export async function addAuth(params) {
  return request('/api/hr/authorities', {
    method: 'POST',
    body: params,
  });
}

export async function editAuth(params, id) {
  return request(`/api/hr/authorities/${id}`, {
    method: 'PATCH',
    body: params,
  });
}

export async function deleteAuth(id) {
  return request(`/api/hr/authorities/${id}`, {
    method: 'DELETE',
  });
}
