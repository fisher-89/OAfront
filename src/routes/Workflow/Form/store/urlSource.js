import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';


export default type => (Component) => {
  @connect(({ workflow, loading }) => ({
    list: workflow.apiConfig,
    loading: {
      deleted: loading.effects['workflow/deleteApiConfig'],
      fetchUrlSoucre: loading.effects['workflow/fetchApiConfig'],
      submit: (
        loading.effects['workflow/addApiConfig'] ||
        loading.effects['workflow/testApiConfig'] ||
        loading.effects['workflow/editApiConfig']
      ),
    },
  }))
  class NewComponent extends React.PureComponent {
    fetchUrlSoucre = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'workflow/fetchApiConfig', payload: params });
    }

    testUri = (url, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'workflow/testApiConfig',
        payload: { url },
        onSuccess,
        onError,
      });
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
        <Component {...makeProps(this, type)} />
      );
    }
  }
  return NewComponent;
};
