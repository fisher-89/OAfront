import React, { PureComponent } from 'react';
import {
  Input,
  Select,
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import OAForm, {
  OAModal,
} from '../../../components/OAForm';

const FormItem = OAForm.Item;
const { Option } = Select;

@connect(({ brand, loading }) => ({
  brand: brand.brand,
  loading: (
    loading.effects['position/addPosition'] ||
    loading.effects['position/editPosition']
  ),
}))
@OAForm.create()
export default class extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'brand/fetchBrand' });
  }

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
      type: params.id ? 'position/editPosition' : 'position/addPosition',
      payload: body,
      onError: this.handleError,
      onSuccess: () => this.props.handleVisible(false),
    });
  }

  render() {
    const {
      brand,
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
    const brandVal = (initialValue.brands || []).map(item => item.id.toString());

    return (
      <OAModal
        title="职位表单"
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

        <FormItem {...formItemLayout} label="职位名称" required>
          {
            getFieldDecorator('name', {
              initialValue: initialValue.name,
            })(
              <Input placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="职级" required>
          {
            getFieldDecorator('level', {
              initialValue: initialValue.level,
            })(
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="是否公共职位" >
          {getFieldDecorator('is_public', {
            initialValue: initialValue.is_public,
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
        <FormItem {...formItemLayout} label="关联品牌" >
          {getFieldDecorator('brands', {
            initialValue: brandVal,
          })(
            <Select
              mode="multiple"
              placeholder="请选择"
            >
              {brand.map(item => (
                <Option key={`${item.id}`}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
      </OAModal>
    );
  }
}
