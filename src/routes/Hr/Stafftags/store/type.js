import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';

export default type => (Component) => {
  @connect(({ stafftags, loading }) => ({
    stafftagtypes: stafftags.stafftagtypes,

    loading: {
      deleted: loading.effects['stafftags/deleteStaffTagCategories'],
      fetchTagTypes: loading.effects['stafftags/fetchStaffTagCategories'],
      submit: (
        loading.effects['stafftags/addStaffTagCategories'] ||
        loading.effects['stafftags/editStaffTagCategories']
      ),
    },
  }))
  class NewComponent extends PureComponent {
    fetchTypes = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'stafftags/fetchStaffTagCategories', payload: { ...params, type: 'staff' } });
    }

    deleted = (id, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'stafftags/deleteStaffTagCategories',
        payload: { id },
        onSuccess,
        onError,
      });
    }

    submit = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: values.id ? 'stafftags/editStaffTagCategories' : 'stafftags/addStaffTagCategories',
        payload: values,
        onSuccess,
        onError,
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

