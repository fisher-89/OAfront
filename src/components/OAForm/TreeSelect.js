import React from 'react';
import {
  TreeSelect,
} from 'antd';
import { markTreeData } from '../../utils/utils';

const defaultProps = {
  dataSource: [],
  parentValue: 0,
  fields: {
    value: 'id',
    parentId: 'parent_id',
    lable: 'full_name',
  },
  name: {
    id: 'id',
    department_name: 'full_name',
  },
  valueIndex: 'id',
  placeholder: '请选择',
  onChange: () => { },
};

export default class OATreeSelect extends TreeSelect {
  getFieldValue = (value) => {
    const newValue = {};
    const { name } = this.props;
    Object.keys(name).forEach((key) => {
      newValue[key] = value[name[key]];
    });
    return newValue;
  }

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
    const fieldsName = fields.value;
    let newValue;
    if (treeCheckable || multiple) {
      const newData = dataSource.filter(item => (
        value.indexOf(item[fieldsName].toString()) !== -1
      ));
      newValue = newData.map((item) => {
        return this.getFieldValue(item);
      });
    } else {
      const newData = dataSource.find(item => value === item[fieldsName].toString());
      newValue = this.getFieldValue(newData);
    }
    onChange(newValue);
  }

  makeTreeValue = () => {
    const {
      name,
      value,
      multiple,
      valueIndex,
      treeCheckable,
    } = this.props;
    const newValue = value || (multiple ? [] : {});
    if (name && (treeCheckable || multiple)) {
      return newValue.map(item => `${item[valueIndex]}`);
    } else if (name && !multiple) {
      return `${newValue[valueIndex] || ''}`;
    }
    return newValue;
  }

  makeProps = () => {
    const { dataSource, fields, parentValue } = this.props;
    const response = {
      dropdownStyle: { maxHeight: 300, overflow: 'auto' },
      ...this.props,
      value: this.makeTreeValue(),
    };
    Object.keys(defaultProps).forEach((key) => {
      delete response[key];
    });
    response.onChange = this.handleOnChange;
    response.treeData = markTreeData(dataSource, fields, parentValue);
    return response;
  }

  render() {
    const response = <TreeSelect {...this.makeProps()} />;
    return response;
  }
}
OATreeSelect.defaultProps = defaultProps;

