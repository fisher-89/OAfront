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
 *     authority： false 是否开启权限
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
      pushValue: newValue,
      modelStyle: props.modelStyle || defaultStyle,
    };
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      const newValue = this.makeInitialValue(nextProps.value);
      this.setState({ pushValue: newValue });
    }
  }

  setTableValue = (changeValue) => {
    const { multiple } = this.props;
    this.pushValue = multiple ? changeValue : changeValue[0];
    if (!multiple) {
      this.setState({ pushValue: this.pushValue || [] }, () => {
        this.handleOk();
      });
    }
  };

  makeInitialValue = (value) => {
    const { name } = this.props;
    let newValue = [];
    if (this.props.multiple) {
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
    const { pushValue } = this.state;
    this.handleModelVisble(false);
    if (multiple) {
      const value = [];
      this.pushValue.forEach((item, i) => {
        value[i] = {};
        Object.keys(name).forEach((key) => {
          value[i][key] = item[name[key]];
        });
      });
      this.setState({ pushValue: this.pushValue }, () => onChange(value));
      return;
    }
    const value = {};
    Object.keys(name).forEach((key) => {
      value[key] = pushValue[name[key]];
    });
    onChange(value);
  };


  makeSearchView = () => {
    const { multiple, placeholder, disabled, showName, tableProps } = this.props;
    const { visible, pushValue } = this.state;
    const commonProps = {
      value: pushValue,
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
          const newValue = pushValue.filter((_, index) => index !== removeIndex);
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
    const { visible, modelStyle: { width }, pushValue } = this.state;
    const footer = multiple ? null : { footer: null };
    let selectValue = [];
    if (multiple) {
      selectValue = pushValue;
    } else {
      selectValue = [pushValue[tableProps.index]] || [];
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
              fetchDataSource={this.fetchDataSource}
              setSelectedValue={this.setTableValue}
            />
          )}

        </Modal>
      </div>
    );
  }
}
SearchTable.defaultProps = {
  title: '员工列表',
  onChange: () => { },
};
SearchTable.Staff = Staff;
SearchTable.Shop = Shop;
