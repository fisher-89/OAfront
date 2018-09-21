import React, { PureComponent } from 'react';
import { Input } from 'antd';
import store from '../store/urlSource';
import OAForm, { OAModal } from '../../../../components/OAForm';

const FormItem = OAForm.Item;

const fieldsItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 4 } },
  wrapperCol: { xs: { span: 24 }, lg: { span: 20 } },
};

@store('submit')
@OAForm.create()
export default class extends PureComponent {
  render() {
    const {
      submit,
      loading,
      visible,
      onCancel,
      initialValue,
      validateFields,
      validatorRequired,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <OAModal
        title="接口配置"
        visible={visible}
        loading={loading}
        onSubmit={validateFields(submit)}
        onCancel={onCancel}
      >
        <FormItem label="名称" {...fieldsItemLayout} required>
          {getFieldDecorator('name', {
            initialValue: initialValue.name || '',
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="接口地址" {...fieldsItemLayout} required>
          {getFieldDecorator('url', {
            initialValue: initialValue.url || '',
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="实际值" {...fieldsItemLayout} required>
          {getFieldDecorator('value', {
            initialValue: initialValue.value || '',
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="显示文本" {...fieldsItemLayout} required>
          {getFieldDecorator('text', {
            initialValue: initialValue.text || '',
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
