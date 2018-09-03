import React from 'react';
import {
  Input,
  Radio,
  Select,
} from 'antd';
import store from '../store';
import OAForm, {
  OAModal,
  TreeSelect,
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
    const { submit } = this.props;
    submit(values, onError);
  }

  render() {
    const {
      brand,
      loading,
      department,
      form: { getFieldDecorator },
      visible, onCancel, validateFields, validatorRequired } = this.props;
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
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="分组类型" {...formItemLayout} required>
          {getFieldDecorator('auth_type', {
            rules: [validatorRequired],
          })(
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="1">查看权限</Radio.Button>
              <Radio.Button value="2">操作权限</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>

        <FormItem label="品牌权限" {...formItemLayout} required>
          {getFieldDecorator('auth_brand', {
            rules: [validatorRequired],
          })(
            <Select placeholder="请选择" getPopupContainer={triggerNode => (triggerNode)}>
              {brand.map(item => (
                <Option key={`${item.id}`}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="部门权限"
        >
          {getFieldDecorator('departments', {
            initialValue: [],
          })(
            <TreeSelect
              multiple
              treeNodeFilterProp="title"
              dataSource={department}
              name={{ department_id: 'id', department_name: 'full_name' }}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="员工权限"
        >
          {getFieldDecorator('staffs', {
            initialValue: [],
          })(
            <SearchTable.Staff multiple />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="客户权限"
        >
          {getFieldDecorator('note_staff', {
            initialValue: [],
          })(
            <SearchTable.Customer multiple />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
