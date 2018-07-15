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
        title: '员工号',
        dataIndex: 'admin_sn',
        searcher: true,
      },
      {
        title: '管理员',
        dataIndex: 'admin_name',
        searcher: true,
      },
      {
        title: '关联组',
        dataIndex: 'groups',
        render: (groups) => {
          const names = groups.map(item => item.name);
          return names.join(' ，');
        },
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
                  <a onClick={() => this.handleDelete(rowData.admin_sn)}>删除</a>
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
          添加管理
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
          rowKey={record => (record.admin_sn)}
          loading={authLoading || deleteLoaing}
          extraOperator={this.makeExtraOperator()}
          columns={this.makeColumns()}
          dataSource={taskAuth}
          fetchDataSource={this.fetchTaskAuth}
          scroll={{ x: 300 }}
        />
      </React.Fragment>
    );
  }
}
