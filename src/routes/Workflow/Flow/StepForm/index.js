import React from 'react';
import {
  Input,
  Button,
  Transfer,
  Form,
  Radio,
  message,
  TreeSelect,
  Select,
} from 'antd';
import { connect } from 'dva';
import OAForm, { InputTags, SearchTable } from '../../../../components/OAForm1';

const FormItem = OAForm.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Option } = Select;

const stepDefaultValue = {
  name: '',
  description: '',
  allow_condition: '',
  skip_condition: '',
  hidden_fields: [],
  editable_fields: [],
  required_fields: [],
  approvers: { staff: [], roles: [], departments: [] },
  reject_type: 0,
  concurrent_type: 0,
  merge_type: 0,
  start_callback_uri: '',
  check_callback_uri: '',
  approve_callback_uri: '',
  rejec_callback_uri: '',
  transfer_callback_uri: '',
  end_callback_uri: '',
  withdraw_callback_uri: '',
  next_step_key: [],
  prev_step_key: [],
};

@connect(({ staffs, department, roles, loading }) => ({
  staffInfo: staffs.staffDetails,
  staffSearcherResult: staffs.tableResult,
  staffSearcherTotal: staffs.total,
  staffsLoading: loading.effects['staffs/fetchStaff'],
  department: department.department,
  departmentLoading: loading.effects['department/fetchDepartment'],
  roles: roles.roles,
  rolesLoading: loading.effects['roles/fetchRoles'],
}))
@Form.create()
export default class StepForm extends React.PureComponent {
  constructor(props) {
    super(props);
    const { data, hiddenData } = this.props;
    const editData = hiddenData;
    const requireData = [];
    if (data) {
      if (data.editable_fields) {
        editData.forEach((item) => {
          if (data.editable_fields.indexOf(item.key) !== -1) {
            requireData.push(item);
          }
        });
      }
    }
    const defaultValue = data || stepDefaultValue;
    this.state = {
      hiddenFields: {
        selectedKeys: [],
        targetKeys: defaultValue.hidden_fields || [],
        data: [],
      },
      editFields: {
        selectedKeys: [],
        targetKeys: defaultValue.editable_fields || [],
        data: requireData || [],
      },
      requireFields: {
        selectedKeys: [],
        targetKeys: defaultValue.required_fields || [],
        data: [],
      },
      editData: editData || [],
      dataCommit: data || { ...stepDefaultValue },
      staff: [],
    };
  }

  componentDidMount() {
    const { dataCommit } = this.state;
    this.fetchDepartment({});
    this.fetchRoles({});
    if (dataCommit.approvers.staff.length > 0) {
      this.fetchUser(dataCommit.approvers.staff);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { staffInfo } = nextProps;
    if (staffInfo !== this.props.staffInfo) {
      const key = this.state.dataCommit.approvers.staff;
      const staff = [];
      nextProps.staffInfo[`${key}`].forEach((item) => {
        staff.push({ realname: item.realname, staff_sn: item.staff_sn });
      });
      this.setState({ staff });
    }
  }

  fetchUser = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'staffs/fetchStaff',
      payload: { staff_sn: data, filters: `staff_sn=[${data}];status_id>0` },
    });
  };

  fetchDepartment = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'department/fetchDepartment',
      payload: params,
    });
  };

  fetchRoles = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roles/fetchRoles',
      payload: params,
    });
  };


  handleHiddenChange = (nextTargetKeys) => {
    const { hiddenFields } = this.state;
    const { hiddenData } = this.props;

    const data = hiddenData.forEach((item) => {
      if (nextTargetKeys.indexOf(item.key) !== -1) {
        return item;
      }
    });

    this.setState({ hiddenFields: { ...hiddenFields, targetKeys: nextTargetKeys, data } });
  };

  handleHiddenSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    const data = [...sourceSelectedKeys, ...targetSelectedKeys];
    const { hiddenFields } = this.state;
    this.setState({
      hiddenFields: {
        ...hiddenFields,
        selectedKeys: data,
      },
    });
  };

  // editDataList = (d) => {
  //   this.setState({
  //     editFields: {
  //       targetKeys: [],
  //       selectedKeys: [],
  //       data: [],
  //     },
  //     requireFields: {
  //       selectedKeys: [],
  //       targetKeys: [],
  //       data: [],
  //     },
  //   });
  //   if (!d) return;
  //   const { hiddenData } = this.props;
  //   const editData = [];
  //   if (hiddenData.length > 0) {
  //     hiddenData.forEach((item) => {
  //       if (d.indexOf(item.key) === -1) {
  //         editData.push(item);
  //       }
  //     });
  //   }
  //   this.setState({ editData });
  // };

  handleEditChange = (nextTargetKeys) => {
    const { editFields, editData } = this.state;
    const data = [];
    editData.forEach((item) => {
      if (nextTargetKeys.indexOf(item.key) !== -1) {
        data.push(item);
      }
    });
    this.setState({
      editFields: { ...editFields, targetKeys: nextTargetKeys, data },
      requireFields: {
        selectedKeys: [],
        targetKeys: [],
        data: [],
      },
    });
  };

  handleEditSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    const data = [...sourceSelectedKeys, ...targetSelectedKeys];
    const { editFields } = this.state;
    this.setState({ editFields: { ...editFields, selectedKeys: data } });
  };

  handleRequireChange = (nextTargetKeys) => {
    const { requireFields, editFields } = this.state;
    const data = [];
    editFields.data.forEach((item) => {
      if (nextTargetKeys.indexOf(item.key) === 0) {
        data.push(item);
      }
    });
    this.setState({ requireFields: { ...requireFields, targetKeys: nextTargetKeys, data } });
  };

  handleRequireSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    const data = [...sourceSelectedKeys, ...targetSelectedKeys];
    const { requireFields } = this.state;
    this.setState({ requireFields: { ...requireFields, selectedKeys: data } });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { hiddenFields, editFields, requireFields, dataCommit } = this.state;
        const { handleSteps, callbackRemoveTabs, onlyKey } = this.props;
        const commitSource = {
          ...dataCommit,
          ...values,
          step_key: onlyKey,
          hidden_fields: hiddenFields.targetKeys,
          editable_fields: editFields.targetKeys,
          required_fields: requireFields.targetKeys,
        };
        const isEdit = typeof this.props.data === 'object';
        const result = handleSteps(commitSource, isEdit);
        if (result) {
          callbackRemoveTabs(`newTabs${onlyKey}`);
          message.info('生成流程成功！');
        } else {
          message.error('存在相同步骤名，请重新输入步骤！');
        }
      }
    });
  };

  handleReset = () => {
    this.setState({
      hiddenFields: {
        selectedKeys: [],
        targetKeys: [],
        data: [],
      },
      editFields: {
        selectedKeys: [],
        targetKeys: [],
        data: [],
      },
      requireFields: {
        selectedKeys: [],
        targetKeys: [],
        data: [],
      },
      staff: [],
      editData: this.props.hiddenData,
      dataCommit: stepDefaultValue,
    });
    scrollTo(0, 0);
  };

  searchStaff = () => {
    const { staff, dataCommit } = this.state;

    return (
      <SearchTable.Staff
        multiple
        value={staff}
        name={{
          staff_sn: 'staff_sn',
          realname: 'realname',
        }}
        showName="realname"
        filters={{ content: 'status_id>=0;', status: [1, 2, 3] }}
        disabled={this.state.formAble}
        onChange={(value) => {
          this.setState({
            staff: value,
            dataCommit: {
              ...dataCommit,
              approvers: { ...dataCommit.approvers, staff: value.map(item => item.staff_sn) },
            },
          });
        }}
      />
    );
  };

  markDepartmentTree = (data, tree, pid = 0, key = 0) => {
    data.forEach((item) => {
      if (item.parent_id === pid) {
        const temp = {
          label: item.full_name,
          value: item.id.toString(),
          key: `${key}-${item.id}`,
          children: [],
        };
        this.markDepartmentTree(data, temp.children, item.id, temp.key);
        tree.push(temp);
      }
    });
  };

  render() {
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const {
      submitting,
      hiddenData,
      roles,
      fields,
      department,
    } = this.props;
    const {
      hiddenFields,
      editFields,
      editData,
      requireFields,
      dataCommit,
    } = this.state;
    const disVisible = editFields.data.length === 0 ? 'none' : 'block';
    const editVisible = editData.length === 0 ? 'none' : 'block';
    const { getFieldDecorator } = this.props.form;
    const departmentTree = [];
    this.markDepartmentTree(department, departmentTree);
    return (
      <Form
        id="addTypeForm"
        onSubmit={this.handleSubmit}
      >
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="名称"
          name="name"
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              message: '请输入名称',
            }, {
              max: 20,
              message: '最大字符不能超过20',
            }],
            initialValue: dataCommit.name,
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="描述"
          name="description"
        >
          {getFieldDecorator('description', {
            initialValue: dataCommit.description,
          })(
            <Input placeholder="请输入" />
          )}

        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="审批人"
        >
          {getFieldDecorator('approvers[staff]', {
            initialValue: dataCommit.approvers.staff,
          })(
            <Input hidden placeholder="请输入" />
          )}
          {this.searchStaff()}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="部门"
        >
          {getFieldDecorator('approvers[departments]', {
            initialValue: dataCommit.approvers.departments,
          })(
            <Input hidden placeholder="请输入" />
          )}
          <TreeSelect
            multiple
            allowClear
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择部门!"
            treeData={departmentTree}
            value={dataCommit.approvers.departments.map(item => item.toString())}
            filterTreeNode={(inputValue, treeNode) => {
              if (treeNode.props.title.indexOf(inputValue) !== -1) {
                return true;
              }
            }}
            onChange={(value) => {
              const departments = value.map(item => parseInt(item, 10));
              this.setState({
                dataCommit: {
                  ...dataCommit,
                  approvers: { ...dataCommit.approvers, departments },
                },
              });
            }}
          />
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="角色"
        >
          {getFieldDecorator('approvers[roles]', {
            initialValue: dataCommit.approvers.roles,
          })(
            <Input hidden placeholder="请输入" />
          )}
          <Select
            mode="multiple"
            placeholder="请选择角色!"
            tokenSeparators={[',']}
            value={dataCommit.approvers.roles}
            filterOption={(inputValue, option) => {
              if (option.props.title.indexOf(inputValue) !== -1) {
                return true;
              }
            }}
            onChange={(value) => {
              this.setState({
                dataCommit: {
                  ...dataCommit,
                  approvers: { ...dataCommit.approvers, roles: [...value] },
                },
              });
            }}
          >
            {roles ? roles.map((item, i) => {
              return (
                <Option
                  key={`${i.toString()}-g`}
                  value={item.id}
                  title={item.role_name}
                >
                  {item.role_name}
                </Option>
              );
            }) : null}
          </Select>
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="访问条件"
          name="allow_condition"
        >
          {getFieldDecorator('allow_condition', {
            initialValue: dataCommit.allow_condition,
          })(
            <InputTags placeholder="请输入" fields={fields} />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="略过条件"
          name="skip_condition"
        >
          {getFieldDecorator('skip_condition', {
            initialValue: dataCommit.skip_condition,
          })(
            <InputTags placeholder="请输入" fields={fields} />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrappercol={{ span: 15 }}
          label="隐藏字段"
          name="hidden_fields"
        >
          <Transfer
            dataSource={hiddenData}
            titles={['待选', '选中列表']}
            targetKeys={hiddenFields.targetKeys}
            selectedKeys={hiddenFields.selectedKeys}
            onChange={this.handleHiddenChange}
            onSelectChange={this.handleHiddenSelectChange}
            render={item => item.title}
          />
        </FormItem>

        <FormItem
          style={{ display: editVisible }}
          labelCol={{ span: 5 }}
          wrappercol={{ span: 15 }}
          label="可编辑字段"
          name="editable_fields"
        >
          <Transfer
            dataSource={editData}
            titles={['待选', '选中列表']}
            targetKeys={editFields.targetKeys}
            selectedKeys={editFields.selectedKeys}
            onChange={this.handleEditChange}
            onSelectChange={this.handleEditSelectChange}
            render={item => item.title}
          />
        </FormItem>
        <FormItem
          style={{ display: disVisible }}
          labelCol={{ span: 5 }}
          wrappercol={{ span: 15 }}
          label="必填字段"
          name="required_fields"
        >
          <Transfer
            dataSource={editFields.data}
            titles={['待选', '选中列表']}
            targetKeys={requireFields.targetKeys}
            selectedKeys={requireFields.selectedKeys}
            onChange={this.handleRequireChange}
            onSelectChange={this.handleRequireSelectChange}
            render={item => item.title}
          />
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrappercol={{ span: 15 }}
          label="退回类型"
          name="reject_type"
        >
          {getFieldDecorator('reject_type', {
            rules: [{
              required: true, message: '请选择退回类型',
            }],
            initialValue: dataCommit.reject_type,
          })(
            <RadioGroup name="radiogroup1">
              <RadioButton value={0}>禁止</RadioButton>
              <RadioButton value={1}>到上一步</RadioButton>
              <RadioButton value={2}>到之前任意步骤</RadioButton>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrappercol={{ span: 15 }}
          label="并发类型"
          name="concurrent_type"
        >
          {getFieldDecorator('concurrent_type', {
            rules: [{
              required: true, message: '请选择并发类型',
            }],
            initialValue: dataCommit.concurrent_type,
          })(
            <RadioGroup name="radiogroup2">
              <RadioButton value={0}>禁止</RadioButton>
              <RadioButton value={1}>允许</RadioButton>
              <RadioButton value={2}>强制</RadioButton>
            </RadioGroup>
          )}

        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrappercol={{ span: 15 }}
          label="合并类型"
          name="merge_type"
        >
          {getFieldDecorator('merge_type', {
            rules: [{
              required: true, message: '请选择合并类型',
            }],
            initialValue: dataCommit.merge_type,
          })(
            <RadioGroup name="radiogroup3">
              <RadioButton value={0}>非必须</RadioButton>
              <RadioButton value={1}>必须</RadioButton>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="开始回调地址"
          name="start_callback_uri"
        >
          {getFieldDecorator('start_callback_uri', {
            rules: [{
              type: 'url', message: '请输入正确的开始回调地址！',
            }],
            initialValue: dataCommit.start_callback_uri,
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="查看回调地址"
          name="check_callback_uri"
        >
          {getFieldDecorator('check_callback_uri', {
            rules: [{
              type: 'url', message: '请输入正确的查看回调地址！',
            }],
            initialValue: dataCommit.check_callback_uri,
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="通过回调地址"
          name="approve_callback_uri"
        >
          {getFieldDecorator('approve_callback_uri', {
            rules: [{
              type: 'url', message: '请输入正确的通过回调地址！',
            }],
            initialValue: dataCommit.approve_callback_uri,
          })(
            <Input placeholder="请输入" />
          )}

        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="驳回回调地址"
          name="rejec_callback_uri"
        >
          {getFieldDecorator('rejec_callback_uri', {
            rules: [{
              type: 'url', message: '请输入正确的驳回回调地址！',
            }],
            initialValue: dataCommit.rejec_callback_uri,
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="转交回调地址"
          name="transfer_callback_uri"
        >
          {getFieldDecorator('transfer_callback_uri', {
            rules: [{
              type: 'url', message: '请输入正确的转交回调地址！',
            }],
            initialValue: dataCommit.transfer_callback_uri,
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="结束回调地址"
          name="end_callback_uri"
        >
          {getFieldDecorator('end_callback_uri', {
            rules: [{
              type: 'url', message: '请输入正确的结束回调地址！',
            }],
            initialValue: dataCommit.end_callback_uri,
          })(
            <Input placeholder="请输入" />
          )}

        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="撤回回调地址"
          name="withdraw_callback_uri"
        >
          {getFieldDecorator('withdraw_callback_uri', {
            rules: [{
              type: 'url', message: '请输入正确的撤回回调地址！',
            }],
            initialValue: dataCommit.withdraw_callback_uri,
          })(
            <Input placeholder="请输入" />
          )}

        </FormItem>

        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>生成流程</Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={this.handleReset}
          >
            重置流程
          </Button>
        </FormItem>
      </Form>
    );
  }
}
