import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';

export default type => (Component) => {
  @connect(({ violation, department, brand, loading }) => ({
    department: department.department,
    score: violation.score,
    brand: brand.brand,
    money: violation.money,
    finelog: violation.finelog,
    rule: violation.rule,
    ruleType: violation.ruletype,
    loading: {
      fetchRuleType: loading.effects['violation/fetchRuleType'],
      fetchRule: loading.effects['violation/fetchRule'],
      fetchFineLog: loading.effects['violation/fetchFineLog'],
      deleted: loading.effects['violation/deleteFineLog'],
      submit: (
        loading.effects['violation/editFineLog'] ||
        loading.effects['violation/addFineLog']
      ),

    },
  }))
  class NewCopmonent extends PureComponent {
    componentWillMount() {
      this.fetchRule();
      this.fetchRuleType();
      this.fetchDepartment();
    }

    fetchFineLog = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchFineLog', payload: params });
    }

    fetchDepartment = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'department/fetchDepartment', payload: params });
      dispatch({ type: 'brand/fetchBrand' });
    }


    fetchRule = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchRule', payload: params });
    }

    fetchRuleType = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchRuleType', payload: params });
    }

    fetchMoneyAndScore = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchFineMoney', payload: params });
      dispatch({ type: 'violation/fetchFineScore', payload: params });
    }

    paymentChange = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/paymentChange', payload: params });
    }

    deleted = (id, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'violation/deleteFineLog',
        payload: { id },
        onSuccess,
        onError,
      });
    }

    submit = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: values.id ? 'violation/editFineLog' : 'violation/addFineLog',
        payload: values,
        onSuccess,
        onError,
      });
    }

    payFine = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'violation/editPayState',
        payload: values,
        onSuccess,
        onError,
      });
    }

    render() {
      return (
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return NewCopmonent;
};
