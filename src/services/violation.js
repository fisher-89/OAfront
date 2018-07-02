import request from '../utils/request';

/**
 * 被大爱列表
 */
export async function fineList(param) {
  return request('/api/violation/punish/list', {
    method: 'POST',
    body: {
      ...param,
    },
  });
}

/**
 * 大爱详情
 */
export async function fineInfo(param) {
  return request('/api/violation/punish/Info', {
    method: 'GET',
    body: {
      ...param,
    },
  });
}

/**
 * 大爱添加
 */
export async function addFine(param) {
  return request('/api/violation/punish/add', {
    method: 'POST',
    body: {
      ...param,
    },
  });
}


/**
 * 大爱修改
 */
export async function updateFine(param) {
  return request('/api/violation/punish/update', {
    method: 'PUT',
    body: {
      ...param,
    },
  });
}

/**
 * 大爱删除
 */
export async function deleteFine(param) {
  return request('/api/violation/punish/delete', {
    method: 'DELETE',
    body: {
      ...param,
    },
  });
}

/**
 * 大爱统计
 */
export async function countFine(param) {
  return request('/api/violation/punish/count', {
    method: 'POST',
    body: {
      ...param,
    },
  });
}


/**
 * 大爱Excel 导出
 */
export async function exportFine(param) {
  return request('/api/violation/punish/export', {
    method: 'GET',
    body: {
      ...param,
    },
  });
}


/**
 * 大爱Excel 导入
 */
export async function intoFine(param) {
  return request('/api/violation/punish/into', {
    method: 'POST',
    body: {
      ...param,
    },
  });
}

/**
 * 制度列表
 */

export async function regimeList(param) {
  return request('/api/violation/rule/list', {
    method: 'POST',
    body: {
      ...param,
    },
  });
}


/**
 * 制度详情
 */

export async function regimeInfo(param) {
  return request('/api/violation/rule/info', {
    method: 'POST',
    body: {
      ...param,
    },
  });
}

/**
 * 制度添加
 */

export async function addRegime(param) {
  return request('/api/violation/rule/add', {
    method: 'POST',
    body: {
      ...param,
    },
  });
}


/**
 * 制度更新
 */

export async function updateRegime(param) {
  return request('/api/violation/rule/update', {
    method: 'PUT',
    body: {
      ...param,
    },
  });
}

/**
 * 制度删除
 */

export async function deleteRegime(param) {
  return request('/api/violation/rule/delete', {
    method: 'DELETE',
    body: {
      ...param,
    },
  });
}

