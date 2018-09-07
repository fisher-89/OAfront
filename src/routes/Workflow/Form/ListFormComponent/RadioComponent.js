import React from 'react';
import {
  Radio,
} from 'antd';

const RadioGroup = Radio.Group;
export default (Component) => {
  class NewComponent extends React.PureComponent {
    handleRadioGroupChange = ({ target: { value } }) => {
      const { onChange, type, valueType } = this.props;
      if (value === 1) {
        let changeValue = type;
        if (valueType === 'object') {
          changeValue = {
            value: type,
            text: type,
          };
        }
        if (onChange) onChange(changeValue, true);
      } else if (value === 2) {
        if (onChange) onChange(undefined);
      }
    }

    render() {
      const { value, type, fieldType, valueType } = this.props;
      let radioGroupValue = 2;
      if (valueType === 'object' && value && value.value === type) {
        radioGroupValue = 1;
      } else if (valueType === 'string' && value === type) {
        radioGroupValue = 1;
      }
      const newProps = { ...this.props };
      if (radioGroupValue === 1) {
        delete newProps.value;
      }
      delete newProps.type;
      delete newProps.valueType;
      return (
        <React.Fragment>
          <RadioGroup
            name="radiogroup"
            value={radioGroupValue}
            onChange={this.handleRadioGroupChange}
          >
            <Radio value={1}>
              当前{`${fieldType.replace(/(（.*）)|控件/, '')}`}
            </Radio>
            <Radio value={2}>
              <span style={{ marginRight: 10 }}>选择</span>
              {radioGroupValue === 2 && (
                <Component {...newProps} />
              )}
            </Radio>
          </RadioGroup>
        </React.Fragment>
      );
    }
  }
  NewComponent.defaultProps = {
    valueType: 'string',
  };
  return NewComponent;
};

