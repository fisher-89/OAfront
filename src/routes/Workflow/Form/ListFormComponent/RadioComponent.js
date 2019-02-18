import React from 'react';
import {
  Radio,
} from 'antd';

const RadioGroup = Radio.Group;
export default (Component) => {
  class NewComponent extends React.PureComponent {
    handleRadioGroupChange = ({ target: { value } }) => {
      const { onChange, type, valueType, multiple } = this.props;
      if (value === 1) {
        let changeValue = type;
        if (valueType === 'object') {
          changeValue = {
            value: type,
            text: type,
          };
        }
        if (multiple) changeValue = [changeValue];
        if (onChange) onChange(changeValue, 'radio');
      } else if (value === 2) {
        if (onChange) onChange(undefined);
      }
    }

    render() {
      const { value, type, fieldType } = this.props;
      let radioGroupValue = 2;
      if (
        value === type ||
        (value && value.value === type) ||
        (value && value[0] && value[0].value === type)
      ) {
        radioGroupValue = 1;
      }
      const newProps = { ...this.props };
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

