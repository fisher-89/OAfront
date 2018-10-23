import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';

function makeLoading(loading) {
  const commoLoading = (
    loading.effects['customer/fetchNotes'] ||
    loading.effects['customer/fetchNoteTypes'] ||
    loading.effects['customer/customerStaffBrandsAuth']
  );
  return {
    fetchBrand: loading.effects['brand/fetchBrand'],
    fetchDataSource: (
      commoLoading ||
      loading.effects['customer/deleteNotes']
    ),
    submit: (
      commoLoading ||
      loading.effects['customer/editNotes'] ||
      loading.effects['customer/addNotes']
    ),
  };
}

export default type => (Component) => {
  @connect(({ customer, brand, loading }) => ({
    brand: brand.brand,
    notes: customer.notes,
    noteTypes: customer.noteTypes,
    notesDetails: customer.notesDetails,
    staffBrandsAuth: customer.staffBrandsAuth,
    loading: makeLoading(loading),
  }))
  class NewComponent extends React.PureComponent {
    componentWillMount() {
      this.fetchBrand();
      this.fetchNoteTypes();
      this.fetchStaffBrandsAuth();
    }

    makeParams = (values) => {
      const params = {
        ...values,
        client_id: values.client.id,
        client_name: values.client.name,
      };
      delete params.client;
      return params;
    }

    deleted = (id) => {
      const { dispatch, clientId } = this.props;
      dispatch({
        type: 'customer/deleteNotes',
        payload: { id, clientId },
      });
    }

    submit = (values, onError) => {
      const { dispatch } = this.props;
      const params = this.makeParams(values);
      const { id } = params;
      dispatch({
        type: !id ? 'customer/addNotes' : 'customer/editNotes',
        payload: params,
        onError: errors => onError(errors, {
          client_id: 'client',
          client_name: 'client',
        }),
        onSuccess: ({ message }) => {
          if (message) return;
          this.props.history.push('/client/notepad/list');
        },
      });
    }

    fetchDataSource = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchNotes', payload: params });
    }

    fetchBrand = () => {
      const { dispatch } = this.props;
      dispatch({ type: 'brand/fetchBrand' });
    }

    fetchStaffBrandsAuth = () => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/customerStaffBrandsAuth' });
    }

    fetchNoteTypes = () => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchNoteTypes' });
    }


    render() {
      return (
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return NewComponent;
};
