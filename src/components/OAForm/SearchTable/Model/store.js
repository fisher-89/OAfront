import React from 'react';
import { connect } from 'dva';

export default (Compoent) => {
  @connect(({ customer, brand, loading }) => ({
    brands: brand.brand,
    source: customer.source,
    tags: customer.tags,
    staffBrandsAuth: customer.staffBrandsAuth,
    loading: (
      loading.effects['brand/fetchBrand'] ||
      loading.effects['customer/fetchSource'] ||
      loading.effects['customer/fetchTags'] ||
      loading.effects['customer/fetchCustomer'] ||
      loading.effects['customer/customerStaffBrandsAuth']
    ),
  }))
  class NewCompoent extends React.PureComponent {
    makeParams = (values) => {
      const params = {
        ...values,
        vindicator_sn: values.vindicator.staff_sn || '',
        vindicator_name: values.vindicator.staff_name || '',
      };
      delete params.vindicator;
      return params;
    }

    delete = (id, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'customer/deleteCustomer',
        payload: { id },
        onError,
        onSuccess,
      });
    }

    update = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      const params = this.makeParams(values);
      dispatch({
        type: 'customer/editCustomer',
        payload: params,
        onError: errors => onError(errors, { vindicator_name: 'vindicator' }),
        onSuccess,
      });
    }

    add = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      const params = this.makeParams(values);
      dispatch({
        type: 'customer/addCustomer',
        payload: params,
        onError: errors => onError(errors, { vindicator_name: 'vindicator' }),
        onSuccess,
      });
    }

    fetchDataSource = (params) => {
      const { dispatch } = this.props;
      this.fetchStore();
      dispatch({ type: 'customer/fetchCustomer', payload: params });
    }

    fetchTagsType = () => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchTagsType' });
    }


    fetchStore() {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchSource' });
      dispatch({ type: 'customer/fetchTags' });
      dispatch({ type: 'brand/fetchBrand' });
      this.fetchStaffBrandsAuth();
    }

    fetchStaffBrandsAuth = () => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/customerStaffBrandsAuth' });
    }

    makeProps = () => {
      const response = {
        ...this.props,
        add: this.add,
        delete: this.delete,
        update: this.update,
        fetch: this.fetchDataSource,
        fetchTagsType: this.fetchTagsType,
      };
      return response;
    }

    render() {
      return (
        <Compoent {...this.makeProps()} />
      );
    }
  }
  return NewCompoent;
};
