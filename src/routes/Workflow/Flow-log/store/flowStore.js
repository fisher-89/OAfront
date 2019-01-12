import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import { makeProps } from '../../../../utils/utils';

function makeLoading(loading) {
  return {
    fetchDataSource: (
      loading.effects['workflow/fetchFlowType'] ||
      loading.effects['workflow/flowRunFlowList'] ||
      loading.effects['workflow/flowFormVersion'] ||
      loading.effects['workflow/flowRunLog'] ||
      loading.effects['workflow/flowRunLogExport']
    ),
  };
}

export default type => (Component) => {
  @connect(({ workflow, loading }) => ({
    flowType: workflow.flowType,
    flow: workflow.flowRunFlowList,
    flowFormVersion: workflow.flowFormVersion,
    flowRunLog: workflow.flowRunLog,
    exportProgress: workflow.exportProgress,
    loading: makeLoading(loading),
  }))
  class NewComponent extends React.PureComponent {
    componentWillMount() {
      const { dispatch } = this.props;
      // 获取流程分类
      dispatch({ type: 'workflow/fetchFlowType' });
      // 获取流程列表（不带权限）
      dispatch({ type: 'workflow/flowRunFlowList', payload: {} });
    }

    // 获取表单版本
    formVersion = (number) => {
      const { dispatch } = this.props;
      dispatch({ type: 'workflow/flowFormVersion', payload: number });
    }

    fetchDataSource = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'workflow/flowRunLog', payload: params });
    }

    exportExcel = (formId, params) => {
      const { dispatch } = this.props;
      if (!formId.length) return message.error('请选择导出的表单!');
      const payload = {
        ...params,
      };
      delete payload.page;
      delete payload.pagesize;
      dispatch({ type: 'workflow/flowRunLogExport', payload });
    }

    render() {
      return (
        <Component {...makeProps(this, type)} />
      );
    }
  }

  return NewComponent;
};
