import React from 'react';
import { Select } from 'antd';
import RadioComponent from './RadioComponent';

const { Option } = Select;
@RadioComponent
export default class extends React.PureComponent {
  render() {
    const { multiple, value, sourceData } = this.props;
    const newProps = { ...this.props };
    delete newProps.sourceData;
    delete newProps.multiple;
    let defaultValue = value;
    if (Array.isArray(value)) {
      defaultValue = value.map(item => (
        typeof item === 'object' ? item.value : item
      ));
    } else if (typeof value === 'object') {
      (defaultValue = value.value);
    }
    return (
      <div style={{ display: 'inline-block' }}>
        <Select
          {...newProps}
          placeholder="请选择"
          value={defaultValue}
          style={{ width: 200 }}
          {...(multiple ? { mode: 'multiple' } : {})}
        >
          {sourceData.map((item) => {
            return (
              <Option key={`${item.value}`} >{item.text}</Option>
            );
          })}
        </Select>
      </div>
    );
  }
}
