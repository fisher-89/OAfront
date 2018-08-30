import React from 'react';
import { connect } from 'dva';

export default type => (Compoent) => {
  @connect(({ customer, loading }) => ({
    noteLogs: customer.noteLogs,
    clientLogs: customer.clientLogs,
    loading: (
      loading.effects['customer/fetchClientLogs'] ||
      loading.effects['customer/fetchNoteLogs']
    ),
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

    makeProps = () => {
      const response = { loading: this.props.loading };
      if (type.indexOf('fetchClientLogs')) {
        response.fetchClientLogs = this.fetchClientLogs;
        response.clientLogs = this.props.clientLogs;
      }
      if (type.indexOf('fetchNoteLogs')) {
        response.fetchNoteLogs = this.fetchNoteLogs;
        response.noteLogs = this.props.response;
      }
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
