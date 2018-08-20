import React, { PureComponent } from 'react';
import {
  Input,
} from 'antd';
import { connect } from 'dva';
import OAForm, { OAModal } from '../../../components/OAForm1';

const FormItem = OAForm.Item;
@connect(({ loading }) => ({
  loading: loading.effects['point/addType'],
}))
@OAForm.create()
export default class extends PureComponent {
  handleOnSuccess = () => {
    this.props.onCancel();
  }


  handleSubmit = (values) => {
    const { dispatch, onError } = this.props;
    dispatch({
      type: 'point/revokeEventLog',
      payload: values,
      onSuccess: this.handleOnSuccess,
      onError,
    });
  }

  render() {
    const {
      visible,
      initialValue,
      onCancel,
      onClose,
      loading,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <OAModal
        title="撤销事件"
        visible={visible}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => onCancel(false)}
        afterClose={onClose}
        loading={loading}
      >
        {initialValue.id ? getFieldDecorator('id', {
          initialValue: initialValue.id,
        })(
          <Input type="hidden" />
        ) : null}

        <FormItem
          label="记录人扣分"
        >
          {getFieldDecorator('recorder_point', {
            initialValue: initialValue.recorder_point || 0,
            rules: [
              {
                required: true,
                message: '必填内容',
              },
            ],
          })(
            <Input placeholder="请输入" type="digits" />
          )}
        </FormItem>

        <FormItem
          label="初审人扣分"
        >
          {getFieldDecorator('first_approver_point', {
            initialValue: initialValue.first_approver_point || 0,
            rules: [
              {
                required: true,
                message: '必填内容',
              },
            ],
          })(
            <Input placeholder="请输入" type="digits" />
          )}
        </FormItem>
        <FormItem
          label="终审人扣分"
        >
          {getFieldDecorator('final_approver_point', {
            initialValue: initialValue.final_approver_point || 0,
            rules: [
              {
                required: true,
                message: '必填内容',
              },
            ],
          })(
            <Input placeholder="请输入" type="digits" />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
