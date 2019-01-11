import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';

export default type => (Component) => {
  @connect(({ violation, loading }) => ({
    content: violation.math,
    rule: violation.rule,
    ruletype: violation.ruletype,
    loading: {
      mathFetch: loading.effects['violation/fetchMath'],
      fetchRule: loading.effects['violation/fetchRule'],
      fetchRuleType: loading.effects['violation/fetchRuleType'],
    },
  }))
  class NewCopmonent extends PureComponent {
    componentWillMount() {
      this.fetchRule();
      this.fetchRuleType();
      this.mathFetch();
    }

    fetchRule=(params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchRule', payload: params });
    }

    fetchRuleType=(params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'violation/fetchRuleType', payload: params });
    }

    typeSubmit = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: values.id ? 'violation/editRuleType' : 'violation/addRuleType',
        payload: values,
        onSuccess,
        onError,
      });
    }

    ruleSubmit = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: values.id ? 'violation/editRule' : 'violation/addRule',
        payload: values,
        onSuccess,
        onError,
      });
    }

    ruleDelete = (id, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'violation/deleteRule',
        payload: { id },
        onSuccess,
        onError,
      });
    }

    typeDelete = (id, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'violation/deleteRuleType',
        payload: { id },
        onSuccess,
        onError,
      });
    }

    mathFetch = () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'violation/fetchMath',
        payload: {},
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

