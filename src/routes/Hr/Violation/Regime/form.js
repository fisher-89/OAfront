import React from 'react';
import {
  Input,
  InputNumber,
  Tabs,
} from 'antd';
import { connect } from 'dva';
import OAForm from '../../../../components/OAForm';
import Floated from './floated';

const { TabPane } = Tabs;

const FormItem = OAForm.Item;
const {
  InputTags,
} = OAForm;

@connect(({ violation, loading }) => ({
  details: violation.regimeDetails,
  loading: loading.effects['violation/fetchRegime'],
  updateLoading: loading.effects['violation/updateRegime'],
  addLoading: loading.effects['violation/addRegime'],
}))
@OAForm.Config
@OAForm.create({
  onValuesChange(props, fields, allValues) {
    props.onChange(allValues);
    Object.keys(fields).forEach(key => props.handleFieldsError(key));
  },
})
export default class RegimeForm extends React.PureComponent {
  constructor(props) {
    super(props);
    const { form, bindForm } = this.props;
    bindForm(form);
    const id = props.match.params.id ? props.match.params.id : null;
    this.state = {
      info: {},
      id,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.state;
    if (id) {
      dispatch({ type: 'violation/fetchRegime', payload: { id } });
    }
  }

  componentWillReceiveProps(newProps) {
    const { details } = newProps;
    const { id } = this.state;
    if (id && details !== this.props.details && details) {
      const info = details[id];
      this.setState({ info });
    }
  }

  getLocal = () => {
    const localValue = this.props.autoSave.getLocal();
    if (Object.keys(localValue || {}).length > 0) {
      this.setState({ info: { ...localValue } });
    }
  }

  handleSubmit = (values, onSuccess, onError) => {
    const { dispatch } = this.props;
    const { id } = this.state;
    dispatch({
      type: id ? 'violation/updateRegime' : 'violation/addRegime',
      payload: values,
      onSuccess,
      onError,
    });
  }

  handleOnSuccess = () => {

  }

  render() {
    const {
      loading,
      autoSave,
      updateLoading,
      form,
      form: { getFieldDecorator },
    } = this.props;
    const { info, id } = this.state;
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
    return (
      <OAForm
        onSubmitBtn
        autoSave={{
          ...autoSave,
          getLocal: this.getLocal,
        }}
        form={form}
        onSubmit={this.handleSubmit}
        onSuccess={this.handleOnSuccess}
        loading={(loading || updateLoading) === true}
      >
        {id && <input type="hidden" value={id} name="id" />}
        <Tabs defaultActiveKey="1">
          <TabPane tab="信息" key="1">
            <FormItem
              {...formItemLayout}
              label="名称"
              required
            >
              {getFieldDecorator('name', {
                initialValue: info.name || '',
                rules: [{ required: true, message: '必填内容' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="描述"
              required
            >
              {getFieldDecorator('description', {
                initialValue: info.description || '',
                rules: [{ required: true, message: '必填内容' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="排序"
            >
              {getFieldDecorator('sort', {
                initialValue: info.sort || 0,
              })(
                <InputNumber placeholder="请输入" min={0} />
              )}
            </FormItem>
          </TabPane>
          <TabPane tab="金额" key="2" forceRender>
            <FormItem
              {...formItemLayout}
              label="金额公式"
              required
            >
              {getFieldDecorator('formula', {
                initialValue: info.rule || '',
                rules: [{ required: true, message: '必填内容' }],
              })(
                <InputTags placeholder="请输入" />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="浮动数据"
            >
              <Floated
                name="amount"
                form={form}
                initialValue={info.amount || []}
              />
            </FormItem>
          </TabPane>
          <TabPane tab="积分" key="3" forceRender>
            <FormItem
              {...formItemLayout}
              label="积分公式"
              required
            >
              {getFieldDecorator('equation', {
                initialValue: info.equation || '',
                rules: [{ required: true, message: '必填内容' }],
              })(
                <InputTags placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="浮动数据"
            >
              <Floated
                name="point"
                form={form}
                initialValue={info.point || []}
              />
            </FormItem>
          </TabPane>
        </Tabs>
      </OAForm>
    );
  }
}
