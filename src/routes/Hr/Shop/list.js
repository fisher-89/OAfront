import React, { PureComponent, Fragment } from 'react';
import {
  Modal,
  Button,
  Divider,

} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Search from './search';
import ShopForm from './form';
import ExportShop from './export';
import OATable from '../../../components/OATable';
import Ellipsis from '../../../components/Ellipsis/index';
import { checkAuthority, getFiltersData } from '../../../utils/utils';

const status = [
  { id: 1, name: '未营业' },
  { id: 2, name: '营业中' },
  { id: 3, name: '闭店' },
  { id: 4, name: '结束' },
];

@connect(({ shop, loading, department, brand }) => ({
  brand: brand.brand,
  shop: shop.shop,
  department: department.department,
  sLoading: loading.effects['shop/fetchShop'],
  brandLoading: loading.effects['brand/fetchBrand'],
}))
export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
  }

  fetchShop = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'brand/fetchBrand' });
    dispatch({ type: 'department/fetchDepartment' });
    dispatch({ type: 'shop/fetchShop', payload: params });
    dispatch({ type: 'stafftags/fetchStaffTags', payload: { type: 'shops' } });
    this.searchFilter = params;
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  handleEdit = (data) => {
    this.setState({ editInfo: data }, () => this.handleModalVisible(true));
  }

  handleDelete = (shopSn) => {
    Modal.confirm({
      title: '确认删除?',
      cancelText: '取消',
      okText: '确认',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'shop/deleteShop',
          payload: { shop_sn: shopSn },
        });
      },
      onCancel: () => {},
    });
  }

  /* 店铺状态筛选 */
  statusSelect = (dataSource, value = 'id', text = 'name') => {
    return (dataSource || []).map(item => ({ value: item[value], text: item[text] }));
  }

  makeColumns = () => {
    const { department, brand, brandLoading } = this.props;
    const columns = [
      {
        title: '店铺代码',
        dataIndex: 'shop_sn',
        searcher: true,
        width: 100,
        fixed: 'left',
      },
      {
        title: '店铺名称',
        dataIndex: 'name',
        searcher: true,
        width: 250,
        fixed: 'left',
        render: key => OATable.renderEllipsis(key, true),
      },
      {
        title: '所属部门',
        dataIndex: 'department.id',
        align: 'center',
        treeFilters: {
          value: 'id',
          title: 'name',
          data: department,
          parentId: 'parent_id',
        },
        render: key => OATable.findRenderKey(department, key).name,
        width: 120,
      },
      {
        title: '所属品牌',
        dataIndex: 'brand.id',
        align: 'center',
        filters: getFiltersData(brand),
        loading: brandLoading,
        render: key => OATable.findRenderKey(brand, key).name,
        width: 150,
      },
      {
        title: '店铺地址',
        dataIndex: 'address',
        align: 'center',
        width: 300,
        searcher: true,
        render: (_, record) => {
          return OATable.renderEllipsis(record.full_address, true);
        },
      },
      {
        title: '店长',
        searcher: true,
        dataIndex: 'manager_name',
        render: val => (val || '暂无'),
        width: 60,
      },
      {
        title: '店长手机号',
        searcher: true,
        dataIndex: 'manager_mobile',
        render: key => OATable.renderEllipsis(key, true),
        width: 60,
      },
      {
        title: '驻店人',
        hidden: true,
        searcher: true,
        dataIndex: 'assistant_name',
        width: 60,
      },
      {
        title: '店员',
        hidden: true,
        searcher: true,
        dataIndex: 'staff.realname',
        render: (_, record) => {
          const staffStr = record.staff.map(item => item.realname).join(',');
          return (<Ellipsis tooltip lines={1}>{staffStr}</Ellipsis>);
        },
      },
      {
        title: '店铺标签',
        dataIndex: 'tags',
        searcher: true,
        align: 'center',
        render: (tags) => {
          const STR = tags.map(item => item.name).join(',');
          return (<Ellipsis tooltip lines={1}>{STR}</Ellipsis>);
        },
      },
      {
        title: '店铺状态',
        dataIndex: 'status_id',
        align: 'center',
        filters: this.statusSelect(status),
        render: (key) => {
          const current = status.filter(item => `${item.id}` === `${key}`).pop();
          return (current !== undefined) ? current.name : '';
        },
      },
      {
        title: '上班时间',
        hidden: true,
        dataIndex: 'clock_in',
        width: 100,
      },
      {
        title: '下班时间',
        hidden: true,
        dataIndex: 'clock_out',
        width: 100,
      },
      {
        title: '开业日期',
        hidden: true,
        dataIndex: 'opening_at',
        dateFilters: true,
        align: 'center',
        width: 110,
        render: time => (time ? moment(time).format('YYYY-MM-DD') : ''),
      },
      {
        title: '闭店日期',
        hidden: true,
        dataIndex: 'end_at',
        dateFilters: true,
        align: 'center',
        width: 110,
        render: time => (time ? moment(time).format('YYYY-MM-DD') : ''),
      },
    ];

    if (checkAuthority(72) || checkAuthority(73)) {
      columns.push(
        {
          title: '操作',
          fixed: 'right',
          width: 100,
          render: (rowData) => {
            return (
              <Fragment>
                {checkAuthority(72) && (
                  <a onClick={() => this.handleEdit(rowData)}>编辑</a>
                )}
                <Divider type="vertical" />
                {checkAuthority(73) && (
                  <a onClick={() => this.handleDelete(rowData.shop_sn)}>删除</a>
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
    const { shop: { total } } = this.props;
    if (checkAuthority(71)) {
      extra.push(
        <Button
          icon="plus"
          key="plus"
          type="primary"
          style={{ marginLeft: '10px' }}
          onClick={() => this.handleModalVisible(true)}
        >
          添加店铺
        </Button>
      );
    }
    if (checkAuthority(210)) {
      extra.push(<ExportShop key="exportBtn" filters={this.searchFilter} total={total} />);
    }

    return extra;
  }

  render() {
    const { shop, sLoading } = this.props;
    const { visible, editInfo } = this.state;
    return (
      <React.Fragment>
        {
          (checkAuthority(72) || checkAuthority(73)) &&
          (
            <React.Fragment>
              <ShopForm
                initialValue={editInfo}
                visible={visible}
                onCancel={() => {
                  this.setState({ visible: false, editInfo: {} });
                }}
              />
            </React.Fragment>
          )
        }
        <OATable
          bordered
          autoComplete
          serverSide
          moreSearch={<Search />}
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
