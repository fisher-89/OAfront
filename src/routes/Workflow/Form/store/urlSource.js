import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';


export default type => (Compoent) => {
  @connect(({ workflow, loading }) => ({
    list: workflow.apiConfig,
    loading: {
      deleted: loading.effects['workflow/deleteApiConfig'],
      fetchUrlSoucre: loading.effects['workflow/fetchApiConfig'],
      submit: (
        loading.effects['workflow/addApiConfig'] ||
        loading.effects['workflow/editApiConfig']
      ),
    },
  }))
  class NewCompoent extends React.PureComponent {
    fetchUrlSoucre = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'workflow/fetchApiConfig', payload: params });
    }

    deleted = (id) => {
      const { dispatch } = this.props;
      dispatch({ type: 'workflow/deleteApiConfig', payload: { id } });
    }

    submit = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: values.id ? 'workflow/editApiConfig' : 'workflow/addApiConfig',
        payload: values,
        onError,
        onSuccess,
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
