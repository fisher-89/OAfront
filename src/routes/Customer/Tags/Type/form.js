import React from 'react';
import {
  Input,
  InputNumber,
} from 'antd';
import {
  SketchPicker,
} from 'react-color';
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
    return (
      <OAModal
        loading={loading}
        visible={visible}
        title="标签类型表单"
        onCancel={() => onCancel(false)}
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
            initialValue: initialValue.color || '',
            rules: [validatorRequired],
          })(
            <Input type="hidden" />
          )}
          <SketchPicker
            width={250}
            color={getFieldValue('color') || '#fff'}
            onChange={({ hex }) => {
              setFieldsValue({ color: hex });
            }}
          />
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
