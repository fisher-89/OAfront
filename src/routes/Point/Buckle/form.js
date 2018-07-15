import React, { PureComponent } from 'react';
import {
  Input,
} from 'antd';
import { connect } from 'dva';
import OAForm from '../../../components/OAForm';

const { OAModal } = OAForm;
const FormItem = OAForm.Item;

@connect()

@OAForm.create({
  onValuesChange(props, fields, allFields) {
    props.onChange(allFields);
    Object.keys(fields).forEach(key => props.handleFieldsError(key));
  },
})
export default class Form extends PureComponent {
  componentDidMount() {
    const { form, bindForm } = this.props;
    bindForm(form);
  }

  handleSuccess = () => {
    this.props.handleVisible(false);
  }

  handleSubmit = (params, onError) => {
    const { dispatch } = this.props;
    dispatch({
      type: '',
      payload: params,
      onError,
      onSuccess: this.handleSuccess,
    });
  }

  render() {
    const {
      form,
      onError,
      visible,
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <OAModal
        form={form}
        title="任务表单"
        visible={visible}
        onSubmit={this.handleSubmit}
        onCancel={() => this.props.handleVisible(false)}
        formProps={{
          onError,
        }}
      >
        <FormItem
          {...formItemLayout}
          label="任务名称"
          required
        >
          {getFieldDecorator('name', {
            initialValue: '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="奖分下限"
        >
          {getFieldDecorator('awardBscore', {
            initialValue: '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="扣分下限"
        >
          {getFieldDecorator('cutBscore', {
            initialValue: '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="奖扣比例"
        >
          {getFieldDecorator('cutScale', {
            initialValue: '',
          })(
            <Input placeholder="请输入" addonAfter="%" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="奖扣人次"
        >
          {getFieldDecorator('awardCutOnePoint', {
            initialValue: '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="未完成任务扣分"
        >
          {getFieldDecorator('uncompletedOnePoint', {
            initialValue: '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
