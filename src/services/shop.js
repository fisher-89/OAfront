import request from '../utils/request';

export async function fetchShop(params) {
  return request('/api/shops', {
    method: 'POST',
    body: params,
  });
}
