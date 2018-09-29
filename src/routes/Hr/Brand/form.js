import React, { PureComponent } from 'react';
import {
  Input,
  Select,
} from 'antd';
import { connect } from 'dva';
import OAForm, {
  OAModal,
} from '../../../components/OAForm';

const FormItem = OAForm.Item;
const { Option } = Select;

@OAForm.create()
@connect(({ brand }) => ({ brand }))
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
      type: params.id ? 'brand/editBrand' : 'brand/addBrand',
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
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    return (
      <OAModal
        title={initialValue.id ? '编辑品牌' : '添加品牌'}
        visible={visible}
        loading={this.props.loading}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
      >
        {initialValue.id ? (getFieldDecorator('id', {
          initialValue: initialValue.id,
        }))(
          <Input type="hidden" placeholder="请输入" />
        ) : null}

        <FormItem {...formItemLayout} label="品牌名称" required>
          {
            getFieldDecorator('name', {
              initialValue: initialValue.name,
            })(
              <Input placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="是否公共品牌" >
          {getFieldDecorator('is_public', {
            initialValue: initialValue.is_public ? initialValue.is_public.toString() : '0',
          })(
            <Select
              showSearch
              placeholder="请选择"
            >
              <Option value="0">否</Option>
              <Option value="1">是</Option>
            </Select>
          )}
        </FormItem>
      </OAModal>
    );
  }
}
