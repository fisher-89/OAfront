import request from '../utils/request';
import upload from '../utils/upload';

/* flow */
export async function fetchFlow(params, id) {
  return request(`/api/workflow/flow/${id}`, {
    method: 'GET',
  });
}

export async function addFlow(params) {
  return request('/api/workflow/flow/', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editFlow(params, id) {
  return request(`/api/workflow/flow/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteFlow(id) {
  return request(`/api/workflow/flow/${id}`, {
    method: 'DELETE',
  });
}

export async function flowRunLog(params) {
  return request('/api/workflow/flow-run', {
    method: 'GET',
    body: {
      ...params,
    },
  });
}

export async function flowRunFormVersion(number) {
  return request(`/api/workflow/flow-run/form/flow/${number}`, { method: 'GET' });
}

export async function formVersion(number) {
  return request(`/api/workflow/flow-run/form/${number}`, { method: 'GET' });
}

export async function startFlowRunLogExport(params) {
  return request('/api/workflow/flow-run/export/start', {
    method: 'GET',
    body: {
      ...params,
    },
  });
}

export function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

export async function checkFlowRunLogExport(code) {
  return request('/api/workflow/flow-run/export/get', {
    method: 'GET',
    body: { code },
  });
}

export async function flowClone(id) {
  return request('/api/workflow/flow-clone', {
    method: 'POST',
    body: { flow_id: id },
  });
}

export async function uploadIcon(params) {
  return upload('/api/workflow/flow-icon', { body: params });
}


/** flowType */

export async function fetchFlowType(params) {
  return request('/api/workflow/flow-type', {
    method: 'GET',
    body: {
      ...params,
    },
  });
}

export async function addFlowType(params) {
  return request('/api/workflow/flow-type', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editFlowType(params, id) {
  return request(`/api/workflow/flow-type/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteFlowType(id) {
  return request(`/api/workflow/flow-type/${id}`, {
    method: 'DELETE',
  });
}


/* form */
export async function fetchOldForm(id) {
  return request(`/api/workflow/form-old/${id}`, {
    method: 'GET',
  });
}

export async function fetchForm(params, id) {
  return request(`/api/workflow/form/${id}`, {
    method: 'GET',
    body: {
      ...params,
    },
  });
}

export async function addForm(params) {
  return request('/api/workflow/form', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editForm(params, id) {
  return request(`/api/workflow/form/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteForm(id) {
  return request(`/api/workflow/form/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchVariate() {
  return request('/api/workflow/variate-calculation', {
    method: 'GET',
  });
}

/* formType */

export async function fetchFormType(params) {
  return request('/api/workflow/form-type', {
    method: 'GET',
    body: {
      ...params,
    },
  });
}

export async function addFormType(params) {
  return request('/api/workflow/form-type', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editFormType(params, id) {
  return request(`/api/workflow/form-type/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteFormType(id) {
  return request(`/api/workflow/form-type/${id}`, {
    method: 'DELETE',
  });
}

/* validator */

export async function fetchValidator(params) {
  return request('/api/workflow/validator', {
    method: 'GET',
    body: {
      ...params,
    },
  });
}

export async function addValidator(params) {
  return request('/api/workflow/validator', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editValidator(params, id) {
  return request(`/api/workflow/validator/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteValidator(id) {
  return request(`/api/workflow/validator/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchApiConfig() {
  return request('/api/workflow/field-api-configuration', {
    method: 'GET',
  });
}

export async function addApiConfig(params) {
  return request('/api/workflow/field-api-configuration', {
    method: 'POST',
    body: params,
  });
}


export async function editApiConfig(params, id) {
  let url = `/api/workflow/field-api-configuration/${id}`;
  if (params.confirm) url += '?confirm=1';
  return request(url, {
    method: 'PUT',
    body: params,
  });
}

export async function deleteApiConfig(id) {
  return request(`/api/workflow/field-api-configuration/${id}`, {
    method: 'DELETE',
  });
}


export async function testApiConfig(params) {
  return request('/api/workflow/check-oa-api', {
    method: 'POST',
    body: params,
  });
}


export async function getApiConfig(id) {
  return request(`/api/workflow/get-oa-api/${id}`, {
    method: 'GET',
  });
}


export async function fetchApprover(id) {
  return request(`/api/workflow/step-approver/${id}`, {
    method: 'GET',
  });
}

export async function addApprover(params) {
  return request('/api/workflow/step-approver', {
    method: 'POST',
    body: params,
  });
}

export async function editApprover(params, id) {
  return request(`/api/workflow/step-approver/${id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function deleteApprover(id) {
  return request(`/api/workflow/step-approver/${id}`, {
    method: 'DELETE',
  });
}


export async function fetchStepDepartment(params, id) {
  return request(`/api/workflow/step-department-approver/${id}`, {
    method: 'GET',
    body: params,
  });
}

export async function addStepDepartment(params) {
  return request('/api/workflow/step-department-approver', {
    method: 'POST',
    body: params,
  });
}

export async function editStepDepartment(params, id) {
  return request(`/api/workflow/step-department-approver/${id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function deleteStepDepartment(id) {
  return request(`/api/workflow/step-department-approver/${id}`, {
    method: 'DELETE',
  });
}


export async function fetchWaitMsg(params) {
  return request('/api/workflow/todo', {
    method: 'GET',
    body: params,
  });
}

export async function resendWaitMsg(id) {
  return request(`/api/workflow/todo/${id}`, {
    method: 'PATCH',
  });
}

export async function fetchWorkMsg(params) {
  return request('/api/workflow/job', {
    method: 'GET',
    body: params,
  });
}

export async function resendWorkMsg(id) {
  return request(`/api/workflow/job/${id}`, {
    method: 'PATCH',
  });
}

// 权限start

// 列表
export async function authIndex() {
  return request('/api/workflow/auth/role', {
    method: 'GET',
  });
}

// 删除
export async function authDelete(id) {
  return request(`/api/workflow/auth/role/${id}`, {
    method: 'DELETE',
  });
}

// 获取流程列表（不带权限）
export async function getFlowList(params) {
  return request('/api/workflow/flow-list', {
    method: 'GET',
    body: params,
  });
}

// 获取流程列表（不带权限）
export async function getFormList(params) {
  return request('/api/workflow/form-list', {
    method: 'GET',
    body: params,
  });
}

// 新增保存
export async function authStore(params) {
  return request('/api/workflow/auth/role', {
    method: 'POST',
    body: params,
  });
}

// 编辑 保存
export async function authUpdate(params, id) {
  return request(`/api/workflow/auth/role/${id}`, {
    method: 'PUT',
    body: params,
  });
}

// 获取超级管理员
export async function getSuper() {
  return request('/api/workflow/auth/super', {
    method: 'GET',
  });
}

// 权限end

