import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import { connect } from 'dva';
import { getBrandAuthority, getDepartmentAuthority } from '../../../../utils/utils';
import SearchTable from '../index';

@connect(({ department, brand, tableShop, loading }) => ({
  brand: brand.brand,
  brandLoading: loading.models.brand,
  department: department.department,
  departmentLoading: loading.effects['department/fetchDepartment'],
  searcherTotal: tableShop.totalResult,
  searcherResult: tableShop.tableResult,
  shopLoading: loading.models.tableShop,
}))

export default class Shop extends PureComponent {
  state = {
    searcherParams: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'brand/fetchBrand' });
    dispatch({ type: 'department/fetchDepartment', payload: {} });
  }

  fetchShop = (params) => {
    const { dispatch } = this.props;
    const jsonStrParams = { ...params };
    delete jsonStrParams.update;
    this.setState({ searcherParams: JSON.stringify(jsonStrParams) }, () => {
      dispatch({ type: 'tableShop/fetchShop', payload: params });
    });
  };

  makeColumns = () => {
    const { brand, department, authority } = this.props;
    let brandFilters = [];
    if (brand) {
      brand.forEach((item) => {
        if (getBrandAuthority(item.id)) {
          brandFilters.push({ text: item.name, value: item.id });
        }
      });
    }
    brandFilters = access ? brandFilters : (
      brand.map(item => ({ text: item.name, value: item.id }))
    );
    let access = false;
    if (authority) {
      access = true;
    }
    return [
      {
        title: '编号',
        dataIndex: 'shop_sn',
        width: 100,
        sorter: true,
        searcher: true,
      },
      {
        title: '店铺',
        dataIndex: 'name',
        width: 200,
        searcher: true,
      },
      {
        title: '品牌',
        align: 'center',
        dataIndex: 'brand_id',
        width: 100,
        filters: access ? brandFilters : brand.map(item => ({ text: item.name, value: item.id })),
        render: (val) => {
          const data = brand && brand.filter(item => item.id === val)[0];
          return data ? data.name : '';
        },
      }, {
        title: '部门',
        dataIndex: 'department_id',
        width: 200,
        treeFilters: {
          title: 'full_name',
          value: 'id',
          parentId: 'parent_id',
          data: department && department.map((item) => {
            const temp = { ...item };
            if (access) {
              temp.disabled = !getDepartmentAuthority(item.id);
            }
            return temp;
          }),
        },
        render: (val) => {
          const data = department && department.filter(item => item.id === val)[0];
          const fullName = data ? data.full_name : '';
          return (
            <Tooltip title={fullName} placement="right">
              {fullName.length > 9 ? `${fullName.substr(0, 9)}...` : fullName}
            </Tooltip>
          );
        },
      },
      {
        title: '店员',
        dataIndex: 'staff.realname',
        searcher: true,
        render: (_, record) => {
          const shopStaff = record.staff.map(item => item.realname).join(',');
          return (
            <Tooltip title={shopStaff} placement="right">
              {shopStaff.length > 9 ? `${shopStaff.substr(0, 9)}...` : shopStaff}
            </Tooltip>
          );
        },
      },
    ];
  }

  makeShopProps = () => {
    const {
      shopLoading,
      brandLoading,
      searcherTotal,
      searcherResult,
      departmentLoading,
    } = this.props;
    const { searcherParams } = this.state;
    const tableProps = {
      index: 'shop_sn',
      scroll: { x: 760 },
      rowKey: record => record.shop_sn,
      total: searcherTotal[searcherParams],
      data: searcherResult[searcherParams],
      loading: (shopLoading || brandLoading || departmentLoading),
    };

    tableProps.columns = this.makeColumns();
    return tableProps;
  };

  makeSearchTableProps = () => {
    const response = {
      valueName: 'shop_sn',
      ...this.props,
      tableProps: {
        ...this.makeShopProps(),
        fetchDataSource: this.fetchShop,
      },
    };
    return response;
  }

  render() {
    return (
      <SearchTable {...this.makeSearchTableProps()} />
    );
  }
}

Shop.defaultProps = {
  multiple: false,
  disabled: false,
  name: {
    shop_sn: 'shop_sn',
    shop_name: 'name',
  },
  showName: 'shop_name',
  title: '店铺',
  placeholder: '请选择',
  filters: {},
  width: 800,
  onChange: () => { },
};

