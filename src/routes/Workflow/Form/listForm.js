import React from 'react';
import { connect } from 'dva';
import {
  Input,
  Select,
  Row,
  Col,
  InputNumber,
} from 'antd';
import OAForm, {
  InputTags,
  OAModal,
} from '../../../components/OAForm';
import TagInput from '../../../components/TagInput';

const FormItem = OAForm.Item;
const { Option } = Select;

const fieldsBoxLayout = { span: 12 };
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

@connect(({ workflow, loading }) => ({
  loading: (
    loading.effects['workflow/fetchValidator']
  ),
  validator: workflow.validator,
}))
@OAForm.create()
export default class extends React.PureComponent {
  handleOk = (value) => {
    const { initialValue, config: { onOk } } = this.props;
    onOk({ ...initialValue, ...value });
  }

  render() {
    const { initialValue, validator, dataSource, form, validateFields } = this.props;
    const { getFieldDecorator } = form;
    const fields = dataSource.map((item) => {
      return { key: item.key, name: item.name };
    });
    const modalProps = { ...this.props.config };
    delete modalProps.onOK;
    return (
      <OAModal {...modalProps} onSubmit={validateFields(this.handleOk)}>
        <Row>
          <Col {...fieldsBoxLayout}>
            <FormItem label="名称" {...fieldsItemLayout}>
              {
                getFieldDecorator('name', {
                  initialValue: initialValue.name || '',
                  // rules: [{ required: true, message: '必填项!' }],
                })(
                  <Input placeholder="请输入" />
                )
              }
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label="键名" {...fieldsItemLayout}>
              {
                getFieldDecorator('key', {
                  initialValue: initialValue.key || '',
                  rules: [{ required: true, message: '必填项!' }],
                })(
                  <Input placeholder="请输入" />
                )
              }
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label="字段类型" {...fieldsItemLayout}>
              {
                getFieldDecorator('type', {
                  initialValue: initialValue.type || [],
                  rules: [{ required: true, message: '必填项!' }],
                })(
                  <Select placeholder="请选择" style={{ width: '100%' }} >
                    {fieldsTypes.map(item => <Option key={item.value}>{item.text}</Option>)}
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label="小数位数" {...fieldsItemLayout}>
              {
                getFieldDecorator('scale', {
                  initialValue: initialValue.scale || 0,
                })(
                  <InputNumber placeholder="请输入" min={0} style={{ width: '100%' }} />
                )
              }
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label="最小值" {...fieldsItemLayout}>
              {
                getFieldDecorator('min', {
                  initialValue: initialValue.min || '',
                })(
                  <InputNumber placeholder="请输入" min={0} style={{ width: '100%' }} />
                )
              }
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label="最大值" {...fieldsItemLayout}>
              {
                getFieldDecorator('max', {
                  initialValue: initialValue.max || '',
                })(
                  <InputNumber placeholder="请输入" min={0} style={{ width: '100%' }} />
                )
              }
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label="可选值" {...fieldsItemLayout}>
              {
                getFieldDecorator('options', {
                  initialValue: initialValue.options || [],
                })(
                  <TagInput name="options" />
                )
              }
            </FormItem>
          </Col>

          <Col {...fieldsBoxLayout}>
            <FormItem
              label="验证规则"
              {...fieldsItemLayout}
            >
              {
                getFieldDecorator('validator_id', {
                  initialValue: initialValue.validator_id || [],
                })(
                  <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择" >
                    {
                      validator.map(item => (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="默认值"
              labelCol={{ xs: { span: 24 }, sm: { span: 8 }, lg: { span: 4 } }}
              wrapperCol={{ xs: { span: 24 }, sm: { span: 16 }, lg: { span: 18 } }}
            >
              {
                getFieldDecorator('default_value', {
                  initialValue: initialValue.default_value || '',
                })(
                  <InputTags placeholder="请输入" fields={fields} />
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="描述"
              labelCol={{ xs: { span: 24 }, sm: { span: 8 }, lg: { span: 4 } }}
              wrapperCol={{ xs: { span: 24 }, sm: { span: 16 }, lg: { span: 18 } }}
            >
              {
                getFieldDecorator('description', {
                  initialValue: initialValue.description || '',
                })(
                  <Input placeholder="请输入" name="description" />
                )
              }
            </FormItem>
          </Col>
        </Row>
      </OAModal>
    );
  }
}
