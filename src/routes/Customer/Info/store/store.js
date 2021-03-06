import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';

function makeLoading(loading) {
  const commoLoading = (
    loading.effects['brand/fetchBrand'] ||
    loading.effects['customer/fetchLevel'] ||
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

export default type => (Component) => {
  @connect(({ customer, brand, loading }) => ({
    tags: customer.tags,
    brands: brand.brand,
    source: customer.source,
    level: customer.level,
    tagsType: customer.tagsType,
    details: customer.customerDetails,
    staffBrandsAuth: customer.staffBrandsAuth,
    loading: makeLoading(loading),
  }))
  class NewComponent extends React.PureComponent {
    componentWillMount() {
      this.fetchStore();
    }

    makeParams = (values) => {
      const params = {
        ...values,
        vindicator_sn: values.vindicator.staff_sn || '',
        vindicator_name: values.vindicator.staff_name || '',
        ...values.developer,
        ...values.recommend,
        county_id: values.present_address.county_id || '',
        city_id: values.present_address.city_id || '',
        address: values.present_address.address || '',
        province_id: values.present_address.province_id || '',
        tags: values.tags.map(item => ({ tag_id: item })),
        brands: values.brands.map(item => ({ brand_id: item })),
        levels: values.levels.map(item => ({ level_id: item })),
        linkages: values.linkages.map(item => ({ linkage_id: item })),
      };
      delete params.vindicator;
      delete params.developer;
      delete params.recommend;
      delete params.present_address;
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
        onError: errors => onError(errors, {
          vindicator_name: 'vindicator',
          develop_sn: 'developer',
          develop_name: 'developer',
          recommend_id: 'recommend',
          recommend_name: 'recommend',
        }),
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

    fetchLevel = () => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchLevel' });
    }

    fetchStore() {
      const { dispatch } = this.props;
      this.fetchStaffBrandsAuth();
      this.fetchTagsType();
      dispatch({ type: 'customer/fetchSource' });
      dispatch({ type: 'customer/fetchTags' });
      dispatch({ type: 'brand/fetchBrand' });
    }

    downloadExcelCustomer = (params) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'customer/downloadExcelCustomer',
        payload: params,
      });
    }

    render() {
      return (
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return NewComponent;
};
