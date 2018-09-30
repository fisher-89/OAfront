import React, { PureComponent } from 'react';
import {
  Input,
} from 'antd';
import { connect } from 'dva';
import OAForm, { OAModal } from '../../../components/OAForm';

const FormItem = OAForm.Item;

@connect(({ loading }) => ({
  loading: (
    loading.effects['point/addTargets'] ||
    loading.effects['point/editTargets']
  ),
}))
@OAForm.create()
export default class Form extends PureComponent {
  handleSuccess = () => {
    this.props.handleVisible(false);
  }

  handleSubmit = (params) => {
    const { dispatch, onError } = this.props;
    dispatch({
      type: params.id ? 'point/editTargets' : 'point/addTargets',
      payload: params,
      onError,
      onSuccess: this.handleSuccess,
    });
  }

  render() {
    const {
      visible,
      initialValue,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <OAModal
        title="任务"
        visible={visible}
        loading={this.props.loading}
        actionType={initialValue.id !== undefined}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => this.props.handleVisible(false)}
      >
        <FormItem
          {...formItemLayout}
          label="任务名称"
          required
        >
          {getFieldDecorator('name', {
            initialValue: initialValue.name || '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="奖分下限"
        >
          {getFieldDecorator('point_b_awarding_target', {
            initialValue: initialValue.point_b_awarding_target || '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="扣分下限"
        >
          {getFieldDecorator('point_b_deducting_target', {
            initialValue: initialValue.point_b_deducting_target || '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="奖扣比例"
        >
          {getFieldDecorator('deducting_percentage_target', {
            initialValue: initialValue.deducting_percentage_target || '',
          })(
            <Input placeholder="请输入" addonAfter="%" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="奖扣人次"
        >
          {getFieldDecorator('event_count_target', {
            initialValue: initialValue.event_count_target || '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
