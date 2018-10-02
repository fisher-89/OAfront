import React from 'react';
import { connect } from 'dva';
import { List } from '../../../components/OAForm';
import ListForm, { labelText, fieldsTypes } from './listForm';
import district from '../../../assets/district';
import { getAvailableText } from './ListFormComponent/RadioSelect';

@connect(({ workflow }) => ({
  apiDataSource: workflow.apiConfigDetails,
  apiData: workflow.apiConfig,
}))
export default class FieldList extends React.Component {
  componentDidMount = () => {
    this.fetchApi();
  }

  fetchApi = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'workflow/fetchApiConfig' });
  };

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

    if (value.field_api_configuration_id && value.type === 'api') {
      valueTemp.field_api_configuration_id = this.props.apiData.filter(item => (
        `${value.field_api_configuration_id}` === `${item.id}`
      )).map(item => item.name).join('、');
    }

    valueTemp.default_value = this.makeDefaultValue(value);

    Object.keys(labelText).forEach((key) => {
      if (Array.isArray(valueTemp[key]) && valueTemp[key].length) {
        staticObject[labelText[key]] = { value: valueTemp[key].join(',') };
      } else if (valueTemp[key] && !Array.isArray(valueTemp[key])) {
        staticObject[labelText[key]] = { value: valueTemp[key] };
      }
    });
    return staticObject;
  }

  makeDefaultValue = (value) => {
    let defaultValue = value.default_value;
    if (value.default_value && value.type !== 'region') {
      if (value.field_api_configuration_id && value.type === 'api') {
        const apiId = value.field_api_configuration_id;
        const data = this.props.apiDataSource[apiId] || [];

        defaultValue = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
        defaultValue = data.filter(item => defaultValue.indexOf(`${item.value}`) !== -1);
      }
      defaultValue = getAvailableText(defaultValue);
      if (value.default_value === value.type) {
        defaultValue = `当前${value.type.replace(/(（.*）)|控件/, '')}`;
      }
    }
    if (value.type === 'region' && value.default_value) {
      const addressValue = Object.keys(value.default_value).map((key) => {
        const addr = district.find(item => `${item.id}` === `${value.default_value[key]}`);
        return addr ? addr.name : value.default_value[key];
      });
      defaultValue = addressValue.join('');
    }

    return defaultValue;
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
