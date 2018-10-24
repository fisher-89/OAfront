import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';


export default type => (Component) => {
  @connect(({ workflow, department, roles, loading }) => ({
    list: workflow.approver,
    rulesData: workflow.stepDepartment,
    roles: roles.roles,
    department: department.department,
    loading: {
      deleted: (
        loading.effects['workflow/deleteApprover'] ||
        loading.effects['workflow/deleteStepDepartment']
      ),
      fetchRoles: loading.effects['roles/fetchRoles'],
      fetchDepartment: loading.effects['department/fetchDepartment'],
      fetchDataSource: loading.effects['workflow/fetchStepDepartment'],
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
  class NewComponent extends React.PureComponent {
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

    deleted = (id, modeId) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'workflow/deleteStepDepartment',
        payload: { id, modeId },
      });
    }

    submit = (values, onError) => {
      const { dispatch, onCancel } = this.props;
      dispatch({
        type: values.id ? 'workflow/editStepDepartment' : 'workflow/addStepDepartment',
        payload: values,
        onSuccess: onCancel,
        onError: errors => onError(errors, {
          department_name: 'department',
          department_id: 'department',
        }),
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
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return NewComponent;
};
