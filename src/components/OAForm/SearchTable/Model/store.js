import React from 'react';
import { connect } from 'dva';

export default (Compoent) => {
  @connect(({ customer, tableClients, brand, loading }) => ({
    brands: brand.brand,
    source: customer.source,
    tags: customer.tags,
    staffBrandsAuth: customer.staffBrandsAuth,
    searcherTotal: tableClients.totalResult,
    searcherResult: tableClients.tableResult,
    loading: (
      loading.effects['brand/fetchBrand'] ||
      loading.effects['customer/fetchSource'] ||
      loading.effects['customer/fetchTags'] ||
      loading.effects['tableClients/fetchCustomer']
      // loading.effects['customer/customerStaffBrandsAuth']
    ),
  }))
  class NewCompoent extends React.PureComponent {
    fetchDataSource = (params) => {
      const { dispatch } = this.props;
      this.fetchStore();
      dispatch({ type: 'tableClients/fetchCustomer', payload: params });
    }

    fetchTagsType = () => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchTagsType' });
    }


    fetchStore() {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchSource' });
      dispatch({ type: 'customer/fetchTags' });
      dispatch({ type: 'brand/fetchBrand' });
      // this.fetchStaffBrandsAuth();
    }

    fetchStaffBrandsAuth = () => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/customerStaffBrandsAuth' });
    }

    makeProps = () => {
      const response = {
        ...this.props,
        fetch: this.fetchDataSource,
      };
      return response;
    }

    render() {
      return (
        <Compoent {...this.makeProps()} />
      );
    }
  }
  return NewCompoent;
};
