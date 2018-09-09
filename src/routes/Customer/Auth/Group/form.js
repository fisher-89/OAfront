import React from 'react';
import {
  Input,
  Select,
} from 'antd';
import store from '../store/store';
import OAForm, {
  OAModal,
  SearchTable,
} from '../../../../components/OAForm';

const FormItem = OAForm.Item;

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 8, pull: 3 },
  wrapperCol: { span: 16, pull: 3 },
};


@OAForm.create()
@store('submit')
export default class extends React.PureComponent {
  handleSubmit = (values, onError) => {
    const { submit, initialValue, onCancel } = this.props;
    submit({
      ...initialValue,
      ...values,
    }, onError, onCancel);
  }

  render() {
    const {
      brand,
      loading,
      initialValue,
      form: { getFieldDecorator },
      visible, onCancel, validateFields, validatorRequired } = this.props;
    const editables = (initialValue.editables || []).map(item => `${item}`);
    const visibles = (initialValue.visibles || []).map(item => `${item}`);
    return (
      <OAModal
        visible={visible}
        loading={loading}
        onCancel={onCancel}
        title="客户权限表单"
        onSubmit={validateFields(this.handleSubmit)}
      >
        <FormItem label="分组名称" {...formItemLayout} required>
          {getFieldDecorator('name', {
            initialValue: initialValue.name,
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="描述" {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: initialValue.description,
          })(
            <Input.TextArea placeholder="请输入" />
          )}
        </FormItem>

        <FormItem label="品牌操作权限" {...formItemLayout} >
          {getFieldDecorator('editables', {
            initialValue: editables,
          })(
            <Select
              mode="multiple"
              placeholder="请选择"
              getPopupContainer={triggerNode => (triggerNode)}
            >
              {brand.map(item => (
                <Option key={`${item.id}`}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem label="品牌查看权限" {...formItemLayout}>
          {getFieldDecorator('visibles', {
            initialValue: visibles,
          })(
            <Select
              mode="multiple"
              placeholder="请选择"
              getPopupContainer={triggerNode => (triggerNode)}
            >
              {brand.map(item => (
                <Option key={`${item.id}`}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="员工权限"
        >
          {getFieldDecorator('staffs', {
            initialValue: initialValue.staffs || [],
          })(
            <SearchTable.Staff multiple />
          )}
        </FormItem>

      </OAModal>
    );
  }
}
