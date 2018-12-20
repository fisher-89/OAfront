import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import {
  Tabs,
  Button,
  Input,
  Icon,
  Select,
  Tooltip,
  InputNumber,
} from 'antd';
import Switch from 'components/CustomSwitch';
import OAForm from 'components/OAForm';
import FooterToolbar from 'components/FooterToolbar';
import FieldList from '../fieldList';
import PCTemplate from './pc/template';
import MobileTemplate from './mobile_template';

const FormItem = OAForm.Item;
const { Option } = Select;
const { TabPane } = Tabs;

@connect(({ loading, workflow }) => ({
  loading: (
    loading.effects['workflow/addForm'] ||
    loading.effects['workflow/fetchForm'] ||
    loading.effects['workflow/fetchFormType'] ||
    loading.effects['workflow/fetchValidator'] ||
    loading.effects['workflow/editForm']
  ),
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
      listError: {},
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

  fieldListChange = (errKey, name) => {
    const { listError } = this.state;
    const fieldsError = listError[name] || {};
    let newListError = {};
    if (errKey === 'all') {
      newListError = { ...listError };
      delete newListError[name];
    } else if (fieldsError[errKey]) {
      delete fieldsError[errKey];
      newListError = {
        ...listError,
        [name]: { ...fieldsError },
      };
    }
    this.setState({ listError: newListError });
  }

  handleOnError = (errors) => {
    const { onError } = this.props;
    const { panes } = this.state;
    const gridsError = {
      // fields: 'fields',
    };
    panes.forEach((_, index) => {
      gridsError[`grids.${index}.name`] = `grids[${index}].name`;
      gridsError[`grids.${index}.key`] = `grids[${index}].key`;
      gridsError[`grids.${index}.fields`] = `grids[${index}].fields`;
    });
    onError(errors, gridsError, (err) => {
      this.setState({ listError: err });
    });
  }

  handleAddSubmit = (params) => {
    // ly修改排序start
    const newParams = { ...params };
    if (params.sort === undefined || params.sort === '') {
      newParams.sort = 0;
    }
    // ly 修改排序end
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/addForm',
      payload: {
        ...newParams,
      },
      onSuccess: this.handleSubmitSuccess,
      onError: this.handleOnError,
    });
  }

  handleEditSubmit = (params) => {
    // ly修改排序start
    const newParams = { ...params };
    if (params.sort === undefined || params.sort === '') {
      newParams.sort = 0;
    }
    // ly 修改排序end
    const { dispatch } = this.props;
    const { formId } = this.state;
    dispatch({
      type: 'workflow/editForm',
      payload: {
        ...newParams,
        id: formId,
      },
      onSuccess: this.handleSubmitSuccess,
      onError: this.handleOnError,
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

  render() {
    const {
      form,
      form: {
        getFieldDecorator,
        getFieldsError,
        getFieldValue,
        getFieldsValue,
      },
      validatorRequired,
      formType, validateFields, validator, formVal,
    } = this.props;

    const { formId, isEdit, activeKey, panes, listError } = this.state;
    let initialFieldsValue = {};
    let grids = [];
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
    const formError = getFieldsError(['name', 'form_type_id', 'fields', 'grids']);
    const errColor =
      (formError.name || formError.form_type_id || formError.fields || listError.fields) && { style: { color: 'red' } };
    const gridsError = listError.grids || formError.grids || {};
    return (
      <Tabs>
        <TabPane tab="表单配置" key="basic">
          <OAForm onSubmit={validateFields(isEdit ? this.handleEditSubmit : this.handleAddSubmit)}>
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
                tab={<span {...errColor}>表单</span>}
                key="form"
              >
                <FormItem
                  {...formItemLayout}
                  label="名称"
                  required
                >
                  {getFieldDecorator('name', {
                    initialValue: initialFieldsValue.name || '',
                    rules: [validatorRequired],
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
                    rules: [validatorRequired],
                  } : {}))(
                    <Select placeholder="请选择">
                      {formType.map(item => <Option key={item.id}>{item.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="启用PC模板"
                >
                  {getFieldDecorator('pc_template', (initialFieldsValue ? {
                    initialValue: initialFieldsValue.pc_template,
                    rules: [validatorRequired],
                  } : {}))(
                    <Switch />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="启用移动端模板"
                >
                  {getFieldDecorator('mobile_template', (initialFieldsValue ? {
                    initialValue: initialFieldsValue.mobile_template,
                    rules: [validatorRequired],
                  } : {}))(
                    <Switch />
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
                  label="表单控件"
                >
                  {getFieldDecorator('fields', {
                    initialValue: initialFieldsValue.fields || [],
                    rules: [validatorRequired],
                  })(
                    <FieldList
                      validator={validator}
                      error={listError.fields || {}}
                      onChange={(_, key) => this.fieldListChange(key, 'grids')}
                    />
                  )}
                </FormItem>
              </TabPane>
              {panes.map((pane, index) => {
                let colorAble = false;
                Object.keys(gridsError[index] || {}).forEach((key) => {
                  if (gridsError[index][key] !== undefined) {
                    colorAble = true;
                  }
                });
                const filedsError = gridsError[index] || {};
                return (
                  <TabPane
                    tab={(
                      <span>
                        <span {...(colorAble && { style: { color: 'red' } })}>{pane.title}</span>
                        <Icon type="close" onClick={e => this.removeTabs(pane.key, e)} />
                      </span>
                    )}
                    forceRender
                    key={pane.key}
                  >
                    {getFieldDecorator(`grids.${index}.id`, {
                      initialValue: grids && grids[index] ? grids[index].id : '',
                    })(
                      <Input hidden />
                    )}
                    <FormItem label="名称" {...formItemLayout} required>
                      {getFieldDecorator(`grids.${index}.name`, {
                        initialValue: grids && grids[index] ? grids[index].name : '',
                        rules: [validatorRequired],
                      })(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                    <FormItem label="键名" {...formItemLayout} required>
                      {getFieldDecorator(`grids.${index}.key`, {
                        initialValue: grids && grids[index] ? grids[index].key : '',
                        rules: [validatorRequired],
                      })(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                    <FormItem label="表单控件" {...formItemLayout} required>
                      {getFieldDecorator(`grids.${index}.fields`, {
                        initialValue: grids && grids[index] ? grids[index].fields : [],
                        rules: [validatorRequired],
                      })(
                        <FieldList
                          validator={validator}
                          error={filedsError.fields || {}}
                          onChange={(_, key) => this.fieldListChange(key, 'grids')}
                        />
                      )}
                    </FormItem>
                    {getFieldDecorator(`grids.${index}.x`, {
                      initialValue: grids && grids[index] ? grids[index].x : null,
                    })(
                      <Input type="hidden" />
                    )}
                    {getFieldDecorator(`grids.${index}.y`, {
                      initialValue: grids && grids[index] ? grids[index].y : null,
                    })(
                      <Input type="hidden" />
                    )}
                    {getFieldDecorator(`grids.${index}.col`, {
                      initialValue: grids && grids[index] ? grids[index].col : null,
                    })(
                      <Input type="hidden" />
                    )}
                    {getFieldDecorator(`grids.${index}.row`, {
                      initialValue: grids && grids[index] ? grids[index].row : null,
                    })(
                      <Input type="hidden" />
                    )}
                  </TabPane>
                );
              })}
            </Tabs>
            <FooterToolbar>
              <Button type="primary" htmlType="submit">提交</Button>
            </FooterToolbar>
          </OAForm>
        </TabPane>
        <TabPane tab="PC端模板" key="pc">
          <PCTemplate fields={getFieldValue('fields')} grids={getFieldsValue().grids || []} form={form} />
        </TabPane>
        <TabPane tab="移动端模板" key="mobile">
          <MobileTemplate />
        </TabPane>
      </Tabs>
    );
  }
}

export default addForm;
