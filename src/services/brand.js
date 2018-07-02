import request from '../utils/request';

export async function fetchBrand() {
  return request('/api/brands', {
    method: 'GET',
  });
}
