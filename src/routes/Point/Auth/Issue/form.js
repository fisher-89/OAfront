import React, { PureComponent } from 'react';
import { connect } from 'dva';
import OAForm, {
  OAModal,
  SearchTable,
} from '../../../../components/OAForm1';

const FormItem = OAForm.Item;

@OAForm.create()
@connect(({ point, department, loading }) => ({
  auth: point.auth,
  department: department.department,
  loading: (
    loading.effects['point/addTaskAuth'] ||
    loading.effects['point/editTaskAuth']
  ),
  departLoading: loading.department,
  authLoading: loading.effects['point/fetchAuth'],
}))
export default class extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'department/fetchDepartment', payload: {} });
  }

  fetchAuth = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/fetchAuth', payload: params });
  }

  handleError = (errors) => {
    const { onError, form: { setFields } } = this.props;
    onError(errors, (error, values) => {
      setFields({
        admin: {
          ...error.admin_name,
          value: values.admin,
        },
      });
    });
  }

  handleSubmit = (params) => {
    const { dispatch, initialValue, handleVisible } = this.props;
    const newParams = {
      ...params,
      ...params.admin,
    };
    delete newParams.admin;
    dispatch({
      type: initialValue.admin_sn ? 'point/editTaskAuth' : 'point/addTaskAuth',
      payload: newParams,
      onError: this.handleError,
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
      index: 'id',
      columns: this.makeColumns(),
      data: auth && auth.data,
      total: auth && auth.total,
      loading: authLoading || departLoading,
      fetchDataSource: this.fetchAuth,
    };
    return response;
  }

  render() {
    const {
      form: { getFieldDecorator },
      handleVisible,
      visible,
      initialValue,
      onCancel,
      validateFields,
    } = this.props;
    const info = { ...initialValue };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    return (
      <OAModal
        title="权限分组表单"
        visible={visible}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
      >
        <FormItem {...formItemLayout} label="员工" required>
          {
            getFieldDecorator('admin', {
              initialValue: info.admin_sn ? {
                admin_sn: info.admin_sn || '',
                admin_name: info.admin_name || '',
              } : {},
            })(
              <SearchTable.Staff
                name={{
                  admin_sn: 'staff_sn',
                  admin_name: 'realname',
                }}
                showName="admin_name"
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
              <SearchTable
                multiple
                title="权限分组"
                showName="name"
                name={{ id: 'id', name: 'name' }}
                tableProps={this.makeSearchAuthProps()}
              />
            )
          }
        </FormItem>
      </OAModal>
    );
  }
}
