import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import SelectTable from './selectTable';
import RadioInput from './input';
import CheckBoxTag from './tag';
import Staff from './Model/Staff';
import Shop from './Model/Shop';
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

const defaultStyle = {
  width: '800px',
  height: '400px',
};

export default class SearchTable extends PureComponent {
  constructor(props) {
    super(props);
    const { value } = props;
    const newValue = this.makeInitialValue(value);
    this.state = {
      visible: false,
      value: newValue,
      modelStyle: props.modelStyle || defaultStyle,
    };
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      const newValue = this.makeInitialValue(nextProps.value);
      this.setState({ value: newValue });
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

  makeInitialValue = (value) => {
    const { name, multiple } = this.props;
    let newValue = [];
    if (multiple) {
      newValue = value.map((item) => {
        const temp = {};
        Object.keys(name).forEach((key) => {
          temp[name[key]] = item[key];
        });
        return temp;
      });
    } else {
      newValue = {};
      Object.keys(name).forEach((key) => {
        newValue[name[key]] = value[key];
      });
    }
    return newValue;
  }

  handleModelVisble = (flag) => {
    const { modalVisible } = this.props;
    this.setState({ visible: flag }, () => {
      if (modalVisible) {
        modalVisible(flag);
      }
    });
  };

  handleOk = () => {
    const { onChange, multiple, name } = this.props;
    const { value } = this.state;
    this.handleModelVisble(false);
    if (multiple) {
      const newValue = [];
      this.pushValue.forEach((item, i) => {
        newValue[i] = {};
        Object.keys(name).forEach((key) => {
          newValue[i][key] = item[name[key]];
        });
      });
      this.setState({ value: [...newValue] }, () => onChange(newValue));
      return;
    }
    const newValue = {};
    Object.keys(name).forEach((key) => {
      newValue[key] = value[name[key]];
    });
    onChange(newValue);
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
    return multiple ? (
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

  render() {
    const { multiple, name, showName, title, tableProps } = this.props;
    const { visible, modelStyle: { width }, value } = this.state;
    const footer = multiple ? null : { footer: null };
    let selectValue = [];
    if (multiple) {
      selectValue = [...value];
    } else {
      selectValue = [value[tableProps.index]] || [];
    }
    return (
      <div>
        {this.makeSearchView()}
        <Modal
          destroyOnClose
          style={this.state.modelStyle}
          width={width}
          title={title}
          visible={visible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleModelVisble(false)}
          {...footer}
        >
          {visible && (
            <SelectTable
              {...tableProps}
              name={name}
              showName={showName}
              multiple={multiple}
              selectValue={selectValue}
              setSelectedValue={this.setTableValue}
            />
          )}
        </Modal>
      </div>
    );
  }
}
SearchTable.defaultProps = {
  title: '列表',
  onChange: () => { },
};
SearchTable.Staff = Staff;
SearchTable.Shop = Shop;
