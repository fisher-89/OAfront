import React, { PureComponent } from 'react';
import { Input, Select } from 'antd';
import OAForm, { OAModal } from '../../../components/OAForm';


const FormItem = OAForm.Item;
const formItemLayout =
  {
    labelCol: { span: 8, pull: 3 },
    wrapperCol: { span: 16, pull: 3 },
  };
@OAForm.create()
export default class extends PureComponent {
  render() {
    const { visible, form: { getFieldDecorator }, onCancel } = this.props;
    return (
      <OAModal
        title="费用品牌"
        visible={visible}
        onCancel={() => onCancel(false)}
      >
        <FormItem label="费用品牌名称" {...formItemLayout} required>
          {getFieldDecorator('name')(<Input />)}
        </FormItem>
        <FormItem label="关联品牌" {...formItemLayout} required>
          {getFieldDecorator('brand')(<Select />)}
        </FormItem>
      </OAModal>
    );
  }
}
