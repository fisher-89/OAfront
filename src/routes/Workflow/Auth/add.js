import React, { Component } from 'react';
import {
  Input,
  Switch,
  Checkbox,
  Button,
  Icon,
  Tag,
  Tabs,
  Divider,
} from 'antd';
import { connect } from 'dva';
import { pick } from 'lodash';
import OAForm from '../../../components/OAForm';
import SearchTable from '../../../components/OAForm/SearchTable';
import style from './add.less';
import FlowAuthModal from './flowAuthModal';
import FormAuthModal from './formAuthModal';

const FormItem = OAForm.Item;
const CheckboxGroup = Checkbox.Group;
const { TabPane } = Tabs;

const checkBoxGroupOptions = [
  { label: '查看', value: 1 },
  { label: '编辑', value: 2 },
  { label: '删除', value: 3 },
];

@connect(({ loading }) => ({
  loading: (
    loading.effects['workflow/authStore'] ||
    loading.effects['workflow/authUpdate']
  ),
}))
@OAForm.create()
export default class Add extends Component {
  constructor(props) {
    super(props);
    const { dispatch, data } = props;
    this.dispatch = dispatch;
    // 表单初始值
    const initialForm = {
      name: '',
      is_super: 0,
      staff: [],
      handle_flow: [],
      handle_flow_type: [],
      handle_form: [],
      handle_form_type: [],
      export_flow: [],
      export_form: [],
      // tabs 显示
      tabsClassName: style.tabsBlock,
    };

    // 流程关联modal 默认关闭
    const flowVisible = false;
    // 流程关联modal 默认关闭
    const formVisible = false;
    // 可导出流程modal关闭
    const exportFlowVisible = false;
    // 可导出表单modal关闭
    const exportFormVisible = false;

    // 是否编辑
    const isEdit = data ? 1 : 0;

    this.state = {
      initialForm,
      // 权限选中tab
      tabActiveKey: 'handle',
      flowVisible,
      formVisible,
      exportFlowVisible,
      exportFormVisible,
      isEdit,
    };
  }

  componentWillMount() {
    const { data } = this.props;
    const { isEdit } = this.state;
    // 编辑
    if (isEdit) {
      const tabsClassName = (data.is_super === 1) ? style.tabsNone : style.tabsBlock;
      this.setState({
        initialForm: {
          ...data,
        },
        tabsClassName,
      });
    }
  }

  // 删除关联流程tag
  onCloseFlowTag = (number) => {
    const { initialForm } = this.state;
    const { getFieldValue, setFieldsValue } = this.props.form;
    const flowAuth = getFieldValue('handle_flow');
    const newHandleFlow = flowAuth.filter(flow => flow.number !== number);
    this.setState({
      initialForm: {
        ...initialForm,
        handle_flow: newHandleFlow,
      },
    });
    setFieldsValue({ handle_flow: newHandleFlow });
  };
  // 关闭流程 modal
  onCancelFlow = () => {
    this.setState({
      flowVisible: false,
    });
  };
  // 删除表单流程tag
  onCloseFormTag = (number) => {
    const { initialForm } = this.state;
    const { getFieldValue, setFieldsValue } = this.props.form;
    const handleForm = getFieldValue('handle_form');
    const newHandleForm = handleForm.filter(form => form.number !== number);
    this.setState({
      initialForm: {
        ...initialForm,
        handle_form: newHandleForm,
      },
    });
    setFieldsValue({ handle_form: newHandleForm });
  };
  // 关闭表单 modal
  onCancelForm = () => {
    this.setState({
      formVisible: false,
    });
  };

  // 删除导出流程tag
  onCloseExportFlowTag = (number) => {
    const { initialForm } = this.state;
    const { getFieldValue, setFieldsValue } = this.props.form;
    const exportFlow = getFieldValue('export_flow');
    const newExportFlow = exportFlow.filter(flow => flow.number !== number);
    this.setState({
      initialForm: {
        ...initialForm,
        export_flow: newExportFlow,
      },
    });
    setFieldsValue({ export_flow: newExportFlow });
  };
  // 关闭导出流程 modal
  onCancelExportFlow = () => {
    this.setState({
      exportFlowVisible: false,
    });
  };

  // 删除导出表单流程tag
  onCloseExportFormTag = (number) => {
    const { initialForm } = this.state;
    const { getFieldValue, setFieldsValue } = this.props.form;
    const exportForm = getFieldValue('export_form');
    const newExportForm = exportForm.filter(form => form.number !== number);
    this.setState({
      initialForm: {
        ...initialForm,
        handle_form: newExportForm,
      },
    });
    setFieldsValue({ export_form: newExportForm });
  };
  // 关闭导出表单 modal
  onCancelExportForm = () => {
    this.setState({
      exportFormVisible: false,
    });
  };

  // 显示流程 modal
  showFlowAuthModal = () => {
    this.setState({
      flowVisible: true,
    });
  };

  // 关联流程确定
  flowAuthOnOk = (selectedRowKeys, selectedRows) => {
    const { setFieldsValue } = this.props.form;
    const { initialForm } = this.state;
    const handleFlow = selectedRows.map(flow => pick(flow, ['name', 'number']));
    setFieldsValue({ handle_flow: handleFlow });
    this.setState({
      flowVisible: false,
      initialForm: {
        ...initialForm,
        handle_flow: handleFlow,
      },
    });
  };

  // 显示导出流程 modal
  showExportFlowModal = () => {
    this.setState({
      exportFlowVisible: true,
    });
  };
  // 导出流程确定
  exportFlowOnOk = (selectedRowKeys, selectedRows) => {
    const { setFieldsValue } = this.props.form;
    const { initialForm } = this.state;
    const exportFlow = selectedRows.map(flow => pick(flow, ['name', 'number']));
    setFieldsValue({ export_flow: exportFlow });
    this.setState({
      exportFlowVisible: false,
      initialForm: {
        ...initialForm,
        export_flow: exportFlow,
      },
    });
  };


  // 表单
  // 显示表单 modal
  showFormAuthModal = () => {
    this.setState({
      formVisible: true,
    });
  };

  // 关联表单确定
  formAuthOnOk = (selectedRowKeys, selectedRows) => {
    const { initialForm } = this.state;
    const { setFieldsValue } = this.props.form;
    const handleForm = selectedRows.map(form => pick(form, ['name', 'number']));
    setFieldsValue({ handle_form: handleForm });
    this.setState({
      formVisible: false,
      initialForm: {
        ...initialForm,
        handle_form: handleForm,
      },
    });
  };

  // 显示导出表单 modal
  showExportFormModal = () => {
    this.setState({
      exportFormVisible: true,
    });
  };

  // 关联导出表单确定
  exportFormOnOk = (selectedRowKeys, selectedRows) => {
    const { initialForm } = this.state;
    const { setFieldsValue } = this.props.form;
    const exportForm = selectedRows.map(form => pick(form, ['name', 'number']));
    setFieldsValue({ export_form: exportForm });
    this.setState({
      exportFormVisible: false,
      initialForm: {
        ...initialForm,
        export_form: exportForm,
      },
    });
  };

  // 超级管理员onChange
  superOnChange = (checked) => {
    const tabsClassName = checked ? style.tabsNone : style.tabsBlock;
    this.setState({
      tabsClassName,
    });
  }

  // 添加提交
  handleSubmit = (params, onError) => {
    const { data } = this.props;
    let newParams = {
      ...params,
      is_super: params.is_super ? 1 : 0,
    };

    // 超级管理员 清除操作权限与导出权限数据
    if (newParams.is_super) {
      newParams = {
        ...newParams,
        handle_flow: [],
        handle_flow_type: [],
        handle_form: [],
        handle_form_type: [],
        export_flow: [],
        export_form: [],
      };
    }
    if (data) {
      // 编辑
      const url = 'workflow/authUpdate';
      this.dispatch({
        type: url,
        payload: newParams,
        id: data.id,
        onSuccess: () => {
          // 关闭新增页面
          this.props.onCancel();
        },
        onError: (error) => {
          onError(error);
        },
      });
    } else {
      // 新增
      const url = 'workflow/authStore';
      this.dispatch({
        type: url,
        payload: newParams,
        onSuccess: () => {
          // 关闭新增页面
          this.props.onCancel();
        },
        onError: (error) => {
          onError(error);
        },
      });
    }
  };
  // 操作类型点击
  checkBoxOnChange = (checkedList) => {
    this.setState(checkedList);
  };
  // 选择员工
  searchStaff = () => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    return (
      <SearchTable.Staff
        multiple
        value={getFieldValue('staff')}
        name={{
          staff_sn: 'staff_sn',
          realname: 'realname',
        }}
        showName="realname"
        // filters={{ content: 'status_id>=0;', status: [1, 2, 3] }}
        // disabled={this.state.formAble}
        onChange={(value) => {
          setFieldsValue({ staff: value });
        }}
      />
    );
  };
  // 操作权限、导出权限tab切换
  tabChange = (activeKey) => {
    this.setState({ tabActiveKey: activeKey });
  };

  render() {
    // 表单字段布局
    const formItemLayout = {
      // label 布局
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      // 右侧布局
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const {
      form: { getFieldDecorator },
      validateFields,
    } = this.props;
    const {
      initialForm,
      flowVisible,
      formVisible,
      exportFlowVisible,
      exportFormVisible,
      tabsClassName,
    } = this.state;
    // 操作权限 可用流程key
    const handleFlowSelectedRowKeys = initialForm.handle_flow.map(flow => flow.number);
    // 操作权限 可用表单key
    const handleFormSelectedRowKeys = initialForm.handle_form.map(form => form.number);
    // 导出权限 可导出流程key
    const exportFlowSelectedRowKeys = initialForm.export_flow.map(flow => flow.number);
    // 导出权限 可导出表单key
    const exportFormSelectedRowKeys = initialForm.export_form.map(form => form.number);
    // 流程tags
    const getFlowTags = initialForm.handle_flow.map(flow => (
      <Tag
        key={flow.number}
        closable
        onClose={() => this.onCloseFlowTag(flow.number)}
      >
        {flow.name}
      </Tag>
    ));
    // 表单tags
    const getFormTags = initialForm.handle_form.map(form => (
      <Tag
        key={form.number}
        closable
        onClose={() => this.onCloseFormTag(form.number)}
      >
        {form.name}
      </Tag>
    ));

    // 导出流程tags
    const getExportFlowTags = initialForm.export_flow.map(flow => (
      <Tag
        key={flow.number}
        closable
        onClose={() => this.onCloseExportFlowTag(flow.number)}
      >
        {flow.name}
      </Tag>
    ));

    // 导出表单tags
    const getExportFormTags = initialForm.export_form.map(form => (
      <Tag
        key={form.number}
        closable
        onClose={() => this.onCloseExportFormTag(form.number)}
      >
        {form.name}
      </Tag>
    ));
    return (
      <div className={style.layout}>
        <OAForm
          onSubmit={validateFields(this.handleSubmit)}
        >
          <FormItem
            {...formItemLayout}
            label="角色名称"
            required
          >
            {
              getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入角色名称',
                }],
                initialValue: initialForm.name,
              })(
                <Input type="text" placeholder="请输入角色名称 最大255" />
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="关联员工"
          >
            {
              getFieldDecorator('staff', {
                initialValue: initialForm.staff,
              })(
                <Button hidden type="dashed" className={style.relateButton}>
                  <Icon type="plus" />
                </Button>
              )
            }
            {this.searchStaff()}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="超级管理员"
            required
          >
            {
              getFieldDecorator('is_super', {
                rules: [{
                  required: true,
                  message: '请选择是或否',
                }],
                initialValue: initialForm.is_super,
              })(
                <Switch defaultChecked={!!initialForm.is_super} onChange={this.superOnChange} />
              )
            }
          </FormItem>
          <Tabs
            activeKey={this.state.tabActiveKey}
            onChange={this.tabChange}
            className={tabsClassName}
          >
            <TabPane tab="操作权限" key="handle">
              <FormItem
                {...formItemLayout}
                label="可操作流程"
              >
                {
                  getFieldDecorator('handle_flow', {
                    initialValue: initialForm.handle_flow,
                  })(
                    <span>
                      {getFlowTags}
                      <Button type="dashed" className={style.relateButton} onClick={this.showFlowAuthModal}>
                        <Icon type="plus" />
                      </Button>
                    </span>
                  )
                }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="操作类型"
              >
                {
                  getFieldDecorator('handle_flow_type', {
                    initialValue: initialForm.handle_flow_type,
                  })(
                    <CheckboxGroup
                      options={checkBoxGroupOptions}
                      onChange={this.checkBoxOnChange}
                    />
                  )
                }
              </FormItem>
              <Divider dashed />
              <FormItem
                {...formItemLayout}
                label="可操作表单"
              >
                {
                  getFieldDecorator('handle_form', {
                    initialValue: initialForm.handle_form,
                  })(
                    <span>
                      {getFormTags}
                      <Button type="dashed" className={style.relateButton} onClick={this.showFormAuthModal}>
                        <Icon type="plus" />
                      </Button>
                    </span>
                  )
                }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="操作类型"
              >
                {
                  getFieldDecorator('handle_form_type', {
                    initialValue: initialForm.handle_form_type,
                  })(
                    <CheckboxGroup
                      options={checkBoxGroupOptions}
                      onChange={this.checkBoxOnChange}
                    />
                  )
                }
              </FormItem>
            </TabPane>
            <TabPane tab="导出权限" key="export">
              <FormItem
                {...formItemLayout}
                label="可导出流程"
              >
                {
                  getFieldDecorator('export_flow', {
                    initialValue: initialForm.export_flow,
                  })(
                    <span>
                      {getExportFlowTags}
                      <Button type="dashed" className={style.relateButton} onClick={this.showExportFlowModal}>
                        <Icon type="plus" />
                      </Button>
                    </span>
                  )
                }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="可导出表单"
              >
                {
                  getFieldDecorator('export_form', {
                    initialValue: initialForm.export_form,
                  })(
                    <span>
                      {getExportFormTags}
                      <Button type="dashed" className={style.relateButton} onClick={this.showExportFormModal}>
                        <Icon type="plus" />
                      </Button>
                    </span>
                  )
                }
              </FormItem>
            </TabPane>
          </Tabs>
          <FormItem
            labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
            wrapperCol={{ span: 24, offset: 6 }}
          >
            <Button type="primary" htmlType="submit">确定</Button>
          </FormItem>
        </OAForm>
        <FlowAuthModal
          visible={flowVisible}
          onCancel={this.onCancelFlow}
          onOk={this.flowAuthOnOk}
          selectedRowKeys={handleFlowSelectedRowKeys}
        />
        <FormAuthModal
          visible={formVisible}
          onCancel={this.onCancelForm}
          onOk={this.formAuthOnOk}
          selectedRowKeys={handleFormSelectedRowKeys}
        />
        <FlowAuthModal
          visible={exportFlowVisible}
          onCancel={this.onCancelExportFlow}
          onOk={this.exportFlowOnOk}
          selectedRowKeys={exportFlowSelectedRowKeys}
        />
        <FlowAuthModal
          visible={exportFormVisible}
          onCancel={this.onCancelExportForm}
          onOk={this.exportFormOnOk}
          selectedRowKeys={exportFormSelectedRowKeys}
        />
      </div>
    );
  }
}

