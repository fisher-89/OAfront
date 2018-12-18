import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['login', 'currentUser', 'tableShop'], () => import('../layouts/BasicLayout')),
    },
    '/dashboard/analysis': {
      component: dynamicWrapper(app, ['point'], () => import('../routes/Dashboard/Analysis')),
    },

    /** 客户端管理 */
    '/client/customer/list': {
      component: dynamicWrapper(app, [], () => import('../routes/Customer/Info')),
      authority: '177',
    },
    '/client/customer/list/info/:id': {
      component: dynamicWrapper(app, ['customer'], () => import('../routes/Customer/Info/info')),
      authority: '187',
    },
    '/client/customer/list/edit/:id': {
      component: dynamicWrapper(app, ['customer'], () => import('../routes/Customer/Info/add')),
      authority: '187',
    },
    '/client/customer/list/add': {
      component: dynamicWrapper(app, ['customer'], () => import('../routes/Customer/Info/add')),
      authority: '188',
    },
    '/client/customer/tags': {
      component: dynamicWrapper(app, ['customer'], () => import('../routes/Customer/Tags')),
      authority: '179',
    },
    '/client/customer/source': {
      component: dynamicWrapper(app, ['customer'], () => import('../routes/Customer/Source')),
    },
    '/client/customer/level': {
      component: dynamicWrapper(app, ['customer'], () => import('../routes/Customer/Level')),
    },

    '/client/notepad/list': {
      component: dynamicWrapper(app, [], () => import('../routes/Customer/Notepad')),
      authority: '181',
    },
    '/client/notepad/list/add': {
      component: dynamicWrapper(app, ['tableClients'], () => import('../routes/Customer/Notepad/add')),
      authority: '182',
    },
    '/client/notepad/type': {
      component: dynamicWrapper(app, [], () => import('../routes/Customer/Notepad/Type')),
      authority: '189',
    },

    '/client/notepad/list/edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Customer/Notepad/add')),
    },
    '/client/action-log/customer': {
      component: dynamicWrapper(app, [], () => import('../routes/Customer/ActionLog/customer')),
      authority: '184',
    },
    '/client/action-log/notepad': {
      component: dynamicWrapper(app, [], () => import('../routes/Customer/ActionLog/notepad')),
      authority: '184',
    },
    '/client/auth/group': {
      component: dynamicWrapper(app, [], () => import('../routes/Customer/Auth/Group')),
      authority: '183',
    },

    /** 报销系统 */
    '/finance/reimbursement/accountant': {
      component: dynamicWrapper(app, ['reimbursement'], () => import('../routes/Finance/Reimbursement/Accountant')),
      authority: '34',
    },
    '/finance/reimbursement/cashier': {
      component: dynamicWrapper(app, ['reimbursement'], () => import('../routes/Finance/Reimbursement/Cashier')),
      authority: '135',
    },
    '/finance/reimbursement/public-cashier': {
      component: dynamicWrapper(app, ['reimbursement'], () => import('../routes/Finance/Reimbursement/PublicCashier')),
      authority: '193',
    },
    '/finance/reimbursement/auditor': {
      component: dynamicWrapper(app, ['reimbursement'], () => import('../routes/Finance/Reimbursement/Auditor')),
      authority: '35',
    },


    /** 积分制管理 */
    '/point/initEvent': {
      component: dynamicWrapper(app, ['point'], () => import('../routes/Point/InitEvent')),
      authority: '137',
    },
    '/point/buckleIndex': {
      component: dynamicWrapper(app, ['point'], () => import('../routes/Point/Buckle')),
    },
    '/point/auth/group': {
      component: dynamicWrapper(app, ['point'], () => import('../routes/Point/Auth/Group')),
      authority: '145',
    },
    '/point/auth/issue': {
      component: dynamicWrapper(app, ['point'], () => import('../routes/Point/Auth/Issue')),
      authority: '168',
    },
    '/point/final': {
      component: dynamicWrapper(app, ['point'], () => import('../routes/Point/Final')),
      authority: '149',
    },
    '/point/base-points': {
      component: dynamicWrapper(app, ['point'], () => import('../routes/Point/Setting')),
      authority: '157',
    },
    '/point/event-logs': {
      component: dynamicWrapper(app, ['point'], () => import('../routes/Point/EventLog')),
      authority: '172',
    },
    '/point/log': {
      component: dynamicWrapper(app, ['point'], () => import('../routes/Point/Log')),
      authority: '156',
    },
    '/point/commadn-log': {
      component: dynamicWrapper(app, ['point'], () => import('../routes/Point/Commadn')),
      authority: '136',
    },
    '/point/attendance': {
      component: dynamicWrapper(app, ['point'], () => import('../routes/Point/Attendance')),
    },

    /** HR 管理 */
    '/hr/staff': {
      component: dynamicWrapper(app, ['staffs', 'department', 'brand', 'position', 'shop'], () => import('../routes/Hr/Staff')),
      authority: '37',
    },
    '/hr/department/list': {
      component: dynamicWrapper(app, ['department', 'position', 'brand'], () => import('../routes/Hr/Department')),
      authority: '38',
    },
    '/hr/department/cates': {
      component: dynamicWrapper(app, ['department', 'position'], () => import('../routes/Hr/Department/Category')),
      authority: '38',
    },
    '/hr/position': {
      component: dynamicWrapper(app, ['position', 'brand'], () => import('../routes/Hr/Position')),
      authority: '42',
    },
    '/hr/brand': {
      component: dynamicWrapper(app, ['position', 'brand'], () => import('../routes/Hr/Brand')),
      authority: '42',
    },
    '/hr/expense': {
      component: dynamicWrapper(app, ['expense', 'brand'], () => import('../routes/Hr/Expense')),
    },
    '/hr/shop': {
      component: dynamicWrapper(app, ['department', 'shop', 'stafftags', 'brand'], () => import('../routes/Hr/Shop')),
      authority: '70',
    },
    '/hr/staff/edit/:staff_sn': {
      component: dynamicWrapper(app, [], () => import('../routes/Hr/Staff/edit')),
    },
    '/hr/tags/stafftags': {
      component: dynamicWrapper(app, ['stafftags'], () => import('../routes/Hr/Stafftags')),
    },
    '/hr/tags/shoptags': {
      component: dynamicWrapper(app, ['stafftags'], () => import('../routes/Hr/Shoptags')),
    },

    /* 大爱 */
    '/violation/log': {
      component: dynamicWrapper(app, ['violation'], () => import('../routes/Violation/Log')),
    },
    // '/violation/regime': {
    //   component: dynamicWrapper(app, ['violation'], () => import('../routes/Violation/Regime')),
    // },
    '/violation/statistics': {
      component: dynamicWrapper(app, ['violation'], () => import('../routes/Violation/Statistics')),
    },

    /**  系统 */
    '/system/authority': {
      component: dynamicWrapper(app, ['authority'], () => import('../routes/System/Authority')),
    },
    '/system/roles': {
      component: dynamicWrapper(app, ['brand', 'staffs', 'department', 'roles'], () => import('../routes/System/Roles')),
    },


    /** 工作流 */
    '/workflow/flow': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Flow')),
      authority: '51',
    },
    '/workflow/flow/add': {
      component: dynamicWrapper(app, ['workflow', 'staffs', 'department', 'roles'], () => import('../routes/Workflow/Flow/flow')),
      authority: '51',
    },
    '/workflow/flow/edit/:id': {
      component: dynamicWrapper(app, ['workflow', 'staffs', 'department', 'roles'], () => import('../routes/Workflow/Flow/flow')),
      authority: '51',
    },
    '/workflow/flow/type': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Flow/type')),
      authority: '51',
    },


    '/workflow/flow-log': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Flow-log')),
      authority: '51',
    },


    '/workflow/form/list': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Form')),
      authority: '51',
    },
    '/workflow/form/list/add': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Form/form')),
      authority: '51',
    },
    '/workflow/form/list/edit/:id': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Form/form')),
      authority: '51',
    },
    '/workflow/form/list/info/:id': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Form/info')),
      authority: '51',
    },
    '/workflow/form/list/type': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Form/type')),
      authority: '51',
    },
    '/workflow/form/urlSource': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Form/UrlSource')),
    },
    '/workflow/form/approver': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/approver')),
      authority: '51',
    },
    '/workflow/form/validator': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Validator')),
      authority: '51',
    },
    '/workflow/dingTalk/waitMsg': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/WaitMsg')),
      authority: '51',
    },
    '/workflow/dingTalk/workMsg': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/WorkMsg')),
      authority: '51',
    },

    /** 异常界面 */
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    },

    '/blank': {
      component: dynamicWrapper(app, [], () => import('../layouts/BlankLayout')),
    },

    /** 登录权限 */
    '/passport/get_access_token': {
      component: dynamicWrapper(app, ['oauth'], () => import('../routes/Oauth/GetAccessToken')),
    },
    '/passport/refresh_access_token': {
      component: dynamicWrapper(app, ['oauth'], () => import('../routes/Oauth/RefreshAccessToken')),
      authority: 'refresh-token',
      redirectPath: '/passport/redirect_to_authorize',
    },
    '/passport/redirect_to_authorize': {
      component: dynamicWrapper(app, [], () => import('../routes/Oauth/RedirectToAuthorize')),
    },

    /** 应用管理 */
    '/appmanage/reimburse/approverset': {
      component: dynamicWrapper(app, ['appmanage'], () => import('../routes/Appmanage/Approverset')),
      authority: '115',
    },
    '/appmanage/reimburse/auditorset': {
      component: dynamicWrapper(app, ['appmanage'], () => import('../routes/Appmanage/Auditorset')),
      authority: '116',
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerData = {};
  Object.keys(routerConfig).forEach((item) => {
    const menuItem = menuData[item.replace(/^\//, '')] || {};
    routerData[item] = {
      ...routerConfig[item],
      name: routerConfig[item].name || menuItem.name,
      authority: routerConfig[item].authority || menuItem.authority,
    };
  });
  return routerData;
};
