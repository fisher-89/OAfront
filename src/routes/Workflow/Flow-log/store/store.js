import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';

function makeLoading(loading) {
  return {
    fetchDataSource: (
      loading.effects['workflow/fetchFlow'] ||
      loading.effects['workflow/fetchForm'] ||
      loading.effects['workflow/flowRunLog'] ||
      loading.effects['workflow/fetchFlowType'] ||
      loading.effects['workflow/fetchFormType'] ||
      loading.effects['workflow/flowRunLogExport']
    ),
  };
}

export default type => (Component) => {
  @connect(({ workflow, loading }) => ({
    flow: workflow.flow,
    form: workflow.form,
    flowType: workflow.flowType,
    formType: workflow.formType,
    flowRunLog: workflow.flowRunLog,
    loading: makeLoading(loading),
  }))
  class NewComponent extends React.PureComponent {
    componentWillMount() {
      const { dispatch } = this.props;
      dispatch({ type: 'workflow/fetchFlowType' });
      dispatch({ type: 'workflow/fetchFormType' });
      dispatch({ type: 'workflow/fetchFlow', payload: {} });
      dispatch({ type: 'workflow/fetchForm', payload: {} });
    }

    fetchDataSource = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'workflow/flowRunLog', payload: params });
    }

    render() {
      return (
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return NewComponent;
};
