import request from '../utils/request';

export async function query(param, id) {
  return request(`/api/departments/${id}`, {
    method: 'GET',
    body: {
      ...param,
    },
  });
}
