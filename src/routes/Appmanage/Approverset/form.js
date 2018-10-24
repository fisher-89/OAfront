import React, { PureComponent } from 'react';
import {
  Select,
  Input,
} from 'antd';
import { connect } from 'dva';
import OAForm, { TreeSelect, OAModal, SearchTable } from '../../../components/OAForm';

const FormItem = OAForm.Item;
@connect(({ appmanage, department, loading }) => ({
  department: department.department,
  reimdepartment: appmanage.reimdepartment,
  loading: (
    loading.effects['appmanage/addApprovers'] ||
    loading.effects['appmanage/editApprovers']
  ),
}))
@OAForm.create()
export default class extends PureComponent {
  handleSubmit = (params) => {
    const { dispatch, onError } = this.props;
    dispatch({
      type: params.id ? 'appmanage/editApprovers' : 'appmanage/addApprovers',
      payload: params,
      onError: (error) => {
        onError(error, {
          department_id: 'department_id',
          staff_sn: 'approver1',
          reim_department_id: 'reim_department_id',
        });
      },
      onSuccess: () => this.props.handleVisible(false),
    });
  }
  render() {
    const {
      department,
      visible,
      onCancel,
      initialValue,
      handleVisible,
      reimdepartment,
      validateFields,
    } = this.props;
    const info = { ...initialValue };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <OAModal
        loading={this.props.loading}
        visible={visible}
        title="审批"
        actionType={info.id !== undefined}
        onSubmit={validateFields(this.handleSubmit)}
        afterClose={onCancel}
        onCancel={() => handleVisible(false)}
      >
        {info.id ? (getFieldDecorator('id', {
          initialValue: info.id,
        }))(
          <Input type="hidden" placeholder="请输入" />
        ) : null}
        <FormItem label="部门" {...formItemLayout} required >
          {
            getFieldDecorator('department_id', {
              initialValue: info || [],
            })(
              <TreeSelect
                parentValue={0}
                dataSource={department}
                valueIndex="department_id"
                name={{
                  department_id: 'id',
                  department_full_name: 'full_name',
                }}
                getPopupContainer={triggerNode => (triggerNode)}
                dropdownStyle={{ maxHeight: '300px', overflow: 'auto' }}
              />
            )
          }
        </FormItem>
        <FormItem label="资金归属" {...formItemLayout} required >
          {
            getFieldDecorator('reim_department_id', {
              initialValue: info.reim_department_id || [],
            })(
              <Select>
                {reimdepartment.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                )
                )}
              </Select>
            )}
        </FormItem>
        <FormItem label="一级审批人" {...formItemLayout} required >
          {
            getFieldDecorator('approver1', {
              initialValue: info.approver1 || [],
            })(
              <SearchTable.Staff
                multiple="true"
                name={{
                  staff_sn: 'staff_sn',
                  realname: 'realname',
                }}
                showName="realname"
                placeholder="请选择员工"
              />
            )
          }
        </FormItem>
        <FormItem label="二级审批人" {...formItemLayout} >
          {
            getFieldDecorator('approver2', {
              initialValue: info.approver2 || [],
            })(
              <SearchTable.Staff
                multiple="true"
                name={{
                  staff_sn: 'staff_sn',
                  realname: 'realname',
                }}
                showName="realname"
                placeholder="请选择员工"
              />
            )
          }
        </FormItem>
        <FormItem label="三级审批人" {...formItemLayout} >
          {
            getFieldDecorator('approver3', {
              initialValue: info.approver3 || [],
            })(
              <SearchTable.Staff
                multiple="true"
                name={{
                  staff_sn: 'staff_sn',
                  realname: 'realname',
                }}
                showName="realname"
                placeholder="请选择员工"
              />
            )
          }
        </FormItem>
      </OAModal>
    );
  }
}
