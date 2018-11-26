import request from '../utils/request';

export async function fetchBrand(params) {
  return request('/api/hr/brands', {
    method: 'GET',
    body: params,
  });
}

export async function addBrand(params) {
  return request('/api/hr/brands', {
    method: 'POST',
    body: params,
  });
}

export async function editBrand(params, id) {
  return request(`/api/hr/brands/${id}`, {
    method: 'PATCH',
    body: params,
  });
}

export async function deleteBrand(id) {
  return request(`/api/hr/brands/${id}`, {
    method: 'DELETE',
  });
}
