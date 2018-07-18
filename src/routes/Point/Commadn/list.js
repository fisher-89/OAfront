import React, { PureComponent } from 'react';
import { connect } from 'dva';

import OATable from '../../../components/OATable';

const status = [
  { value: 0, label: '未完成' },
  { value: 1, label: '已完成' },
  { value: 2, label: '失败' },
];

@connect(({ point, loading }) => ({
  log: point.commadnLog,
  logLoading: loading.effects['point/fetchCommadnLog'],
}))
export default class extends PureComponent {
  fetchCommadnLog = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/fetchCommadnLog', payload: params });
  }

  makeColumns = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        searcher: true,
      },
      {
        title: '任务号',
        dataIndex: 'command_sn',
        searcher: true,
      },
      {
        title: '标题',
        dataIndex: 'title',
        searcher: true,
      },
      {
        title: '执行时间',
        dataIndex: 'created_at',
        sort: true,
      },
      {
        title: '完成时间',
        dataIndex: 'updated_at',
        sort: true,
      },
      {
        title: '描述',
        dataIndex: 'description',
      },
      {
        title: '选项',
        dataIndex: 'options',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (statusId) => {
          const { label } = status.find(item => item.value === statusId);
          return label;
        },
      },
    ];
    return columns;
  }

  render() {
    const { log, logLoading, dLoading, bLoading } = this.props;
    return (
      <React.Fragment>
        <OATable
          serverSide
          loading={logLoading || dLoading || bLoading}
          columns={this.makeColumns()}
          dataSource={log && log.data}
          total={log && log.total}
          filtered={log && log.filtered}
          fetchDataSource={this.fetchCommadnLog}
          scroll={{ x: 300 }}
        />
      </React.Fragment>
    );
  }
}
