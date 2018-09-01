import React from 'react';
import {
  Input,
} from 'antd';
import OAForm, { OAModal } from '../../../components/OAForm';
import store from './store';

const FormItem = OAForm.Item;

const formItemLayout = {
  labelCol: { span: 8, pull: 3 },
  wrapperCol: { span: 16, pull: 3 },
};


@OAForm.create()
@store('submit')
export default class extends React.PureComponent {
  handleSubmit = (values) => {
    console.log(values);
  }

  render() {
    const {
      form: { getFieldDecorator },
      visible, onCancel, validateFields, validatorRequired } = this.props;
    return (
      <OAModal
        visible={visible}
        onCancel={onCancel}
        title="客户权限表单"
        onSubmit={validateFields(this.handleSubmit)}
      >
        <FormItem label="分组名称" {...formItemLayout} required>
          {getFieldDecorator('name', {
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
