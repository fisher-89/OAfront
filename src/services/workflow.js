import request from '../utils/request';

/* flow */
export async function fetchFlow(params, id) {
  return request(`/api/workflow/flow/${id}`, {
    method: 'GET',
    body: {
      ...params,
    },
  });
}

export async function addFlow(params) {
  return request('/api/workflow/flow', {
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

