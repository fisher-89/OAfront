import request from '../utils/request';

/** 客户来源 */
export async function fetchSource() {
  return request('/api/crm/source', {
    method: 'GET',
  });
}
