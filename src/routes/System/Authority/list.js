import React, { PureComponent, Fragment } from 'react';
import {
  Row,
  Col,
  Modal,
  Button,
  Divider,
} from 'antd';
import { connect } from 'dva';

import OATable from '../../../components/OATable';
import AuthForm from './form';
import AuthTree from './authTree';
import { checkAuthority } from '../../../utils/utils';
@connect(({ authority, loading }) => ({
  authority: authority.authority,
  fLoading: loading.effects['authority/fetchAuth'],
  loading: (
    loading.effects['authority/addAuth'] ||
    loading.effects['authority/editAuth']
  ),
}))
export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
    filters: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'authority/fetchAuth' });
  }

  setAuthId = (id) => {
    const ids = this.props.authority.filter((item) => {
      return `${item.id}` === `${id}` || `${item.parent_id}` === `${id}`;
    }).map(item => `${item.id}`);
    this.setState({ filters: { id: ids } });
  }

  fetchAuth = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'authority/fetchAuth', payload: params });
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  handleEdit = (data) => {
    this.setState({ editInfo: data }, () => this.handleModalVisible(true));
  }

  handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除?',
      cancelText: '取消',
      okText: '确认',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'authority/deleteAuth',
          payload: { id },
        });
      },
      onCancel: () => {},
    });
  }

  makeColumns = () => {
    const isMenu = ['否', '是'];
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        searcher: true,
        onFilter: (value, record) => {
          const { filters: { id } } = this.state;
          return id.indexOf(`${record.id}`) !== -1;
        },
      },
      {
        title: '权限名称',
        dataIndex: 'auth_name',
        searcher: true,
      },
      {
        title: '关联 URI',
        dataIndex: 'full_url',
      },
      {
        title: '是否为菜单',
        dataIndex: 'is_menu',
        filters: isMenu.map((item, i) => {
          return { text: item, value: i };
        }),
        render: val => isMenu[val],
      },
      {
        title: '菜单名称',
        dataIndex: 'menu_name',
        searcher: true,
      },
      {
        title: '菜单图标',
        dataIndex: 'menu_logo',
      },
    ];

    if (checkAuthority(63) || checkAuthority(64)) {
      columns.push(
        {
          title: '操作',
          render: (rowData) => {
            return (
              <Fragment>
                {checkAuthority(63) && (
                  <a onClick={() => this.handleEdit(rowData)}>编辑</a>
                )}
                <Divider type="vertical" />
                {checkAuthority(64) && (
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
    if (checkAuthority(62)) {
      extra.push((
        <Button
          icon="plus"
          key="plus"
          type="primary"
          style={{ marginLeft: '10px' }}
          onClick={() => this.handleModalVisible(true)}
        >
        权限菜单
        </Button>
      ));
    }
    return extra;
  }

  render() {
    const { authority, fLoading, loading } = this.props;
    const { visible, editInfo, filters } = this.state;
    return (
      <Row gutter={16}>
        <Col span={4} style={{ borderRight: '1px solid #e8e8e8' }}>
          <AuthTree dataSource={authority} fetchDataSource={this.setAuthId} />
        </Col>
        <Col span={20}>
          {
            (checkAuthority(63) || checkAuthority(64)) &&
            (
              <AuthForm
                treeData={authority}
                loading={loading}
                initialValue={editInfo}
                visible={visible}
                onCancel={() => { this.setState({ editInfo: {} }); }}
                handleVisible={this.handleModalVisible}
              />
            )
          }
          <OATable
            filters={filters}
            serverSide={false}
            loading={fLoading || false}
            extraOperator={this.makeExtraOperator()}
            columns={this.makeColumns()}
            dataSource={authority}
            fetchDataSource={this.fetchAuth}
          />
        </Col>
      </Row>
    );
  }
}
