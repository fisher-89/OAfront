import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';


export default type => (Compoent) => {
  @connect(({ workflow, department, roles, loading }) => ({
    list: workflow.approver,
    rulesData: workflow.stepDepartment,
    roles: roles.roles,
    department: department.department,
    loading: {
      deleted: loading.effects['workflow/deleteApprover'],
      fetchDataSource: loading.effects['workflow/fetchStepDepartment'],
      fetchRoles: loading.effects['roles/fetchRoles'],
      fetchDepartment: loading.effects['department/fetchDepartment'],
      submit: (
        loading.effects['workflow/editStepDepartment'] ||
        loading.effects['workflow/addStepDepartment']
      ),
      modeSubmit: (
        loading.effects['workflow/addApprover'] ||
        loading.effects['workflow/editApprover']
      ),
    },
  }))
  class NewCompoent extends React.PureComponent {
    fetchDepartment = () => {
      this.props.dispatch({ type: 'department/fetchDepartment' });
    }

    fetchRoles = () => {
      this.props.dispatch({ type: 'roles/fetchRoles' });
    }

    fetchDataSource = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'workflow/fetchStepDepartment', payload: params });
    }

    deleted = (id, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'workflow/deleteStepDepartment',
        payload: { id },
        onSuccess,
        onError,
      });
    }

    submit = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: values.id ? 'workflow/editStepDepartment' : 'workflow/addStepDepartment',
        payload: values,
        onSuccess,
        onError,
      });
    }


    fetchMode = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'workflow/fetchApprover', payload: params });
    }

    modeDeleted = (id, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'workflow/deleteApprover',
        payload: { id },
        onSuccess,
        onError,
      });
    }

    modeSubmit = (values, onError) => {
      const { dispatch, onCancel } = this.props;
      dispatch({
        type: values.id ? 'workflow/editApprover' : 'workflow/addApprover',
        payload: values,
        onSuccess: onCancel,
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
