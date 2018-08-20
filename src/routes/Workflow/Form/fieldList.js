import React from 'react';
import {
  Input,
  Select,
  Row,
  Col,
  InputNumber,
} from 'antd';
import OAForm, {
  InputTags,
  List,
} from '../../../components/OAForm1';
import TagInput from '../../../components/TagInput';

const FormItem = OAForm.Item;
const { Option } = Select;

export default class FieldList extends React.Component {
  makeContent = (value, error) => {
    const { validator } = this.props;
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
    let message = '';
    message = Object.keys(error).map((key) => {
      return error[key].join(',');
    });
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
    const { validator } = this.props;
    const fieldsBoxLayout = { xs: 24, lg: 12 };
    const fieldsItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 8 } },
      wrapperCol: { xs: { span: 24 }, lg: { span: 12 } },
    };
    const fieldsTypes = [
      { value: 'text', text: '文本' },
      { value: 'int', text: '数字' },
      { value: 'date', text: '日期' },
      { value: 'datetime', text: '日期时间' },
      { value: 'time', text: '时间' },
      { value: 'array', text: '数组' },
      { value: 'file', text: '文件' },
    ];
    const fields = this.props.value.map((item) => {
      return { key: item.key, name: item.name };
    });
    return (
      <React.Fragment>
        <List
          sorter
          width={700}
          height={600}
          title="字段"
          error={this.props.error}
          listItemContent={this.makeContent}
          onChange={this.props.onChange}
          initialValue={this.props.value}
        >
          <FormItem>
            <Row>
              <Col {...fieldsBoxLayout}>
                <FormItem label="名称" {...fieldsItemLayout}>
                  <Input placeholder="请输入" name="name" value="" />
                </FormItem>
              </Col>
              <Col {...fieldsBoxLayout}>
                <FormItem label="键名" {...fieldsItemLayout}>
                  <Input placeholder="请输入" name="key" value="" />
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem
            label="可选值"
            labelCol={{ xs: { span: 24 }, sm: { span: 8 }, lg: { span: 4 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 16 }, lg: { span: 18 } }}
          >
            <TagInput name="options" value={[]} />
          </FormItem>
          <FormItem
            label="描述"
            labelCol={{ xs: { span: 24 }, sm: { span: 8 }, lg: { span: 4 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 16 }, lg: { span: 18 } }}
          >
            <Input placeholder="请输入" name="description" value="" />
          </FormItem>
          <FormItem>
            <Row>
              <Col {...fieldsBoxLayout}>
                <FormItem label="字段类型" {...fieldsItemLayout}>
                  <Select placeholder="请选择" name="type" style={{ width: '100%' }} value="">
                    {fieldsTypes.map(item => <Option key={item.value}>{item.text}</Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col {...fieldsBoxLayout}>
                <FormItem label="小数位数" {...fieldsItemLayout}>
                  <InputNumber value={0} placeholder="请输入" name="scale" min={0} style={{ width: '100%' }} />
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row>
              <Col {...fieldsBoxLayout}>
                <FormItem label="最小值" {...fieldsItemLayout}>
                  <Input placeholder="请输入" name="min" value="" />
                </FormItem>
              </Col>
              <Col {...fieldsBoxLayout}>
                <FormItem label="最大值" {...fieldsItemLayout}>
                  <Input placeholder="请输入" name="max" value="" />
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row>
              <Col {...fieldsBoxLayout}>
                <FormItem
                  label="验证规则"
                  {...fieldsItemLayout}
                >
                  <Select
                    name="validator_id"
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    mode="multiple"
                    optionFilterProp="children"
                    value={[]}
                  >
                    {
                      validator.map(item => (
                        <Option
                          key={item.id}
                          value={item.id}
                          title={item.description}
                        >
                          {item.name}
                        </Option>
                      ))
                    }
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem
            label="默认值"
            labelCol={{ xs: { span: 24 }, sm: { span: 8 }, lg: { span: 4 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 16 }, lg: { span: 18 } }}
          >
            <InputTags name="default_value" placeholder="请输入" fields={fields} value="" />
          </FormItem>
        </List>
      </React.Fragment>
    );
  }
}
