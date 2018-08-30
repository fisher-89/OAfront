import request from '../utils/request';

export async function loginByTelephone(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  const response = request('/api/current-user');
  return response;
}

export async function fetchStaff(params) {
  return request('/api/staff', {
    method: 'GET',
    body: { ...params },
  });
}

export async function fetchStaffInfo(staffSn) {
  return request(`/api/staff/${staffSn}`, {
    method: 'GET',
  });
}

/**
 * 编辑员工信息.
 * @param object params
 */
export async function editStaff(params) {
  return request('/api/hr/staff_update', {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 删除员工.
 * @param int params
 */
export async function deleteStaff(id) {
  return request(`/api/hr/staff_delete/${id}`, {
    method: 'DELETE',
  });
}
