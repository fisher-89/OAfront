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
      fetchBillImage: loading.effects['violation/fetchBillImage'],
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

    fetchBillImage = (keys) => {
      const { dispatch } = this.props;
      const params = {
        own: 0,
        overdued: 0,
        ...keys,
      };
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

    refund = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/refund', payload: params });
    }

    cleanPreTable = (params) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'violation/cleanPreTable',
        payload: params,
      });
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

    payFine = (values, paidtype, onSuccess, onError) => {
      const { dispatch } = this.props;
      const ids = Array.isArray(values) ? values : [values];
      const params = {
        id: ids,
        paid_type: paidtype,
      };
      dispatch({
        type: 'violation/editPayState',
        payload: params,
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
