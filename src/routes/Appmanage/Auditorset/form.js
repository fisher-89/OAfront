import React, { PureComponent } from 'react';
import { Input } from 'antd';
import { connect } from 'dva';
import OAForm, { OAModal, SearchTable } from '../../../components/OAForm';

const FormItem = OAForm.Item;
@connect(({ appmanage, loading }) => ({
  reimdepartment: appmanage.reimdepartment,
  loading: (
    loading.effects['appmanage/addReimDepartment'] ||
    loading.effects['apppmanage/editReimDepartment']
  ),
}))
@OAForm.create()
export default class extends PureComponent {
  handleSubmit = (params) => {
    const { dispatch, onError } = this.props;
    dispatch({
      type: params.id ? 'appmanage/editReimDepartment' : 'appmanage/addReimDepartment',
      payload: params,
      onError: (error) => {
        onError(error, {
          name: 'name',
          auditor: 'auditor',
          manager_sn: 'manager_sn',
          manager_name: 'manager_sn',
          cashier_sn: 'cashier_sn',
          cashier_name: 'cashier_sn',
        });
      },
      onSuccess: () => this.props.handleVisible(false),
    });
  }
  render() {
    const {
      visible,
      initialValue,
      handleVisible,
      onCancel,
      validateFields,
    } = this.props;
    const info = { ...initialValue };
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <OAModal
        loading={this.props.loading}
        title="审核"
        visible={visible}
        onSubmit={validateFields(this.handleSubmit)}
        actionType={info.id !== undefined}
        afterClose={onCancel}
        onCancel={() => handleVisible(false)}
      >
        {info.id ? (getFieldDecorator('id', {
          initialValue: info.id,
        }))(
          <Input type="hidden" placeholder="请输入" />
        ) : null}
        <FormItem label="资金归属" {...formItemLayout} required>
          {
            getFieldDecorator('name', {
              initialValue: info.name || '',
            })(
              <Input placeholder="请输入" />
            )
          }
        </FormItem>
        <FormItem label="品牌副总" {...formItemLayout} required>
          {
            getFieldDecorator('manager_sn', {
              initialValue: info || '',
            })(
              <SearchTable.Staff
                name={{
                  manager_sn: 'staff_sn',
                  manager_name: 'realname',
                }}
                showName="manager_name"
                placeholder="请选择员工"
              />
            )
          }
        </FormItem>
        <FormItem label="出纳" {...formItemLayout} required>
          {
            getFieldDecorator('cashier_sn', {
              initialValue: info,
            })(
              <SearchTable.Staff
                name={{
                  cashier_sn: 'staff_sn',
                  cashier_name: 'realname',
                }}
                showName="cashier_name"
                placeholder="请选择员工"
              />
            )
          }
        </FormItem>
        <FormItem label="财务审核人" {...formItemLayout} required>
          {
            getFieldDecorator('auditor', {
              initialValue: info.auditor || [],
            })(
              <SearchTable.Staff
                multiple="true"
                name={{
                  auditor_staff_sn: 'staff_sn',
                  auditor_realname: 'realname',
                }}
                valueName="auditor_staff_sn"
                showName="auditor_realname"
                placeholder="请选择员工"
              />
            )
          }
        </FormItem>
      </OAModal>
    );
  }
}
