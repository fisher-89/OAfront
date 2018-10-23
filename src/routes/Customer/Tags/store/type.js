import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';


export default type => (Component) => {
  @connect(({ customer, loading }) => ({
    tagsType: customer.tagsType,
    loading: {
      deleted: loading.effects['customer/deleteTagsType'],
      fetchTagsType: loading.effects['customer/fetchTagsType'],
      submit: (
        loading.effects['customer/addTagsType'] ||
        loading.effects['customer/editTagsType']
      ),
    },
  }))
  class NewComponent extends React.PureComponent {
    fetchTagsType = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchTagsType', payload: params });
    }

    deleted = (id, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'customer/deleteTagsType',
        payload: { id },
        onSuccess,
        onError,
      });
    }

    submit = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: values.id ? 'customer/editTagsType' : 'customer/addTagsType',
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
