import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { find } from 'lodash';
import store from './store';
import OATable from '../../../components/OATable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const status = [
  { value: 'null', text: '未发送' },
  { value: '0', text: '成功' },
  { value: '1', text: '失败' },
];

@store()
export default class Validator extends PureComponent {
  columns = [
    { title: '编号', dataIndex: 'id' },
    { title: '标题', dataIndex: 'title' },
    {
      title: '发起人', dataIndex: 'create_realname',
    },
    {
      title: '状态',
      filters: status,
      dataIndex: 'errcode',
      render: (key) => {
        const value = find(status, ['value', `${key}`]) || {};
        return value.text || '失败';
      },
    },
    { title: '完成', dataIndex: 'is_finish' },
    {
      title: '操作',
      render: (record) => {
        return (record.errcode || record.errcode === null) ? (<a>发送</a>) : '';
      },
    },
  ]

  render() {
    const {
      list,
      loading,
      fetchDataSource,
    } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <OATable
            serverSide
            data={list.data}
            loading={loading}
            total={list.total}
            columns={this.columns}
            fetchDataSource={fetchDataSource}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
