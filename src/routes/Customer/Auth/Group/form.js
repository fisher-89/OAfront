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
        title="客户权限"
        visible={visible}
        loading={loading}
        onCancel={onCancel}
        actionType={initialValue.id !== undefined}
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


        <FormItem label="可查看品牌" {...formItemLayout} required>
          {getFieldDecorator('visibles', {
            initialValue: visibles,
            rules: [validatorRequired],
          })(
            <Select
              mode="multiple"
              placeholder="请选择"
              onChange={() => {
                const editablesValue = this.props.form.getFieldValue('editables');
                this.props.form.setFields({
                  editables: {
                    errors: null,
                    value: editablesValue,
                  },
                });
              }}
              getPopupContainer={triggerNode => (triggerNode)}
            >
              {brand.map(item => (
                <Option key={`${item.id}`}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>


        <FormItem label="可操作品牌" {...formItemLayout} >
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


        <FormItem {...formItemLayout} label="员工权限" required>
          {getFieldDecorator('staffs', {
            initialValue: initialValue.staffs || [],
            rules: [validatorRequired],
          })(
            <SearchTable.Staff multiple />
          )}
        </FormItem>

      </OAModal>
    );
  }
}
