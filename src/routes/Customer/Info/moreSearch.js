import React, { PureComponent } from 'react';
import { Input, Select, Button } from 'antd';
import { isArray } from 'lodash';
import OAForm, { Address } from '../../../components/OAForm';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 25 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 25 },
    sm: { span: 15 },
  },
};
const FormItem = OAForm.Item;
@OAForm.create()
export default class Search extends PureComponent {
  handleSubmit = (values) => {
    const { moreChange } = this.props;
    let params = { ...values };
    delete params.address;
    params = { ...params, ...values.address };
    Object.keys(params).forEach((key) => {
      if (!params[key]) {
        delete params[key];
      } else {
        params[key] = isArray(params[key]) ? params[key] : [params[key]];
      }
    });
    moreChange(params);
  }


  render() {
    const {
      nation,
      province,
      sexOption,
      moreChange,
      validateFields,
    } = this.props;
    const { getFieldDecorator, resetFields } = this.props.form;
    return (
      <OAForm
        style={{ minWidth: 500 }}
        onSubmit={validateFields(this.handleSubmit)}
      >
        <FormItem label="性别" {...formItemLayout} >
          {getFieldDecorator('gender')(
            <Select placeholder="请选择" mode="multiple">
              {sexOption.map(item =>
                (<Option key={item.value}>{item.value}</Option>))
              }
            </Select>
          )}
        </FormItem>
        <FormItem label="微信" {...formItemLayout}>
          {getFieldDecorator('wechat')(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="民族" {...formItemLayout}>
          {getFieldDecorator('nation')(
            <Select placeholder="请选择">
              {nation.map(item =>
                (<Option key={item.name}>{item.name}</Option>))
              }
            </Select>
          )}
        </FormItem>
        <FormItem label="籍贯" {...formItemLayout} >
          {getFieldDecorator('native_place')(
            <Select placeholder="请选择">
              {province.map(item =>
                (<Option key={`${item.name}`}>{item.name}</Option>))
              }
            </Select>
          )}
        </FormItem>
        <FormItem label="身份证号" {...formItemLayout} >
          {getFieldDecorator('id_card_number')(
            <Input placeholder="请输入身份证" />
          )}
        </FormItem>
        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark')(
            <Input.TextArea placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="现居地址" {...formItemLayout}>
          {getFieldDecorator('address')(
            <Address visibles={{ address: true }} />
          )}
        </FormItem>
        <div className="ant-table-filter-dropdown-btns">
          <Button htmlType="submit" type="primary">
            确定
          </Button>
          <Button
            className="ant-table-filter-dropdown-link clear"
            onClick={() => {
              resetFields();
              moreChange({
                id_card_number: undefined,
                native_place: undefined,
                province_id: undefined,
                county_id: undefined,
                city_id: undefined,
                gender: undefined,
              });
            }}
          >重置
          </Button>
        </div>
      </OAForm>
    );
  }
}
