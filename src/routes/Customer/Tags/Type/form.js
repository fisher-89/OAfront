import React from 'react';
import {
  Tag,
  Input,
  InputNumber,
} from 'antd';
import { CirclePicker } from 'react-color';
import store from '../store/type';
import OAForm, { OAModal } from '../../../../components/OAForm';

const FormItem = OAForm.Item;


const formItemLayout = {
  labelCol: { span: 8, pull: 3 },
  wrapperCol: { span: 16, pull: 3 },
};

@OAForm.create()
@store('submit')
export default class extends React.PureComponent {
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
    const {
      loading,
      initialValue,
      visible, validatorRequired, validateFields, onCancel,
      form: { getFieldValue, getFieldDecorator, setFieldsValue },
    } = this.props;
    const color = [
      '#874E01', '#622A1D', '#003264', '#0032C8', '#320096',
      '#D68806', '#9D2933', '#006464', '#0064C8', '#640096',
      '#FAAD15', '#C21F30', '#329632', '#0096C8', '#960096',
      '#FFC53D', '#F5222D', '#64C800', '#00C8C8', '#C80096',
    ];
    return (
      <OAModal
        title="标签类型"
        loading={loading}
        visible={visible}
        onCancel={() => onCancel(false)}
        actionType={initialValue.id !== undefined}
        onSubmit={validateFields(this.handleSubmit)}
      >
        <FormItem label="名称" {...formItemLayout} required>
          {getFieldDecorator('name', {
            initialValue: initialValue.name || '',
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="颜色" {...formItemLayout} required>
          {getFieldDecorator('color', {
            initialValue: initialValue.color || '#874E01',
            rules: [validatorRequired],
          })(
            <Input type="hidden" />
          )}
          <CirclePicker
            width={360}
            colors={color}
            circleSpacing={35}
            color={getFieldValue('color')}
            onChange={({ hex }) => {
              setFieldsValue({ color: hex });
            }}
          />
          <div style={{ marginTop: 5 }}>
            预览 : <Tag color={getFieldValue('color') || '#874E01'}>{getFieldValue('name') || '颜色'}</Tag>
          </div>
        </FormItem>
        <FormItem label="排序" {...formItemLayout}>
          {getFieldDecorator('sort', {
            initialValue: initialValue.sort || 0,
          })(
            <InputNumber placeholder="请输入" min={0} />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
