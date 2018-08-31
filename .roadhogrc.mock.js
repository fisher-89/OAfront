
// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

const TEST_URI = 'http://112.74.177.132';
const crm_port = `${TEST_URI}:8003`;
const pms_port = `${TEST_URI}:8009`;
const api_port = `${TEST_URI}:8002`;
const workflow_port = `${TEST_URI}:8006`;



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
    'GET /api/finance/reimburse/(.*)': `${api_port}/reimburse`,
    'POST /api/finance/reimburse/(.*)': `${api_port}/reimburse`,
    'PATCH /api/finance/reimburse/(.*)': `${api_port}/reimburse`,
    'PUT /api/finance/reimburse/(.*)': `${api_port}/reimburse`,
    'DELETE /api/finance/reimburse/(.*)': `${api_port}/reimburse`,

    /**
     * 测试服  ： 工作流
     */
    'GET /api/workflow/(.*)': `${workflow_port}/admin/`,
    'POST /api/workflow/(.*)': `${workflow_port}/admin/`,
    'PUT /api/workflow/(.*)': `${workflow_port}/admin/`,
    'DELETE /api/workflow/(.*)': `${workflow_port}/admin/`,

    /** 客户端管理 */
    'GET /api/crm/(.*)': `${crm_port}/admin/`,
    'POST /api/crm/(.*)': `${crm_port}/admin/`,
    'PUT /api/crm/(.*)': `${crm_port}/admin/`,
    'PATCH /api/crm/(.*)': `${crm_port}/admin/`,
    'DELETE /api/crm/(.*)': `${crm_port}/admin/`,

    /**
     * 测试服 ： 积分制
     */

    'GET /api/pms/(.*)': `${pms_port}/admin/`,
    'POST /api/pms/(.*)': `${pms_port}/admin/`,
    'PUT /api/pms/(.*)': `${pms_port}/admin/`,
    'PATCH /api/pms/(.*)': `${pms_port}/admin/`,
    'DELETE /api/pms/(.*)': `${pms_port}/admin/`,

    'GET /api/admin/(.*)': `${pms_port}/admin/`,
    'POST /api/admin/(.*)': `${pms_port}/admin/`,
    'PUT /api/admin/(.*)': `${pms_port}/admin/`,
    'PATCH /api/admin/(.*)': `${pms_port}/admin/`,
    'DELETE /api/admin/(.*)': `${pms_port}/admin/`,

    /**
     * 测试服  ： 登录
     */
    'GET /api/(.*)': `${api_port}/api/`,
    'POST /api/(.*)': `${api_port}/api/`,
    'POST /oauth/(.*)': `${api_port}/oauth/`,

    /**
     * 唐娇  ： 大爱
     */
    // 'POST /api/violation/(.*)': 'http://192.168.20.144:8001/api/',
  };

