import request from '../utils/request';

export async function query(params) {
  return request('/api/hr/hr_roles', {
    method: 'GET',
    body: params,
  });
}

export async function addRole(params) {
  return request('/api/hr/hr_roles', {
    method: 'POST',
    body: params,
  });
}

export async function editRole(params, id) {
  return request(`/api/hr/hr_roles/${id}`, {
    method: 'PATCH',
    body: params,
  });
}

export async function deleteRole(id) {
  return request(`/api/hr/hr_roles/${id}`, {
    method: 'DELETE',
  });
}
