
import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../utils/utils';


export default type => (Component) => {
  @connect(({ customer, department, brand, loading }) => {
    const commoLoad = {
      fetchBrand: loading.effects['department/fetchBrand'],
      fetchDepartment: loading.effects['department/fetchDepartment'],
    };
    return {
      auth: customer.auth,
      department: department.department,
      brand: brand.brand,
      loading: {
        fetchAuth: loading.effects['customer/fetchAuth'],
        ...commoLoad,
        submit: (
          commoLoad.fetchBrand ||
          commoLoad.fetchDepartment ||
          loading.effects['customer/addAuth'] ||
          loading.effects['customer/editAuth']
        ),
      },
    };
  })
  class Store extends React.PureComponent {
    componentWillMount() {
      this.fetchBrand();
      this.fetchDepartment();
    }

    fetchAuth = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchAuth', payload: params });
    }

    fetchBrand = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'brand/fetchBrand', payload: params });
    }

    fetchDepartment = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'department/fetchDepartment', payload: params });
    }

    submit = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      const { id } = values;
      dispatch({
        type: !id ? 'customer/addAuth' : 'customer/editAuth',
        payload: values,
        onError: errors => onError(errors),
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
