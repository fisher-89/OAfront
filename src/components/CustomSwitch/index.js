import React from 'react';
import { Switch } from 'antd';

export default class CustomSwitch extends React.PureComponent {
  customOnChange = (checked) => {
    const { onChange, checkedValue, unCheckedValue } = this.props;
    onChange(checked ? checkedValue : unCheckedValue);
  }

  render() {
    const { value, checkedValue } = this.props;
    const switchProps = { ...this.props };
    delete switchProps.checkedValue;
    delete switchProps.unCheckedValue;
    return (
      <Switch
        {...switchProps}
        onChange={this.customOnChange}
        checked={`${value}` === `${checkedValue}`}
      />
    );
  }
}

CustomSwitch.defaultProps = {
  checkedValue: '1',
  unCheckedValue: '0',
};
