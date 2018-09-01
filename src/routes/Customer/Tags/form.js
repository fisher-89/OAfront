import React from 'react';
import {
  Input,
} from 'antd';
import store from './store';
import OAForm, { OAModal } from '../../../components/OAForm';

const FormItem = OAForm.Item;

@store()
@OAForm.create()
export default class extends React.PureComponent {
  render() {
    const { form: { getFieldDecorator }, visible } = this.props;
    return (
      <OAModal visible={visible} title="标签表单">
        <FormItem label="名称">
          {getFieldDecorator('name', {})(
            <Input placeholder="请输入" />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
