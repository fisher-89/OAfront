import request from '../utils/request';

export async function fetchPosition() {
  return request('/api/positions', {
    method: 'GET',
  });
}
