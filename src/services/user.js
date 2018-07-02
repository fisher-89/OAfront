import request from '../utils/request';

export async function loginByTelephone(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  const response = request('/api/current-user').catch(() => {
    return undefined;
  });
  return response;
}

export async function fetchStaff(params) {
  return request('/api/staff', {
    method: 'GET',
    body: { ...params },
  });
}

export async function fetchStaffInfo(staffSn) {
  return request(`/api/staff/${staffSn}`, {
    method: 'GET',
  });
}
