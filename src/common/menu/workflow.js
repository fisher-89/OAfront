export default {
  name: '工作流配置',
  icon: 'branches',
  path: 'workflow',
  authority: '51',
  children: [
    {
      name: '流程管理',
      path: 'flow',
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
        }, {
          name: '历史表单',
          path: 'list/info/:id',
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
          name: '验证规则',
          path: 'validator',
        },
      ],
    },
    {
      name: '审批模板',
      path: 'form/approver',
    },
    {
      name: '流程运行记录',
      path: 'flow-log',
      // authority: '100',
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
    {
      name: '权限配置',
      path: 'auth',
    },
  ],
};
