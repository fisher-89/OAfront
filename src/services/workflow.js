import request from '../utils/request';

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

export async function flowRunLogExport(params) {
  return request('/api/workflow/flow-run/get-export', {
    method: 'GET',
    body: {
      ...params,
    },
  });
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
  return request(`/api/workflow/field-api-configuration/${id}`, {
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

export async function fetchWorkMsg(params) {
  return request('/api/workflow/job', {
    method: 'GET',
    body: params,
  });
}

