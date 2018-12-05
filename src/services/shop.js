import request from '../utils/request';

export async function fetchShop(params) {
  return request('/api/hr/shops', {
    method: 'GET',
    body: params,
  });
}

export async function addShop(params) {
  return request('/api/hr/shops', {
    method: 'POST',
    body: params,
  });
}

export async function editShop(params, shopSn) {
  return request(`/api/hr/shops/${shopSn}`, {
    method: 'PATCH',
    body: params,
  });
}

export async function deleteShop(shopSn) {
  return request(`/api/hr/shops/${shopSn}`, {
    method: 'DELETE',
  });
}

export async function positionShop(params) {
  return request('/api/hr/shops/position', {
    method: 'POST',
    body: params,
  });
}
