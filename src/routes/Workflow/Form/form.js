import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import {
  Tabs,
  Input,
  Icon,
  Select,
  Tooltip,
  InputNumber,
} from 'antd';
import OAForm from '../../../components/OAForm';
import FieldList from './fieldList';

const FormItem = OAForm.Item;
const { Option } = Select;
const { TabPane } = Tabs;

@connect(({ loading, workflow }) => ({
  submitting: loading.effects['workflow/addForm'],
  fetching: loading.effects['workflow/fetchForm'],
  formVal: workflow.formDetails,
  formType: workflow.formType,
  validator: workflow.validator,
}))


@OAForm.create()
@withRouter
class addForm extends PureComponent {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    this.state = {
      panes: [],
      activeKey: 'form',
      formId: props.match.params.id,
      isEdit: props.match.params.id !== undefined,
    };
  }

  componentWillMount() {
    const { formId, isEdit } = this.state;
    if (isEdit) {
      this.fetchFormById(formId);
    }
    this.fetchFormType();
    this.fetchValidator();
  }

  componentWillReceiveProps(newProps) {
    const { formId } = this.state;
    if (newProps.formVal !== this.props.formVal) {
      if (newProps.formVal[formId] && newProps.formVal[formId].grids !== undefined) {
        const { grids } = newProps.formVal[formId];
        const newPanes = grids.map(() => {
          this.newTabIndex += 1;
          return { title: `列表控件${this.newTabIndex}`, key: this.newTabIndex.toString() };
        });
        this.setState({ panes: [...newPanes] });
      }
    }
  }

  onChange = (activeKey) => {
    this.setState({ activeKey });
  }

  fetchFormById = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/fetchForm',
      payload: { id },
    });
  }

  fetchFormType = () => {
    const { formType, dispatch } = this.props;
    if (formType.length === 0) {
      dispatch({ type: 'workflow/fetchFormType' });
    }
  }

  fetchValidator = () => {
    const { validator, dispatch } = this.props;
    if (validator.length === 0) {
      dispatch({ type: 'workflow/fetchValidator' });
    }
  }

  handleAddSubmit = (params) => {
    // ly修改排序start
    const newParams = { ...params };
    if (params.sort === undefined || params.sort === '') {
      newParams.sort = 0;
    }
    // ly 修改排序end
    const { dispatch, onError } = this.props;
    dispatch({
      type: 'workflow/addForm',
      payload: {
        ...newParams,
      },
      onSuccess: this.handleSubmitSuccess,
      onError,
    });
  }

  handleEditSubmit = (params) => {
    // ly修改排序start
    const newParams = { ...params };
    if (params.sort === undefined || params.sort === '') {
      newParams.sort = 0;
    }
    // ly 修改排序end
    const { dispatch, onError } = this.props;
    const { formId } = this.state;
    dispatch({
      type: 'workflow/editForm',
      payload: {
        ...newParams,
        id: formId,
      },
      onSuccess: this.handleSubmitSuccess,
      onError,
    });
  }

  handleSubmitSuccess = () => {
    this.props.history.push('/workflow/form');
  }


  addTabs = () => {
    const { panes } = this.state;
    this.newTabIndex += 1;
    const activeKey = `${this.newTabIndex}`;
    panes.push({ title: `列表控件${this.newTabIndex}`, key: activeKey });
    this.setState({ panes, activeKey });
  }

  removeTabs = (targetKey, e) => {
    e.stopPropagation();
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key.toString();
    }
    if (panes.length === 0) {
      activeKey = 'form';
    }
    this.setState({ panes, activeKey });
  }


  handleFieldListOnChange = (listData, name) => {
    this.props.handleFieldsError(name);
  }

  render() {
    const {
      formType,
      fetching,
      submitting,
      validateFields,
      form: {
        getFieldDecorator,
      },
      validator,
      fieldsError,
      formVal,
    } = this.props;
    const {
      formId,
      isEdit,
      activeKey,
      panes,
    } = this.state;
    let initialFieldsValue = {};
    let grids = {};
    let fields = [];
    if (isEdit && formVal[formId]) {
      initialFieldsValue = formVal[formId];
      initialFieldsValue.form_type_id = initialFieldsValue &&
        initialFieldsValue.form_type_id.toString();
      (fields) = initialFieldsValue;
      if (fields.length && fields.validator_id.length) {
        const validators = fields.map(item => item.validator_id);
        validators.forEach((item, index) => {
          fields[index].validator_id = item.map(validatorId => validatorId.toString());
        });
      }

      if (initialFieldsValue.grids) {
        ({ grids } = initialFieldsValue);
      }
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    return (
      <OAForm
        onSubmitBtn
        onSubmit={validateFields(isEdit ? this.handleEditSubmit : this.handleAddSubmit)}
        loading={(fetching || submitting) === true}
      >
        <Tabs
          tabPosition="left"
          activeKey={activeKey}
          onChange={this.onChange}
          tabBarExtraContent={(
            <Tooltip title="添加表单组件" placement="bottomRight">
              <Icon
                type="plus"
                className="ant-tabs-new-tab"
                onClick={() => {
                  this.addTabs();
                }}
              />
            </Tooltip>
          )}
        >
          <TabPane
            tab="表单"
            key="form"
          >
            <FormItem
              {...formItemLayout}
              label="名称"
              required
            >
              {getFieldDecorator('name', {
                initialValue: initialFieldsValue.name || '',
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="描述"
            >
              {getFieldDecorator('description', {
                initialValue: initialFieldsValue.description || '',
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="表单分类"
              required
            >
              {getFieldDecorator('form_type_id', (initialFieldsValue ? {
                initialValue: initialFieldsValue.form_type_id,
              } : {}))(
                <Select placeholder="请选择" >
                  {formType.map(item => <Option key={item.id}>{item.name}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="排序"
            >
              {getFieldDecorator('sort', {
                initialValue: initialFieldsValue.sort || 0,
              })(
                <InputNumber placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="字段"
            >
              {getFieldDecorator('fields', {
                initialValue: initialFieldsValue.fields || [],
              })(
                <FieldList
                  validator={validator}
                  error={fieldsError.fields || {}}
                  onChange={listData => this.handleFieldListOnChange(listData, 'fields')}
                />
              )}
            </FormItem>
          </TabPane>
          {panes.map((pane, index) => {
            return (
              <TabPane
                tab={(
                  <span>
                    {pane.title}
                    <Icon
                      type="close"
                      onClick={(e) => {
                        this.removeTabs(pane.key, e);
                      }}
                    />
                  </span>
                )}
                forceRender
                key={pane.key}
              >
                <FormItem label="名称" {...formItemLayout}>
                  {getFieldDecorator(`grids.${index}.name`, {
                    initialValue: grids && grids[index] ? grids[index].name : '',
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem label="键名" {...formItemLayout}>
                  {getFieldDecorator(`grids.${index}.key`, {
                    initialValue: grids && grids[index] ? grids[index].key : '',
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem label="字段" {...formItemLayout}>
                  {getFieldDecorator(`grids.${index}.fields`, {
                    initialValue: grids && grids[index] ? grids[index].fields : [],
                  })(
                    <FieldList
                      validator={validator}
                      error={fieldsError.grids || {}}
                      onChange={listData => this.handleFieldListOnChange(listData, `grids.${index}.fields`)}
                    />
                  )}
                </FormItem>
              </TabPane>
            );
          })}
        </Tabs>
      </OAForm>
    );
  }
}
export default addForm;
