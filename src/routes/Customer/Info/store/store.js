import React from 'react';
import { connect } from 'dva';

export default (Compoent) => {
  @connect(({ customer, brand, loading }) => ({
    brands: brand.brand,
    source: customer.source,
    tags: customer.tags,
    tagsType: customer.tagsType,
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
    componentWillMount() {
      this.fetchStore();
    }

    onSuccess = () => {
      this.props.history.push('/client/customer/list');
    }

    makeParams = (values) => {
      const params = {
        ...values,
        vindicator_sn: values.vindicator.staff_sn || '',
        vindicator_name: values.vindicator.staff_name || '',
        tags: (values.tags || []).map(item => ({ tag_id: item })),
        brands: (values.brands || []).map(item => ({ brand_id: item })),
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

    update = (values, onError) => {
      const { dispatch } = this.props;
      const params = this.makeParams(values);
      dispatch({
        type: 'customer/editCustomer',
        payload: params,
        onError: errors => onError(errors, { vindicator_name: 'vindicator' }),
        onSuccess: () => this.onSuccess(),
      });
    }

    add = (values, onError) => {
      const { dispatch } = this.props;
      const params = this.makeParams(values);
      dispatch({
        type: 'customer/addCustomer',
        payload: params,
        onError: errors => onError(errors, { vindicator_name: 'vindicator' }),
        onSuccess: () => this.onSuccess(),
      });
    }

    edit = (values, onError) => {
      const { dispatch } = this.props;
      const params = this.makeParams(values);
      dispatch({
        type: 'customer/editCustomer',
        payload: params,
        onError: errors => onError(errors, { vindicator_name: 'vindicator' }),
        onSuccess: () => this.onSuccess(),
      });
    }

    fetchDataSource = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchCustomer', payload: params });
    }

    fetchTagsType = () => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchTagsType' });
    }


    fetchStaffBrandsAuth = () => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/customerStaffBrandsAuth' });
    }

    fetchStore() {
      const { dispatch } = this.props;
      this.fetchStaffBrandsAuth();
      dispatch({ type: 'customer/fetchSource' });
      dispatch({ type: 'customer/fetchTags' });
      dispatch({ type: 'brand/fetchBrand' });
    }

    makeProps = () => {
      const response = {
        ...this.props,
        add: this.add,
        edit: this.edit,
        update: this.update,
        deleted: this.delete,
        fetch: this.fetchDataSource,
        fetchTagsType: this.fetchTagsType,
        fetchStaffBrandsAuth: this.fetchStaffBrandsAuth,
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
