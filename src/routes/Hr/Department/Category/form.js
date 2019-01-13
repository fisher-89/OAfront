import React, { PureComponent } from 'react';
import {
  Input,
  Select,
} from 'antd';
import { connect } from 'dva';
import OAForm, { OAModal } from 'components/OAForm';

const { Option } = Select;
const FormItem = OAForm.Item;
const mapWithKey = [
  { key: 'minister_sn', name: '部长' },
  { key: 'province_id', name: '省份' },
  { key: 'area_manager_sn', name: '区域经理' },
  { key: 'regional_manager_sn', name: '大区经理' },
  { key: 'personnel_manager_sn', name: '人事负责人' },
];
@connect(({ loading }) => ({
  loading: (
    loading.effects['department/addCategory'] ||
    loading.effects['department/editCategory']
  ),
}))
@OAForm.create()
export default class extends PureComponent {
  handleSubmit = (params) => {
    const { dispatch, onError, onCancel } = this.props;
    dispatch({
      type: params.id ? 'department/editCategory' : 'department/addCategory',
      payload: params,
      onSuccess: onCancel(false),
      onError: error => onError(error),
    });
  }

  render() {
    const {
      visible,
      form,
      initialValue,
      onCancel,
      onClose,
      validateFields,
      validatorRequired,
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <OAModal
        form={form}
        title={initialValue.id ? '编辑分类' : '添加分类'}
        visible={visible}
        loading={this.props.loading}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => onCancel(false)}
        afterClose={onClose}
      >
        {initialValue.id ? getFieldDecorator('id', {
          initialValue: initialValue.id,
        })(
          <Input placeholder="请输入" type="hidden" />
        ) : null}

        <FormItem label="名称" {...formItemLayout} required>
          {getFieldDecorator('name', {
            initialValue: initialValue.name || '',
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>

        <FormItem label="分类字段" {...formItemLayout}>
          {getFieldDecorator('fields', {
            initialValue: initialValue.fields || [],
          })(
            <Select mode="multiple" placeholer="请选择">
              {mapWithKey.map((item) => {
                return (<Option key={item.key} value={item.key}>{item.name}</Option>);
              })}
            </Select>
          )}
        </FormItem>
      </OAModal>
    );
  }
}
