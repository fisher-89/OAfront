import React, { PureComponent } from 'react';
import { Input, Select } from 'antd';
import { connect } from 'dva';
import OAForm, { OAModal } from '../../../components/OAForm';


const FormItem = OAForm.Item;

const formItemLayout =
  {
    labelCol: { span: 8, pull: 3 },
    wrapperCol: { span: 16, pull: 3 },
  };
  @connect(({ expense, brand, loading }) => ({
    brands: brand.brand,
    expense: expense.expense,
    loading: (
      loading.effects['expense/addExpense'] ||
      loading.effects['expense/editExpense']
    ),
  }))
@OAForm.create()
export default class extends PureComponent {
    componentDidMount() {
      const { dispatch } = this.props;
      dispatch({ type: 'brand/fetchBrand' });
    }
  handleSubmit = (params) => {
    const { dispatch, onError } = this.props;
    dispatch({
      type: params.id ? 'expense/editExpense' : 'expense/addExpense',
      payload: params,
      onError: (error) => {
        onError(error, {
          name: 'name',
          brands: 'brands',
        });
      },
      onSuccess: () => this.props.handleVisible(false),
    });
  }
  render() {
    const {
      visible,
      brands,
      onCancel,
      handleVisible,
      initialValue,
      validateFields,
      validatorRequired,
      form: { getFieldDecorator },
    } = this.props;
    const info = { ...initialValue };
    const brandId = (info.brands || []).map(item => item.id.toString());
    return (
      <OAModal
        loading={this.props.loading}
        title="费用品牌"
        visible={visible}
        actionType={info.id !== undefined}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
      >
        {info.id ? (getFieldDecorator('id', {
          initialValue: info.id,
        }))(
          <Input type="hidden" placeholder="请输入" />
        ) : null}
        <FormItem label="名称" {...formItemLayout} required>
          {getFieldDecorator('name', {
            initialValue: info.name || [],
            rules: [validatorRequired],
          })(
            <Input placeholder="请输入" />
            )}
        </FormItem>
        <FormItem label="品牌" {...formItemLayout}>
          {getFieldDecorator('brands', {
            initialValue: brandId || [],
          })(
            <Select mode="multiple" placeholder="请选择" >
              {brands.map(item => (
                <Select.Option key={`${item.id}`}>
                  {item.name}
                </Select.Option>
            ))}
            </Select>
          )}
        </FormItem>
      </OAModal>
    );
  }
  }
