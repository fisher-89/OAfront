import React, { PureComponent, Fragment } from 'react';
import {
  Modal,
  Button,
  Divider,
} from 'antd';
import { connect } from 'dva';

import OATable from '../../../components/OATable';
import BrandForm from './form';
import { customerAuthority } from '../../../utils/utils';
@connect(({ brand, loading }) => ({
  brand: brand.brand,
  fLoading: loading.effects['brand/fetchBrand'],
  dLoaing: loading.effects['brand/deleteBrand'],
}))
export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
  }

  fetchBrand = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'brand/fetchBrand', payload: params });
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
          type: 'brand/deleteBrand',
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
        searcher: true,
      },
      {
        title: '职位名称',
        dataIndex: 'name',
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
    ];

    if (customerAuthority(63) || customerAuthority(64)) {
      columns.push(
        {
          title: '操作',
          render: (rowData) => {
            return (
              <Fragment>
                {customerAuthority(63) && (
                  <a onClick={() => this.handleEdit(rowData)}>编辑</a>
                )}
                <Divider type="vertical" />
                {customerAuthority(64) && (
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
    if (customerAuthority(62)) {
      extra.push((
        <Button
          icon="plus"
          key="plus"
          type="primary"
          style={{ marginLeft: '10px' }}
          onClick={() => this.handleModalVisible(true)}
        >
          添加品牌
        </Button>
      ));
    }
    return extra;
  }

  render() {
    const { brand, fLoading, dLoading } = this.props;
    const { visible, editInfo } = this.state;
    return (
      <React.Fragment>
        {
          (customerAuthority(63) || customerAuthority(64)) &&
          (
            <BrandForm
              initialValue={editInfo}
              visible={visible}
              onCancel={() => { this.setState({ editInfo: {} }); }}
              handleVisible={this.handleModalVisible}
            />
          )
        }
        <OATable
          serverSide
          loading={fLoading || dLoading || false}
          extraOperator={this.makeExtraOperator()}
          columns={this.makeColumns()}
          dataSource={brand && brand.data}
          total={brand && brand.total}
          filtered={brand && brand.filtered}
          fetchDataSource={this.fetchBrand}
        />
      </React.Fragment>
    );
  }
}
