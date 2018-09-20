import React from 'react';
import {
  Input,
  InputNumber,
} from 'antd';
import store from './store/store';
import OAForm, { OAModal } from '../../../components/OAForm';

const FormItem = OAForm.Item;


const formItemLayout = {
  labelCol: { span: 8, pull: 3 },
  wrapperCol: { span: 16, pull: 3 },
};

@OAForm.create()
@store('submit')
export default class extends React.PureComponent {
  handleSubmit = (values, onError) => {
    const { submit, onCancel, initialValue } = this.props;
    submit({
      ...initialValue,
      ...values,
    }, onError, () => {
      onCancel(false);
    });
  }

  render() {
    const {
      loading,
      initialValue,
      form: { getFieldDecorator },
      visible, validatorRequired, validateFields, onCancel,
    } = this.props;
    return (
      <OAModal
        title="客户来源表单"
        loading={loading}
        visible={visible}
        onCancel={() => onCancel(false)}
        onSubmit={validateFields(this.handleSubmit)}
      >
        <FormItem label="名称" {...formItemLayout} required>
          {getFieldDecorator('name', {
            initialValue: initialValue.name || '',
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="说明" {...formItemLayout}>
          {getFieldDecorator('describe', {
            initialValue: initialValue.describe || '',
          })(
            <Input.TextArea placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="排序" {...formItemLayout}>
          {getFieldDecorator('sort', {
            initialValue: initialValue.sort || 0,
          })(
            <InputNumber placeholder="请输入" min={0} />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
