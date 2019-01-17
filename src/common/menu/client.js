export default {
  name: '客户管理',
  icon: 'solution',
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
};
