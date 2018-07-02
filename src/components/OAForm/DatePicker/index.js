import React, { PureComponent } from 'react';
import {
  DatePicker,
} from 'antd';
import moment from 'moment';

export default class DataPicker extends PureComponent {
  render() {
    const { value, onChange, format } = this.props;
    const momentValue = value ? { value: moment(value, format || 'YYYY-MM-DD') } : null;
    return (
      <DatePicker
        {...this.props}
        {...momentValue}
        style={{ width: '100%' }}
        onChange={(date, dateString) => {
          onChange(dateString);
        }}
      />
    );
  }
}

