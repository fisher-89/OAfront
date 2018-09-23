import React, { PureComponent } from 'react';
import moment from 'moment';
import store from './store';
import SearchTable from '../index';
import OATable from '../../../OATable';
import { customerStatus } from '../../../../assets/customer';
import { getFiltersData, makerFilters } from '../../../../utils/utils';

@store
export default class Customer extends PureComponent {
  state = {
    searcherParams: '',
  };

  makeColumns = () => {
    const { source, tags, brands, staffBrandsAuth } = this.props;
    const { editable = [] } = staffBrandsAuth;
    const brandData = brands.filter(item => editable.indexOf(item.id) !== -1);
    const columns = [
      {
        align: 'center',
        title: '客户姓名',
        dataIndex: 'name',
        width: 160,
        searcher: true,
        fixed: 'left',
      },
      {
        align: 'center',
        title: '电话',
        dataIndex: 'mobile',
        width: 160,
        searcher: true,
      },
      {
        align: 'center',
        title: '客户来源',
        dataIndex: 'source_id',
        width: 120,
        filters: getFiltersData(source),
        render: (key) => {
          const value = source.find(item => item.id === key) || {};
          return value.name;
        },
      },
      {
        align: 'center',
        title: '客户状态',
        width: 120,
        dataIndex: 'status',
        filters: getFiltersData(customerStatus),
        render: key => OATable.findRenderKey(customerStatus, key).name,
      },
      {
        width: 160,
        align: 'center',
        title: '合作品牌',
        filters: getFiltersData(brandData),
        dataIndex: 'brands.brand_id',
        render: (_, record) => OATable.analysisColumn(brandData, record.brands, 'brand_id'),
      },
      {
        width: 120,
        align: 'center',
        title: '合作时间',
        dataIndex: 'first_cooperation_at',
        sorter: true,
        render: time => moment(time).format('YYYY-MM-DD'),
      },
      {
        width: 160,
        title: '维护人',
        align: 'center',
        dataIndex: 'vindicator_name',
        searcher: true,
      },
      {
        // width: 320,
        title: '标签',
        align: 'center',
        dataIndex: 'tags.tag_id',
        filters: getFiltersData(tags),
        render: (_, record) => OATable.analysisColumn(tags, record.tags, 'tag_id'),
      },
    ];
    return columns;
  }

  makeStaffProps = () => {
    const {
      loading,
      searcherTotal,
      searcherResult,
    } = this.props;
    const { searcherParams } = this.state;
    const tableProps = {
      index: 'id',
      scroll: { x: 1200 },
      total: searcherTotal[searcherParams],
      data: searcherResult[searcherParams],
      loading,
    };
    tableProps.columns = this.makeColumns();
    return tableProps;
  };

  makeSearchTableProps = () => {
    const { staffBrandsAuth } = this.props;
    const { editable = [] } = staffBrandsAuth;
    const response = {
      valueName: 'id',
      ...this.props,
      tableProps: {
        ...this.makeStaffProps(),
        fetchDataSource: (_, params) => {
          let newParams = { ...params };
          if (!newParams.filters['brands.brand_id']) {
            newParams.filters['brands.brand_id'] = `[${editable.join(',')}]`;
          }
          newParams = makerFilters(newParams);
          const jsonStrParams = { ...newParams };
          delete jsonStrParams.update;
          this.setState({ searcherParams: JSON.stringify(jsonStrParams) }, () => {
            this.props.fetch(newParams);
          });
        },
      },
    };
    return response;
  }

  render() {
    return (
      <SearchTable
        {...this.makeSearchTableProps()}
      />
    );
  }
}

Customer.defaultProps = {
  multiple: false,
  disabled: false,
  showName: 'name',
  name: {
    id: 'id',
    name: 'name',
  },
  title: '客户选择',
  placeholder: '请选择客户',
  filters: {},
  width: 800,
  onChange: () => { },
};
