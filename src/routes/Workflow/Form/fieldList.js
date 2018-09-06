import React from 'react';
import { List } from '../../../components/OAForm';
import ListForm, { labelText, fieldsTypes } from './listForm';
import { getAvailableText } from './ListFormComponent/RadioSelect';

export default class FieldList extends React.Component {
  makeContent = (value) => {
    const { validator } = this.props;
    const valueTemp = { ...value };
    const valueType = fieldsTypes.find(item => item.value === value.type) || {};
    valueTemp.type = valueType.text;

    if (value.validator_id.length) {
      valueTemp.validator_id = validator.filter((item) => {
        return value.validator_id.indexOf(item.id) !== -1;
      }).map(item => item.name);
    } else { valueTemp.validator_id = ''; }

    if (Array.isArray(value.options)) {
      valueTemp.options = value.options.length ? value.options.join('、') : '';
    }
    const staticObject = {};

    if (value.available_options.length) {
      valueTemp.available_options = value.available_options.map(item => item.text).join('、');
    }

    if (value.default_value) {
      valueTemp.default_value = getAvailableText(value.default_value);
      if (valueTemp.default_value === value.type) {
        valueTemp.default_value = `当前${valueTemp.type.replace(/(（.*）)|控件/, '')}`;
      }
    }

    Object.keys(labelText).forEach((key) => {
      if (Array.isArray(valueTemp[key]) && valueTemp[key].length) {
        staticObject[labelText[key]] = { value: valueTemp[key].join(',') };
      } else if (valueTemp[key] && !Array.isArray(valueTemp[key])) {
        staticObject[labelText[key]] = { value: valueTemp[key] };
      }
    });
    return staticObject;
  }

  render() {
    return (
      <React.Fragment>
        <List
          sorter
          width={700}
          height={600}
          title="表单控件"
          Component={ListForm}
          value={this.props.value}
          error={this.props.error}
          onChange={this.props.onChange}
          bodyStyle={{ minHeight: 400 }}
          listItemContent={this.makeContent}
        />
      </React.Fragment>
    );
  }
}
