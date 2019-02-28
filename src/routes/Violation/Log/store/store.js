import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';

export default type => (Component) => {
  @connect(({ violation, department, brand, loading }) => ({
    billimage: violation.billimage,
    brand: brand.brand,
    department: department.department,
    finelog: violation.finelog,
    money: violation.money,
    pushgroup: violation.pushgroup,
    rule: violation.rule,
    ruleType: violation.ruletype,
    score: violation.score,
    loading: {
      fetchRuleType: loading.effects['violation/fetchRuleType'],
      fetchRule: loading.effects['violation/fetchRule'],
      fetchFineLog: loading.effects['violation/fetchFineLog'],
      deleted: loading.effects['violation/deleteFineLog'],
    },
  }))
  class NewCopmonent extends PureComponent {
    componentWillMount() {
      this.fetchRule();
      this.fetchRuleType();
      this.fetchDepartment();
      this.fetchPushQun();
    }

    fetchBillImage = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchBillImage', payload: params });
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
      dispatch({
        type: 'violation/fetchFineMoney',
        payload: params,
      });
      dispatch({
        type: 'violation/fetchFineScore',
        payload: params,
      });
    }

    fetchPushQun = (params) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'violation/fetchPushQun',
        payload: params,
      });
    }

    paymentChange = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/paymentChange', payload: params });
    }

    refund = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/refund', payload: params });
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
