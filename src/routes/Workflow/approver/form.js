import React, { PureComponent } from 'react';
import {
  Card,
  Select,
} from 'antd';
import OAForm, {
  OAModal,
  TreeSelect,
  SearchTable,
} from '../../../components/OAForm';
import store from './store/store';

const { Option } = Select;
const FormItem = OAForm.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
@OAForm.create()
@store(['submit', 'fetchDepartment', 'fetchRoles'])
export default class List extends PureComponent {
  componentWillMount() {
    const { fetchRoles } = this.props;
    fetchRoles();
  }

  handleSubmit = (value, onError) => {
    const { submit, initialValue, modeId } = this.props;
    const params = {
      ...initialValue,
      ...value,
      ...value.department,
    };
    params.step_approver_id = modeId;
    submit(params, onError);
  }

  handleChange = () => {
    const { setFields, getFieldsValue } = this.props.form;
    const value = getFieldsValue(['approver_staff', 'approver_departments', 'approver_roles']);
    setFields({
      approver_staff: { value: value.approver_staff, errors: undefined },
      approver_departments: { value: value.approver_departments, errors: undefined },
      approver_roles: { value: value.approver_roles, errors: undefined },
    });
  }

  render() {
    const {
      roles,
      visible,
      loading,
      onCancel,
      department,
      initialValue,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;

    const approverRoles = initialValue.approver_roles || [];

    return (
      <OAModal
        title="规则"
        visible={visible}
        loading={loading}
        onCancel={onCancel}
        onSubmit={validateFields(this.handleSubmit)}
        actionType={initialValue.id !== undefined}
      >
        <Card bordered={false}>
          <FormItem label="所属部门" required {...formItemLayout}>
            {getFieldDecorator('department', {
              initialValue: initialValue.department_id ? {
                department_id: initialValue.department_id,
                department_name: initialValue.department_name,
              } : {},
            })(
              <TreeSelect
                name={{
                  department_id: 'id',
                  department_name: 'name',
                }}
                valueIndex="department_id"
                dataSource={department}
                getPopupContainer={triggerNode => (triggerNode)}
                dropdownStyle={{ maxHeight: '300px', overflow: 'auto' }}
              />
            )}
          </FormItem>
        </Card>
        <Card bordered={false} title="审批">
          <FormItem label="员工" required {...formItemLayout}>
            {getFieldDecorator('approver_staff', {
              initialValue: initialValue.approver_staff || [],
            })(
              <SearchTable.Staff
                multiple
                showName="text"
                name={{
                  value: 'staff_sn',
                  text: 'realname',
                }}
                onChange={this.handleChange}
              />
            )}
          </FormItem>
          <FormItem label="部门" required {...formItemLayout}>
            {getFieldDecorator('approver_departments', {
              initialValue: initialValue.approver_departments || [],
            })(
              <TreeSelect
                multiple
                name={false}
                dataSource={department}
                onChange={this.handleChange}
                getPopupContainer={triggerNode => (triggerNode)}
                dropdownStyle={{ maxHeight: '300px', overflow: 'auto' }}
              />
            )}
          </FormItem>
          <FormItem label="角色" required {...formItemLayout}>
            {getFieldDecorator('approver_roles', {
              initialValue: approverRoles,
            })(
              <Select placeholder="请输入" mode="multiple" onChange={this.handleChange}>
                {roles.map(item => <Option key={item.id}>{item.role_name}</Option>)}
              </Select>
            )}
          </FormItem>
        </Card>
      </OAModal>
    );
  }
}
