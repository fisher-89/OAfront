import React, { PureComponent } from 'react';
import {
  Input,
} from 'antd';
import { connect } from 'dva';
import OAForm, {
  OAModal,
  TreeSelect,
  SearchTable,
} from '../../../../components/OAForm';

const FormItem = OAForm.Item;

@connect(({ department, loading }) => ({
  department: department.department,
  loading: (
    loading.effects['point/addAuth'] ||
    loading.effects['point/editAuth']
  ),
}))
@OAForm.create()
export default class extends PureComponent {
  handleSubmit = (params) => {
    const { dispatch, onError } = this.props;
    dispatch({
      type: params.id ? 'point/editAuth' : 'point/addAuth',
      payload: params,
      onError,
      onSuccess: () => this.props.handleVisible(false),
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      handleVisible,
      visible,
      department,
      initialValue,
      onCancel,
      validateFields,
    } = this.props;
    const info = { ...initialValue };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <OAModal
        title="权限分组表单"
        visible={visible}
        loading={this.props.loading}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
      >
        {info.id ? (getFieldDecorator('id', {
          initialValue: info.id,
        }))(
          <Input type="hidden" placeholder="请输入" />
        ) : null}
        <FormItem {...formItemLayout} label="分组名称" required>
          {
            getFieldDecorator('name', {
              initialValue: info.name || '',
            })(
              <Input placeholder="请输入" />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="部门">
          {
            getFieldDecorator('departments', {
              initialValue: info.departments || [],
            })(
              <TreeSelect
                multiple
                parentValue={0}
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
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="员工">
          {
            getFieldDecorator('staff', {
              initialValue: info.staff || [],
            })(
              <SearchTable.Staff
                multiple
                name={{
                  staff_sn: 'staff_sn',
                  staff_name: 'realname',
                }}
                showName="staff_name"
              />
            )
          }
        </FormItem>
      </OAModal>
    );
  }
}
