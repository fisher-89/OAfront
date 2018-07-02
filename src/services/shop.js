import request from '../utils/request';

export async function fetchShop(params) {
  return request('/api/table/shop/', {
    method: 'POST',
    body: params,
  });
}
