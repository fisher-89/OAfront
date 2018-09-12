import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';


export default type => (Compoent) => {
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
  class NewCompoent extends React.PureComponent {
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
        <Compoent {...makeProps(this, type)} />
      );
    }
  }
  return NewCompoent;
};
