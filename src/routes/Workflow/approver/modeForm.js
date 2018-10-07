import React, { PureComponent } from 'react';
import {
  Input,
} from 'antd';
import OAForm, {
  OAModal,
} from '../../../components/OAForm';
import store from './store/store';

const FormItem = OAForm.Item;

@OAForm.create()
@store('modeSubmit')
export default class List extends PureComponent {
  handleSubmit = (value, onError) => {
    const { modeSubmit, initialValue } = this.props;
    modeSubmit({
      ...initialValue,
      ...value,
    }, onError);
  }

  render() {
    const {
      visible,
      loading,
      onCancel,
      initialValue,
      validateFields,
      validatorRequired,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <OAModal
        title="审批模板"
        visible={visible}
        loading={loading}
        onCancel={onCancel}
        onSubmit={validateFields(this.handleSubmit)}
        actionType={initialValue.id !== undefined}
      >
        <FormItem label="模板名称" required>
          {getFieldDecorator('name', {
            initialValue: initialValue.name || '',
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="模板描述">
          {getFieldDecorator('description', {
            initialValue: initialValue.description || '',
          })(
            <Input.TextArea placeholder="请输入" />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
