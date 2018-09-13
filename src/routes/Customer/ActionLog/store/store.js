import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';


export default type => (Compoent) => {
  @connect(({ customer, brand, loading }) => ({
    brands: brand.brand,
    noteLogs: customer.noteLogs,
    clientLogs: customer.clientLogs,
    loading: {
      fetchClientLogs: loading.effects['customer/fetchClientLogs'],
      fetchNoteLogs: loading.effects['customer/fetchNoteLogs'],
      fetchBrand: loading.effects['customer/fetchBrand'],
    },
  }))
  class NewCompoent extends React.PureComponent {
    fetchClientLogs = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchClientLogs', payload: params });
    }

    fetchNoteLogs = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchNoteLogs', payload: params });
    }

    fetchBrand = () => {
      const { dispatch } = this.props;
      dispatch({ type: 'brand/fetchBrand' });
    }

    render() {
      return (
        <Compoent {...makeProps(this, type)} />
      );
    }
  }
  return NewCompoent;
};
