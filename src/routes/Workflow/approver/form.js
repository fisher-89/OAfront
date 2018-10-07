import React, { PureComponent } from 'react';
import {
  Input,
} from 'antd';
import OAForm, {
  OAModal,
  SearchTable,
} from '../../../components/OAForm';
import store from './store/store';

const FormItem = OAForm.Item;

@OAForm.create()
@store('submit')
export default class List extends PureComponent {
  handleSubmit = (value, onError) => {
    const { submit } = this.props;
    submit(value, onError);
  }

  render() {
    const {
      visible,
      loading,
      onCancel,
      initialValue,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <OAModal
        title="审批人"
        visible={visible}
        loading={loading}
        onCancel={onCancel}
        onSubmit={validateFields(this.handleSubmit)}
        actionType={initialValue.id !== undefined}
      >
        <FormItem label="部门" required>
          {getFieldDecorator('department', {
            initialValue: initialValue.department || '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="审批人" required>
          {getFieldDecorator('approver_staff', {
            initialValue: initialValue.approver_staff || '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="角色" required>
          {getFieldDecorator('approver_roles', {
            initialValue: initialValue.approver_roles || '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="审批部门" required>
          {getFieldDecorator('approver_departments', {
            initialValue: initialValue.approver_departments || [],
          })(
            <SearchTable.Staff
              multiple
            />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
