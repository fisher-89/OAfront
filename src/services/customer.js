import request from '../utils/request';

export async function downloadExcelCustomer(params) {
  return request('/api/crm/clients/export', {
    method: 'GET',
    body: params,
    headers: { Accept: '*' },
  });
}

/** 客户来源 */
export async function fetchSource() {
  return request('/api/crm/source', { method: 'GET' });
}

/** 添加客户来源 */
export async function addSource(params) {
  return request('/api/crm/source', { method: 'POST', body: params });
}

/** 编辑客户来源 */
export async function editSource(params, id) {
  return request(`/api/crm/source/${id}`, { method: 'PUT', body: params });
}

/** 删除客户来源 */
export async function deleteSource(id) {
  return request(`/api/crm/source/${id}`, { method: 'DELETE' });
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
export async function deleteCustomer(id) {
  return request(`/api/crm/clients/${id}`, { method: 'DELETE' });
}


// Execel模板导出
export async function downloadExcelTemp() {
  return request('/api/crm/clients/example', {
    method: 'GET',
  });
}

/** 当前员工品牌 */
export async function customerStaffBrandsAuth() {
  return request('/api/crm/clients/brands', { method: 'GET' });
}


/** 标签列表 */
export async function fetchTagsType() {
  return request('/api/crm/tags/types', { method: 'GET' });
}

/** 添加标签 */
export async function addTagsType(params) {
  return request('/api/crm/tags/types', { method: 'POST', body: params });
}

/** 编辑标签 */
export async function editTagsType(params, id) {
  return request(`/api/crm/tags/types/${id}`, { method: 'PUT', body: params });
}

/** 删除标签 */
export async function deleteTagsType(id) {
  return request(`/api/crm/tags/types/${id}`, { method: 'DELETE' });
}


/** 标签列表 */
export async function fetchTags() {
  return request('/api/crm/tags', { method: 'GET' });
}

/** 添加标签 */
export async function addTags(params) {
  return request('/api/crm/tags', { method: 'POST', body: params });
}

/** 编辑标签 */
export async function editTags(params, id) {
  return request(`/api/crm/tags/${id}`, { method: 'PUT', body: params });
}

/** 删除标签 */
export async function deleteTags(id) {
  return request(`/api/crm/tags/${id}`, { method: 'DELETE' });
}


/** 事件列表 */
export async function fetchNotes(params, id) {
  return request(`/api/crm/notes/${id}`, { method: 'GET', body: params });
}

/** 添加事件 */
export async function addNotes(params) {
  return request('/api/crm/notes', { method: 'POST', body: params });
}

/** 编辑事件 */
export async function editNotes(params, id) {
  return request(`/api/crm/notes/${id}`, { method: 'PUT', body: params });
}

/** 删除事件 */
export async function deleteNotes(id) {
  return request(`/api/crm/notes/${id}`, { method: 'DELETE' });
}


/** 事件类型列表 */
export async function fetchNoteTypes() {
  return request('/api/crm/note/type', { method: 'GET' });
}

/** 添加事件类型 */
export async function addNoteTypes(params) {
  return request('/api/crm/note/type', { method: 'POST', body: params });
}

/** 编辑事件类型 */
export async function editNoteTypes(params, id) {
  return request(`/api/crm/note/type/${id}`, { method: 'PUT', body: params });
}

/** 删除事件类型 */
export async function deleteNoteTypes(id) {
  return request(`/api/crm/note/type/${id}`, { method: 'DELETE' });
}

/** 客户事件列表 */
export async function fetchNoteLogs(params) {
  return request('/api/crm/note/logs', { method: 'GET', body: params });
}

/** 客户资料日志列表 */
export async function fetchClientLogs(params) {
  return request('/api/crm/client/logs', { method: 'GET', body: params });
}

/** 客户资料日志还原 */
export async function clientReduction(id) {
  return request(`/api/crm/client/logs/${id}`, { method: 'GET' });
}

/** 客户管理权限列表 */
export async function fetchAuth(params) {
  return request('/api/crm/auth', { method: 'GET', body: params });
}

/** 添加客户管理权限 */
export async function addAuth(params) {
  return request('/api/crm/auth', { method: 'POST', body: params });
}

/** 编辑客户管理权限 */
export async function editAuth(params, id) {
  return request(`/api/crm/auth/${id}`, { method: 'PUT', body: params });
}

/** 删除客户管理权限 */
export async function deleteAuth(id) {
  return request(`/api/crm/auth/${id}`, { method: 'DELETE' });
}

export async function upLoadFile() {
  return request('/api/crm/notes/files');
}
