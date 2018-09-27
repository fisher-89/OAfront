import request from '../utils/request';

/**
 * 获取报销待审列表
 *
 * @param params
 * @returns {Promise.<Object>}
 */
export async function fetchProcessingReimbursements(params) {
  return request('/api/finance/reimburse/audit', {
    method: 'GET',
    body: {
      ...params,
      type: 'processing',
    },
  });
}

/**
 * 获取报销下期待审列表
 *
 * @param params
 * @returns {Promise.<Object>}
 */
export async function fetchOvertimeReimbursements(params) {
  return request('/api/finance/reimburse/audit', {
    method: 'GET',
    body: {
      ...params,
      type: 'overtime',
    },
  });
}

/**
 * 获取报销已通过列表
 *
 * @param params
 * @returns {Promise.<Object>}
 */
export async function fetchApprovedReimbursements(params) {
  return request('/api/finance/reimburse/audit', {
    method: 'GET',
    body: {
      ...params,
      type: 'audited',
    },
  });
}

export async function fetchAllApprovedReimbursements(params) {
  return request('/api/finance/reimburse/audited', {
    method: 'GET',
    body: {
      ...params,
    },
  });
}

/**
 * 获取已通过报销单导出数据
 *
 * @param params
 * @returns {Promise.<Object>}
 */
export async function fetchExportApprovedReimbursements(params) {
  return request('/api/finance/reimburse/export-audit', {
    method: 'GET',
    body: {
      ...params,
      type: 'audited',
    },
  });
}

/**
 * 获取已通过报销单导出数据
 *
 * @param params
 * @returns {Promise.<Object>}
 */
export async function exportAllApprovedReimbursements(params) {
  return request('/api/finance/reimburse/audited/export', {
    method: 'GET',
    body: {
      ...params,
    },
  });
}

/**
 * 获取报销已驳回列表
 *
 * @param params
 * @returns {Promise.<Object>}
 */
export async function fetchRejectedReimbursements(params) {
  return request('/api/finance/reimburse/audit', {
    method: 'GET',
    body: {
      ...params,
      type: 'rejected',
    },
  });
}

/**
 * 获取报销批量送审列表
 *
 * @param params
 * @returns {Promise.<Object>}
 */
export async function fetchPackageReimbursements(params) {
  return request('/api/finance/reimburse/deliver', {
    method: 'GET',
    body: {
      ...params,
    },
  });
}

export async function fetchUnpaidReimbursements(params) {
  return request('/api/finance/reimburse/pay', {
    method: 'GET',
    body: {
      ...params,
      type: 'not_paid',
    },
  });
}

export async function fetchPaidReimbursements(params) {
  return request('/api/finance/reimburse/pay', {
    method: 'GET',
    body: {
      ...params,
      type: 'paid',
    },
  });
}

export async function fetchExportPaidReimbursements(params) {
  return request('/api/finance/reimburse/export-pay', {
    method: 'GET',
    body: {
      ...params,
      type: 'paid',
    },
  });
}

export async function fetchUnpaidPublicReimbursements(params) {
  return request('/api/finance/reimburse/public', {
    method: 'GET',
    body: {
      ...params,
      type: 'not_paid',
    },
  });
}

export async function fetchPaidPublicReimbursements(params) {
  return request('/api/finance/reimburse/public', {
    method: 'GET',
    body: {
      ...params,
      type: 'paid',
    },
  });
}

export async function fetchExportPaidPublicReimbursements(params) {
  return request('/api/finance/reimburse/public/export', {
    method: 'GET',
    body: {
      ...params,
      type: 'paid',
    },
  });
}

export async function approveByAccountant(params) {
  return request('/api/finance/reimburse/agree', {
    method: 'PATCH',
    body: {
      ...params,
    },
  });
}

export async function rejectByAccountant(params) {
  return request('/api/finance/reimburse/reject', {
    method: 'PATCH',
    body: {
      ...params,
    },
  });
}

export async function sendReimbursementPackages(params) {
  return request('/api/finance/reimburse/deliver', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function withdrawReimbuserment(params) {
  return request(`/api/finance/reimburse/withdraw/${params.id}`, {
    method: 'PATCH',
    body: {
      ...params,
    },
  });
}

export async function payReimbursements(params) {
  return request('/api/finance/reimburse/pay', {
    method: 'PATCH',
    body: {
      ...params,
    },
  });
}

export async function rejectReimbursementByCashier(params) {
  return request('/api/finance/reimburse/pay/reject', {
    method: 'PATCH',
    body: {
      ...params,
    },
  });
}

/**
 * 获取全部资金归属
 *
 * @returns {Promise.<Object>}
 */
export async function fetchAllFundsAttribution() {
  return request('/api/finance/reimburse/reim-department', {
    method: 'GET',
  });
}

export async function fetchAllReimbursementStatus() {
  return request('/api/finance/reimburse/status', {
    method: 'GET',
  });
}

export async function fetchAllExpenseTypes() {
  return request('/api/finance/reimburse/types', {
    method: 'GET',
  });
}
