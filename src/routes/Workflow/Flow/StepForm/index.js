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
import { filter, forEach, isArray } from 'lodash';
import OAForm, { InputTags, SearchTable } from '../../../../components/OAForm';

const FormItem = OAForm.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Option } = Select;
const { Step } = Steps;

const stepDefaultValue = {
  name: '',
  is_cc: '0',
  merge_type: 0,
  cc_person: [],
  send_todo: '1',
  reject_type: 0,
  send_start: '0',
  description: '',
  approver_type: 0,
  hidden_fields: [],
  next_step_key: [],
  prev_step_key: [],
  skip_condition: '',
  concurrent_type: 0,
  editable_fields: [],
  required_fields: [],
  allow_condition: '',
  end_callback_uri: '',
  available_fields: [],
  start_callback_uri: '',
  check_callback_uri: '',
  rejec_callback_uri: '',
  step_approver_id: null,
  approve_callback_uri: '',
  transfer_callback_uri: '',
  withdraw_callback_uri: '',
  accept_end_callback: '0',
  accept_start_callback: '0',
  accept_check_callback: '0',
  accept_approve_callback: '0',
  accept_reject_callback: '0',
  accept_transfer_callback: '0',
  accept_withdraw_callback: '0',
  approvers: { staff: [], roles: [], departments: [], manager: '' },
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

    const defaultValue = { ...stepDefaultValue, ...data };
    defaultValue.available_fields = isArray(defaultValue.available_fields) ?
      defaultValue.available_fields : [];
    defaultValue.editable_fields = isArray(defaultValue.editable_fields) ?
      defaultValue.editable_fields : [];

    const hiddenFieldsData = filter(hiddenData, obj =>
      defaultValue.available_fields.indexOf(obj.key) !== -1);

    const editFieldsData = filter(hiddenFieldsData, obj =>
      defaultValue.editable_fields.indexOf(obj.key) !== -1);

    const requireData = filter(editFieldsData, obj =>
      defaultValue.editable_fields.indexOf(obj.key) !== -1);

    this.state = {
      current: 0,
      availableFields: {
        selectedKeys: [],
        targetKeys: defaultValue.available_fields || [],
        data: hiddenFieldsData || [],
      },
      hiddenFields: {
        selectedKeys: [],
        targetKeys: defaultValue.hidden_fields || [],
        data: hiddenFieldsData || [],
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

  handleCommChange = (key, fields = []) => {
    return (nextTargetKeys) => {
      const { hiddenData } = this.props;
      const dataSouce = { ...this.state[key] };
      if (key === 'hiddenFields') {
        dataSouce.data = filter(hiddenData, obj => (nextTargetKeys.indexOf(obj.key) === -1));
      } else {
        dataSouce.data = filter(hiddenData, obj => (nextTargetKeys.indexOf(obj.key) !== -1));
      }
      const stateFields = { [key]: dataSouce };
      if (fields.length) {
        forEach(fields, (item) => {
          stateFields[item] = {
            selectedKeys: [],
            targetKeys: [],
            data: [],
          };
        });
      }
      dataSouce.targetKeys = nextTargetKeys;
      this.setState({ ...stateFields });
    };
  };

  handleCommSelectChange = (key) => {
    return (sourceSelectedKeys, targetSelectedKeys) => {
      const selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];
      const newObj = { ...this.state[key] };
      newObj.selectedKeys = selectedKeys;
      this.setState({ [key]: newObj });
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { availableFields, hiddenFields, editFields, requireFields, dataCommit } = this.state;
        const { handleSteps, callbackRemoveTabs, onlyKey } = this.props;
        const commitSource = {
          ...dataCommit,
          ...values,
          step_key: onlyKey,
          hidden_fields: hiddenFields.targetKeys,
          editable_fields: editFields.targetKeys,
          required_fields: requireFields.targetKeys,
          available_fields: availableFields.targetKeys,
        };
        const isEdit = typeof this.props.data === 'object';
        const result = handleSteps(commitSource, isEdit);
        if (result) {
          callbackRemoveTabs(`newTabs${onlyKey}`);
          message.info('生成步骤成功！');
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
      roles,
      fields,
      submitting,
      hiddenData,
      department,
    } = this.props;
    const {
      current,
      dataCommit,
      editFields,
      hiddenFields,
      requireFields,
      availableFields,
    } = this.state;
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
            label="通知"
          >
            {getFieldDecorator('send_todo', {
              rules: [{
                required: true, message: '必选选项',
              }],
              initialValue: dataCommit.send_todo,
            })(
              <RadioGroup>
                <RadioButton value="1">启用</RadioButton>
                <RadioButton value="0">停用</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="通知发起人"
          >
            {getFieldDecorator('send_start', {
              rules: [{
                required: true, message: '必选选项',
              }],
              initialValue: dataCommit.send_start,
            })(
              <RadioGroup>
                <RadioButton value="1">启用</RadioButton>
                <RadioButton value="0">停用</RadioButton>
              </RadioGroup>
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
            wrappercol={{ span: 15 }}
            label="是否抄送"
          >
            {getFieldDecorator('is_cc', {
              initialValue: dataCommit.is_cc,
            })(
              <RadioGroup>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="抄送人"
          >
            {getFieldDecorator('cc_person', {
              initialValue: dataCommit.cc_person,
            })(
              <SearchTable.Staff
                multiple
                disabled={getFieldValue('is_cc') === '0'}
                filters={{ content: 'status_id>=0;', status: [1, 2, 3] }}
              />
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
            label="可用字段"
          >
            <Transfer
              lazy={false}
              dataSource={hiddenData}
              titles={['待选', '选中列表']}
              targetKeys={availableFields.targetKeys}
              selectedKeys={availableFields.selectedKeys}
              onSelectChange={this.handleCommSelectChange('availableFields')}
              onChange={this.handleCommChange('availableFields', ['hiddenFields', 'editFields', 'requireFields'])}
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
            labelCol={{ span: 5 }}
            wrappercol={{ span: 15 }}
            label="隐藏字段"
          >
            <Transfer
              lazy={false}
              titles={['待选', '选中列表']}
              dataSource={availableFields.data}
              targetKeys={hiddenFields.targetKeys}
              selectedKeys={hiddenFields.selectedKeys}
              onChange={this.handleCommChange('hiddenFields')}
              onSelectChange={this.handleCommSelectChange('hiddenFields')}
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
            labelCol={{ span: 5 }}
            wrappercol={{ span: 15 }}
            label="可编辑字段"
          >
            <Transfer
              lazy={false}
              titles={['待选', '选中列表']}
              dataSource={availableFields.data}
              targetKeys={editFields.targetKeys}
              selectedKeys={editFields.selectedKeys}
              onSelectChange={this.handleCommSelectChange('editFields')}
              onChange={this.handleCommChange('editFields', ['requireFields'])}
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
              onChange={this.handleCommChange('requireFields')}
              onSelectChange={this.handleCommSelectChange('requireFields')}
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
            label="接收开始回调值"
          >
            {getFieldDecorator('accept_start_callback', {
              initialValue: dataCommit.accept_start_callback,
            })(
              <RadioGroup name="radiogroup3" >
                <RadioButton value="0">停用</RadioButton>
                <RadioButton value="1">启用</RadioButton>
              </RadioGroup>
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
            label="接收查看回调值"
          >
            {getFieldDecorator('accept_check_callback', {
              initialValue: dataCommit.accept_check_callback,
            })(
              <RadioGroup name="radiogroup3" >
                <RadioButton value="0">停用</RadioButton>
                <RadioButton value="1">启用</RadioButton>
              </RadioGroup>
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
            label="接收通过回调值"
          >
            {getFieldDecorator('accept_approve_callback', {
              initialValue: dataCommit.accept_approve_callback,
            })(
              <RadioGroup name="radiogroup3" >
                <RadioButton value="0">停用</RadioButton>
                <RadioButton value="1">启用</RadioButton>
              </RadioGroup>
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
            label="接收驳回回调值"
          >
            {getFieldDecorator('accept_reject_callback', {
              initialValue: dataCommit.accept_reject_callback,
            })(
              <RadioGroup name="radiogroup3" >
                <RadioButton value="0">停用</RadioButton>
                <RadioButton value="1">启用</RadioButton>
              </RadioGroup>
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
            label="接收转交回调值"
          >
            {getFieldDecorator('accept_transfer_callback', {
              initialValue: dataCommit.accept_transfer_callback,
            })(
              <RadioGroup name="radiogroup3" >
                <RadioButton value="0">停用</RadioButton>
                <RadioButton value="1">启用</RadioButton>
              </RadioGroup>
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
            label="接收结束回调值"
          >
            {getFieldDecorator('accept_end_callback', {
              initialValue: dataCommit.accept_end_callback,
            })(
              <RadioGroup name="radiogroup3" >
                <RadioButton value="0">停用</RadioButton>
                <RadioButton value="1">启用</RadioButton>
              </RadioGroup>
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

          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="接收撤回回调值"
          >
            {getFieldDecorator('accept_withdraw_callback', {
              initialValue: dataCommit.accept_withdraw_callback,
            })(
              <RadioGroup name="radiogroup3" >
                <RadioButton value="0">停用</RadioButton>
                <RadioButton value="1">启用</RadioButton>
              </RadioGroup>
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
          <Button type="primary" htmlType="submit" loading={submitting}>生成步骤</Button>
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
