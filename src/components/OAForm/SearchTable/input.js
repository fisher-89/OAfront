import React from 'react';
import { Input, Icon } from 'antd';
import './index.less';

export default class SearchInput extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
      return true;
    } else if (JSON.stringify(nextProps.disabled) !== JSON.stringify(this.props.disabled)) {
      return true;
    }
    return false;
  }


  handleFocus = () => {
    const { modalVisible } = this.props;
    this.searchInput.blur();
    if (!modalVisible) {
      this.searchInput.blur();
      this.props.handleModelVisble(true);
    }
  };

  handleBlur = () => {
    this.props.handleModelVisble(false);
  };

  render() {
    const {
      value,
      placeholder,
      clearValue,
      disabled,
      showName,
    } = this.props;

    const buttonBefore = (
      <Icon
        type="close-circle"
        onClick={clearValue}
        style={{ cursor: 'pointer' }}
        className="ant-input-suffix-customer"
      />
    );
    return (
      <Input
        readOnly
        ref={(e) => {
          this.searchInput = e;
        }}
        disabled={disabled}
        suffix={buttonBefore}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        placeholder={placeholder || '请选择'}
        value={(typeof value === 'object') ? value[showName] : value}
        prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
      />
    );
  }
}
SearchInput.defaultProps = {
  placeholder: '请选择',
  value: {},
};
