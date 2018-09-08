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
      component: dynamicWrapper(app, ['login', 'currentUser'], () => import('../layouts/BasicLayout')),
    },
    '/dashboard/analysis': {
      component: dynamicWrapper(app, ['point'], () => import('../routes/Dashboard/Analysis')),
    },

    /** 客户端管理 */
    '/client/customer/list': {
      component: dynamicWrapper(app, ['nation'], () => import('../routes/Customer/Info')),
    },
    '/client/customer/list/info/:id': {
      component: dynamicWrapper(app, ['customer'], () => import('../routes/Customer/Info/info')),
    },
    '/client/customer/list/edit/:id': {
      component: dynamicWrapper(app, ['customer'], () => import('../routes/Customer/Info/add')),
    },
    '/client/customer/list/add': {
      component: dynamicWrapper(app, ['customer'], () => import('../routes/Customer/Info/add')),
    },
    '/client/customer/tags/list': {
      component: dynamicWrapper(app, ['customer'], () => import('../routes/Customer/Tags')),
    },
    '/client/customer/tags/type': {
      component: dynamicWrapper(app, ['customer'], () => import('../routes/Customer/Tags/Type')),
    },

    '/client/notepad/list': {
      component: dynamicWrapper(app, ['nation'], () => import('../routes/Customer/Notepad')),
    },
    '/client/notepad/list/add': {
      component: dynamicWrapper(app, ['nation'], () => import('../routes/Customer/Notepad/add')),
    },
    '/client/notepad/list/edit/:id': {
      component: dynamicWrapper(app, ['nation'], () => import('../routes/Customer/Notepad/add')),
    },

    '/client/action-log/customer': {
      component: dynamicWrapper(app, ['nation'], () => import('../routes/Customer/ActionLog/customer')),
    },
    '/client/auth/group': {
      component: dynamicWrapper(app, ['nation'], () => import('../routes/Customer/Auth/Group')),
    },
    '/client/action-log/notepad': {
      component: dynamicWrapper(app, ['nation'], () => import('../routes/Customer/ActionLog/notepad')),
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
    },
    '/hr/department': {
      component: dynamicWrapper(app, ['department', 'position', 'brand'], () => import('../routes/Hr/Department')),
    },
    '/hr/position': {
      component: dynamicWrapper(app, ['position', 'brand'], () => import('../routes/Hr/Position')),
    },
    '/hr/brand': {
      component: dynamicWrapper(app, ['position', 'brand'], () => import('../routes/Hr/Brand')),
    },
    '/hr/staff/edit/:staff_sn': {
      component: dynamicWrapper(app, [], () => import('../routes/Hr/Staff/edit')),
    },
    '/hr/violation/fine': {
      component: dynamicWrapper(app, ['violation', 'department', 'brand', 'position', 'shop'], () => import('../routes/Hr/Violation/Fine')),
    },
    '/hr/violation/regime': {
      component: dynamicWrapper(app, ['violation', 'department', 'brand', 'position', 'shop'], () => import('../routes/Hr/Violation/Regime')),
    },
    '/hr/violation/regime/add': {
      component: dynamicWrapper(app, ['violation', 'department', 'brand', 'position'], () => import('../routes/Hr/Violation/Regime/form')),
    },
    '/hr/violation/regime/edit/:id': {
      component: dynamicWrapper(app, ['violation', 'department', 'brand', 'position'], () => import('../routes/Hr/Violation/Regime/form')),
    },


    /** 工作流 */
    '/workflow/flow': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Flow')),
    },
    '/workflow/flow/add': {
      component: dynamicWrapper(app, ['workflow', 'staffs', 'department', 'roles'], () => import('../routes/Workflow/Flow/flow')),
    },
    '/workflow/flow/edit/:id': {
      component: dynamicWrapper(app, ['workflow', 'staffs', 'department', 'roles'], () => import('../routes/Workflow/Flow/flow')),
    },
    '/workflow/flow/type': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Flow/type')),
    },
    '/workflow/form': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Form')),
    },
    '/workflow/form/add': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Form/form')),
    },
    '/workflow/form/edit/:id': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Form/form')),
    },
    '/workflow/form/type': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Form/type')),
    },
    '/workflow/validator': {
      component: dynamicWrapper(app, ['workflow'], () => import('../routes/Workflow/Validator')),
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
