import React from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';


export default type => (Compoent) => {
  @connect(({ loading }) => ({
    loading: {
      deleted: loading.effects['form/delete'],
      fetchUrlSoucre: loading.effects['form/fetch'],
      submit: (
        loading.effects['form/add'] ||
        loading.effects['form/edit']
      ),
    },
  }))
  class NewCompoent extends React.PureComponent {
    fetchUrlSoucre = (params) => {
      console.log(params);
    }

    deleted = (id, onError, onSuccess) => {
      console.log(id, onError, onSuccess);
    }

    submit = (values, onError, onSuccess) => {
      console.log(values, onError, onSuccess);
    }

    render() {
      return (
        <Compoent {...makeProps(this, type)} />
      );
    }
  }
  return NewCompoent;
};
