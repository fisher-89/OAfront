import request from '../utils/request';

export async function fetchBrand(params) {
  return request('/api/brand', {
    method: 'GET',
    body: params,
  });
}

export async function addBrand(params) {
  return request('/api/brand', {
    method: 'POST',
    body: params,
  });
}

export async function editBrand(params, id) {
  return request(`/api/brand/${id}`, {
    method: 'PATCH',
    body: params,
  });
}

export async function deleteBrand(id) {
  return request(`/api/brand/${id}`, {
    method: 'DELETE',
  });
}
