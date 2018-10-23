import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';


export default type => (Component) => {
  @connect(({ customer, brand, loading }) => ({
    brands: brand.brand,
    noteLogs: customer.noteLogs,
    clientLogs: customer.clientLogs,
    loading: {
      fetchClientLogs: loading.effects['customer/fetchClientLogs'],
      fetchNoteLogs: loading.effects['customer/fetchNoteLogs'],
      fetchBrand: loading.effects['customer/fetchBrand'],
      clientReduction: loading.effects['customer/clientReduction'],
    },
  }))
  class NewComponent extends React.PureComponent {
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

    clientReduction = (id, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'customer/clientReduction',
        payload: { id },
        onSuccess,
      });
    }

    render() {
      return (
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return NewComponent;
};
