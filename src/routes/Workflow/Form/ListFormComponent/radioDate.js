import React from 'react';
import RadioComponent from './RadioComponent';
import { DatePicker } from '../../../../components/OAForm';

@RadioComponent
export default class extends React.PureComponent {
  render() {
    const { type } = this.props;
    const format = type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss';
    return (
      <DatePicker
        {...this.props}
        format={format}
        showTime={type !== 'date'}
      />
    );
  }
}
