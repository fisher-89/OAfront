import React, { PureComponent, Fragment } from 'react';
import { Divider, Button } from 'antd';
import OATable from '../../../components/OATable';
import NewForm from './form';
import store from './store/store';

@store()
export default class extends PureComponent {
  state = {
    visible: false,
    initialValue: {},
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag, initialValue: {} });
  }

  handleEdit = (data) => {
    this.setState({ visible: true, initialValue: data });
  }

  makeColumns = () => {
    const { deletePushAuth } = this.props;
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'staff_name',
      },
      {
        title: '推送地址名称',
        dataIndex: 'flock_name',
      },
      {
        title: '是否默认选择',
        dataIndex: 'default_push',
        render: key => (key ? '是' : '否'),
      },
      {
        title: '操作',
        render: (rowData) => {
          return (
            <Fragment>
              <a onClick={() => this.handleEdit(rowData)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => deletePushAuth(rowData.id)}>删除</a>
            </Fragment>
          );
        },
      },
    ];
    return columns;
  }

  makeExtraOperator = () => {
    const extra = [];
    extra.push((
      <Button
        icon="plus"
        key="plus"
        type="primary"
        style={{ marginLeft: '10px' }}
        onClick={() => this.handleModalVisible(true)}
      >
        添加配置
      </Button>
    ));
    return extra;
  }

  render() {
    const { dinggroup, fetchDingGroup, fetchPushAuth, setPushAuth, pushauth, loading } = this.props;
    const { initialValue, visible } = this.state;
    return (
      <Fragment>
        <OATable
          data={pushauth}
          fetchDataSource={fetchPushAuth}
          columns={this.makeColumns()}
          loading={loading}
          extraOperator={this.makeExtraOperator()}
        />
        <NewForm
          fetchDingGroup={fetchDingGroup}
          dinggroup={dinggroup}
          initialValue={initialValue}
          visible={visible}
          setPushAuth={setPushAuth}
          onCancel={this.handleModalVisible}
        />
      </Fragment>
    );
  }
}
