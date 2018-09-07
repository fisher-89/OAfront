import React from 'react';
import RadioComponent from './RadioComponent';
import { DatePicker } from '../../../../components/OAForm';

@RadioComponent
export default class extends React.PureComponent {
  render() {
    return (
      <DatePicker
        {...this.props}
      />
    );
  }
}
