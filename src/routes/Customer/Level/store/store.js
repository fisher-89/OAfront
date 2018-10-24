import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';


export default type => (Component) => {
  @connect(({ customer, loading }) => ({
    level: customer.level,
    loading: {
      deleted: loading.effects['customer/deleteLevel'],
      fetchLevel: loading.effects['customer/fetchLevel'],
      submit: (
        loading.effects['customer/addLevel'] ||
        loading.effects['customer/editLevel']
      ),
    },
  }))
  class NewComponent extends React.PureComponent {
    fetchLevel = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchLevel', payload: params });
    }

    deleted = (id, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'customer/deleteLevel',
        payload: { id },
        onSuccess,
        onError,
      });
    }

    submit = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: values.id ? 'customer/editLevel' : 'customer/addLevel',
        payload: values,
        onSuccess,
        onError,
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
