import React, { PureComponent } from 'react';
import { Form, Select, Button, Input, Row, Col } from 'antd';
import InputTags from './InputTags/index';

const FormItem = Form.Item;
@Form.create()
export default class extends PureComponent {
  submit = (params) => {
    if (params) {
      const newtype = { name: params };
      const { typeSubmit } = this.props;
      const { setFieldsValue } = this.props.form;
      typeSubmit(newtype);
      setFieldsValue({ typenew: '' });
    }
  }

  handleSubmit = () => {
    const { validateFields } = this.props.form;
    validateFields((errors, values) => {
      if (!errors) {
        const params = { ...values };
        delete params.typenew;
        const { ruleSubmit } = this.props;
        ruleSubmit(params);
        this.props.remove();
      }
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const typeFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const { ruletype, initialValue } = this.props;
    return (
      <Form>
        {getFieldDecorator('id', {
        initialValue: initialValue.id || undefined,
          })(<Input type="hidden" />)}
        <Row gutter={0}>
          <Col span={8} offset={4}>
            <FormItem {...typeFormItemLayout} label="大爱类型" required>
              {getFieldDecorator('type_id', {
              initialValue: initialValue.type_id || undefined,
              rules: [{
                required: true,
                message: '请选择类型!',
              }],
                })(
                  <Select>
                    {ruletype.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                  )
                  )}
                  </Select>
                  )}
            </FormItem>
          </Col>

          <Col span={8} offset={-2}>
            <FormItem {...typeFormItemLayout} label="添加类型" >
              {getFieldDecorator('typenew', {
              initialValue: undefined,
                })(
                  <Input onBlur={() => this.submit(this.props.form.getFieldValue('typenew'))} />
              )}
            </FormItem>
          </Col>
        </Row>

        <FormItem {...formItemLayout} label="大爱原因" required>
          {getFieldDecorator('name', {
          initialValue: initialValue.name || '',
          rules: [{
            required: true,
            message: '请输入大爱原因!',
          }],
            })(
              <Input />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="大爱规则" required>
          {getFieldDecorator('money', {
          initialValue: initialValue.money || '',
            })(
              <InputTags />
          )}

        </FormItem>

        <FormItem {...formItemLayout} label="扣分规则" required>
          {getFieldDecorator('score', {
          initialValue: initialValue.score || '',
            })(
              <InputTags />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('remark', {
          initialValue: initialValue.remark || '',
            })(
              <Input />
          )}
        </FormItem>

        <Row gutter={8}>
          <Col span={3} offset={6}>
            <FormItem>
              <Button type="primary" block onClick={this.handleSubmit}>确定</Button>
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem>
              <Button block onClick={this.handleReset} >重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
