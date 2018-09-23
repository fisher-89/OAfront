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


/**
 * 批量获取员工.
 * @param  object params
 */
export async function fetchStaff(params) {
  return request('/api/staff', {
    method: 'GET',
    body: params,
  });
}


/**
 * 获取单个员工信息.
 * @param  int staffSn
 */
export async function fetchStaffInfo(staffSn) {
  return request(`/api/staff/${staffSn}`, {
    method: 'GET',
  });
}

/**
 * 添加员工.
 * @param object params
 */
export async function addStaff(params) {
  return request('/api/staff', {
    method: 'POST',
    body: params,
  });
}

/**
 * 编辑员工信息.
 * @param object params
 */
export async function editStaff(params, staffSn) {
  return request(`/api/staff/${staffSn}`, {
    method: 'PATCH',
    body: params,
  });
}

/**
 * 删除员工.
 * @param int params
 */
export async function deleteStaff(staffSn) {
  return request(`/api/hr/staff_delete/${staffSn}`, {
    method: 'DELETE',
  });
}

/**
 * 批量导入员工.
 * @param object params
 */
export async function importStaff(params) {
  return request('/api/staff/import', {
    method: 'POST',
    body: params,
  });
}

/**
 * 批量导出员工.
 * @param  object params
 */
export async function exportStaff(params) {
  return request('/api/staff/export', {
    method: 'POST',
    body: params,
  });
}
