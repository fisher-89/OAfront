import React from 'react';
import { connect } from 'dva';

export default (Compoent) => {
  @connect(({ customer, brand, loading }) => ({
    brands: brand.brand,
    source: customer.source,
    tags: customer.tags,
    loading: (
      loading.effects['brand/fetchBrand'] ||
      loading.effects['customer/fetchSource'] ||
      loading.effects['customer/fetchTags'] ||
      loading.effects['customer/fetchCustomer']
    ),
  }))
  class NewCompoent extends React.PureComponent {
    componentWillMount() {
      this.fetchStore();
    }

    fetchDataSource = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchCustomer', payload: params });
    }

    fetchStore() {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchSource' });
      dispatch({ type: 'customer/fetchTags' });
      dispatch({ type: 'brand/fetchBrand' });
    }

    render() {
      return (
        <Compoent
          {...this.props}
          fetch={this.fetchDataSource}
        />
      );
    }
  }
  return NewCompoent;
};
