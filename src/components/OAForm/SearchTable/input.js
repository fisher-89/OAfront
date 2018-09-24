import React from 'react';
import { Input, Icon } from 'antd';
import './index.less';

export default class SearchInput extends React.PureComponent {
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
        value={(typeof value === 'object') ? value[showName] : value}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        placeholder={placeholder || '请选择'}
        prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
      />
    );
  }
}
SearchInput.defaultProps = {
  placeholder: '请选择',
  value: {},
};
