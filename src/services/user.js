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
  return request('/api/hr/staff', {
    method: 'GET',
    body: params,
  });
}


/**
 * 获取单个员工信息.
 * @param  int staffSn
 */
export async function fetchStaffInfo(staffSn) {
  return request(`/api/hr/staff/${staffSn}`, {
    method: 'GET',
  });
}

/**
 * 添加员工.
 * @param object params
 */
export async function addStaff(params) {
  return request('/api/hr/staff', {
    method: 'POST',
    body: params,
  });
}

/**
 * 编辑员工信息.
 * @param object params
 */
export async function editStaff(params, staffSn) {
  return request(`/api/hr/staff/${staffSn}`, {
    method: 'PATCH',
    body: params,
  });
}

/**
 * 删除员工.
 * @param int params
 */
export async function deleteStaff(staffSn) {
  return request(`/api/hr/staff/${staffSn}`, {
    method: 'DELETE',
  });
}

/**
 * 批量导入员工.
 * @param object params
 */
export async function importStaff(params) {
  return request('/api/hr/staff/import', {
    method: 'POST',
    body: params,
  });
}

/**
 * 批量导出员工.
 * @param  object params
 */
export async function exportStaff(params) {
  return request('/api/hr/staff/export', {
    method: 'POST',
    body: params,
  });
}

// 重置密码
export async function resetPassword(staffSn) {
  return request(`/api/hr/staff/${staffSn}/reset`, {
    method: 'POST',
  });
}

// 激活
export async function unlock(staffSn) {
  return request(`/api/hr/staff/${staffSn}/unlock`, {
    method: 'PATCH',
  });
}

// 锁定
export async function locked(staffSn) {
  return request(`/api/hr/staff/${staffSn}/locked`, {
    method: 'PATCH',
  });
}

// 转正
export async function process(params) {
  return request('/api/hr/staff/process', {
    method: 'PATCH',
    body: params,
  });
}

// 人事变动
export async function transfer(params) {
  return request('/api/hr/staff/transfer', {
    method: 'PATCH',
    body: params,
  });
}

// 离职
export async function leave(params) {
  return request('/api/hr/staff/leave', {
    method: 'PATCH',
    body: params,
  });
}

// 离职交接
export async function leaving(params) {
  return request('/api/hr/staff/leaving', {
    method: 'PATCH',
    body: params,
  });
}

// 再入职
export async function againEntry(params) {
  return request('/api/hr/staff/again-entry', {
    method: 'PATCH',
    body: params,
  });
}

// 操作记录
export async function fetchStaffLog(id) {
  return request(`/api/hr/staff/${id}/logs`, { method: 'GET' });
}

// 预约操作
export async function fetchBespokeStaff(id) {
  return request(`/api/hr/staff/${id}/reserve`, { method: 'GET' });
}

// 取消预约操作
export async function deleteBespokeStaff(id) {
  return request(`/api/hr/staff/reserve/${id}`, { method: 'DELETE' });
}
