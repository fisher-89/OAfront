
// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

export default !noProxy ? {
  /**
   * 张博涵  ： 报销
   */
  'GET /api/finance/reimburse/(.*)': 'http://192.168.20.238:8003/reimburse',
  'POST /api/finance/reimburse/(.*)': 'http://192.168.20.238:8003/reimburse',
  'PATCH /api/finance/reimburse/(.*)': 'http://192.168.20.238:8003/reimburse',
  'PUT /api/finance/reimburse/(.*)': 'http://192.168.20.238:8003/reimburse',
  'DELETE /api/finance/reimburse/(.*)': 'http://192.168.20.238:8003/reimburse',
  /**
   * 刘勇  ： 工作流
   */
  'GET /api/workflow/(.*)': 'http://192.168.20.16:8009/admin/',
  'POST /api/workflow/(.*)': 'http://192.168.20.16:8009/admin/',
  'PUT /api/workflow/(.*)': 'http://192.168.20.16:8009/admin/',
  'DELETE /api/workflow/(.*)': 'http://192.168.20.16:8009/admin/',

  /**
   * 线上  积分制
   */
  'GET /api/pms/(.*)': 'http://120.79.121.158:8004/admin/',
  'POST /api/pms/(.*)': 'http://120.79.121.158:8004/admin/',
  'PUT /api/pms/(.*)': 'http://120.79.121.158:8004/admin/',
  'PATCH /api/pms/(.*)': 'http://120.79.121.158:8004/admin/',
  'DELETE /api/pms/(.*)': 'http://120.79.121.158:8004/admin/',

  'GET /api/admin/(.*)': 'http://120.79.121.158:8004/admin/',
  'POST /api/admin/(.*)': 'http://120.79.121.158:8004/admin/',
  'PUT /api/admin/(.*)': 'http://120.79.121.158:8004/admin/',
  'PATCH /api/admin/(.*)': 'http://120.79.121.158:8004/admin/',
  'DELETE /api/admin/(.*)': 'http://120.79.121.158:8004/admin/',

  /**
   * 张博涵  oa登录和hr
   */
  'GET /api/(.*)': 'http://192.168.20.238:8003/api/',
  'POST /api/(.*)': 'http://192.168.20.238:8003/api/',
  'POST /oauth/(.*)': 'http://192.168.20.238:8003/oauth/',
} : {
  /**
   * 测试服  ： 报销
   */
  'GET /api/finance/reimburse/(.*)': 'http://112.74.177.132:8002/reimburse/',
  'POST /api/finance/reimburse/(.*)': 'http://112.74.177.132:8002/reimburse/',
  'PATCH /api/finance/reimburse/(.*)': 'http://112.74.177.132:8002/reimburse/',
  'PUT /api/finance/reimburse/(.*)': 'http://112.74.177.132:8002/reimburse/',
  'DELETE /api/finance/reimburse/(.*)': 'http://112.74.177.132:8002/reimburse/',

  /**
   * 测试服  ： 工作流
   */
  'GET /api/workflow/(.*)': 'http://112.74.177.132:8006/admin/',
  'POST /api/workflow/(.*)': 'http://112.74.177.132:8006/admin/',
  'PUT /api/workflow/(.*)': 'http://112.74.177.132:8006/admin/',
  'DELETE /api/workflow/(.*)': 'http://112.74.177.132:8006/admin/',

  /**
   * 测试服 ： 积分制
   */

  'GET /api/pms/(.*)': 'http://112.74.177.132:8009/admin/',
  'POST /api/pms/(.*)': 'http://112.74.177.132:8009/admin/',
  'PUT /api/pms/(.*)': 'http://112.74.177.132:8009/admin/',
  'PATCH /api/pms/(.*)': 'http://112.74.177.132:8009/admin/',
  'DELETE /api/pms/(.*)': 'http://112.74.177.132:8009/admin/',

  'GET /api/admin/(.*)': 'http://112.74.177.132:8009/admin/',
  'POST /api/admin/(.*)': 'http://112.74.177.132:8009/admin/',
  'PUT /api/admin/(.*)': 'http://112.74.177.132:8009/admin/',
  'PATCH /api/admin/(.*)': 'http://112.74.177.132:8009/admin/',
  'DELETE /api/admin/(.*)': 'http://112.74.177.132:8009/admin/',


  /**
   * 测试服  ： 登录
   */
  'GET /api/(.*)': 'http://112.74.177.132:8002/api/',
  'POST /api/(.*)': 'http://112.74.177.132:8002/api/',
  'POST /oauth/(.*)': 'http://112.74.177.132:8002/oauth/',
};

