import React, { PureComponent } from 'react';
import {
  Input,
} from 'antd';
import { connect } from 'dva';
import OAForm, {
  OAModal,
} from '../../../components/OAForm';

const FormItem = OAForm.Item;

@connect(({ loading }) => ({
  loading: (
    loading.effects['position/addPosition'] ||
    loading.effects['position/editPosition']
  ),
}))
@OAForm.create()
export default class extends PureComponent {
  handleError = (error) => {
    const { onError } = this.props;
    onError(error);
  }

  handleSubmit = (params) => {
    const { dispatch } = this.props;
    const body = {
      ...params,
    };
    dispatch({
      type: params.id ? 'position/addPosition' : 'point/addPosition',
      payload: body,
      onError: this.handleError,
      onSuccess: () => this.props.handleVisible(false),
    });
  }

  render() {
    const {
      handleVisible,
      visible,
      initialValue,
      onCancel,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;
    const info = { ...initialValue };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <OAModal
        title="职位表单"
        visible={visible}
        loading={this.props.loading}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
      >
        {info.id ? (getFieldDecorator('id', {
          initialValue: initialValue.id,
        }))(
          <Input type="hidden" placeholder="请输入" />
        ) : null}

        <FormItem {...formItemLayout} label="职位名称" required>
          {
            getFieldDecorator('point_a_awarding_limit', {
              initialValue: initialValue.name,
            })(
              <Input placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>

      </OAModal>
    );
  }
}
