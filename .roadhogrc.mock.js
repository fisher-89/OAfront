import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getFormType, formTypeSave } from './mock/workflow';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
// import { delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/get_current_user': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      realname: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'POST /api/workflow/form_type/list': getFormType,
  'POST /api/workflow/form_type/save': formTypeSave,
  'GET /api/rule': getRule,
  'POST /api/rule': getRule,
  'POST /api/rule/add': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === '888888' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: ['admin']
      });
      return;
    }
    if (password === '123456' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: ['user']
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: ['guest']
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      "timestamp": 1513932555104,
      "status": 500,
      "error": "error",
      "message": "error",
      "path": "/base/category/list"
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      "timestamp": 1513932643431,
      "status": 404,
      "error": "Not Found",
      "message": "No message available",
      "path": "/base/category/list/2121212"
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      "timestamp": 1513932555104,
      "status": 403,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
};

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
  'GET /api/finance/reimburse/(.*)': 'http://112.74.177.132:8002/reimburse',
  'POST /api/finance/reimburse/(.*)': 'http://112.74.177.132:8002/reimburse',
  'PATCH /api/finance/reimburse/(.*)': 'http://112.74.177.132:8002/reimburse',
  'PUT /api/finance/reimburse/(.*)': 'http://112.74.177.132:8002/reimburse',
  'DELETE /api/finance/reimburse/(.*)': 'http://112.74.177.132:8002/reimburse',

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

  /**
   * 唐娇  ： 大爱
   */
  'POST /api/violation/(.*)': 'http://192.168.20.144:8001/api/',
};

