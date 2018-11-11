import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import { makeProps } from '../../../../utils/utils';

function makeLoading(loading) {
  return {
    fetchDataSource: (
      loading.effects['workflow/fetchFlow'] ||
      loading.effects['workflow/fetchForm'] ||
      loading.effects['workflow/flowRunLog'] ||
      loading.effects['workflow/fetchFlowType'] ||
      loading.effects['workflow/fetchFormType'] ||
      loading.effects['workflow/flowRunLogExport'] ||
      loading.effects['workflow/flowRunFormVersion'] ||
      loading.effects['workflow/formVersion']
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
    formVersion: workflow.formVersionDetails,
    formVData: workflow.formVDetails,
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

    flowRunFormVersion = (id) => {
      const { dispatch } = this.props;
      dispatch({ type: 'workflow/flowRunFormVersion', payload: { id } });
    }

    fetchFormVersion = (id) => {
      const { dispatch } = this.props;
      dispatch({ type: 'workflow/formVersion', payload: { id } });
    }

    exportExcel = (formId) => {
      const { dispatch } = this.props;
      if (!formId.length) return message.error('请选择导出的表单!');
      dispatch({ type: 'workflow/flowRunLogExport', payload: { form_id: formId } });
    }

    render() {
      return (
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return NewComponent;
};
