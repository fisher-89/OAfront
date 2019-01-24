import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';

export default type => (Component) => {
  @connect(({ violation, loading }) => ({
    pushauth: violation.pushauth,
    loading: {
      fetchPushAuth: loading.effects['violation/fetchPushAuth'],
      deletePushAuth: loading.effects['violation/deletePushAuth'],
    },
  }))
  class NewCopmonent extends PureComponent {
    setPushAuth = (params, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: params.id ? 'violation/editPushAuth' : 'violation/addPushAuth',
        payload: params,
        onSuccess,
        onError,
      });
    }

    deletePushAuth = (id) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/deletePushAuth', payload: { id } });
    }

    fetchPushAuth = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchPushAuth', payload: params });
    }
    render() {
      return (
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return NewCopmonent;
};
