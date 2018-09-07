import React from 'react';
import moment from 'moment';
import { TimePicker } from 'antd';
import RadioComponent from './RadioComponent';

@RadioComponent
export default class extends React.PureComponent {
  render() {
    const { value, onChange } = this.props;
    const format = 'HH:mm:ss';
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
