import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { makeProps } from '../../../../utils/utils';

export default type => (Component) => {
  @connect(({ stafftags, loading }) => ({
    stafftags: stafftags.stafftags,
    stafftagtypes: stafftags.stafftagtypes,
    loading: {
      deleted: loading.effects['stafftags/deleteStaffTags'],
      fetchTags: loading.effects['stafftags/fetchStaffTags'],
      fetchTagsType: loading.effects['stafftags/fetchStaffTagCategories'],
      submit: (
        loading.effects['stafftags/addStaffTags'] ||
        loading.effects['stafftags/editStaffTags']
      ),
    },
  }))
  class NewCopmonent extends PureComponent {
    componentWillMount() {
      this.fetchTags();
    }

    fetchTags = (params) => {
      const { dispatch } = this.props;
      dispatch({ type: 'stafftags/fetchStaffTags', payload: { ...params, type: 'shops' } });
    }

    deleted = (id, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'stafftags/deleteStaffTags',
        payload: { id },
        onSuccess,
        onError,
      });
    }

    submit = (values, onError, onSuccess) => {
      const { dispatch } = this.props;
      dispatch({
        type: values.id ? 'stafftags/editStaffTags' : 'stafftags/addStaffTags',
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
  return NewCopmonent;
};
