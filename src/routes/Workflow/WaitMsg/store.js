import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../utils/utils';

export default type => (Component) => {
  @connect(({ workflow, loading }) => ({
    list: workflow.waitMsg,
    loading: {
      fetchDataSource: loading.effects['workflow/fetchWaitMsg'],
    },
  }))
  class NewComponent extends React.PureComponent {
    fetchDataSource = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'workflow/fetchWaitMsg', payload: params });
    }

    render() {
      return (
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return NewComponent;
};
