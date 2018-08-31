import React from 'react';
import { Card } from 'antd';
import store from './store';
import OATable from '../../../components/OATable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const authType = [
  { value: 1, text: '查看权限' },
  { value: 2, text: '操作权限' },
];

@store()
export default class extends React.PureComponent {
  componentWillMount() {
    const { fetchDepartment } = this.props;
    fetchDepartment();
  }

  makeColumns = () => {
    const { department } = this.props;
    const columns = [
      {
        searcher: true,
        title: '分组名称',
        dataIndex: 'name',
      },
      {
        title: '分组类型',
        dataIndex: 'auth_type',
        filters: authType,
        render: (key) => {
          const value = authType.find(item => item.value === key) || {};
          return value.text || '';
        },
      },
      {
        width: 200,
        title: '部门',
        dataIndex: 'departments.department_id',
        treeFilters: {
          title: 'full_name',
          value: 'id',
          parentId: 'parent_id',
          data: department,
        },
        render: (_, record) => {
          const value = record.departments.map(item => item.department_name);
          return value.join('、');
        },
      },
      {
        width: 200,
        searcher: true,
        title: '事件权限人员',
        dataIndex: 'note_staff.staff_name',
        render: (_, record) => {
          const value = record.note_staff.map(item => item.staff_name);
          return value.join('、');
        },
      },
      {
        width: 200,
        searcher: true,
        title: '客户信息权限人员',
        dataIndex: 'staffs.staff_name',
        render: (_, record) => {
          const value = record.staffs.map(item => item.staff_name);
          return value.join('、');
        },
      },
      {
        title: '操作',
        render: () => {
          return (
            <React.Fragment>
              <a>编辑</a>
              <a>删除</a>
            </React.Fragment>
          );
        },
      },
    ];
    return columns;
  }

  render() {
    const { fetchAuth, auth } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <OATable
            serverSide
            data={auth.data}
            total={auth.total}
            fetchDataSource={fetchAuth}
            columns={this.makeColumns()}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
