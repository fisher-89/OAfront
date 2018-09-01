import React, { PureComponent } from 'react';
import { ModalSelect } from '../../OAModal';
import RadioInput from './input';
import CheckBoxTag from './tag';
import CheckBoxCustomer from './staff';
import RadioCustomer from './radioStaff';
import Staff from './Model/Staff';
import Shop from './Model/Shop';
import Customer from './Model/customer';

import './index.less';

/**
 *  props {
 *     multiple ： false 单选
 *     value : required
 *     name : 多选值 required  typeof 'object'
 *     showName:显示的值  required
 *     disabled ：是否禁用  默认  false
 *     placeholder：描述
 *     style：外部样式
 *     modelStyle：弹出层样式
 *     onChange：function(values)
 *     tableProps: {
 *       index：required 选择下标
 *     }
 * }
 *
 */

export default class SearchTable extends PureComponent {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      visible: false,
      value: value || [],
    };
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleModelVisble = (flag) => {
    const { modalVisible } = this.props;
    this.setState({ visible: flag }, () => {
      if (modalVisible) {
        modalVisible(flag);
      }
    });
  };

  makeSearchView = () => {
    const { multiple, placeholder, disabled, showName, tableProps, onChange } = this.props;
    const { visible, value } = this.state;
    const commonProps = {
      value,
      disabled,
      placeholder,
      showName,
      valueName: tableProps.index,
      handleModelVisble: this.handleModelVisble,
    };
    return multiple ?
      (
        <CheckBoxTag
          {...commonProps}
          setTagSelectedValue={(removeIndex) => {
            const newValue = value.filter((_, index) => index !== removeIndex);
            onChange(newValue);
          }}
        />
      ) :
      (
        <RadioInput
          {...commonProps}
          modalVisible={visible}
          clearValue={() => onChange([])}
        />
      );
  };

  makeUserView = () => {
    const { multiple, placeholder, disabled, showName, tableProps, style, onChange } = this.props;
    const { visible, value } = this.state;
    const commonProps = {
      value,
      disabled,
      placeholder,
      showName,
      style,
      valueName: tableProps.index,
      handleModelVisble: this.handleModelVisble,
    };
    return multiple ?
      (
        <CheckBoxCustomer
          {...commonProps}
          setTagSelectedValue={(removeIndex) => {
            const newValue = value.filter((_, index) => index !== removeIndex);
            onChange(newValue);
          }}
        />
      ) :
      (
        <RadioCustomer
          {...commonProps}
          modalVisible={visible}
          clearValue={() => onChange({})}
        />
      );
  }


  render() {
    const { mode, multiple, name, title, tableProps, width, onChange } = this.props;
    const { visible, value } = this.state;
    return (
      <div>
        {mode === 'default' && this.makeSearchView()}
        {mode === 'user' && this.makeUserView()}
        <ModalSelect
          modalProps={{
            width,
            title,
            visible,
          }}
          onChange={onChange}
          onCancel={this.handleModelVisble}
          name={name}
          value={value}
          {...tableProps}
          multiple={multiple}
        />
      </div>
    );
  }
}
SearchTable.defaultProps = {
  title: '列表',
  mode: 'default',
  tableProps: { index: 'id' },
  onChange: () => {
  },
};
SearchTable.Staff = Staff;
SearchTable.Shop = Shop;
SearchTable.Customer = Customer;
