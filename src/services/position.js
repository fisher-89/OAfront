import request from '../utils/request';

export async function fetchPosition(params) {
  return request('/api/position', {
    method: 'GET',
    body: params,
  });
}

export async function addPosition(params) {
  return request('/api/position', {
    method: 'POST',
    body: params,
  });
}

export async function editPosition(params, id) {
  return request(`/api/position/${id}`, {
    method: 'PATCH',
    body: params,
  });
}

export async function deletePosition(id) {
  return request(`/api/position/${id}`, {
    method: 'DELETE',
  });
}
