import request from '../utils/request';

export async function fetchProcessingReimbursements(params) {
  return request('/api/finance/reimburse/audit', {
    method: 'GET',
    body: {
      ...params,
      type: 'processing',
    },
  });
}

export async function fetchOvertimeReimbursements(params) {
  return request('/api/finance/reimburse/audit', {
    method: 'GET',
    body: {
      ...params,
      type: 'overtime',
    },
  });
}

export async function fetchApprovedReimbursements(params) {
  return request('/api/finance/reimburse/audit', {
    method: 'GET',
    body: {
      ...params,
      type: 'audited',
    },
  });
}

export async function fetchRejectedReimbursements(params) {
  return request('/api/finance/reimburse/audit', {
    method: 'GET',
    body: {
      ...params,
      type: 'rejected',
    },
  });
}

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
