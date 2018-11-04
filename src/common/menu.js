const menuData = [
  {
    name: '首页',
    icon: 'dashboard',
    path: '/',
  }, {
    name: '客户管理',
    icon: 'customer-service',
    path: 'client',
    authority: '174',
    children: [
      {
        name: '客户资料',
        path: 'customer',
        authority: '176',
        children: [
          {
            name: '录入资料',
            path: 'list/add',
            authority: '188',
          },
          {
            name: '编辑资料',
            path: 'list/edit/:id',
            hideInMenu: true,
            authority: '187',
          },
          {
            name: '资料详情',
            path: 'list/info/:id',
            hideInMenu: true,
            authority: '187',
          },
          {
            name: '客户列表',
            path: 'list',
            authority: '177',
          },
          {
            name: '客户来源',
            path: 'source',
          },
          {
            name: '客户等级',
            path: 'level',
          },
          {
            name: '标签管理',
            path: 'tags',
            authority: '179',
          },
        ],
      },
      {
        name: '记事本',
        path: 'notepad',
        authority: '181',
        children: [
          {
            name: '事件列表',
            path: 'list',
            authority: '181',
          },
          {
            name: '录入事件',
            path: 'list/add',
            authority: '182',
          },
          {
            name: '事件类型',
            path: 'type',
            authority: '189',
          },
          {
            name: '编辑事件',
            path: 'list/edit/:id',
            hideInMenu: true,
          },
        ],
      },
      // {
      //   name: '客户服务',
      //   path: 'service',
      // },
      // {
      //   name: '合同管理',
      //   path: 'contract-manager',
      // },
      // {
      //   name: '统计中心',
      //   path: 'stats-central',
      // },
      {
        name: '品牌权限',
        path: 'auth/group',
        authority: '183',
      },
      {
        name: '操作日志',
        path: 'action-log',
        authority: '184',
        children: [
          {
            name: '客户资料',
            path: 'customer',
          },
          // {
          //   name: '记事本',
          //   path: 'notepad',
          // },
        ],
      },
    ],
  }, {
    name: '财务',
    path: 'finance',
    icon: '',
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
        name: '考勤管理',
        path: 'attendance',
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
        authority: '136',
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
    authority: '36',
    children: [
      {
        name: '员工管理',
        path: 'staff',
        authority: '37',
      }, {
        name: '编辑员工',
        path: 'staff/edit/:staff_sn',
        hideInMenu: true,
      },
      {
        name: '部门管理',
        path: 'department',
        authority: '38',
      },
      {
        name: '职位管理',
        path: 'position',
        authority: '42',
      },
      {
        name: '品牌管理',
        path: 'brand',
        authority: '42',
      },
      {
        name: '费用品牌',
        path: 'expense',
      },
      {
        name: '店铺管理',
        path: 'shop',
        authority: '70',
      },
      {
        name: '员工标签',
        path: 'stafftags',
      },
      {
        name: '大爱',
        path: 'violation',
        authority: '76',
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
  {
    name: '工作流配置',
    icon: 'form',
    path: 'workflow',
    authority: '51',
    children: [
      {
        name: '流程管理',
        path: 'flow',
        // authority: '100',
      },
      {
        name: '流程运行记录',
        path: 'flow-log',
        // authority: '100',
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
        children: [
          {
            name: '表单列表',
            path: 'list',
          },
          {
            name: '添加表单',
            path: 'list/add',
            hideInMenu: true,
          },
          {
            name: '编辑表单',
            path: 'list/edit/:id',
            hideInMenu: true,
          },
          {
            name: '表单分类',
            path: 'list/type',
            hideInMenu: true,
          },
          {
            name: '接口配置',
            path: 'urlSource',
          },
          {
            name: '审批模板',
            path: 'approver',
          },
          {
            name: '验证规则',
            path: 'validator',
          },
        ],
      },
      {
        name: '消息管理',
        path: 'dingTalk',
        children: [
          {
            name: '待办通知',
            path: 'waitMsg',
          },
          {
            name: '工作通知',
            path: 'workMsg',
          },
        ],
      },
    ],
  },
  {
    name: '应用管理',
    icon: 'form',
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

