import React, { PureComponent } from 'react';
import {
  Input,
} from 'antd';
import { connect } from 'dva';
import OAForm from '../../../../components/OAForm';

const {
  OAModal,
  TreeSelect,
  SearchTable,
} = OAForm;
const FormItem = OAForm.Item;

@connect(({ department, loading }) => ({
  department: department.department,
  addLoading: loading.effects['point/addAuth'],
  editLoading: loading.effects['point/editAuth'],
}))

@OAForm.create({
  onValuesChange(props, changeValues, allValues) {
    props.onChange(allValues);
    Object.keys(changeValues).forEach(key => props.handleFieldsError(key));
  },
})
export default class extends PureComponent {
  componentDidMount() {
    const { bindForm, form } = this.props;
    bindForm(form);
  }

  handleSubmit = (params, onError) => {
    const { dispatch } = this.props;
    dispatch({
      type: params.id ? 'point/editAuth' : 'point/addAuth',
      payload: params,
      onError,
      onSuccess: () => this.props.handleVisible(false),
    });
  }

  render() {
    const {
      form,
      form: { getFieldDecorator },
      autoSave,
      onError,
      handleVisible,
      visible,
      department,
      addLoading,
      editLoading,
      initialValue,
      onCancel,
    } = this.props;
    const info = { ...initialValue };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <OAModal
        title="权限分组表单"
        visible={visible}
        autoSave={autoSave}
        onSubmit={this.handleSubmit}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
        form={form}
        formProps={{
          loading: addLoading || editLoading,
          onError,
        }}
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
                allowClear
                showSearch
                name={{
                  department_id: 'id',
                  department_full_name: 'full_name',
                }}
                dataSource={{
                  data: department,
                  parentValue: 0,
                  fields: { value: 'id', parentId: 'parent_id', lable: 'full_name' },
                }}
                placeholder="请选择"
                dropdownMatchSelectWidth
                treeNodeFilterProp="title"
                dropdownStyle={{ height: '300px' }}
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
