import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import { makeProps } from '../../../../utils/utils';

function makeLoading(loading) {
  const commoLoading = (
    loading.effects['brand/fetchBrand'] ||
    loading.effects['customer/fetchTags'] ||
    loading.effects['customer/fetchSource'] ||
    loading.effects['customer/fetchCustomer'] ||
    loading.effects['customer/deleteCustomer'] ||
    loading.effects['customer/customerStaffBrandsAuth']
  );
  return {
    fetchDataSource: (
      commoLoading ||
      loading.effects['customer/downloadExcelTemp']
    ),
    submit: (
      commoLoading ||
      loading.effects['customer/addCustomer'] ||
      loading.effects['customer/editCustomer']
    ),
  };
}

export default type => (Compoent) => {
  @connect(({ customer, brand, loading }) => ({
    tags: customer.tags,
    brands: brand.brand,
    source: customer.source,
    tagsType: customer.tagsType,
    details: customer.customerDetails,
    staffBrandsAuth: customer.staffBrandsAuth,
    loading: makeLoading(loading),
  }))
  class NewCompoent extends React.PureComponent {
    componentWillMount() {
      this.fetchStore();
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

    deleted = (id, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'customer/deleteCustomer',
        payload: { id },
        onError,
        onSuccess,
      });
    }

    submit = (values, onError) => {
      const { dispatch } = this.props;
      const params = this.makeParams(values);
      const { id } = params;
      dispatch({
        type: id ? 'customer/editCustomer' : 'customer/addCustomer',
        payload: params,
        onError: errors => onError(errors, { vindicator_name: 'vindicator' }),
        onSuccess: () => {
          this.props.history.push('/client/customer/list');
        },
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
      this.fetchTagsType();
      dispatch({ type: 'customer/fetchSource' });
      dispatch({ type: 'customer/fetchTags' });
      dispatch({ type: 'brand/fetchBrand' });
    }

    downloadExcelTemp = () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'customer/downloadExcelTemp',
        onError: () => {
          message.error('下载失败');
        },
        onSuccess: () => {
          message.error('下载成功');
        },
      });
    }

    render() {
      return (
        <Compoent {...makeProps(this, type)} />
      );
    }
  }
  return NewCompoent;
};
