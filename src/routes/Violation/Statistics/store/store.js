import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';

export default type => (Component) => {
  @connect(({ department, violation, brand, loading }) => ({
    brand: brand.brand,
    department: department.department,
    finedepartment: violation.finedepartment,
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

    fetchFineDepartment = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchFineDepartment', payload: params });
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

    singleStaffPay = (values, paidtype, onSuccess) => {
      const { dispatch } = this.props;
      const ids = Array.isArray(values) ? values : [values];
      const params = {
        id: ids,
        paid_type: paidtype,
      };
      dispatch({
        type: 'violation/editSinglePayment',
        payload: params,
        onSuccess,
      });
    }

    staffMultiPay= (params, onError) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/singleStaffPay', params, onError });
    }

    render() {
      return (
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return NewCopmonent;
};
