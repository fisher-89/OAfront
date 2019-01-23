import React, { PureComponent } from 'react';
import {
  Input,
  Switch,
} from 'antd';
import OAForm, { OAModal, SearchTable } from '../../../components/OAForm';

const FormItem = OAForm.Item;
@OAForm.create()
export default class extends PureComponent {
  handleSubmit = (params) => {
    const { setPushAuth, onCancel } = this.props;
    const payload = {
      ...params,
      ...params.staff,
      default_push: params.default_push ? 1 : 0,
    };
    setPushAuth(payload, this.handleError, () => onCancel());
  }

  handleError = (error) => {
    const { onError } = this.props;
    onError(error, {
      staff_name: 'staff',
      staff_sn: 'staff',
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const staffItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
    };
    const { initialValue, validateFields, onCancel, visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    const staffname = { staff_sn: initialValue.staff_sn, staff_name: initialValue.staff_name };
    return (
      <OAModal
        visible={visible}
        title="推送权限"
        onCancel={() => onCancel()}
        actionType={initialValue.id !== undefined}
        onSubmit={validateFields(this.handleSubmit)}
      >
        {getFieldDecorator('id', {
          initialValue: initialValue.id || undefined,
          })(<input type="hidden" />)}
        <FormItem label="员工姓名" {...staffItemLayout} required>
          {getFieldDecorator('staff', {
           initialValue: staffname || { },
          })(
            <SearchTable.Staff
              name={{
                  staff_sn: 'staff_sn',
                  staff_name: 'realname',
              }}
              showName="staff_name"
              placeholder="请选择员工"
            />)}
        </FormItem>
        <FormItem label="推送地址编号" {...formItemLayout} required>
          {getFieldDecorator('flock_sn', {
            initialValue: initialValue.flock_sn || '' })(
              <Input />
        )}
        </FormItem>
        <FormItem label="推送地址名称" {...formItemLayout} required>
          {getFieldDecorator('flock_name', {
           initialValue: initialValue.flock_name || '' })(
             <Input />
          )}
        </FormItem>
        <FormItem label="是否默认选择" {...formItemLayout}>
          {getFieldDecorator('default_push', {
            initialValue: !!initialValue.default_push || 0 })(
              <Switch />
          )}
        </FormItem>
      </OAModal>
    );
  }
}

