import React, { PureComponent } from 'react';
import { Input, Select, Button, Radio } from 'antd';
import OAForm, { Address } from '../../../components/OAForm';

const RadioGroup = Radio.Group;
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
        params[key] = [params[key]];
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
          {getFieldDecorator('gender', {
            initialValue: undefined,
          })(
            <RadioGroup>
              {sexOption.map(item =>
                (<Radio key={item.value} value={item.value}>{item.label}</Radio>))
              }
            </RadioGroup>
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
            <Address disabled={{ address: true }} />
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
                id_card_number: null,
                native_place: null,
                province_id: null,
                county_id: null,
                city_id: null,
              });
            }}
          >重置
          </Button>
        </div>
      </OAForm>
    );
  }
}
