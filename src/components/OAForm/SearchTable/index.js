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

  setTableValue = (changeValue) => {
    const { multiple } = this.props;
    if (!multiple) {
      this.setState({ value: changeValue[0] || [] }, () => {
        this.handleOk();
      });
      return;
    }
    this.pushValue = changeValue;
  };


  handleModelVisble = (flag) => {
    const { modalVisible } = this.props;
    this.setState({ visible: flag }, () => {
      if (modalVisible) {
        modalVisible(flag);
      }
    });
  };

  handleOk = () => {
    const { onChange, multiple } = this.props;
    const { value } = this.state;
    this.handleModelVisble(false);
    let result = value;
    if (multiple) {
      result = this.pushValue;
      this.setState({ value: result });
    }
    onChange(result);
  };


  makeSearchView = () => {
    const { multiple, placeholder, disabled, showName, tableProps } = this.props;
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
            this.setTableValue(newValue);
            this.handleOk();
          }}
        />
      ) :
      (
        <RadioInput
          {...commonProps}
          modalVisible={visible}
          clearValue={() => {
            this.setTableValue([]);
          }}
        />
      );
  };

  makeUserView = () => {
    const { multiple, placeholder, disabled, showName, tableProps, style } = this.props;
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
            this.setTableValue(newValue);
            this.handleOk();
          }}
        />
      ) :
      (
        <RadioCustomer
          {...commonProps}
          modalVisible={visible}
          clearValue={() => {
            this.setTableValue({});
          }}
        />
      );
  }


  render() {
    const { mode, multiple, name, title, tableProps, width } = this.props;
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
          onChange={this.setTableValue}
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
