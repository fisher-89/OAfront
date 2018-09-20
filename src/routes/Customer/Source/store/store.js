import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';


export default type => (Compoent) => {
  @connect(({ customer, loading }) => ({
    source: customer.source,
    loading: {
      deleted: loading.effects['customer/deleteSource'],
      fetchSource: loading.effects['customer/fetchSource'],
      submit: (
        loading.effects['customer/addSource'] ||
        loading.effects['customer/editSource']
      ),
    },
  }))
  class NewCompoent extends React.PureComponent {
    fetchSource = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchSource', payload: params });
    }

    deleted = (id, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'customer/deleteSource',
        payload: { id },
        onSuccess,
        onError,
      });
    }

    submit = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: values.id ? 'customer/editSource' : 'customer/addSource',
        payload: values,
        onSuccess,
        onError,
      });
    }

    render() {
      return (
        <Compoent {...makeProps(this, type)} />
      );
    }
  }
  return NewCompoent;
};
