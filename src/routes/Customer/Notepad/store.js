import React from 'react';
import { connect } from 'dva';

export default (Compoent) => {
  @connect(({ customer, brand, loading }) => ({
    brand: brand.brand,
    notes: customer.notes,
    noteTypes: customer.noteTypes,
    notesDetails: customer.notesDetails,
    loading: (
      loading.effects['customer/fetchNotes'] ||
      loading.effects['brand/fetchBrand'] ||
      loading.effects['customer/editNotes'] ||
      loading.effects['customer/addNotes'] ||
      loading.effects['customer/deleteNotes'] ||
      loading.effects['customer/fetchNoteTypes']
    ),
  }))
  class NewCompoent extends React.PureComponent {
    componentWillMount() {
      this.fetchBrand();
      this.fetchNoteTypes();
    }

    fetchNoteTypes = () => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchNoteTypes' });
    }

    makeParams = (values) => {
      const params = {
        ...values,
        client_id: values.client.id,
      };
      delete params.client;
      return params;
    }

    delete = (id, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'customer/deleteNotes',
        payload: { id },
        onError,
        onSuccess,
      });
    }

    submit = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      const params = this.makeParams(values);
      const { id } = params;
      dispatch({
        type: !id ? 'customer/addNotes' : 'customer/editNotes',
        payload: params,
        onError: errors => onError(errors, { client_id: 'client' }),
        onSuccess,
      });
    }

    fetchBrand = () => {
      const { dispatch } = this.props;
      dispatch({ type: 'brand/fetchBrand' });
    }

    fetchDataSource = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'customer/fetchNotes', payload: params });
    }

    makeProps = () => {
      const response = {
        ...this.props,
        submit: this.submit,
        deleted: this.delete,
        fetch: this.fetchDataSource,
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
