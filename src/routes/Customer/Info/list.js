import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  // Card,
  Button,

  Divider,

} from 'antd';

import OATable from '../../../components/OATable';
// import OAForm, { OAModal } from '../../../components/OAForm';
// import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

@connect(({ customer, loading }) => ({
  customer: customer.customer,
  loading: loading.effects['customer/fetchCustomer'],
}))
export default class Validator extends PureComponent {
  state = {};

  fetch = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'customer/fetchCustomer', payload: params });
  }

  makeColumns = () => {
    const columns = [
      {
        align: 'center',
        title: '客户姓名',
        dataIndex: 'name',
        // width: 160,
        searcher: true,
      },
      {
        align: 'center',
        title: '电话',
        dataIndex: 'phone',
        // width: 160,
        searcher: true,
      },
      {
        align: 'center',
        title: '客户来源',
        dataIndex: 'source',
      },
      {
        align: 'center',
        title: '客户状态',
        // width: 120,
        dataIndex: 'status',
      },
      {
        // width: 240,
        align: 'center',
        title: '合作品牌',
        dataIndex: 'brand',
      },
      {
        // width: 120,
        align: 'center',
        title: '合作时间',
        dataIndex: 'time',
      },
      {
        // width: 160,
        title: '维护人',
        align: 'center',
        dataIndex: 'staff',
        searcher: true,
      },
      {
        // width: 320,
        title: '标签',
        align: 'center',
        dataIndex: 'tag',
      },
      {
        title: '操作',
        render: (rowData) => {
          return (
            <Fragment>
              <a onClick={() => {
                this.props.history.push('/client/customer/list/info/1');
              }}
              >编辑
              </a>
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
    const { loading, customer } = this.props;
    return (
      <OATable
        serverSide
        loading={loading}
        columns={this.makeColumns()}
        fetchDataSource={this.fetch}
        extraOperator={extraOperator}
        data={[{ id: '1' }]}
        total={customer && customer.total}
      />
    );
  }
}
