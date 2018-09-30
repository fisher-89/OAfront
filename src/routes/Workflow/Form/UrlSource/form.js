import React, { PureComponent } from 'react';
import { Input, message, Button, Select } from 'antd';
import store from '../store/urlSource';
import OAForm, { OAModal } from '../../../../components/OAForm';

const FormItem = OAForm.Item;
const { Option } = Select;

const fieldsItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 4 } },
  wrapperCol: { xs: { span: 24 }, lg: { span: 20 } },
};

@store(['submit', 'testUri'])
@OAForm.create()
export default class extends PureComponent {
  state = {
    apiTest: false,
    selectOption: [],
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValue !== this.props.initialValue) {
      if (nextProps.initialValue.id) this.handleTestLink(nextProps.initialValue);
    }
  }

  handleSubmit = (values, onError) => {
    const { submit, initialValue } = this.props;
    if (!this.state.apiTest) {
      message.error('请先进行接口测试!!');
      return;
    }
    submit({
      ...initialValue,
      ...values,
    }, onError, this.handleCancel);
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    this.setState({
      apiTest: false,
      selectOption: [],
    }, onCancel());
  }

  handleTestLink = (initialValue) => {
    const { getFieldValue } = this.props.form;
    const { testUri } = this.props;
    const url = getFieldValue('url') || initialValue.url;
    if (!url) {
      message.error('请输入接口地址!!');
    }
    testUri(url, () => {
      message.error('无效接口地址，请重新输入!!');
    }, (fields) => {
      if (!fields.length) {
        return;
      }
      if (JSON.stringify(fields) === JSON.stringify(this.state.selectOption)) {
        this.setState({ apiTest: true });
      }
      this.setState({ selectOption: fields, apiTest: true });
    });
  }

  render() {
    const {
      loading,
      visible,
      initialValue,
      validateFields,
      validatorRequired,
      form: { getFieldDecorator },
    } = this.props;

    const { apiTest } = this.state;
    return (
      <OAModal
        title="接口配置"
        visible={visible}
        loading={loading}
        onCancel={this.handleCancel}
        onSubmit={validateFields(this.handleSubmit)}
        actionType={initialValue.id !== undefined}
      >
        <FormItem label="名称" {...fieldsItemLayout} required>
          {getFieldDecorator('name', {
            initialValue: initialValue.name || '',
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="接口地址" {...fieldsItemLayout} required>
          {getFieldDecorator('url', {
            initialValue: initialValue.url || '',
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" onChange={() => { this.setState({ apiTest: false }); }} />
          )}
        </FormItem>
        <FormItem label="测试操作" {...fieldsItemLayout} required>
          <Button icon="link" type="primary" onClick={this.handleTestLink}>接口测试</Button>
        </FormItem>
        {apiTest && (
          <React.Fragment>
            <FormItem label="实际值" {...fieldsItemLayout} required>
              {getFieldDecorator('value', {
                initialValue: initialValue.value || undefined,
                rules: [validatorRequired],
              })(
                <Select>
                  {this.state.selectOption.map((item) => {
                    return <Option key={item}>{item}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label="显示文本" {...fieldsItemLayout} required>
              {getFieldDecorator('text', {
                initialValue: initialValue.text || undefined,
                rules: [validatorRequired],
              })(
                <Select>
                  {this.state.selectOption.map((item) => {
                    return <Option key={item}>{item}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </React.Fragment>
        )}
      </OAModal>
    );
  }
}
