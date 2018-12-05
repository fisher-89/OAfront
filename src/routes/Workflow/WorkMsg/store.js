import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../utils/utils';

export default type => (Component) => {
  @connect(({ workflow, loading }) => ({
    list: workflow.workMsg,
    loading: {
      fetchDataSource: (
        loading.effects['workflow/fetchWorkMsg'] ||
        loading.effects['workflow/resendWorkMsg']
      ),
    },
  }))
  class NewComponent extends React.PureComponent {
    fetchDataSource = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'workflow/fetchWorkMsg', payload: params });
    }

    resendWorkMsg = (id) => {
      return () => {
        const { dispatch } = this.props;
        dispatch({ type: 'workflow/resendWorkMsg', payload: { id } });
      };
    }

    render() {
      return (
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return NewComponent;
};
