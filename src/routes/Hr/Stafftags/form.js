import React, { PureComponent } from 'react';
import { Input, Select } from 'antd';
import OAForm, { OAModal } from '../../../components/OAForm';
import store from './store/store';

const FormItem = OAForm.Item;
const formItemLayout = {
  labelCol: { span: 8, pull: 3 },
  wrapperCol: { span: 16, pull: 3 },
};
@OAForm.create()
@store('submit')
export default class extends PureComponent {
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
      form: { getFieldDecorator },
      initialValue,
      visible,
      onCancel,
      loading,
      validateFields,
      stafftagtypes,
    } = this.props;
    return (
      <OAModal
        title="标签"
        loading={loading}
        actionType={initialValue.id !== undefined}
        visible={visible}
        onCancel={() => onCancel(false)}
        onSubmit={validateFields(this.handleSubmit)}
      >
        {getFieldDecorator('type', { initialValue: 'staff' })(<Input type="hidden" />)}

        <FormItem label="名称" {...formItemLayout} required>
          {getFieldDecorator('name', {
          initialValue: initialValue.name || '',
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label="分类" {...formItemLayout} required>
          {getFieldDecorator('tag_category_id', {
            initialValue: { ...initialValue.category }.id || undefined,
          })(
            <Select placeholder="请选择">
              {stafftagtypes.map(item => (
                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
            ))}
            </Select>
          )}
        </FormItem>

        <FormItem label="说明" {...formItemLayout} >
          {getFieldDecorator('description', {
            initialValue: initialValue.description || '',
          })(<Input.TextArea placeholder="请输入" />)}
        </FormItem>

      </OAModal>
    );
  }
}
