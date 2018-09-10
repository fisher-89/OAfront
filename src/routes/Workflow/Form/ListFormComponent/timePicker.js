import React from 'react';
import moment from 'moment';
import { TimePicker } from 'antd';

export default class extends React.PureComponent {
  render() {
    const { value, onChange, format } = this.props;
    const momentValue = value ? { value: moment(value, format) } : { value: undefined };
    return (
      <TimePicker
        format={format}
        {...this.props}
        {...momentValue}
        onChange={(changeValue) => {
          if (onChange) onChange(moment(changeValue).format(format));
        }}
      />
    );
  }
}
