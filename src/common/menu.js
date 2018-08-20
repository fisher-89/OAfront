const menuData = [
  {
    name: '首页',
    icon: 'dashboard',
    path: '/',
  }, {
    name: '积分制系统',
    path: 'point',
    icon: 'point-system',
    authority: '136',
    children: [
      {
        name: '事件管理',
        path: 'initEvent',
        authority: '137',
      },
      {
        name: '权限管理',
        path: 'auth',
        authority: '168',
        children: [
          {
            name: '权限分组',
            path: 'group',
            authority: '145',
          },
          {
            name: '任务发布权限',
            path: 'issue',
            authority: '167',
          },
        ],
      },
      {
        name: '奖扣指标',
        path: 'buckleIndex',
        hideInMenu: true,
      },
      {
        name: '终审人',
        path: 'final',
        authority: '149',
      },
      {
        name: '事件日志',
        path: 'event-logs',
        authority: '172',
      },
      {
        name: '积分日志',
        path: 'log',
        authority: '156',
      },
      {
        name: '任务执行日志',
        path: 'commadn-log',
        // authority: '156',
      },
      {
        name: '基础分配置',
        path: 'base-points',
        authority: '157',
      },
    ],
  }, {
    name: '人事系统',
    icon: 'team',
    path: 'hr',
    children: [
      {
        name: '员工管理',
        path: 'staff',
      }, {
        name: '编辑员工',
        path: 'staff/edit/:staff_sn',
        hideInMenu: true,
      },
      {
        name: '大爱',
        path: 'violation',
        children: [
          {
            name: '大爱查询',
            path: 'fine',
          },
          {
            name: '制度列表',
            path: 'regime',
          },
          {
            name: '添加制度',
            path: 'regime/add',
            hideInMenu: true,
          },
          {
            name: '添加制度',
            path: 'regime/edit/:id',
            hideInMenu: true,
          },
          {
            name: '大爱统计',
            path: 'count',
          },
        ],
      },
    ],
  },
  {
    name: '工作流配置',
    icon: 'form',
    path: 'workflow',
    children: [
      {
        name: '流程管理',
        path: 'flow',
      },
      {
        name: '流程分类',
        path: 'flow/type',
        hideInMenu: true,
      },
      {
        name: '添加流程',
        path: 'flow/add',
        hideInMenu: true,
      },
      {
        name: '编辑流程',
        path: 'flow/edit/:id',
        hideInMenu: true,
      },
      {
        name: '表单管理',
        path: 'form',
      },
      {
        name: '添加表单',
        path: 'form/add',
        hideInMenu: true,
      },
      {
        name: '编辑表单',
        path: 'form/edit/:id',
        hideInMenu: true,
      },
      {
        name: '表单分类',
        path: 'form/type',
        hideInMenu: true,
      },
      {
        name: '验证规则',
        path: 'validator',
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
