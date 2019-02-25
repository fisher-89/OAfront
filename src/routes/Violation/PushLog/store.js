import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../utils/utils';

export default type => (Component) => {
  @connect(({ violation, loading }) => ({
    mypushlog: violation.mypushlog,
    pushlog: violation.pushlog,
    loading: {
      fetchMyPushLog: loading.effects['violation/fetchMyPushLog'],
      fetchPushLog: loading.effects['violation/fetchPushLog'],
    },
  }))
  class NewCopmonent extends PureComponent {
    fetchMyPushLog = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchMyPushLog', payload: params });
    }

    fetchPushLog = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchPushLog', payload: params });
    }

    render() {
      return (
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return NewCopmonent;
};
