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

export const fieldsTypes = [
  { value: 'text', text: '文本' },
  { value: 'int', text: '数字' },
  { value: 'date', text: '日期' },
  { value: 'datetime', text: '日期时间' },
  { value: 'time', text: '时间' },
  { value: 'array', text: '数组' },
  { value: 'file', text: '文件' },
  { value: 'department', text: '部门控件' },
  { value: 'staff', text: '员工控件' },
  { value: 'shop', text: '店铺控件' },
];

export const labelText = {
  name: '名称',
  key: '键名',
  type: '字段类型',
  scale: '小数位数',
  min: '最小值',
  max: '最大值',
  options: '可选值',
  validator_id: '验证规则',
  default_value: '默认值',
  description: '描述',
};


@connect(({ workflow, loading }) => ({
  loading: (
    loading.effects['workflow/fetchValidator']
  ),
  validator: workflow.validator,
}))
@OAForm.create()
export default class extends React.PureComponent {
  componentWillReceiveProps(nextProps) {
    const { error, onError } = nextProps;
    if (Object.keys(error).length && error !== this.props.error) {
      onError(error, false);
    }
  }

  labelValue = labelText;

  handleOk = (value) => {
    const { initialValue, config: { onOk } } = this.props;
    onOk({ ...initialValue, ...value });
  }

  render() {
    const {
      initialValue, validator, dataSource, form, validateFields, validatorRequired,
    } = this.props;
    const { getFieldDecorator } = form;
    const fields = dataSource.map((item) => {
      return { key: item.key, name: item.name };
    });
    const modalProps = { ...this.props.config };
    delete modalProps.onOK;
    const { labelValue } = this;
    return (
      <OAModal {...modalProps} onSubmit={validateFields(this.handleOk)}>
        <Row>
          <Col {...fieldsBoxLayout}>
            <FormItem label={labelValue.name} {...fieldsItemLayout}>
              {
                getFieldDecorator('name', {
                  initialValue: initialValue.name || '',
                  rules: [validatorRequired],
                })(
                  <Input placeholder="请输入" />
                )
              }
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label={labelValue.key} {...fieldsItemLayout}>
              {
                getFieldDecorator('key', {
                  initialValue: initialValue.key || '',
                  rules: [validatorRequired],
                })(
                  <Input placeholder="请输入" />
                )
              }
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label={labelValue.type} {...fieldsItemLayout}>
              {
                getFieldDecorator('type', {
                  initialValue: initialValue.type || [],
                  rules: [validatorRequired],
                })(
                  <Select placeholder="请选择" style={{ width: '100%' }} >
                    {fieldsTypes.map(item => <Option key={item.value}>{item.text}</Option>)}
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label={labelValue.scale} {...fieldsItemLayout}>
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
            <FormItem label={labelValue.min} {...fieldsItemLayout}>
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
            <FormItem label={labelValue.max} {...fieldsItemLayout}>
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
            <FormItem label={labelValue.options} {...fieldsItemLayout}>
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
            <FormItem label={labelValue.validator_id} {...fieldsItemLayout}>
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
              label={labelValue.default_value}
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
              label={labelValue.description}
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
