import React, { PureComponent, Fragment } from 'react';
import {
  Modal,
  Button,
  Divider,
} from 'antd';
import { connect } from 'dva';

import OATable from '../../../components/OATable';
import Ellipsis from '../../../components/Ellipsis/index';
import BrandForm from './form';
import AuthForm from './authForm';
import StaffForm from './staffForm';
import { checkAuthority } from '../../../utils/utils';
@connect(({ roles, loading }) => ({
  roles: roles.roles,
  fLoading: loading.effects['roles/fetchRoles'],
}))
export default class extends PureComponent {
  state = {
    visible: false,
    authVisible: false,
    staffVisible: false,
    editRole: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'roles/fetchRoles' });
  }

  fetchRoles = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'roles/fetchRoles', payload: params });
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  handleAuthVisible = (flag) => {
    this.setState({ authVisible: !!flag });
  }

  handleStaffVisible = (flag) => {
    this.setState({ staffVisible: !!flag });
  }

  handleEdit = (data) => {
    this.setState({ editRole: data }, () => this.handleModalVisible(true));
  }

  handleAuth = (data) => {
    this.setState({ editRole: data }, () => this.handleAuthVisible(true));
  }

  handleStaff = (data) => {
    this.setState({ editRole: data }, () => this.handleStaffVisible(true));
  }

  handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除?',
      cancelText: '取消',
      okText: '确认',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'roles/deleteRole',
          payload: { id },
        });
      },
      onCancel: () => {},
    });
  }

  makeColumns = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        sorter: true,
      },
      {
        title: '角色名称',
        dataIndex: 'role_name',
        searcher: true,
      },
      {
        title: '关联员工',
        dataIndex: 'staff',
        searcher: true,
        width: 160,
        render: (staff) => {
          const staffStr = staff.map(item => item.realname).join(',');
          return (<Ellipsis tooltip lines={2} style={{ width: 155 }}>{staffStr}</Ellipsis>);
        },
        onFilter: (value, record) => {
          const staffStr = record.staff.map(item => item.realname);
          return staffStr.indexOf(value) !== -1;
        },
      },
      {
        title: '配属品牌',
        dataIndex: 'brand',
        searcher: true,
        render: (brand) => {
          const brandStr = brand.map(item => item.name).join(',');
          return (<Ellipsis tooltip lines={2} style={{ width: 155 }}>{brandStr}</Ellipsis>);
        },
        onFilter: (value, record) => {
          const brandStr = record.brand.map(item => item.name);
          return brandStr.indexOf(value) !== -1;
        },
      },
      {
        title: '配属部门',
        dataIndex: 'department',
        searcher: true,
        render: (department) => {
          const departmentStr = department.map(item => item.name).join(',');
          return (<Ellipsis tooltip lines={2} style={{ width: 155 }}>{departmentStr}</Ellipsis>);
        },
        onFilter: (value, record) => {
          const departmentStr = record.department.map(item => item.name);
          return departmentStr.indexOf(value) !== -1;
        },
      },
    ];

    if (checkAuthority(31)) {
      columns.push(
        {
          title: '操作',
          width: 140,
          fixed: 'right',
          render: (rowData) => {
            return (
              <Fragment>
                <div>
                  <a onClick={() => this.handleEdit(rowData)}>编辑</a>
                  <Divider type="vertical" />
                  <a onClick={() => this.handleAuth(rowData)}>权限管理</a>
                </div>
                <div>
                  <a onClick={() => this.handleStaff(rowData)}>关联员工</a>
                  <Divider type="vertical" />
                  <a onClick={() => this.handleDelete(rowData.id)}>删除</a>
                </div>
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
    if (checkAuthority(31)) {
      extra.push((
        <Button
          icon="plus"
          key="plus"
          type="primary"
          style={{ marginLeft: '10px' }}
          onClick={() => this.handleModalVisible(true)}
        >
          创建角色
        </Button>
      ));
    }
    return extra;
  }

  render() {
    const { roles, fLoading } = this.props;
    const { visible, authVisible, staffVisible, editRole } = this.state;
    return (
      <Fragment>
        {
          (checkAuthority(31)) &&
          (
            <Fragment>
              <BrandForm
                initialValue={editRole}
                visible={visible}
                onCancel={() => { this.setState({ editRole: {} }); }}
                handleVisible={this.handleModalVisible}
              />
              <AuthForm
                initialValue={editRole}
                visible={authVisible}
                onCancel={() => { this.setState({ editRole: {} }); }}
                handleVisible={this.handleAuthVisible}
              />
              <StaffForm
                initialValue={editRole}
                visible={staffVisible}
                onCancel={() => { this.setState({ editRole: {} }); }}
                handleVisible={this.handleStaffVisible}
              />
            </Fragment>
          )
        }
        <OATable
          serverSide={false}
          loading={fLoading || false}
          extraOperator={this.makeExtraOperator()}
          columns={this.makeColumns()}
          dataSource={roles}
          fetchDataSource={this.fetchRoles}
        />
      </Fragment>
    );
  }
}
