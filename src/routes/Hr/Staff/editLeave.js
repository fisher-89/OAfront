import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Input,
  Select,
  Switch,
} from 'antd';

import OAForm, { DatePicker, OAModal } from '../../../components/OAForm';

const FormItem = OAForm.Item;
const { Option } = Select;

@OAForm.create()
@connect(({ staffs }) => ({ staffs }))
export default class extends PureComponent {
  handleSubmit = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'staffs/leave',
      payload: {
        ...params,
        skip_leaving: params.skip_leaving ? 1 : 0,
      },
      onError: this.handleError,
      onSuccess: this.handleSuccess,
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
      editStaff,
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
        width={600}
        title="离职"
        loading={loading}
        visible={visible}
        style={{ top: 30 }}
        onCancel={() => this.props.onCancel()}
        onSubmit={validateFields(this.handleSubmit)}
      >
        <FormItem label="姓名" {...formItemLayout}>
          {getFieldDecorator('staff_sn', {
            initialValue: editStaff.staff_sn || '',
          })(
            <Input type="hidden" />
          )}
          {getFieldDecorator('operation_type', {
            initialValue: 'leave',
          })(
            <Input type="hidden" />
          )}
          {getFieldDecorator('realname', {
            initialValue: editStaff.realname,
          })(
            <Input placeholder="请输入" name="realname" disabled />
          )}
        </FormItem>
        <FormItem label="状态" required {...formItemLayout}>
          {getFieldDecorator('status_id', {
            initialValue: -1,
          })(
            <Select name="status_id" placeholer="请选择">
              <Option value={-1}>离职</Option>
              <Option value={-2}>自动离职</Option>
              <Option value={-3}>开除</Option>
              <Option value={-4}>劝退</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="跳过工作交接">
          {getFieldDecorator('skip_leaving', {
            initialValue: false,
          })(
            <Switch onChange={this.handleChange} />
          )}
        </FormItem>
        <FormItem label="执行时间" name="operate_at" required {...formItemLayout}>
          {getFieldDecorator('operate_at', {
            initialValue: '',
          })(
            <DatePicker />
          )}
        </FormItem>
        <FormItem label="操作说明" {...formItemLayout1} name="operation_remark">
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
