import React from 'react';
import {
  Row,
  Col,
} from 'antd';
import OAForm, {
  List,
} from '../../../components/OAForm';

import ListForm from './listForm';

const FormItem = OAForm.Item;

const fieldsBoxLayout = { xs: 24, lg: 12 };
const fieldsTypes = [
  { value: 'text', text: '文本' },
  { value: 'int', text: '数字' },
  { value: 'date', text: '日期' },
  { value: 'datetime', text: '日期时间' },
  { value: 'time', text: '时间' },
  { value: 'array', text: '数组' },
  { value: 'file', text: '文件' },
];

export default class FieldList extends React.Component {
  makeContent = (value, error) => {
    const { validator } = this.props;

    let message = '';
    message = Object.keys(error).map((key) => {
      return error[key].join(',');
    });
    console.log(message);

    const [valueType] = fieldsTypes.filter((item) => {
      return item.value === value.type;
    });

    let valueValidator = [];
    if (value.validator_id.length) {
      valueValidator = validator.filter((item) => {
        return value.validator_id.indexOf(item.id) !== -1;
      });
    }
    let { options } = value;
    if (Array.isArray(value.options)) {
      options = value.options.join(',');
    }
    return (
      <React.Fragment>
        {value ? <input type="hidden" name="id" value={value.id} /> : null}
        <div style={{ paddingTop: '20px' }}>
          <FormItem validateStatus="error" help={message.join(',')}>
            <Row>
              <Col {...fieldsBoxLayout}>
                名称：{value.name || ''}
              </Col>
              <Col {...fieldsBoxLayout}>
                键名:  {value.key || ''}
              </Col>
            </Row>
            <Row>
              可选值：{options || ''}
            </Row>
            <Row>
              描述：{value.description || ''}
            </Row>
            <Row>
              <Col {...fieldsBoxLayout}>
                字段类型: {valueType ? valueType.text : ''}
              </Col>
              <Col {...fieldsBoxLayout}>
                小数位数：{value.scale || ''}
              </Col>
            </Row>
            <Row>
              <Col {...fieldsBoxLayout}>
                最小值：{value.min || ''}
              </Col>
              <Col {...fieldsBoxLayout}>
                最大值：{value.max || ''}
              </Col>
            </Row>
            <Row>
              <Col {...fieldsBoxLayout}>
                验证规则：{valueValidator.map(item => item.name)}
              </Col>
            </Row>
            <FormItem
              label="默认值"
              labelCol={{ xs: { span: 24 }, sm: { span: 8 }, lg: { span: 4 } }}
              wrapperCol={{ xs: { span: 24 }, sm: { span: 16 }, lg: { span: 18 } }}
            >
              {value.default_value || ''}
            </FormItem>
          </FormItem>
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <List
          sorter
          width={700}
          height={600}
          title="字段"
          error={this.props.error}
          onChange={this.props.onChange}
          initialValue={this.props.value}
          listItemContent={this.makeContent}
          Component={ListForm}
        />
      </React.Fragment>
    );
  }
}
