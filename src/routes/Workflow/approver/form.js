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
    const { submit, initialValue, roles, modeId } = this.props;
    const approverRoles = roles.filter(item => value.approver_roles.indexOf(`${item.id}`) !== -1)
      .map(item => ({ value: item.id, text: item.role_name }));
    const params = {
      ...initialValue,
      ...value,
      ...value.department,
    };
    params.approver_roles = approverRoles;
    params.step_approver_id = modeId;
    submit(params, onError);
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
              />
            )}
          </FormItem>
          <FormItem label="部门" required {...formItemLayout}>
            {getFieldDecorator('approver_departments', {
              initialValue: initialValue.approver_departments || [],
            })(
              <TreeSelect
                multiple
                name={{
                  value: 'id',
                  text: 'name',
                }}
                valueIndex="value"
                dataSource={department}
                getPopupContainer={triggerNode => (triggerNode)}
                dropdownStyle={{ maxHeight: '300px', overflow: 'auto' }}
              />
            )}
          </FormItem>
          <FormItem label="角色" required {...formItemLayout}>
            {getFieldDecorator('approver_roles', {
              initialValue: approverRoles.map(item => `${item.value}`) || [],
            })(
              <Select placeholder="请输入" mode="multiple">
                {roles.map(item => <Option key={item.id}>{item.role_name}</Option>)}
              </Select>
            )}
          </FormItem>
        </Card>
      </OAModal>
    );
  }
}
