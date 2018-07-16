import request from '../utils/request';

export async function fetchEvent(params) {
  return request('/api/pms/events', {
    method: 'GET',
    body: params,
  });
}

export async function addEvent(params) {
  return request('/api/pms/events', {
    method: 'POST',
    body: params,
  });
}

export async function editEvent(params, id) {
  return request(`/api/pms/events/${id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function deleteEvent(id) {
  return request(`/api/pms/events/${id}`, {
    method: 'DELETE',
  });
}

export async function importEvent() {
  return request('/api/pms/events/import', {
    method: 'POST',
  });
}

export async function exportEvent(params) {
  return request('/api/pms/events/export', {
    method: 'GET',
    body: params,
  });
}

/** 事件类型 */
export async function fetchType() {
  return request('/api/pms/events/types', {
    method: 'GET',
  });
}

export async function addType(params) {
  return request('/api/pms/events/types', {
    method: 'POST',
    body: params,
  });
}

export async function editType(params, id) {
  return request(`/api/pms/events/types/${id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function deleteType(id) {
  return request(`/api/pms/events/types/${id}`, {
    method: 'DELETE',
  });
}

export async function sorterType(params) {
  return request('/api/pms/events/types', {
    method: 'PATCH',
    body: params,
  });
}

/* 事件日志 */
export async function fetchEventLog(params) {
  return request('/api/pms/event-logs', {
    method: 'GET',
    body: params,
  });
}

export async function revokeEventLog(params, id) {
  return request(`/api/pms/event-logs/${id}/revoke`, {
    method: 'POST',
    body: params,
  });
}

/** permissions 权限分组 */


export async function fetchAuth(params, id) {
  return request(`/api/pms/auth/groups/${id}`, {
    method: 'GET',
    body: params,
  });
}

export async function addAuth(params) {
  return request('/api/pms/auth/groups', {
    method: 'POST',
    body: params,
  });
}

export async function editAuth(params, id) {
  return request(`/api/pms/auth/groups/${id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function deleteAuth(id) {
  return request(`/api/pms/auth/groups/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 任务分配权限
 */
export async function fetchTaskAuth(params) {
  return request('/api/pms/task/authority', {
    method: 'GET',
    body: params,
  });
}

export async function addTaskAuth(params) {
  return request('/api/pms/task/authority', {
    method: 'POST',
    body: params,
  });
}

export async function editTaskAuth(params) {
  return request('/api/pms/task/authority', {
    method: 'PUT',
    body: params,
  });
}

export async function deleteTaskAuth(id) {
  return request(`/api/pms/task/authority/${id}`, {
    method: 'DELETE',
  });
}


/** 终审人 */
export async function fetchFinal(params, id) {
  return request(`/api/pms/finals/${id}`, {
    method: 'GET',
    body: params,
  });
}

export async function addFinal(params) {
  return request('/api/pms/finals', {
    method: 'POST',
    body: params,
  });
}

export async function editFinal(params, id) {
  return request(`/api/pms/finals/${id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function deleteFinal(id) {
  return request(`/api/pms/finals/${id}`, {
    method: 'DELETE',
  });
}


/**
 * 积分变动列表
 * @param {filters} params
 */
export async function fetchPointLog(params) {
  return request('/api/pms/point-log', {
    method: 'GET',
    body: params,
  });
}

/**
 * 任务执行日志列表
 * @param {filters} params
 */
export async function fetchCommadnLog(params) {
  return request('/api/admin/commadn-logs', {
    method: 'GET',
    body: params,
  });
}


/**  base-points 固定积分配置 * */

export async function fetchBase(params) {
  return request('/api/admin/base-points/setting', {
    method: 'GET',
    body: params,
  });
}

export async function editBase(params) {
  return request('/api/admin/base-points/setting', {
    method: 'PATCH',
    body: params,
  });
}

export async function editBaseForm(params) {
  return request('/api/admin/base-points/setting', {
    method: 'POST',
    body: params,
  });
}


/**
 * 固定分配置，----证书配置
 * @param {参数} params
 * @param {详情id} id
 */
export async function fetchCertificate(params, id) {
  return request(`/api/admin/certificates/${id}`, {
    method: 'GET',
    body: params,
  });
}

export async function addCertificate(params) {
  return request('/api/admin/certificates', {
    method: 'POST',
    body: params,
  });
}

export async function editCertificate(params, id) {
  return request(`/api/admin/certificates/${id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function deleteCertificate(id) {
  return request(`/api/admin/certificates/${id}`, {
    method: 'DELETE',
  });
}


/**
 * 全部证书分配信息
 */
export async function fetchCertificateStaff(params) {
  return request('/api/admin/certificate-staff', {
    method: 'GET',
    body: params,
  });
}


/**
 * 批量配置员工和证书
 * @param {员工和证书id} param
 */
export async function addCertificateAward(param) {
  return request('/api/admin/certificate-staff/batch/add', {
    method: 'PUT',
    body: param,
  });
}

export async function deleteCertificateStaff(param) {
  return request('/api/admin/certificate-staff/batch/delete', {
    method: 'POST',
    body: param,
  });
}


/**
 * 学历接口
 * （张博涵）
 *  */

export async function fetchEducation() {
  return request('/api/educations', {
    method: 'GET',
  });
}

/**
 * 奖扣指标列表 || 详情
 */
export async function fetchTargets(id) {
  return request(`/api/pms/targets/${id}`, {
    method: 'GET',
  });
}

export async function addTargets(params) {
  return request('/api/pms/targets', {
    method: 'POST',
    body: params,
  });
}

export async function editTargets(params, id) {
  return request(`/api/pms/targets/${id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function deleteTargets(id) {
  return request(`/api/pms/targets/${id}`, {
    method: 'DELETE',
  });
}

export async function editTargetsStaff(id) {
  return request(`/api/pms/targets/${id}/staff`, {
    method: 'PUT',
  });
}
