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
  Icon,
  Steps,
} from 'antd';
import { connect } from 'dva';
import OAForm, { InputTags, SearchTable } from '../../../../components/OAForm';

const FormItem = OAForm.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Option } = Select;
const { Step } = Steps;

const stepDefaultValue = {
  name: '',
  description: '',
  allow_condition: '',
  skip_condition: '',
  hidden_fields: [],
  editable_fields: [],
  required_fields: [],
  approver_type: 0,
  step_approver_id: null,
  approvers: { staff: [], roles: [], departments: [], manager: '' },
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

const stepsTitle = ['基础信息', '步骤条件', '表单字段', '操作类型', '回调地址'];
@connect(({ staffs, workflow, department, roles, loading }) => ({
  staffInfo: staffs.staffDetails,
  staffSearcherResult: staffs.tableResult,
  staffSearcherTotal: staffs.total,
  approver: workflow.approver,
  staffsLoading: loading.effects['staffs/fetchStaffForSearchTable'],
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
      current: 0,
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
    };
  }

  componentDidMount() {
    this.fetchDepartment({});
    this.fetchRoles({});
    this.fetchMode();
  }

  fetchDepartment = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'department/fetchDepartment',
      payload: params,
    });
  };

  fetchMode = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'workflow/fetchApprover' });
  }

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
      } else {
        this.setState({ current: 0 });
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
      current: 0,
      editData: this.props.hiddenData,
      dataCommit: stepDefaultValue,
    });
    scrollTo(0, 0);
  };

  markDepartmentTree = (data, tree, pid = 0, key = 0) => {
    data.forEach((item) => {
      if (item.parent_id === pid) {
        const temp = {
          title: item.full_name,
          value: item.id.toString(),
          key: `${key}-${item.id}`,
          children: [],
        };
        this.markDepartmentTree(data, temp.children, item.id, temp.key);
        tree.push(temp);
      }
    });
  };

  clickStepTitle = (current) => {
    return () => {
      this.setState({ current });
    };
  }

  render() {
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 5 },
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
      current,
    } = this.state;
    const disVisible = editFields.data.length === 0 ? 'none' : 'block';
    const editVisible = editData.length === 0 ? 'none' : 'block';
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const departmentTree = [];
    this.markDepartmentTree(department, departmentTree);
    const approverType = getFieldValue('approver_type') === undefined ? dataCommit.approver_type : getFieldValue('approver_type');
    return (
      <Form
        id="addTypeForm"
        onSubmit={this.handleSubmit}
      >
        <Steps current={current} size="small" style={{ padding: '40px 100px' }}>
          {stepsTitle.map((item, index) => (
            <Step
              key={item}
              title={
                <a
                  onClick={this.clickStepTitle(index)}
                  style={{ color: current === index ? '#1890ff' : '#ccc' }}
                >
                  {item}
                </a>
              }
            />
          ))}
        </Steps>
        <div style={{ display: current === 0 ? 'block' : 'none' }}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="名称"
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
            label="审批类型"
          >
            {getFieldDecorator('approver_type', {
              initialValue: dataCommit.approver_type,
            })(
              <Select
                placeholder="请选择"
                onChange={() => {
                  this.props.form.setFieldsValue({
                    'approvers.roles': [],
                    'approvers.staff': [],
                    'approvers.manager': '',
                    'approvers.departments': [],
                    step_approver_id: null,
                  });
                }}
              >
                <Option value={0}>全部</Option>
                <Option value={1}>审批</Option>
                <Option value={2}>审批模板</Option>
                <Option value={3}>当前管理员</Option>
              </Select>
            )}
          </FormItem>
          <div style={{ display: approverType === 2 ? 'block' : 'none' }}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="审批类型"
            >
              {getFieldDecorator('step_approver_id', {
                initialValue: dataCommit.step_approver_id ? `${dataCommit.step_approver_id}` : null,
              })(
                <Select placeholder="请选择">
                  {this.props.approver.map(item =>
                    (<Option key={item.id}>{item.name}</Option>))}
                </Select>
              )}
            </FormItem>
          </div>
          <div style={{ display: approverType === 3 ? 'block' : 'none' }}>
            <FormItem
              labelCol={{ span: 5 }}
              wrappercol={{ span: 15 }}
              label="管理者"
            >
              {getFieldDecorator('approvers.manager', {
                initialValue: dataCommit.approvers.manager,
              })(
                <RadioGroup>
                  <Radio value="shop_manager">当前店长</Radio>
                  <Radio value="department_manager">当前部门</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </div>
          <div style={{ display: approverType === 1 ? 'block' : 'none' }}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="审批人"
            >
              {getFieldDecorator('approvers.staff', {
                initialValue: dataCommit.approvers.staff,
              })(
                <SearchTable.Staff
                  multiple
                  showName="text"
                  name={{
                    value: 'staff_sn',
                    text: 'realname',
                  }}
                  disabled={this.state.formAble}
                  filters={{ content: 'status_id>=0;', status: [1, 2, 3] }}
                />
              )}
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="审批部门"
            >
              {getFieldDecorator('approvers.departments', {
                initialValue: dataCommit.approvers.departments,
              })(
                <TreeSelect
                  multiple
                  allowClear
                  placeholder="请选择部门!"
                  treeData={departmentTree}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                />
              )}
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="审批角色"
            >
              {getFieldDecorator('approvers.roles', {
                initialValue: dataCommit.approvers.roles,
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择角色!"
                >
                  {roles.map((item) => {
                    return (
                      <Option key={item.id}>{item.role_name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </div>
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

        </div>
        <div style={{ display: current === 1 ? 'block' : 'none' }}>
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
        </div>
        <div style={{ display: current === 2 ? 'block' : 'none' }}>
          <FormItem
            labelCol={{ span: 5 }}
            wrappercol={{ span: 15 }}
            label="隐藏字段"
          >
            <Transfer
              lazy={false}
              dataSource={hiddenData}
              titles={['待选', '选中列表']}
              targetKeys={hiddenFields.targetKeys}
              selectedKeys={hiddenFields.selectedKeys}
              onChange={this.handleHiddenChange}
              onSelectChange={this.handleHiddenSelectChange}
              render={(item) => {
                return item.grids ? (
                  <React.Fragment>
                    {item.title} <Icon type="profile" theme="outlined" />
                  </React.Fragment>
                ) : item.title;
              }}
            />
          </FormItem>

          <FormItem
            style={{ display: editVisible }}
            labelCol={{ span: 5 }}
            wrappercol={{ span: 15 }}
            label="可编辑字段"
          >
            <Transfer
              lazy={false}
              dataSource={editData}
              titles={['待选', '选中列表']}
              targetKeys={editFields.targetKeys}
              selectedKeys={editFields.selectedKeys}
              onChange={this.handleEditChange}
              onSelectChange={this.handleEditSelectChange}
              render={(item) => {
                return item.grids ? (
                  <React.Fragment>
                    {item.title} <Icon type="profile" />
                  </React.Fragment>
                ) : item.title;
              }}
            />
          </FormItem>
          <FormItem
            style={{ display: disVisible }}
            labelCol={{ span: 5 }}
            wrappercol={{ span: 15 }}
            label="必填字段"
          >
            <Transfer
              lazy={false}
              dataSource={editFields.data}
              titles={['待选', '选中列表']}
              targetKeys={requireFields.targetKeys}
              selectedKeys={requireFields.selectedKeys}
              onChange={this.handleRequireChange}
              onSelectChange={this.handleRequireSelectChange}
              render={(item) => {
                return item.grids ? (
                  <React.Fragment>
                    {item.title} <Icon type="profile" theme="outlined" />
                  </React.Fragment>
                ) : item.title;
              }}
            />
          </FormItem>
        </div>
        <div style={{ display: current === 3 ? 'block' : 'none' }}>
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
        </div>

        <div style={{ display: current === 4 ? 'block' : 'none' }}>
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
        </div>

        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          {current !== 0 && (
            <Button
              style={{ marginRight: 8 }}
              onClick={() => {
                this.setState({ current: current - 1 });
              }}
            >上一步
            </Button>
          )}
          {current !== 4 && (
            <Button
              style={{ marginRight: 8 }}
              onClick={() => {
                this.setState({ current: current + 1 });
              }}
            >下一步
            </Button>
          )}
          <Button type="primary" htmlType="submit" loading={submitting}>生成流程</Button>
          <Button
            type="danger"
            ghost
            style={{ marginLeft: 8 }}
            onClick={this.handleReset}
          >
            重置
          </Button>
        </FormItem>

      </Form>
    );
  }
}
