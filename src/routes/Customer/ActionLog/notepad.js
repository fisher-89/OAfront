import React, { PureComponent, Fragment } from 'react';
// import { connect } from 'dva';
import {
  Card,
  Divider,
} from 'antd';
import store from './store';
import OATable from '../../../components/OATable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

@store('fetchNoteLogs')
export default class extends PureComponent {
  makeColumns = () => {
    const columns = [
      {
        // width: 80,
        title: '员工编号',
        align: 'center',
        dataIndex: 'staff_sn',
        sorter: true,
      },
      {
        // width: 100,
        align: 'center',
        title: '员工姓名',
        dataIndex: 'staff_name',
        searcher: true,
      },
      {
        // width: 200,
        align: 'center',
        title: '所在部门',
        dataIndex: 'department',
      },
      {
        // width: 80,
        title: '职位',
        align: 'center',
        dataIndex: 'position',
      },
      {
        // width: 80,
        title: '状态',
        align: 'center',
        dataIndex: 'status',
      },
      {
        // width: 80,
        align: 'center',
        title: '客户姓名',
        dataIndex: 'customer',
      },
      {
        // width: 240,
        align: 'center',
        title: '合作品牌',
        dataIndex: 'brand',
      },
      {
        // width: 200,
        align: 'center',
        title: '记录时间',
        dataIndex: 'time',
      },
      {
        // width: 80,
        align: 'center',
        title: '操作类型',
        dataIndex: 'actionType',
      },
      {
        title: '查看',
        render: () => {
          return (
            <Fragment>
              <a >编辑</a>
              <Divider type="vertical" />
              <a >详细信息</a>
            </Fragment>
          );
        },
      },
    ];
    return columns;
  }

  render() {
    const { fetchNoteLogs, clientLogs } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <OATable
            serverSide
            data={clientLogs.data}
            total={clientLogs.total}
            columns={this.makeColumns()}
            fetchDataSource={fetchNoteLogs}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
