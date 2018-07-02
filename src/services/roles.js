import request from '../utils/request';

export async function query(param, id) {
  return request(`/api/roles/${id}`, {
    method: 'GET',
    body: {
      ...param,
    },
  });
}
