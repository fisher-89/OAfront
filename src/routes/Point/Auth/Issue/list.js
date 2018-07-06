import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Divider,
} from 'antd';
import { connect } from 'dva';

import OATable from '../../../../components/OATable';
import TaskAuthForm from './form';
import { customerAuthority } from '../../../../utils/utils';
@connect(({ point, loading }) => ({
  taskAuth: point.taskAuth,
  authLoading: loading.effects['point/fetchTaskAuth'],
  deleteLoaing: loading.effects['point/deleteTaskAuth'],
}))
export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'department/fetchDepartment', payload: {} });
  }

  fetchTaskAuth = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/fetchTaskAuth', payload: params });
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  handleEdit = (data) => {
    this.setState({
      editInfo: {
        ...data,
        auth: { group_id: data.id, name: data.name },
      },
    }, () => this.handleModalVisible(true));
  }

  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/deleteTaskAuth', payload: { id } });
  }

  makeColumns = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '组成员',
        dataIndex: 'admin_name',
        render: (_, record) => {
          const name = record.administrator.map(item => item.admin_name);
          return name.join(',');
        },
      },
      {
        title: '分组名称',
        dataIndex: 'name',
      },
    ];
    if (customerAuthority([171, 170])) {
      columns.push(
        {
          title: '操作',
          render: (rowData) => {
            return (
              <Fragment>
                {customerAuthority(171) && (
                  <a onClick={() => this.handleEdit(rowData)}>编辑</a>
                )}
                <Divider type="vertical" />
                {customerAuthority(170) && (
                  <a onClick={() => this.handleDelete(rowData.id)}>删除</a>
                )}
              </Fragment>
            );
          },
        }
      );
    }
    return columns;
  }

  makeExtraOperator = () => {
    const extra = [];
    if (customerAuthority(169)) {
      extra.push((
        <Button
          icon="plus"
          key="plus"
          type="primary"
          style={{ marginLeft: '10px' }}
          onClick={() => this.handleModalVisible(true)}
        >
          添加分组
        </Button>
      ));
    }
    return extra;
  }

  render() {
    const { taskAuth, authLoading, deleteLoaing } = this.props;
    const { visible, editInfo } = this.state;
    return (
      <React.Fragment>
        {
          (customerAuthority([169, 171])) &&
          (
            <TaskAuthForm
              initialValue={editInfo}
              visible={visible}
              onCancel={() => { this.setState({ editInfo: {} }); }}
              handleVisible={this.handleModalVisible}
            />
          )
        }
        <OATable
          serverSide
          loading={authLoading || deleteLoaing}
          extraOperator={this.makeExtraOperator()}
          columns={this.makeColumns()}
          dataSource={taskAuth && taskAuth.data}
          total={taskAuth && taskAuth.total}
          filtered={taskAuth && taskAuth.filtered}
          fetchDataSource={this.fetchTaskAuth}
          scroll={{ x: 300 }}
        />
      </React.Fragment>
    );
  }
}
