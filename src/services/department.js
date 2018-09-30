import request from '../utils/request';

export async function fetchDepartment(params) {
  return request('/api/department', {
    method: 'GET',
    body: params,
  });
}

export async function addDepartment(params) {
  return request('/api/department', {
    method: 'POST',
    body: params,
  });
}

export async function editDepartment(params, id) {
  return request(`/api/department/${id}`, {
    method: 'PATCH',
    body: params,
  });
}

export async function deleteDepartment(id) {
  return request(`/api/department/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchTreeDepart(params) {
  return request('/api/department/tree', {
    method: 'GET',
    body: params,
  });
}

export async function sortDepartment(params) {
  return request('/api/department/sort', {
    method: 'PATCH',
    body: params,
  });
}
