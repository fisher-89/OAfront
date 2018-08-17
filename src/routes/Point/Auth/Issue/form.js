import React, { PureComponent } from 'react';
import { connect } from 'dva';
import OAForm from '../../../../components/OAForm';

const {
  OAModal,
  SearchTable,
} = OAForm;
const FormItem = OAForm.Item;

@connect(({ point, department, loading }) => ({
  auth: point.auth,
  department: department.department,
  departLoading: loading.department,
  authLoading: loading.effects['point/fetchAuth'],
  addLoading: loading.effects['point/addTaskAuth'],
  editLoading: loading.effects['point/editTaskAuth'],
}))
@OAForm.create({
  onValuesChange(props, changeValues, allValues) {
    props.onChange(allValues);
    Object.keys(changeValues).forEach(key => props.handleFieldsError(key));
  },
})
export default class extends PureComponent {
  componentDidMount() {
    const { bindForm, form, dispatch } = this.props;
    bindForm(form);
    dispatch({ type: 'department/fetchDepartment', payload: {} });
  }

  fetchAuth = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/fetchAuth', payload: params });
  }

  handleError = (errs) => {
    const { onError, form: { setFields } } = this.props;
    if (errs.admin_sn || errs.admin_name) {
      const errOBJ = new Error(
        (errs.admin_sn && errs.admin_sn[0]) || (errs.admin_name && errs.admin_name[0])
      );
      setFields({
        admin: {
          errors: [errOBJ],
        },
      });
    }
    onError(errs);
  }

  handleSubmit = (params, onError) => {
    const { dispatch, initialValue, handleVisible } = this.props;
    const newParams = {
      ...params,
      ...params.admin,
    };
    delete newParams.admin;

    dispatch({
      type: initialValue.admin_sn ? 'point/editTaskAuth' : 'point/addTaskAuth',
      payload: newParams,
      onError,
      onSuccess: () => handleVisible(false),
    });
  }

  makeColumns = () => {
    const { department } = this.props;
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        searcher: true,
      },
      {
        title: '分组名称',
        dataIndex: 'name',
        searcher: true,
      },
      {
        title: '组部门',
        dataIndex: 'departments.department_id',
        treeFilters: {
          title: 'full_name',
          value: 'id',
          parentId: 'parent_id',
          data: department.map(item => item),
        },
        render: (_, recode) => {
          const name = recode.departments.map(item => item.department_full_name);
          return name.join(',');
        },
      },
      {
        title: '组成员',
        dataIndex: 'staff.staff_name',
        searcher: true,
        render: (_, recode) => {
          const name = recode.staff.map(item => item.staff_name);
          return name.join(',');
        },
      },
    ];
    return columns;
  }


  makeSearchAuthProps = () => {
    const { auth, authLoading, departLoading } = this.props;
    const response = {
      name: {
        id: 'id',
        name: 'name',
      },
      title: '权限分组',
      showName: 'name',
      placeholder: '请选择',
      tableProps: {
        index: 'id',
        columns: this.makeColumns(),
        data: auth && auth.data,
        total: auth && auth.total,
        loading: authLoading || departLoading,
        fetchDataSource: this.fetchAuth,
      },
    };
    return response;
  }

  render() {
    const {
      form,
      form: { getFieldDecorator },
      handleVisible,
      visible,
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
        onError={this.handleError}
        onSubmit={this.handleSubmit}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
        form={form}
        formProps={{
          loading: addLoading || editLoading,
        }}
      >
        <FormItem {...formItemLayout} label="员工" required>
          {
            getFieldDecorator('admin', {
              initialValue: {
                admin_sn: info.admin_sn || '',
                admin_name: info.admin_name || '',
              },
            })(
              <SearchTable.Staff
                name={{
                  admin_sn: 'staff_sn',
                  admin_name: 'realname',
                }}
                showName="realname"
                placeholder="请选择员工"
              />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="分组" required>
          {
            getFieldDecorator('groups', {
              initialValue: info.groups || [],
            })(
              <SearchTable {...this.makeSearchAuthProps()} multiple />
            )
          }
        </FormItem>
      </OAModal>
    );
  }
}
