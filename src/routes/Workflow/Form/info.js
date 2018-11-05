import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Tabs,
  Card,
  Input,
  Select,
  InputNumber,
} from 'antd';
import FieldList from './fieldList';
import OAForm from '../../../components/OAForm';

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
export default class extends PureComponent {
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


  render() {
    const { formType, validator, formVal } = this.props;

    const { formId, isEdit, activeKey, panes } = this.state;
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
      <Card bordered={false}>
        <Tabs
          tabPosition="left"
          activeKey={activeKey}
          onChange={this.onChange}
        >
          <TabPane tab="表单" key="form" >
            <FormItem {...formItemLayout} label="名称">
              <Input placeholder="请输入" value={initialFieldsValue.name || ''} readOnly />
            </FormItem>
            <FormItem {...formItemLayout} label="描述" >
              <Input placeholder="请输入" value={initialFieldsValue.description || ''} readOnly />
            </FormItem>
            <FormItem {...formItemLayout} label="表单分类">
              <Select placeholder="请选择" value={initialFieldsValue.form_type_id} readOnly>
                {formType.map(item => <Option key={item.id}>{item.name}</Option>)}
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="排序" >
              <InputNumber placeholder="请输入" value={initialFieldsValue.sort || 0} readOnly />
            </FormItem>
            <FormItem {...formItemLayout} label="表单控件" >
              <FieldList
                validator={validator}
                value={initialFieldsValue.fields || []}
              />
            </FormItem>
          </TabPane>
          {panes.map((pane, index) => {
            return (
              <TabPane
                tab={pane.title}
                forceRender
                key={pane.key}
              >
                <FormItem label="名称" {...formItemLayout}>
                  <Input placeholder="请输入" value={grids && grids[index] ? grids[index].name : ''} readOnly />
                </FormItem>
                <FormItem label="键名" {...formItemLayout}>
                  <Input placeholder="请输入" value={grids && grids[index] ? grids[index].key : ''} readOnly />
                </FormItem>
                <FormItem label="表单控件" {...formItemLayout}>
                  <FieldList
                    validator={validator}
                    value={grids && grids[index] ? grids[index].fields : []}
                  />
                </FormItem>
              </TabPane>
            );
          })}
        </Tabs>
      </Card>
    );
  }
}
