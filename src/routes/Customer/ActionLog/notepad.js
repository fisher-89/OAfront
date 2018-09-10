import React, { PureComponent, Fragment } from 'react';
// import { connect } from 'dva';
import {
  Card,
  Drawer,
  Divider,
} from 'antd';
import store from './store/store';
import OATable from '../../../components/OATable';
import NotepadInfo from './notepad/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

@store('fetchNoteLogs')
export default class extends PureComponent {
  state = {
    visible: false,
  }

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
        // width: 100,
        align: 'center',
        title: '操作人',
        dataIndex: 'staff_name',
        searcher: true,
      },
      {
        // width: 100,
        align: 'center',
        title: '事件标题',
        dataIndex: 'title',
        searcher: true,
      },
      {
        // width: 100,
        align: 'center',
        title: '客户',
        searcher: true,
        dataIndex: 'client_name',
      },
      {
        title: '查看',
        render: () => {
          return (
            <Fragment>
              <a >编辑</a>
              <Divider type="vertical" />
              <a onClick={() => { this.setState({ visible: true }); }}>详细信息</a>
            </Fragment>
          );
        },
      },
    ];
    return columns;
  }

  render() {
    const { fetchNoteLogs, clientLogs } = this.props;
    const { visible } = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <OATable
            serverSide
            data={clientLogs.data || [{ id: '1' }]}
            total={clientLogs.total}
            columns={this.makeColumns()}
            fetchDataSource={fetchNoteLogs}
          />
          <Drawer
            width={400}
            visible={visible}
            onClose={() => { this.setState({ visible: false }); }}
          >
            <NotepadInfo />
          </Drawer>
        </Card>
      </PageHeaderLayout>
    );
  }
}
