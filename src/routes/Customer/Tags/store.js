import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../utils/utils';


export default type => (Compoent) => {
  @connect(({ customer, loading }) => ({
    tags: customer.tags,
    tagsType: customer.tagsType,
    loading: {
      fetchTags: loading.effects['customer/fetchTags'],
      fetchTagsType: loading.effects['customer/fetchTagsType'],
    },
  }))
  class NewCompoent extends React.PureComponent {
    fetchTags = (params) => {
      const { dispatch } = this.props;
      const newParams = { ...params };
      delete newParams.update;
      const { update } = newParams;
      dispatch({ type: 'customer/fetchTags', payload: params, update });
    }

    fetchTagsType = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchTagsType', payload: params });
    }

    tagSubmit = (values) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'customer/addTags',
        payload: values,
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
