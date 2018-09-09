import React, { PureComponent, Fragment } from 'react';
// import { connect } from 'dva';
import {
  Card,
  Divider,
} from 'antd';
import store from './store/store';
import OATable from '../../../components/OATable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

@store('fetchClientLogs')
export default class extends PureComponent {
  state = {};

  makeColumns = () => {
    const columns = [
      {
        // width: 80,
        title: '员工编号',
        align: 'center',
        dataIndex: 'id',
        sorter: true,
      },
      {
        // width: 100,
        align: 'center',
        title: '员工姓名',
        dataIndex: 'name',
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
        render: (rowData) => {
          return (
            <Fragment>
              <a onClick={() => this.handleEdit(rowData)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleDelete(rowData.id)}>删除</a>
            </Fragment>
          );
        },
      },
    ];
    return columns;
  }

  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <OATable
            data={[]}
            serverSide
            columns={this.makeColumns()}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
