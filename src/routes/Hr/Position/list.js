import React, { PureComponent, Fragment } from 'react';
import {
  Modal,
  Button,
  Divider,
} from 'antd';
import { connect } from 'dva';

import OATable from '../../../components/OATable';
import PositionForm from './form';
import { checkAuthority } from '../../../utils/utils';
@connect(({ position, brand, loading }) => ({
  brand: brand.brand,
  position: position.position,
  fLoading: loading.effects['position/fetchPosition'],
  dLoaing: loading.effects['position/deletePosition'],
}))
export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'brand/fetchBrand' });
    dispatch({ type: 'position/fetchPosition' });
  }

  fetchPosition = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'position/fetchPosition', payload: params });
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
          type: 'position/deletePosition',
          payload: { id },
        });
      },
      onCancel: () => {},
    });
  }

  makeColumns = () => {
    const isPublic = ['否', '是'];
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        sorter: true,
      },
      {
        title: '职位名称',
        dataIndex: 'name',
        searcher: true,
      },
      {
        title: '职级',
        dataIndex: 'level',
        searcher: true,
      },
      {
        title: '是否共享',
        dataIndex: 'is_public',
        filters: isPublic.map((item, i) => {
          return { text: item, value: i };
        }),
        render: val => isPublic[val],
      },
      {
        title: '关联品牌',
        dataIndex: 'brands',
        render: (val) => {
          let brandStr = '';
          val.forEach((item) => {
            brandStr += `${item.name}，`;
          });
          return brandStr.slice(0, -1);
        },
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
          添加职位
        </Button>
      ));
    }
    return extra;
  }

  render() {
    const { position, brand, fLoading, dLoading } = this.props;
    const { visible, editInfo } = this.state;
    return (
      <React.Fragment>
        {
          (checkAuthority(63) || checkAuthority(64)) &&
          (
            <PositionForm
              dataSource={brand}
              initialValue={editInfo}
              visible={visible}
              onCancel={() => { this.setState({ editInfo: {} }); }}
              handleVisible={this.handleModalVisible}
            />
          )
        }
        <OATable
          serverSide={false}
          loading={fLoading || dLoading || false}
          extraOperator={this.makeExtraOperator()}
          columns={this.makeColumns()}
          dataSource={position}
          fetchDataSource={this.fetchPosition}
        />
      </React.Fragment>
    );
  }
}
