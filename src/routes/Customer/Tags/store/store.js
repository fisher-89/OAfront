import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';


export default type => (Component) => {
  @connect(({ customer, loading }) => ({
    tags: customer.tags,
    tagsType: customer.tagsType,
    loading: {
      deleted: loading.effects['customer/deleteTags'],
      fetchTags: loading.effects['customer/fetchTags'],
      fetchTagsType: loading.effects['customer/fetchTagsType'],
      submit: (
        loading.effects['customer/addTags'] ||
        loading.effects['customer/editTags']
      ),
    },
  }))
  class NewComponent extends React.PureComponent {
    fetchTags = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchTags', payload: params });
    }

    deleted = (id, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'customer/deleteTags',
        payload: { id },
        onSuccess,
        onError,
      });
    }

    submit = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: values.id ? 'customer/editTags' : 'customer/addTags',
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
