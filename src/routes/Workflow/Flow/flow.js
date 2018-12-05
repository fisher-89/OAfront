import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { find, filter } from 'lodash';
import {
  Button,
  Tabs,
  Card,
  Icon,
  Input,
  InputNumber,
  Form,
  Select,
  Modal,
  TreeSelect,
  notification,
} from 'antd';
import FlowChart from '../../../components/FlowChart';
import Switch from '../../../components/CustomSwitch';
import SearchTable from '../../../components/OAForm/SearchTable';
import UploadCropper from '../../../components/UploadCropper';
import { markTreeData } from '../../../utils/utils';
import StepForm from './StepForm';

const { TabPane } = Tabs;

const FormItem = Form.Item;
const { Option } = Select;


@connect(({ workflow, staffs, department, roles, loading }) => ({
  flowType: workflow.flowType,
  formsList: workflow.form,
  formsDetail: workflow.formDetails,
  flow: workflow.flowDetails,
  loading: loading.models.workflow,
  staffInfo: staffs.staffDetails,
  staffsLoading: loading.effects['staffs/fetchStaffForSearchTable'],
  department: department.department,
  departmentLoading: loading.effects['department/fetchDepartment'],
  roles: roles.roles,
  rolesLoading: loading.effects['roles/fetchRoles'],
}))
@Form.create()
export default class Flow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    const panes = [
      {
        title: '流程信息',
        content: '',
        key: '0',
        closable: false,
      }, {
        title: '步骤设计',
        content: '',
        key: '1',
        closable: false,
      },
    ];
    const formData = {
      name: '',
      description: '',
      flow_type_id: null,
      form_id: null,
      is_active: '1',
      start_callback_uri: '',
      end_callback_uri: '',
      flows_has_staff: [],
      flows_has_roles: [],
      flows_has_departments: [],
      steps: [],
      send_message: '1',
      is_client: '1',
      accept_end_callback: '0',
      accept_start_callback: '0',
    };
    const flowId = props.match.params.id ? parseInt(props.match.params.id, 10) : null;
    const isEdit = flowId !== null;
    const activeKey = isEdit ? panes[1].key : panes[0].key;
    const formAble = isEdit === true;
    this.state = {
      activeKey,
      panes,
      isEdit,
      flowId,
      formData,
      formAble,
      staff: [],
      location: {},
    };
  }

  componentDidMount() {
    const params = {};
    const { isEdit, flowId } = this.state;
    if (isEdit) {
      this.fetchFlow({ id: flowId });
    }
    this.fetchForm(params);
    this.fetchFlowType(params);
    this.fetchDepartment({});
    this.fetchRoles({});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.flow !== this.props.flow && !this.state.formData.id) {
      const { flow } = nextProps;
      const { flowId } = this.state;
      const formData = flow[flowId];
      const stepKey = formData.steps.map(item => item.step_key);
      const location = {};
      formData.steps.forEach((item) => {
        location[item.step_key] = {
          x: item.x || 0,
          y: item.y || 0,
        };
      });
      this.newTabIndex = Math.max.apply(null, stepKey);
      if (formData.flows_has_staff.length) {
        this.fetchUser(formData.flows_has_staff);
      }
      this.fetchForm({ id: formData.form_id });
      this.setState({ formData, location });
    }
    const { staffInfo } = nextProps;

    const key = this.state.formData.flows_has_staff;
    if (staffInfo !== this.props.staffInfo && nextProps.staffInfo[`${key}`]) {
      const staff = [];
      nextProps.staffInfo[`${key}`].forEach((item) => {
        staff.push({ realname: item.realname, staff_sn: item.staff_sn });
      });
      this.setState({ staff });
    }
  }

  onChange = (activeKey) => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  getFields = () => {
    const { formsDetail } = this.props;
    const { formData } = this.state;
    let fields = [];
    let grids = [];
    if (formsDetail[formData.form_id]) {
      ({ fields, grids } = formsDetail[formData.form_id]);
    }
    const data = [];
    if (fields.length > 0) {
      fields.forEach((item) => {
        data.push({
          key: item.key,
          title: item.name,
          disabled: false,
        });
      });
    }
    if (grids.length > 0) {
      grids.forEach((item) => {
        data.push({
          key: item.key,
          title: item.name,
          grids: true,
          disabled: false,
        });
        item.fields.forEach((field) => {
          data.push({
            key: `${item.key}.*.${field.key}`,
            title: `${item.name} - ${field.name}`,
            disabled: false,
          });
        });
      });
    }
    return data;
  };

  fetchForm = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'workflow/fetchForm', payload: { ...params } });
  };

  fetchFlowType = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'workflow/fetchFlowType', payload: {} });
  };

  fetchFlow = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'workflow/fetchFlow', payload: { ...params } });
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

  fetchUser = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'staffs/fetchStaffForSearchTable',
      payload: { staff_sn: data, filters: `staff_sn=[${data}];status_id>0` },
    });
  };

  handleSubmitFlow = () => {
    if (!this.checkSteps()) {
      return false;
    }
    const { formData, formData: { steps }, location } = this.state;
    const { dispatch } = this.props;

    const data = { ...formData };
    data.steps = steps.map((item) => {
      return {
        ...item,
        ...location[item.step_key],
      };
    });
    dispatch({
      type: 'workflow/addFlows',
      payload: data,
      onSuccess: () => {
        this.props.dispatch(routerRedux.push('/workflow/flow'));
      },
      onError: this.handleValidateErrors,
    });
  };

  handleEditForm = () => {
    this.setState({ formAble: false });
  };

  handleReset = () => {
    this.setState({
      formAble: false,
      formData: {
        name: null,
        description: null,
        flow_type_id: null,
        form_id: null,
        is_active: 1,
        start_callback_uri: '',
        end_callback_uri: '',
        flows_has_staff: [],
        flows_has_roles: [],
        flows_has_departments: [],
        steps: [],
      },
    });
    scrollTo(0, 0);
  };

  pushTabs = (txt, cnt, activeKey) => {
    const { panes } = this.state;
    panes.push({
      title: txt,
      content: cnt,
      key: activeKey,
    });
    this.setState({ panes, activeKey });
  };

  editStep = (data) => {
    const { panes, formAble } = this.state;
    if (!formAble) {
      Modal.error({ title: '请先确认流程信息！' });
      this.setState({ formAble: false, activeKey: panes[0].key });
      return;
    }
    const nIndex = data.step_key;
    const activeKey = `newTabs${data.step_key}`;
    const hiddenData = this.getFields();
    const form = (
      <StepForm
        hiddenData={hiddenData}
        key={nIndex}
        onlyKey={nIndex}
        data={data}
        fields={hiddenData.map((item) => {
          return { key: item.key, name: item.title };
        })}
        handleSteps={this.handleSteps}
        callbackRemoveTabs={this.remove}
      />
    );

    const pushAble = panes.every((item) => {
      return item.key !== data.step_key;
    });

    const title = '编辑步骤';
    if (pushAble) {
      this.pushTabs(title, form, activeKey);
    }
  };

  add = () => {
    const { formAble, panes } = this.state;
    if (!formAble) {
      Modal.error({ title: '请先确定流程信息!' });
      this.setState({ activeKey: panes[0].key });
      return;
    }

    this.newTabIndex += 1;
    const nIndex = this.newTabIndex;
    const activeKey = `newTabs${nIndex}`;
    const hiddenData = this.getFields();
    const form = (
      <StepForm
        hiddenData={hiddenData}
        key={nIndex}
        onlyKey={nIndex}
        fields={hiddenData.map((item) => {
          return { key: item.key, name: item.title };
        })}
        handleSteps={this.handleSteps}
        callbackRemoveTabs={this.remove}
      />
    );
    const title = '添加步骤';
    this.pushTabs(title, form, activeKey);
  };

  remove = (targetKey) => {
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.setState({ panes, activeKey });
  };

  checkSteps = () => {
    let result = true;
    const { formData: { steps }, formAble, panes } = this.state;

    if (!formAble) {
      Modal.error({ title: '请先确认流程信息！' });
      this.setState({ formAble: false, activeKey: panes[0].key });
      result = false;
      return result;
    }

    if (steps.length < 2) {
      Modal.error({ title: '流程步骤至少两个步骤, 请添加步骤！' });
      this.setState({ activeKey: panes[1].key });
      result = false;
      return result;
    }

    let commit = true;
    steps.forEach((item) => {
      if (item.next_step_key.length === 0 && item.prev_step_key.length === 0) {
        commit = false;
      }
    });

    if (!commit) {
      Modal.error({ title: '存在没有关系的步骤，请建立步骤关系！' });
      this.setState({ activeKey: panes[1].key });
      result = false;
      return result;
    }
    return result;
  };

  handleSteps = (data) => {
    const { formData, formData: { steps } } = this.state;
    const nameData = filter(steps, ['name', data.name]);
    if (nameData.length > 1) {
      return false;
    }
    const oldStep = find(steps, ['step_key', data.step_key]);
    let newSteps = [...steps];
    if (oldStep) {
      newSteps = newSteps.map(value => (oldStep.step_key === value.step_key ? data : value));
    } else {
      const location = !steps.length ? { x: 120, y: 120 } : { x: 0, y: 0 };
      const newData = { ...data, ...location };
      newSteps.push(newData);
    }
    this.setState({ formData: { ...formData, steps: [...newSteps] } });
    return true;
  };

  editFlows = () => {
    if (!this.checkSteps()) {
      return false;
    }
    const { formData, formData: { steps }, location, flowId } = this.state;
    const { dispatch, onError } = this.props;
    const data = { ...formData };
    data.steps = steps.map((item) => {
      return {
        ...item,
        ...location[item.step_key],
      };
    });
    dispatch({
      type: 'workflow/editFlow',
      payload: { ...data, id: flowId },
      onSuccess: () => {
        this.props.dispatch(routerRedux.push('/workflow/flow'));
      },
      onError: error => onError(error, this.handleValidateErrors),
    });
  };

  handleValidateErrors = (_, __, err) => {
    const { panes, formData: { steps } } = this.state;
    const errorData = [];
    Object.keys(err).forEach((i) => {
      const k = i.split('.');
      if (k[0] === 'steps') {
        errorData.push({
          name: k.length > 1 ? steps[k[1]].name : '步骤',
          message: err[i][0],
        });
      } else {
        this.setState({ formAble: false, activeKey: panes[0].key });
      }
    });
    if (errorData.length > 0) {
      errorData.forEach((item, i) => {
        notification.error({
          message: '请求错误',
          key: i,
          description: (
            <div>
              <p>流程名称：{item.name}</p>
              <p>错误信息：{item.message}</p>
            </div>
          ),
        });
      });
    }
  };


  searchStaff = () => {
    const { staff, formData } = this.state;
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
            formData: {
              ...formData,
              flows_has_staff: value.map(item => item.staff_sn),
            },
          });
        }}
      />
    );
  };

  flowChartForm = () => {
    const { formData, formData: { steps } } = this.state;
    const departmentTree = markTreeData(this.props.department, {
      parentId: 'parent_id',
      value: 'id',
      label: 'full_name',
    }, 0);
    const {
      form: { getFieldDecorator, setFieldsValue },
      formsList,
      flowType,
      roles,
    } = this.props;

    let typesOption = [];
    if (flowType) {
      typesOption = flowType.map((item, i) => {
        const k = `o${i}`;
        return (
          <Option key={k} value={item.id}>{item.name}</Option>
        );
      });
    }

    let formsOption = [];
    if (formsList) {
      formsOption = formsList.map((item, i) => {
        const k = `f${i}`;
        return (<Option key={k} value={item.id}>{item.name}</Option>);
      });
    }


    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 10 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const flowsDepartments = formData.flows_has_departments.map(item => item.toString());
    return (
      <Form
        onSubmit={this.affirmFlow}
      >
        <FormItem label="流程图标" {...formItemLayout}>
          {getFieldDecorator('icon', {
            initialValue: formData.icon,
          })(
            <Input type="hidden" disabled={this.state.formAble} />
          )}
          <UploadCropper
            name="icon"
            cropperProps={{
              aspectRatio: 1,
            }}
            value={formData.icon ? [formData.icon] : []}
            actionType="workflow/uploadIcon"
            disabled={this.state.formAble}
            onChange={(values) => {
              formData.icon = values[0] || null;
              setFieldsValue({ icon: values[0] });
            }}
          />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="名称"
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: '请输入流程名称',
            }],
            initialValue: formData.name,
          })(
            <Input placeholder="请输入流程名称" disabled={this.state.formAble} />
          )}

        </FormItem>

        <FormItem
          {...formItemLayout}
          label="流程描述"
        >
          {getFieldDecorator('description', {
            initialValue: formData.description,
          })(
            <Input placeholder="请输入流程描述" disabled={this.state.formAble} />
          )}
        </FormItem>

        <FormItem
          labelCol={formItemLayout.labelCol}
          wrapperCol={{ span: 5 }}
          label="流程类型"
          hasFeedback
        >
          {getFieldDecorator('flow_type_id', {
            rules: [
              { required: true, message: '请选择流程类型' },
            ],
            initialValue: formData.flow_type_id,
          })(
            <Select placeholder="请选择流程类型" disabled={this.state.formAble}>
              <Option value={null}>---请选择---</Option>
              {typesOption}
            </Select>
          )}
        </FormItem>


        <FormItem
          labelCol={formItemLayout.labelCol}
          wrapperCol={{ span: 5 }}
          label="表单"
          hasFeedback
        >
          {getFieldDecorator('form_id', {
            rules: [
              { required: true, message: '请选择流程表单' },
            ],
            initialValue: formData.form_id,
          })(
            <Select
              placeholder="请选择流程表单"
              disabled={this.state.formAble}
              onChange={() => {
                const newSteps = steps.map((item) => {
                  return {
                    ...item,
                    hidden_fields: [],
                    editable_fields: [],
                    required_fields: [],
                  };
                });
                this.setState({
                  formData: {
                    ...formData,
                    steps: [...newSteps],
                  },
                });
              }}
            >
              <Option value={null}>---请选择---</Option>
              {formsOption}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="是否启用"
        >
          {getFieldDecorator('is_active', {
            rules: [{
              required: true, message: '必选选项',
            }],
            initialValue: formData.is_active,
          })(
            <Switch defaultChecked disabled={this.state.formAble} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="发送通知"
        >
          {getFieldDecorator('send_message', {
            rules: [{
              required: true, message: '必选选项',
            }],
            initialValue: formData.send_message,
          })(
            <Switch defaultChecked disabled={this.state.formAble} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="客户端可见"
        >
          {getFieldDecorator('is_client', {
            rules: [{
              required: true, message: '必选选项',
            }],
            initialValue: formData.is_client,
          })(
            <Switch defaultChecked disabled={this.state.formAble} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="发起人"
        >
          {getFieldDecorator('flows_has_staff', {
            initialValue: formData.flows_has_staff,
          })(
            <Input hidden placeholder="请输入" disabled={this.state.formAble} />
          )}
          {this.searchStaff()}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="发起部门"
        >
          {getFieldDecorator('flows_has_departments', {
            initialValue: formData.flows_has_departments,
          })(
            <Input hidden placeholder="请输入" disabled={this.state.formAble} />
          )}
          <TreeSelect
            multiple
            allowClear
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择发起部门"
            treeData={departmentTree}
            disabled={this.state.formAble}
            value={flowsDepartments}
            filterTreeNode={(inputValue, treeNode) => {
              if (treeNode.props.title.indexOf(inputValue) !== -1) {
                return true;
              }
            }}
            onChange={(value) => {
              const flowsHasDepartments = value.map(item => parseInt(item, 10));
              this.setState({
                formData: {
                  ...formData,
                  flows_has_departments: flowsHasDepartments,
                },
              });
            }}
          />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="发起角色"
        >
          {getFieldDecorator('flows_has_roles', {
            initialValue: formData.flows_has_roles,
          })(
            <Input hidden placeholder="请输入" />
          )}
          <Select
            mode="multiple"
            placeholder="请选择发起角色!"
            tokenSeparators={[',']}
            disabled={this.state.formAble}
            value={formData.flows_has_roles}
            filterOption={(inputValue, option) => {
              if (option.props.title.indexOf(inputValue) !== -1) {
                return true;
              }
            }}
            onChange={(value) => {
              this.setState({
                formData: {
                  ...formData,
                  flows_has_roles: [...value],
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
          {...formItemLayout}
          label="开始回调地址"
        >
          {getFieldDecorator('start_callback_uri', {
            rules: [{
              type: 'url', message: '请输入正确的开始回调地址！',
            }],
            initialValue: formData.start_callback_uri,
          })(
            <Input placeholder="请输入开始回调地址" disabled={this.state.formAble} />
          )}

        </FormItem>
        <FormItem
          {...formItemLayout}
          label="接收开始回调返回值"
        >
          {getFieldDecorator('accept_start_callback', {
            rules: [
              { required: true, message: '请选择' },
            ],
            initialValue: formData.accept_end_callback || '0',
          })(
            <Switch disabled={this.state.formAble} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="结束回调地址"
        >
          {getFieldDecorator('end_callback_uri', {
            rules: [{
              type: 'url', message: '请输入正确的结束回调地址！',
            }],
            initialValue: formData.end_callback_uri,
          })(
            <Input placeholder="请输入结束回调地址" disabled={this.state.formAble} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="接收结束回调返回值"
        >
          {getFieldDecorator('accept_end_callback', {
            rules: [
              { required: true, message: '请选择' },
            ],
            initialValue: formData.accept_end_callback || '0',
          })(
            <Switch disabled={this.state.formAble} />
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label="排序"
        >
          {getFieldDecorator('sort', {
            initialValue: formData.sort,
          })(
            <InputNumber placeholder="请输入" disabled={this.state.formAble} />
          )}
        </FormItem>

        <FormItem
          {...tailFormItemLayout}
          style={{ marginTop: 32 }}
        >
          <Button
            type="primary"
            htmlType="submit"
            disabled={this.state.formAble}
          >
            确定
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={this.handleEditForm}
          >
            编辑
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={this.handleReset}
          >
            重新输入
          </Button>
        </FormItem>
      </Form>
    );
  };

  updateSteps = (steps) => {
    const { formData } = this.state;
    this.setState({ formData: { ...formData, steps: [...steps] } });
  };

  locationUpdate = (location) => {
    this.setState({ location });
  }

  affirmFlow = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.fetchForm({ id: values.form_id });
        const formData = {
          ...this.state.formData,
          ...values,
        };
        this.setState({
          formAble: true,
          formData,
        });
      }
    });
  };

  render() {
    const {
      activeKey,
      isEdit,
      panes,
      location,
      formData: { steps },
    } = this.state;

    // const {
    //   staffsLoading,
    //   rolesLoading,
    //   departmentLoading,
    // } = this.props;

    const operations = (
      <Button
        type="primary"
        onClick={() => {
          if (isEdit) {
            this.editFlows();
          } else {
            this.handleSubmitFlow();
          }
        }}
      >
        <Icon type="save" />提交流程
      </Button>
    );
    panes[0].content = this.flowChartForm();
    panes[1].content = (
      <FlowChart
        steps={steps}
        location={location}
        editStep={this.editStep}
        addSteps={this.handleSteps}
        updateSteps={this.updateSteps}
        loactionUpdate={this.locationUpdate}
      />
    );

    const addSteps = (
      <Button
        size="small"
        onClick={this.add}
      >
        <Icon type="plus" /> 添加步骤
      </Button>
    );

    return (
      <Card
        key="i"
        extra={operations}
      >
        <Tabs
          renderTabBar
          renderTabContent
          animated
          tabBarExtraContent={addSteps}
          onChange={this.onChange}
          activeKey={activeKey}
          type="editable-card"
          onEdit={this.onEdit}
          hideAdd
        >
          {panes.map(pane => (
            <TabPane
              forceRender
              tab={pane.title}
              key={pane.key}
              closable={pane.closable}
            >
              {pane.content}
            </TabPane>)
          )}
        </Tabs>
      </Card>
    );
  }
}
