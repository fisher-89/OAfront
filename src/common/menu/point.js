export default {
  name: '积分制系统',
  path: 'point',
  icon: 'trophy',
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
};
