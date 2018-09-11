import request from '../utils/request';

export async function fetchShop(params) {
  return request('/api/shop', {
    method: 'GET',
    body: params,
  });
}

export async function addShop(params) {
  return request('/api/shop', {
    method: 'POST',
    body: params,
  });
}

export async function editShop(params, id) {
  return request(`/api/shop/${id}`, {
    method: 'PATCH',
    body: params,
  });
}

export async function deleteShop(id) {
  return request(`/api/shop/${id}`, {
    method: 'DELETE',
  });
}

export async function positionShop(params) {
  return request('/api/shop/position', {
    method: 'POST',
    body: params,
  });
}
