import React, { PureComponent } from 'react';
import {
  Input,
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import OAForm, { OAModal } from '../../../../../components/OAForm';

const FormItem = OAForm.Item;
const { TextArea } = Input;

@connect(({ loading }) => ({
  loading: (
    loading.effects['point/addCertificate'] ||
    loading.effects['point/editCertificate']
  ),
}))
@OAForm.create()
export default class extends PureComponent {
  handleSubmit = (params) => {
    const { dispatch, onError } = this.props;
    dispatch({
      type: params.id ? 'point/editCertificate' : 'point/addCertificate',
      payload: params,
      onError,
      onSuccess: () => this.props.handleVisible(false),
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      handleVisible,
      visible,
      initialValue,
      onCancel,
      validateFields,
    } = this.props;
    const info = { ...initialValue };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <OAModal
        title="证书表单"
        visible={visible}
        loading={this.props.loading}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
      >
        {info.id ? (getFieldDecorator('id', {
          initialValue: info.id,
        }))(
          <Input type="hidden" placeholder="请输入" />
        ) : null}

        <FormItem {...formItemLayout} label="证书名称" required>
          {
            getFieldDecorator('name', {
              initialValue: info.name || '',
            })(
              <Input placeholder="请输入" />
            )
          }
        </FormItem>

        <FormItem {...formItemLayout} label="描述">
          {
            getFieldDecorator('description', {
              initialValue: info.description || '',
            })(
              <TextArea placeholder="请输入" />
            )
          }
        </FormItem>

        <FormItem {...formItemLayout} label="基础分">
          {
            getFieldDecorator('point', {
              initialValue: info.point || 0,
            })(
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>

      </OAModal>
    );
  }
}
