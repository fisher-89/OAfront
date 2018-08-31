
import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../utils/utils';


export default type => (Component) => {
  @connect(({ customer, department, loading }) => ({
    auth: customer.auth,
    department: department.department,
    loading: {
      fetchAuth: loading.effects['customer/fetchAuth'],
      fetchDepartment: loading.effects['department/fetchDepartment'],
      submit: (
        loading.effects['customer/addAuth'] ||
        loading.effects['customer/editAuth']
      ),
    },
  }))
  class Store extends React.PureComponent {
    fetchAuth = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchAuth', payload: params });
    }

    fetchDepartment = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'department/fetchDepartment', payload: params });
    }

    submit = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      const params = this.makeParams(values);
      const { id } = params;
      dispatch({
        type: !id ? 'customer/addCustomer' : 'customer/editCustomer',
        payload: params,
        onError: errors => onError(errors, { vindicator_name: 'vindicator' }),
        onSuccess,
      });
    }

    render() {
      return (
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return Store;
};
