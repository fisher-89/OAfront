import React, { Component } from 'react';
import {
  Input,
  Switch,
  Checkbox,
  Button,
  Icon,
  Tag,
} from 'antd';
import { connect } from 'dva';
import OAForm from '../../../components/OAForm';
import SearchTable from '../../../components/OAForm/SearchTable';
import style from './add.less';
import FlowAuthModal from './flowAuthModal';
import FormAuthModal from './formAuthModal';

const FormItem = OAForm.Item;
const CheckboxGroup = Checkbox.Group;

const checkBoxGroupOptions = [
  { label: '查看', value: 1 },
  { label: '编辑', value: 3 },
  { label: '添加', value: 2 },
  { label: '删除', value: 4 },
];

@OAForm.create()
@connect(({ loading }) => ({
  loading: loading.effects['workflow/authStore'],
}))
export default class Add extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    // 表单初始值
    const initialForm = {
      name: '',
      is_super: 0,
      staff: [],
      handle: [],
      flow_auth: [],
      form_auth: [],
    };
    // 流程关联modal 默认关闭
    const flowVisible = false;
    // 关联流程data
    const flowAuthData = [];
    // 流程关联modal 默认关闭
    const formVisible = false;
    // 关联流程data
    const formAuthData = [];

    this.state = {
      initialForm,
      flowVisible,
      flowAuthData,
      formVisible,
      formAuthData,
    };
  }

  // 删除关联流程tag
  onCloseFlowTag = (number) => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const flowAuth = getFieldValue('flow_auth');
    const index = flowAuth.indexOf(number);
    flowAuth.splice(index, 1);
    const newFlowAuthData = this.state.flowAuthData.filter(flow => flow.number !== number);
    this.setState({
      flowAuthData: newFlowAuthData,
    });
    setFieldsValue({ flow_auth: flowAuth });
  };
  // 关闭流程 modal
  onCancelFlow = () => {
    this.setState({
      flowVisible: false,
    });
  };
  // 删除表单流程tag
  onCloseFormTag = (number) => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const formAuth = getFieldValue('form_auth');
    const index = formAuth.indexOf(number);
    formAuth.splice(index, 1);
    const newFormAuthData = this.state.formAuthData.filter(form => form.number !== number);
    this.setState({
      formAuthData: newFormAuthData,
    });
    setFieldsValue({ form_auth: formAuth });
  };
  // 关闭表单 modal
  onCancelForm = () => {
    this.setState({
      formVisible: false,
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
    setFieldsValue({ flow_auth: selectedRowKeys });
    this.setState({
      flowVisible: false,
      // initialForm: {
      //   flow_auth: selectedRowKeys,
      // },
      flowAuthData: selectedRows,
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
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ form_auth: selectedRowKeys });
    this.setState({
      formVisible: false,
      // initialForm: {
      //   flow_auth: selectedRowKeys,
      // },
      formAuthData: selectedRows,
    });
  };


  // 添加提交
  handleSubmit = (params, onError) => {
    const data = {
      ...params,
      is_super: params.is_super ? 1 : 0,
    };
    this.dispatch({
      type: 'workflow/authStore',
      payload: data,
      onSuccess: () => {
        // 关闭新增页面
        this.props.onCancel();
      },
      onError: (error) => {
        onError(error);
      },
    });
  };
  // 操作权限点击
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

  render() {
    // 表单字段布局
    const formItemLayout = {
      // label 布局
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      // 右侧布局
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const {
      form: { getFieldDecorator },
      validateFields,
    } = this.props;
    const { initialForm, flowVisible, flowAuthData, formVisible, formAuthData } = this.state;
    // 流程tags
    const getFlowTags = flowAuthData.map(flow => (
      <Tag
        key={flow.number}
        closable
        onClose={() => this.onCloseFlowTag(flow.number)}
      >
        {flow.name}
      </Tag>
    ));
    // 表单tags
    const getFormTags = formAuthData.map(form => (
      <Tag
        key={form.number}
        closable
        onClose={() => this.onCloseFormTag(form.number)}
      >
        {form.name}
      </Tag>
    ));
    return (
      <div className={style.layout}>
        <OAForm onSubmit={validateFields(this.handleSubmit)}>
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
                <Switch defaultChecked={false} />
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="操作权限"
          >
            {
              getFieldDecorator('handle', {
                initialValue: initialForm.handle,
              })(
                <CheckboxGroup
                  options={checkBoxGroupOptions}
                  onChange={this.checkBoxOnChange}
                />
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
            label="关联流程"
          >
            {
              getFieldDecorator('flow_auth', {
                initialValue: initialForm.flow_auth,
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
            label="关联表单"
          >
            {
              getFieldDecorator('form_auth', {
                initialValue: initialForm.form_auth,
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
            wrapperCol={{ span: 12, offset: 5 }}
          >
            <Button type="primary" htmlType="submit" className={style.submitButton}>确定</Button>
            <Button>取消</Button>
          </FormItem>
        </OAForm>
        <FlowAuthModal
          visible={flowVisible}
          onCancel={this.onCancelFlow}
          onOk={this.flowAuthOnOk}
          selectedRowKeys={initialForm.flow_auth}
        />
        <FormAuthModal
          visible={formVisible}
          onCancel={this.onCancelForm}
          onOk={this.formAuthOnOk}
          selectedRowKeys={initialForm.form_auth}
        />
      </div>
    );
  }
}

