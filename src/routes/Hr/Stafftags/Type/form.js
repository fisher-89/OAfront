import React, { PureComponent } from 'react';
import { Input, Tag } from 'antd';
import { CirclePicker } from 'react-color';
import OAForm, { OAModal } from '../../../../components/OAForm';
import store from '../store/type';

const FormItem = OAForm.Item;
const formItemLayout = {
  labelCol: { span: 8, pull: 3 },
  wrapperCol: { span: 16, pull: 3 },
};
@OAForm.create()
@store('submit')
export default class extends PureComponent {
  handleSubmit = (values, onError) => {
    const { submit, onCancel, initialValue } = this.props;
    submit({
      ...initialValue,
      ...values,
    }, onError, () => {
      onCancel(false);
    });
  }

  render() {
    const color = [
      '#874E01', '#622A1D', '#003264', '#0032C8', '#320096',
      '#D68806', '#9D2933', '#006464', '#0064C8', '#640096',
      '#FAAD15', '#C21F30', '#329632', '#0096C8', '#960096',
      '#FFC53D', '#F5222D', '#64C800', '#00C8C8', '#C80096',
    ];
    const {
      visible,
      loading,
      validateFields,
      initialValue,
      onCancel,
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
    } = this.props;
    return (
      <OAModal
        title="标签类型"
        loading={loading}
        visible={visible}
        actionType={initialValue.id !== undefined}
        onCancel={() => onCancel(false)}
        onSubmit={validateFields(this.handleSubmit)}
      >
        <FormItem label="名称" {...formItemLayout} required>
          {getFieldDecorator('name', {
            initialValue: initialValue.name || '',
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="颜色" {...formItemLayout} required>
          {getFieldDecorator('color', {
            initialValue: initialValue.color || '#874E01',
          })(<Input type="hidden" />)}
          <CirclePicker
            width={360}
            colors={color}
            circleSpacing={35}
            color={getFieldValue('color')}
            onChange={({ hex }) => {
              setFieldsValue({ color: hex });
            }}
          />
          <div>
          预览：<Tag color={getFieldValue('color') || '#874E01'}>{getFieldValue('name') || '颜色'}</Tag>
          </div>
        </FormItem>
      </OAModal>
    );
  }
}
