import hrMenu from './hr';
import pointMenu from './point';
import workflowMenu from './workflow';
import clientMenu from './client';

const menuData = [
  {
    name: '首页',
    icon: 'home',
    path: '/',
  },
  hrMenu,
  {
    name: '财务',
    path: 'finance',
    icon: 'pay-circle',
    authority: '33',
    children: [{
      name: '报销',
      path: 'reimbursement',
      authority: '33',
      children: [
        {
          name: '报销审核',
          path: 'accountant',
          authority: '34',
        },
        {
          name: '报销转账',
          path: 'cashier',
          authority: '135',
        },
        {
          name: '对公转账',
          path: 'public-cashier',
          authority: '193',
        },
        {
          name: '查看报销',
          path: 'auditor',
          authority: '35',
        },
      ],
    }],
  },
  clientMenu,
  workflowMenu,
  pointMenu,
  {
    name: '大爱',
    icon: 'heart',
    path: 'violation',
    authority: '196',
    children: [
      {
        name: '大爱记录',
        authority: '197',
        path: 'log',
      },
      {
        name: '制度管理',
        authority: '198',
        path: 'regime',
      },
      {
        name: '月统计',
        authority: '199',
        path: 'statistics',
      },
      {
        name: '推送记录',
        authority: '213',
        path: 'pushlog',
      },
      {
        name: '权限管理',
        authority: '211',
        path: 'fineauth',
      },
    ],
  },
  {
    name: '应用管理',
    icon: 'appstore',
    path: 'appmanage',
    authority: '51',
    children: [
      {
        name: '报销系统',
        path: 'reimburse',
        children: [
          {
            name: '审批人配置',
            path: 'approverset',
            authority: '115',
          },
          {
            name: '审核人配置',
            path: 'auditorset',
            authority: '116',
          },
        ],
      },
    ],
  },
  {
    name: '系统管理',
    icon: 'setting',
    path: 'system',
    authority: '7',
    children: [
      {
        name: '角色管理',
        path: 'roles',
        authority: '31',
      },
      {
        name: '权限管理',
        path: 'authority',
        authority: '32',
      },
    ],
  },
];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    const result = {
      ...item,
      path: `${parentPath}${item.path}`,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);

