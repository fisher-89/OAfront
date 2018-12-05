import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Divider,
} from 'antd';
import { connect } from 'dva';

import OATable from '../../../../components/OATable';
import AuthForm from './form';
import { checkAuthority } from '../../../../utils/utils';
@connect(({ point, department, loading }) => ({
  auth: point.auth,
  authLoading: loading.effects['point/fetchAuth'],
  deleteLoaing: loading.effects['point/deleteAuth'],
  department: department.department,
  departLoading: loading.department,
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

  fetchAuth = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/fetchAuth', payload: params });
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  handleEdit = (data) => {
    this.setState({ editInfo: data }, () => this.handleModalVisible(true));
  }

  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/deleteAuth', payload: { id } });
  }

  makeColumns = () => {
    const { department } = this.props;
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        searcher: true,
      },
      {
        title: '分组名称',
        dataIndex: 'name',
        searcher: true,
      },
      {
        title: '组部门',
        dataIndex: 'departments.department_id',
        treeFilters: {
          title: 'full_name',
          value: 'id',
          parentId: 'parent_id',
          data: department.map(item => item),
        },
        render: (_, recode) => {
          const name = recode.departments.map(item => item.department_full_name);
          return name.join(',');
        },
      },
      {
        title: '组成员',
        dataIndex: 'staff.staff_name',
        searcher: true,
        render: (_, recode) => {
          const name = recode.staff.map(item => item.staff_name);
          return name.join(',');
        },
      },
    ];
    if (checkAuthority(147) || checkAuthority(148)) {
      columns.push(
        {
          title: '操作',
          render: (rowData) => {
            return (
              <Fragment>
                {checkAuthority(147) && (
                  <a onClick={() => this.handleEdit(rowData)}>编辑</a>
                )}
                <Divider type="vertical" />
                {checkAuthority(148) && (
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
    if (checkAuthority(146)) {
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
    const { auth, departLoading, authLoading, deleteLoaing } = this.props;
    const { visible, editInfo } = this.state;
    return (
      <React.Fragment>
        {
          (checkAuthority(146) || checkAuthority(147)) &&
          (
            <AuthForm
              initialValue={editInfo}
              visible={visible}
              onCancel={() => { this.setState({ editInfo: {} }); }}
              handleVisible={this.handleModalVisible}
            />
          )
        }

        <OATable
          serverSide
          loading={authLoading || departLoading || deleteLoaing}
          extraOperator={this.makeExtraOperator()}
          columns={this.makeColumns()}
          dataSource={auth && auth.data}
          total={auth && auth.total}
          filtered={auth && auth.filtered}
          fetchDataSource={this.fetchAuth}
          scroll={{ x: 300 }}
        />
      </React.Fragment>
    );
  }
}
