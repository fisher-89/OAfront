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
        dataIndex: 'brand',
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
        dataIndex: 'time',
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
            this.props.history.push('/client/notepad/add');
          }}
        >
          新建录入
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
