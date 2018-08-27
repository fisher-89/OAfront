import React, { PureComponent, Fragment } from 'react';
// import { connect } from 'dva';
import {
  Card,
  Button,

  Divider,

} from 'antd';

import OATable from '../../../components/OATable';
// import OAForm, { OAModal } from '../../../components/OAForm';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

export default class Validator extends PureComponent {
  state = {};

  makeColumns = () => {
    const columns = [
      { title: '客户姓名', dataIndex: 'name', width: 160, searcher: true },
      { title: '电话', dataIndex: 'phone', width: 160, searcher: true },
      {
        title: '客户来源',
        dataIndex: 'source',
      },
      {
        title: '客户状态',
        width: 120,
        dataIndex: 'status',
      },
      {
        width: 240,
        title: '合作品牌',
        dataIndex: 'brand',
      },
      {
        width: 120,
        title: '合作时间',
        dataIndex: 'time',
      },
      {
        width: 160,
        title: '维护人',
        dataIndex: 'staff',
        searcher: true,
      },
      {
        width: 320,
        title: '标签',
        dataIndex: 'tag',
      },
      {
        title: '操作',
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
    const extraOperator = [
      (
        <Button
          type="primary"
          icon="plus"
          key="plus"
          onClick={() => {
            this.props.history.push('/client/customer/add');
          }}
        >
          新建客户资料
        </Button>
      ),
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <OATable
            data={[]}
            columns={this.makeColumns()}
            extraOperator={extraOperator}
            serverSide
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
