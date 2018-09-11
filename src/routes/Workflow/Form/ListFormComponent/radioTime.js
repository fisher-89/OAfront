import React from 'react';
import TimePicker from './timePicker';
import RadioComponent from './RadioComponent';

@RadioComponent
export default class extends React.PureComponent {
  render() {
    // const format = 'HH:mm:ss';
    return (
      <TimePicker
        // format={format}
        {...this.props}
      />
    );
  }
}
