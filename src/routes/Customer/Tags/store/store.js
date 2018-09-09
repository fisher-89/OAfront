import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';


export default type => (Compoent) => {
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
  class NewCompoent extends React.PureComponent {
    componentWillMount() {
      this.fetchTagsType();
    }

    fetchTags = (_, params) => {
      const { dispatch } = this.props;
      const newParams = { ...params };
      delete newParams.update;
      const { update } = params;
      dispatch({ type: 'customer/fetchTags', payload: params, update });
    }

    fetchTagsType = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchTagsType', payload: params });
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
        <Compoent {...makeProps(this, type)} />
      );
    }
  }
  return NewCompoent;
};
