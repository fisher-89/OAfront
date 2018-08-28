import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button,
  Divider,
} from 'antd';
import moment from 'moment';
import OATable from '../../../components/OATable';
import { customerStatus } from '../../../assets/customer';

@connect(({ customer, loading }) => ({
  customer: customer.customer,
  source: customer.source,
  tags: customer.tags,
  loading: (
    loading.effects['customer/fetchSource'] ||
    loading.effects['customer/fetchTags'] ||
    loading.effects['customer/fetchCustomer']
  ),
}))
export default class Validator extends PureComponent {
  state = {};
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'customer/fetchSource' });
  }

  fetch = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'customer/fetchCustomer', payload: params });
  }

  makeColumns = () => {
    const { source, tags } = this.props;
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
        dataIndex: 'mobile',
        // width: 160,
        searcher: true,
      },
      {
        align: 'center',
        title: '客户来源',
        dataIndex: 'source_id',
        filters: source.map(item => ({ text: item.name, value: item.id })),
        render: (key) => {
          const value = source.find(item => item.id === key) || {};
          return value.name;
        },
      },
      {
        align: 'center',
        title: '客户状态',
        // width: 120,
        dataIndex: 'status',
        filters: customerStatus.map(item => ({ text: item.name, value: item.id })),
        render: (key) => {
          const value = source.find(item => item.id === key) || {};
          return value.name;
        },
      },
      {
        // width: 240,
        align: 'center',
        title: '合作品牌',
        dataIndex: 'brand_id',
      },
      {
        // width: 120,
        align: 'center',
        title: '合作时间',
        dataIndex: 'first_cooperation_at',
        render: time => moment(time).format('YYYY-MM-DD'),
      },
      {
        // width: 160,
        title: '维护人',
        align: 'center',
        dataIndex: 'vindicator_name',
        searcher: true,
      },
      {
        // width: 320,
        title: '标签',
        align: 'center',
        dataIndex: 'has_tags',
        render: (key) => {
          const tagId = key.map(item => item.tag_id);
          const value = tags.filter(tag => tagId.indexOf(tag.id)).map(item => item.name);
          return value.join(',');
        },
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
        data={customer.data}
        total={customer.total}
        columns={this.makeColumns()}
        fetchDataSource={this.fetch}
        extraOperator={extraOperator}
      />
    );
  }
}
