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
    const { submit, initialValue } = this.props;
    submit({
      ...initialValue,
      ...value,
    }, onError);
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
              initialValue: initialValue.department || [],
            })(
              <TreeSelect
                multiple
                dataSource={department}
                valueIndex="department_id"
                name={{
                  department_id: 'id',
                  department_full_name: 'full_name',
                }}
                getPopupContainer={triggerNode => (triggerNode)}
                dropdownStyle={{ maxHeight: '300px', overflow: 'auto' }}
              // onChange={() => this.handleDefaultValueChange()}
              />
            )}
          </FormItem>
        </Card>
        <Card bordered={false} title="审批">
          <FormItem label="员工" required {...formItemLayout}>
            {getFieldDecorator('approver_staff', {
              initialValue: initialValue.approver_staff || '',
            })(
              <SearchTable.Staff
                multiple
              />
            )}
          </FormItem>
          <FormItem label="部门" required {...formItemLayout}>
            {getFieldDecorator('approver_departments', {
              initialValue: initialValue.approver_departments || [],
            })(
              <TreeSelect
                multiple
                dataSource={department}
                valueIndex="department_id"
                name={{
                  department_id: 'id',
                  department_full_name: 'full_name',
                }}
                getPopupContainer={triggerNode => (triggerNode)}
                dropdownStyle={{ maxHeight: '300px', overflow: 'auto' }}
              // onChange={() => this.handleDefaultValueChange()}
              />
            )}
          </FormItem>
          <FormItem label="角色" required {...formItemLayout}>
            {getFieldDecorator('approver_roles', {
              initialValue: initialValue.approver_roles || [],
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
