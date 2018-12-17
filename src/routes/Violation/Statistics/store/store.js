import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';

export default type => (Component) => {
  @connect(({ violation, department, brand, loading }) => ({
    department: department.department,
    brand: brand.brand,
    rule: violation.rule,
    ruleType: violation.ruletype,
    staffviolation: violation.staffviolation,
    departmentviolation: violation.departmentviolation,
    loading: {
      fetchDepartment: loading.effects['department/fetchDepartment'],
      fetchStaffViolation: loading.effects['violation/fetchStaffViolation'],
      fetchDepartmentViolation: loading.effects['violation/fetchDepartmentViolation'],
      fetchRule: loading.effects['violation/fetchRule'],
      fetchRuleType: loading.effects['violation/fetchRuleType'],
    },
  }))
  class NewCopmonent extends PureComponent {
    componentWillMount() {
      this.fetchStaffViolation();
      this.fetchDepartment();
      this.fetchRule();
      this.fetchRuleType();
    }

    fetchRule = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchRule', payload: params });
    }

    fetchRuleType = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchRuleType', payload: params });
    }

    fetchDepartment = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'department/fetchDepartment', payload: params });
      dispatch({ type: 'brand/fetchBrand' });
    }

    fetchStaffViolation = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchStaffViolation', payload: params });
    }

    fetchDepartmentViolation = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchDepartmentViolation', payload: params });
    }

    render() {
      return (
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return NewCopmonent;
};
