import React, { PureComponent } from 'react';
import { Input } from 'antd';
import OAForm, { OAModal } from '../../../components/OAForm';

const FormItem = OAForm.Item;
const formItemLayout = {
  labelCol: { span: 8, pull: 3 },
  wrapperCol: { span: 16, pull: 3 },
};
@OAForm.create()
export default class extends PureComponent {
  render() {
    const { form: { getFieldDecorator }, visible, onCancel } = this.props;
    return (
      <OAModal
        visible={visible}
        onCancel={() => onCancel(false)}
      >
        <FormItem label="名称" {...formItemLayout} required>
          {getFieldDecorator('name')(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="分类" {...formItemLayout} required>
          {getFieldDecorator('type')(<Input />)}
        </FormItem>
        <FormItem label="说明" {...formItemLayout} >
          {getFieldDecorator('description')(<Input.TextArea placeholder="请输入" />)}
        </FormItem>
      </OAModal>
    );
  }
}
