import React from 'react';
import RadioComponent from './RadioComponent';
import { TreeSelect } from '../../../../components/OAForm';

@RadioComponent
export default class extends React.PureComponent {
  render() {
    return (
      <TreeSelect
        {...this.props}
        parentValue={0}
        valueIndex="value"
        name={{ value: 'id', text: 'full_name' }}
        getPopupContainer={triggerNode => (triggerNode)}
        dropdownStyle={{ maxHeight: '300px', overflow: 'auto' }}
      />
    );
  }
}
