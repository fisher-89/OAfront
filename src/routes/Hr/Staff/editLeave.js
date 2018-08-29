import React, { PureComponent } from 'react';
import {
  Input,
  Select,
  Switch,
} from 'antd';

import OAForm, { DatePicker, OAModal } from '../../../components/OAForm';

const FormItem = OAForm.Item;
const { Option } = Select;

@OAForm.create()
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleSubmit = (e) => {
    return e;
  };

  render() {
    const {
      form,
      visible,
      editStaff,
      validateFields,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <OAModal
        width={600}
        title="离职"
        visible={visible}
        style={{ top: 30 }}
        onCancel={() => this.props.onCancel()}
        onSubmit={validateFields(this.handleSubmit)}
      >
        <FormItem label="姓名" {...formItemLayout}>
          {form.getFieldDecorator('realname', {
            initialValue: editStaff.realname,
          })(
            <Input placeholder="请输入" name="realname" disabled />
          )}
        </FormItem>
        <FormItem label="状态" required {...formItemLayout}>
          {form.getFieldDecorator('status_id', {
            initialValue: editStaff.status_id,
          })(
            <Select name="status_id" placeholer="请选择">
              <Option value={1}>试用期</Option>
              <Option value={2}>在职</Option>
              <Option value={3}>停薪留职</Option>
              <Option value={-1}>离职</Option>
              <Option value={-2}>自动离职</Option>
              <Option value={-3}>开除</Option>
              <Option value={-4}>劝退</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="工作交接" name="skip_leaving">
          {form.getFieldDecorator('skip_leaving', {
            initialValue: editStaff.skip_leaving,
          })(
            <Switch />
          )}
        </FormItem>
        <FormItem label="执行时间" name="operate_at" required {...formItemLayout}>
          {form.getFieldDecorator('operate_at', {
            initialValue: editStaff.operate_at,
          })(
            <DatePicker />
          )}
        </FormItem>
        <FormItem label="操作说明" {...formItemLayout} name="operation_remark">
          {form.getFieldDecorator('operation_remark', {
            initialValue: editStaff.operation_remark,
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
