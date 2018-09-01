import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Divider,
} from 'antd';
import store from './store';
import OATable from '../../../components/OATable';

@store
export default class Validator extends PureComponent {
  state = {};

  makeColumns = () => {
    const { deleted } = this.props;
    const onClick = (name, id) => {
      this.props.history.push(`/client/customer/list/${name}/${id}`);
    };
    const columns = [
      {
        // width: 80,
        title: '序号',
        align: 'center',
        dataIndex: 'id',
        sorter: true,
      },
      {
        // width: 160,
        align: 'center',
        title: '客户姓名',
        dataIndex: 'name',
        searcher: true,
      },
      {
        // width: 200,
        align: 'center',
        title: '合作品牌',
        dataIndex: 'brands',
      },
      {
        // width: 240,
        title: '标题',
        align: 'center',
        dataIndex: 'title',
      },
      {
        // width: 400,
        title: '内容',
        align: 'center',
        dataIndex: 'content',
      },
      {
        // width: 200,
        align: 'center',
        title: '记录时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        render: ({ id }) => {
          return (
            <Fragment>
              <a onClick={() => onClick('edit', id)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => deleted(id)}>删除</a>
            </Fragment>
          );
        },
      },
    ];
    return columns;
  }

  fetchDataSource = (params) => {
    const { fetch, customerId } = this.props;
    const client = customerId ? { client_id: customerId } : {};
    const newParams = {
      ...params,
      ...client,
    };
    fetch(newParams);
  }

  render() {
    const { notes, loading } = this.props;
    const extraOperator = [
      (
        <Button
          type="primary"
          icon="plus"
          key="plus"
          onClick={() => {
            this.props.history.push('/client/notepad/list/add');
          }}
        >
          新建录入
        </Button>
      ),
    ];
    return (
      <OATable
        serverSide
        data={notes.data}
        loading={loading}
        total={notes.total}
        columns={this.makeColumns()}
        fetchDataSource={this.fetchDataSource}
        extraOperator={extraOperator}
      />
    );
  }
}
