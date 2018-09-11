import React from 'react';
import moment from 'moment';
import { TimePicker } from 'antd';

export default class extends React.PureComponent {
  render() {
    const { value, onChange } = this.props;
    const momentValue = value ? { value: moment(value, 'HH:mm:ss') } : { value: undefined };
    return (
      <TimePicker
        format="HH:mm:ss"
        {...this.props}
        {...momentValue}
        onChange={(_, timeStr) => {
          if (onChange) onChange(timeStr);
        }}
      />
    );
  }
}
