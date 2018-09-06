import React from 'react';
import {
  DatePicker,
} from 'antd';
import moment from 'moment';

// import styles from './index.less';

export default class Picker extends DatePicker {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      value: this.makeMomentValue(value),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (value !== this.props.value) {
      this.setState({ value: this.makeMomentValue(value) });
    }
  }

  makeMomentValue = (value) => {
    const { format } = this.props;
    return value && value.length ? { value: moment(value, format || 'YYYY-MM-DD') } : { value: null };
  }

  makeProps = () => {
    const response = {
      ...this.props,
      ...this.state.value,
    };
    return response;
  }

  render() {
    const { onChange } = this.props;
    return (
      <DatePicker
        getCalendarContainer={trigger => (trigger)}
        {...this.makeProps()}
        onChange={(_, dateString) => {
          onChange(dateString);
        }}
      />
    );
  }
}
Picker.defaultProps = {
  onChange: () => { },
};

