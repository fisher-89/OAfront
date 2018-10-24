import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';

function makeLoading(loading) {
  return {
    fetchBrand: loading.effects['brand/fetchBrand'],
    fetchDataSource: (
      loading.effects['customer/fetchNoteTypes'] ||
      loading.effects['customer/deleteNoteTypes']
    ),
    submit: (
      loading.effects['customer/editNoteTypes'] ||
      loading.effects['customer/addNoteTypes']
    ),
  };
}

export default type => (Component) => {
  @connect(({ customer, loading }) => ({
    noteTypes: customer.noteTypes,
    loading: makeLoading(loading),
  }))
  class NewComponent extends React.PureComponent {
    deleted = (id) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'customer/deleteNoteTypes',
        payload: { id },
      });
    }

    submit = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      const params = { ...values };
      params.is_task = values.is_task ? 1 : 0;
      const { id } = params;
      dispatch({
        type: !id ? 'customer/addNoteTypes' : 'customer/editNoteTypes',
        payload: params,
        onError,
        onSuccess,
      });
    }

    fetchDataSource = () => {
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
