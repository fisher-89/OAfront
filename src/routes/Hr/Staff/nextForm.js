import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Input,
  message,
} from 'antd';

import OAForm, { DatePicker, OAModal } from '../../../components/OAForm';

const FormItem = OAForm.Item;

@OAForm.create()
@connect(({ loading }) => ({ loading: loading.models.staffs }))
export default class extends PureComponent {
  handleSubmit = (params) => {
    const { dispatch, onError, onCancel, perantOnCancel } = this.props;
    if (!params.operation_at) {
      message.error('请选择执行日期！！');
      return;
    }
    const body = {
      ...params,
      ...params.recruiter,
      ...params.household,
      ...params.living,

      is_active: params.is_active ? 1 : 0,
      account_active: params.account_active ? 1 : 0,
    };
    delete body.recruiter;
    delete body.household;
    delete body.living;
    const relatives = body.relatives.map(item =>
      ({ ...item.relative, relative_type: item.relative_type })
    );
    body.relatives = relatives;
    dispatch({
      type: params.staff_sn ? 'staffs/editStaff' : 'staffs/addStaff',
      payload: body,
      onError: (errors) => {
        onCancel();
        onError(errors);
      },
      onSuccess: () => {
        onCancel();
        perantOnCancel();
      },
    });
  }

  handleError = (err) => {
    const { onError } = this.props;
    onError(err);
  }

  handleSuccess = () => {
    this.props.onCancel();
  }

  handleChange = (check) => {
    this.props.form.setFieldsValue({
      operation_type: (check === true) ? 'leaving' : 'leave',
    });
  }

  render() {
    const {
      loading,
      visible,
      onCancel,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 8 },
    };
    const formItemLayout1 = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    return (
      <OAModal
        width={500}
        title="操作设置"
        loading={loading}
        visible={visible}
        onCancel={onCancel}
        onSubmit={validateFields(this.handleSubmit)}
      >
        <FormItem label="执行日期" {...formItemLayout} required>
          {getFieldDecorator('operation_at', {
            initialValue: '',
          })(
            <DatePicker />
          )}
        </FormItem>
        <FormItem label="操作说明" {...formItemLayout1} >
          {getFieldDecorator('operation_remark', {
            initialValue: '',
          })(
            <Input.TextArea
              placeholder="最大长度100个字符"
              autosize={{
                minRows: 4,
                maxRows: 6,
              }}
            />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
