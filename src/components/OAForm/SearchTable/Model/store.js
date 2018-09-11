import React from 'react';
import { connect } from 'dva';

export default (Compoent) => {
  @connect(({ customer, brand, loading }) => ({
    brands: brand.brand,
    source: customer.source,
    tags: customer.tags,
    staffBrandsAuth: customer.staffBrandsAuth,
    loading: (
      loading.effects['brand/fetchBrand'] ||
      loading.effects['customer/fetchSource'] ||
      loading.effects['customer/fetchTags'] ||
      loading.effects['customer/fetchCustomer']
      // loading.effects['customer/customerStaffBrandsAuth']
    ),
  }))
  class NewCompoent extends React.PureComponent {
    fetchDataSource = (params) => {
      const { dispatch } = this.props;
      this.fetchStore();
      dispatch({ type: 'customer/fetchCustomer', payload: params });
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
        fetchTagsType: this.fetchTagsType,
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
