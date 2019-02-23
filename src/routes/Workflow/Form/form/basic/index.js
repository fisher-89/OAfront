import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { merge } from 'lodash';
import {
  Tabs,
  Input,
  Icon,
  Select,
  Tooltip,
  InputNumber,
} from 'antd';
import Switch from 'components/CustomSwitch';
import OAForm from 'components/OAForm';
import FieldList from '../../fieldList';

const FormItem = OAForm.Item;
const { Option } = Select;
const { TabPane } = Tabs;

@connect(({ workflow }) => ({
  formVal: workflow.formDetails,
  formType: workflow.formType,
  validator: workflow.validator,
}))

class basicForm extends PureComponent {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    this.state = {
      panes: [],
      activeKey: 'form',
      isEdit: props.formId !== undefined,
    };
  }

  componentWillMount() {
    this.fetchFormType();
    this.fetchValidator();
  }

  componentWillReceiveProps(newProps) {
    const { formId } = this.props;
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

  onTabChange = (activeKey) => {
    this.setState({ activeKey });
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

  addTabs = () => {
    const { panes } = this.state;
    this.newTabIndex += 1;
    const activeKey = `${this.newTabIndex}`;
    panes.push({ title: `列表控件${this.newTabIndex}`, key: activeKey });
    this.setState({ panes, activeKey });
  }

  removeTabs = (targetKey, e) => {
    e.stopPropagation();
    const { activeKey, panes } = this.state;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== targetKey);
    let newkey;
    if (lastIndex >= 0 && activeKey === targetKey) {
      newkey = newPanes[lastIndex].key.toString();
    }
    if (newPanes.length === 0) {
      newkey = 'form';
    }
    this.setState({ panes: newPanes, activeKey: newkey });
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldsError,
      },
      validatorRequired, formType, validator, formVal, listError, fieldListChange, formId,
    } = this.props;

    const { isEdit, activeKey, panes } = this.state;
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
    const gridsError = merge(listError.grids, formError.grids) || {};
    return (
      <Tabs
        tabPosition="left"
        activeKey={activeKey}
        onChange={this.onTabChange}
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
          tab={<span {...errColor}>主表</span>}
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
              initialValue: initialFieldsValue.pc_template || 0,
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
              initialValue: initialFieldsValue.mobile_template || 0,
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
                onChange={(_, key) => fieldListChange(key, 'grids')}
              />
            )}
          </FormItem>
          {getFieldDecorator('field_groups', {
            initialValue: initialFieldsValue.field_groups || [],
          })(
            <Input type="hidden" />
          )}
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
                    onChange={(_, key) => fieldListChange(key, 'grids')}
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
              {getFieldDecorator(`grids.${index}.mobile_y`, {
                initialValue: grids && grids[index] ? grids[index].mobile_y : null,
              })(
                <Input type="hidden" />
              )}
            </TabPane>
          );
        })}
      </Tabs>
    );
  }
}

export default basicForm;
