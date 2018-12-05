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
export default class extends PureComponent {
  columns = [
    { title: '编号', dataIndex: 'id' },
    { title: '标题', dataIndex: 'title' },
    { title: '接收人', dataIndex: 'todo_name' },
    {
      title: '发起人', dataIndex: 'create_realname', align: 'center',
    },
    { title: '发起时间', dataIndex: 'created_at', dateFilters: true },
    {
      title: '状态',
      align: 'center',
      filters: status,
      dataIndex: 'errcode',
      render: (key) => {
        const value = find(status, ['value', key]) || {};
        return value.text || '失败';
      },
    },
    {
      align: 'center',
      title: '完成情况',
      dataIndex: 'is_finish',
      render: key => (key === 1 ? '已完成' : '未完成'),
    },
    {
      title: '操作',
      render: (record) => {
        return (record.errcode !== '0' || !record.errcode) ? (
          <a onClick={this.props.resendWaitMsg(record.id)}>发送</a>
        ) : '';
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
