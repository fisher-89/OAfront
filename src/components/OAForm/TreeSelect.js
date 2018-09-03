import React from 'react';
import {
  TreeSelect,
} from 'antd';
import { markTreeData } from '../../utils/utils';

const defaultProps = {
  dataSource: [],
  parentValue: 0,
  fields: { value: 'id', parentId: 'parent_id', lable: 'full_name' },
  placeholder: '请选择',
  onChange: () => { },
};

export default class OATreeSelect extends TreeSelect {
  handleOnChange = (value) => {
    const {
      name,
      fields,
      multiple,
      onChange,
      dataSource,
      treeCheckable,
    } = this.props;
    if (!name) {
      onChange(value);
      return;
    }
    if (treeCheckable || multiple) {
      const fieldsName = fields.value;
      const newData = dataSource.filter(item => value.indexOf(item[fieldsName].toString()) !== -1);
      const newValue = newData.map((item) => {
        const temp = {};
        Object.keys(name).forEach((key) => {
          temp[key] = item[name[key]];
        });
        return temp;
      });
      onChange(newValue);
    } else {
      const [newData] = dataSource.filter(item => value === item[fieldsName].toString());
      const newValue = {};
      Object.keys(name).forEach((key) => {
        temp[key] = newData[name[key]];
      });
      onChange(newValue);
    }
  }

  makeTreeValue = () => {
    const {
      name,
      value,
      fields,
      multiple,
      treeCheckable,
    } = this.props;
    let newValue = multiple ? (value || []) : (value || {});
    if (name && (treeCheckable || multiple)) {
      let valueName = '';
      Object.keys(name).forEach((key) => {
        if (fields.value === name[key]) {
          valueName = key;
        }
      });
      newValue = newValue.map(item => item[valueName].toString());
    } else if (name && !multiple) {
      newValue = {};
      Object.keys(name).forEach((key) => {
        if (fields.value === name[key]) {
          newValue[key] = value[key].toString();
        }
      });
    }
    return newValue;
  }

  makeProps = () => {
    const { dataSource, fields, parentValue } = this.props;
    const response = {
      dropdownStyle: { maxHeight: 300, overflow: 'auto' },
      ...this.props,
      value: this.makeTreeValue(),
      treeData: markTreeData(dataSource, fields, parentValue),
    };
    Object.keys(defaultProps).forEach((key) => {
      delete response[key];
    });
    response.onChange = this.handleOnChange;
    return response;
  }

  render() {
    return (
      <TreeSelect
        {...this.makeProps()}
      />
    );
  }
}
OATreeSelect.defaultProps = defaultProps;

