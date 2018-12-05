import React, { PureComponent, Fragment } from 'react';
import {
  Modal,
  Button,
  Divider,
} from 'antd';
import { connect } from 'dva';

import { checkAuthority } from 'utils/utils';
import OATable from 'components/OATable';
import Ellipsis from 'components/Ellipsis/index';
import BrandForm from './form';

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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'brand/fetchBrand' });
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
        sorter: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        searcher: true,
      },
      {
        title: '关联费用品牌',
        align: 'center',
        dataIndex: 'cost_brands',
        searcher: true,
        render: (brand) => {
          const brandStr = (brand || []).map(item => item.name).join(',');
          return (<Ellipsis tooltip lines={2}>{brandStr}</Ellipsis>);
        },
        onFilter: (value, brand) => {
          const brandStr = (brand.cost_brands || []).map(item => item.name);
          return brandStr.indexOf(value) !== -1;
        },
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
          (checkAuthority(63) || checkAuthority(64)) &&
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
          serverSide={false}
          loading={fLoading || dLoading || false}
          extraOperator={this.makeExtraOperator()}
          columns={this.makeColumns()}
          dataSource={brand}
          fetchDataSource={this.fetchBrand}
        />
      </React.Fragment>
    );
  }
}
