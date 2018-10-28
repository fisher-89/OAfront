import React, { PureComponent, Fragment } from 'react';
import {
  Modal,
  Button,
  Divider,

} from 'antd';
import { connect } from 'dva';

import OATable from '../../../components/OATable';
import Ellipsis from '../../../components/Ellipsis/index';
import ShopForm from './form';
import { customerAuthority } from '../../../utils/utils';
@connect(({ shop, loading }) => ({
  shop: shop.shop,
  sLoading: loading.effects['shop/fetchShop'],
}))
export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
  }

  fetchShop = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'shop/fetchShop', payload: params });
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
          type: 'shop/deleteShop',
          payload: { id },
        });
      },
      onCancel: () => {},
    });
  }

  makeColumns = () => {
    const columns = [
      {
        title: '店铺代码',
        dataIndex: 'shop_sn',
        searcher: true,
      },
      {
        title: '店铺名称',
        dataIndex: 'name',
        searcher: true,
        width: 250,
      },
      {
        title: '所属部门',
        dataIndex: 'department.name',
        searcher: true,
        render: val => (val || '未分配'),
      },
      {
        title: '所属品牌',
        dataIndex: 'brand.name',
        searcher: true,
        render: val => (val || '未分配'),
      },
      {
        title: '店铺地址',
        dataIndex: 'address',
        searcher: true,
        width: 250,
      },
      {
        title: '上班时间',
        dataIndex: 'clock_in',
      },
      {
        title: '下班时间',
        dataIndex: 'clock_out',
      },
      {
        title: '店长',
        dataIndex: 'manager_name',
        render: val => (val || '暂无'),
      },
      {
        title: '店长电话',
        dataIndex: 'manager_mobile',
        width: 120,
        render: val => (val || '暂无'),
      },
      {
        title: '店员',
        dataIndex: 'staff',
        width: 300,
        render: (staff) => {
          const staffStr = staff.map(item => item.realname).join(',');
          return (<Ellipsis tooltip lines={1} style={{ width: 155 }}>{staffStr}</Ellipsis>);
        },
      },
    ];

    if (customerAuthority(72) || customerAuthority(73)) {
      columns.push(
        {
          title: '操作',
          render: (rowData) => {
            return (
              <Fragment>
                {customerAuthority(72) && (
                  <a onClick={() => this.handleEdit(rowData)}>编辑</a>
                )}
                <Divider type="vertical" />
                {customerAuthority(73) && (
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
    if (customerAuthority(71)) {
      extra.push((
        <Button
          icon="plus"
          key="plus"
          type="primary"
          style={{ marginLeft: '10px' }}
          onClick={() => this.handleModalVisible(true)}
        >
          添加店铺
        </Button>
      ));
    }
    return extra;
  }

  render() {
    const { shop, sLoading } = this.props;
    const { visible, editInfo } = this.state;
    return (
      <React.Fragment>
        {
          (customerAuthority(72) || customerAuthority(73)) &&
          (
            <React.Fragment>
              <ShopForm
                initialValue={editInfo}
                visible={visible}
                onCancel={() => { this.setState({ editInfo: {} }); }}
                handleVisible={this.handleModalVisible}
              />
            </React.Fragment>
          )
        }
        <OATable
          serverSide
          extraColumns
          loading={sLoading || false}
          extraOperator={this.makeExtraOperator()}
          columns={this.makeColumns()}
          dataSource={shop && shop.data}
          total={shop && shop.total}
          filtered={shop && shop.filtered}
          fetchDataSource={this.fetchShop}
          scroll={{ x: 1200 }}
        />
      </React.Fragment>
    );
  }
}
