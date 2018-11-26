import request from '../utils/request';

export async function fetchDepartment(params) {
  return request('/api/hr/departments', {
    method: 'GET',
    body: params,
  });
}

export async function addDepartment(params) {
  return request('/api/hr/departments', {
    method: 'POST',
    body: params,
  });
}

export async function editDepartment(params, id) {
  return request(`/api/hr/departments/${id}`, {
    method: 'PATCH',
    body: params,
  });
}

export async function deleteDepartment(id) {
  return request(`/api/hr/departments/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchTreeDepart(params) {
  return request('/api/hr/departments/tree', {
    method: 'GET',
    body: params,
  });
}

export async function sortDepartment(params) {
  return request('/api/hr/departments/sort', {
    method: 'PATCH',
    body: params,
  });
}
