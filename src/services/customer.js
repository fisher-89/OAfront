import request from '../utils/request';

/** 客户来源 */
export async function fetchSource() {
  return request('/api/crm/source', { method: 'GET' });
}

/** 客户列表 */
export async function fetchCustomer(params, id) {
  return request(`/api/crm/clients/${id}`, { method: 'GET', body: params });
}

/** 添加客户资料 */
export async function addCustomer(params) {
  return request('/api/crm/clients', { method: 'POST', body: params });
}

/** 编辑客户资料 */
export async function editCustomer(params, id) {
  return request(`/api/crm/clients/${id}`, { method: 'PUT', body: params });
}


/** 删除客户资料 */
export async function deleteCustomer(params, id) {
  return request(`/api/crm/clients/${id}`, { method: 'DELETE', body: params });
}


/** 标签列表 */
export async function fetchTagsType() {
  return request('/api/crm/tags/types', { method: 'GET' });
}

/** 添加标签资料 */
export async function addTagsType(params) {
  return request('/api/crm/tags/types', { method: 'POST', body: params });
}

/** 编辑标签资料 */
export async function editTagsType(params, id) {
  return request(`/api/crm/tags/types/${id}`, { method: 'PUT', body: params });
}

/** 删除标签资料 */
export async function deleteTagsType(params, id) {
  return request(`/api/crm/tags/types/${id}`, { method: 'DELETE', body: params });
}


/** 标签列表 */
export async function fetchTags() {
  return request('/api/crm/tags', { method: 'GET' });
}

/** 添加标签资料 */
export async function addTags(params) {
  return request('/api/crm/tags', { method: 'POST', body: params });
}

/** 编辑标签资料 */
export async function editTags(params, id) {
  return request(`/api/crm/tags/${id}`, { method: 'PUT', body: params });
}

/** 删除标签资料 */
export async function deleteTags(params, id) {
  return request(`/api/crm/tags/${id}`, { method: 'DELETE', body: params });
}
