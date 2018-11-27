import request from '../utils/request';

export async function fetchFineLog(params) {
  return request('/api/violation/punish', { method: 'GET', body: params });
}

export async function downloadExcelTemp() {
  return request('/api/violation/punish/example', { method: 'GET' });
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
