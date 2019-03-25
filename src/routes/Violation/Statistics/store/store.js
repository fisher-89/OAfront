import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';

export default type => (Component) => {
  @connect(({ department, violation, brand, loading }) => ({
    brand: brand.brand,
    department: department.department,
    rule: violation.rule,
    ruleType: violation.ruletype,
    staffviolation: violation.staffviolation,
    loading: {
      fetchDepartment: loading.effects['department/fetchDepartment'],
      fetchStaffViolation: loading.effects['violation/fetchStaffViolation'],
      fetchRule: loading.effects['violation/fetchRule'],
      fetchRuleType: loading.effects['violation/fetchRuleType'],
    },
  }))
  class NewCopmonent extends PureComponent {
    componentWillMount() {
      this.fetchRule();
      this.fetchBrand();
      this.fetchDepartment();
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

    fetchBrand = () => {
      const { dispatch } = this.props;
      dispatch({ type: 'brand/fetchBrand' });
    }

    fetchDepartment = () => {
      const { dispatch } = this.props;
      dispatch({ type: 'department/fetchDepartment' });
    }

    fetchStaffViolation = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchStaffViolation', payload: params });
    }

    singleStaffPay = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/editSinglePayment', payload: params });
    }

    staffMultiPay= (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/singleStaffPay', payload: params });
    }

    render() {
      return (
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return NewCopmonent;
};
