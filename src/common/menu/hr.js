export default {
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
      children: [
        {
          name: '部门列表',
          path: 'list',
        },
        {
          name: '部门分类',
          path: 'cates',
        },
      ],
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
      name: '角色管理',
      path: 'roles',
      authority: '70',
    },
    {
      name: '标签管理',
      path: 'tags',
      children: [
        {
          name: '员工标签',
          path: 'stafftags',
        },
        {
          name: '店铺标签',
          path: 'shoptags',
        },
      ],
    },
  ],
};
