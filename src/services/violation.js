import request from '../utils/request';

export async function fetchFineLog(params) {
  return request('/api/violation/punish', { method: 'GET', body: params });
}

export async function fetchFineMoney(params) {
  return request('/api/violation/punish/money', { method: 'POST', body: params });
}

export async function fetchFineScore(params) {
  return request('/api/violation/punish/score', { method: 'POST', body: params });
}

export async function downloadExcelFinLog(params) {
  return request('/api/violation/punish/export', {
    method: 'GET',
    body: params,
    headers: { Accept: '*' },
  });
}

export async function addFineLog(params) {
  return request('/api/violation/punish', { method: 'POST', body: params });
}

/** 付款状态修改 */
export async function paymentChange(id, params) {
  return request(`/api/violation/punish/both-pay/${id}`, { method: 'GET', body: params });
}

/**
 * 大爱修改
 */
export async function editFineLog(params, id) {
  return request(`/api/violation/punish/${id}`, { method: 'PUT', body: params });
}

export async function editPayState(params) {
  return request('/api/violation/punish/pay', { method: 'POST', body: params });
}

/**
 * 大爱删除
 */
export async function deleteFineLog(id) {
  return request(`/api/violation/punish/${id}`, { method: 'DELETE' });
}


/*  大爱制度 */
export async function fetchRuleType() {
  return request('/api/violation/rule-type', { method: 'GET' });
}

export async function addRuleType(params) {
  return request('/api/violation/rule-type', { method: 'POST', body: params });
}

export async function editRuleType(params, id) {
  return request(`/api/violation/rule-type/${id}`, { method: 'PUT', body: params });
}

export async function deleteRuleType(id) {
  return request(`/api/violation/rule-type/${id}`, { method: 'DELETE' });
}


export async function fetchRule() {
  return request('/api/violation/rule', { method: 'GET' });
}

export async function addRule(params) {
  return request('/api/violation/rule', { method: 'POST', body: params });
}

export async function editRule(params, id) {
  return request(`/api/violation/rule/${id}`, { method: 'PUT', body: params });
}

export async function deleteRule(id) {
  return request(`/api/violation/rule/${id}`, { method: 'DELETE' });
}

export async function fetchMath() {
  return request('/api/violation/rule/math', { method: 'GET' });
}

export async function fetchOperator() {
  return request('/api/violation/rule/operator', { method: 'GET' });
}

/* 员工详情 */

export async function fetchStaffViolation(params) {
  return request('/api/violation/count-staff', { method: 'GET', body: params });
}

export async function editStaffPayment(params) {
  return request('/api/violation/count-staff', { method: 'POST', body: params });
}

export async function downloadDepartmentExcel(params) {
  return request('/api/violation/count-excel', {
    method: 'GET',
    body: params,
    headers: { Accept: '*' },
  });
}

export async function downloadStaffExcel(params) {
  return request('/api/violation/count-staff-excel', {
    method: 'GET',
    body: params,
    headers: { Accept: '*' },
  });
}

// 大爱推送
export async function fetchPushAuth(params) {
  return request('/api/violation/pushing-auth', { method: 'GET', body: params });
}

export async function addPushAuth(params) {
  return request('/api/violation/pushing-auth', { method: 'POST', body: params });
}

export async function editPushAuth(params, id) {
  return request(`/api/violation/pushing-auth/${id}`, { method: 'PUT', body: params });
}

export async function deletePushAuth(id) {
  return request(`/api/violation/pushing-auth/${id}`, { method: 'DELETE' });
}

// 获取当前用户可推送群
export async function fetchPushQun() {
  return request('/api/violation/push/auth', { method: 'GET' });
}

// 修改当前用户默认推送群
export async function editPushQun(params) {
  return request('/api/violation/push', { method: 'POST', body: params });
}

// 补充推送
export async function selfLogPush(params) {
  return request('/api/violation/push/image', { method: 'POST', body: params });
}
