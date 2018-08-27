import request from '../utils/request';

export async function fetchNation() {
  return request('/api/crm/nation', {
    method: 'GET',
  });
}
