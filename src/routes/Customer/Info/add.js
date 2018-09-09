import React from 'react';
import {
  Col,
  Row,
  Input,
  Select,
  Button,
  Radio,
} from 'antd';
import { connect } from 'dva';
import OAForm, {
  Address,
  DatePicker,
  SearchTable,
} from '../../../components/OAForm';
import { nation } from '../../../assets/nation';
import { province } from '../../../assets/province';
import { customerStatus } from '../../../assets/customer';
import store from './store/store';

const RadioGroup = Radio.Group;
const FormItem = OAForm.Item;
const { Option, OptGroup } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const rowFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 12,
    },
  },
};

const rowGutter = { sm: 16, lg: 8 };
const colSpan = { sm: rowGutter.sm / 2, lg: rowGutter.lg / 2 };

const sexOption = [
  { label: '男', value: '男' },
  { label: '女', value: '女' },
];

@connect(({ customer, loading }) => ({
  tagsType: customer.tagsType,
  details: customer.customerDetails,
  loading: (
    loading.effects['brand/fetchBrand'] ||
    loading.effects['customer/fetchTags'] ||
    loading.effects['customer/fetchSource'] ||
    loading.effects['customer/fetchTagsType'] ||
    loading.effects['customer/fetchCustomer'] ||
    loading.effects['customer/editCustomer'] ||
    loading.effects['customer/addCustomer']
  ),
}))
@OAForm.create()
@store
export default class extends React.PureComponent {
  componentDidMount() {
    const { fetchTagsType, fetch, match } = this.props;
    const { id } = match.params;
    if (id) { this.id = id; fetch({ id }); }
    fetchTagsType();
  }

  handleSubmit = (values, onError) => {
    const { add, edit } = this.props;
    if (this.id) {
      edit({ id: this.id, ...values }, onError);
    } else {
      add(values, onError);
    }
  }

  render() {
    const {
      tags,
      source,
      brands,
      tagsType,
      staffBrandsAuth,
      validateFields, validatorRequired,
      form: { getFieldDecorator },
    } = this.props;
    let tagsGroup = [];
    const tagsTypeId = tagsType.map(type => type.id);
    const tagsGroupAble = tags.filter(tag => tagsTypeId.indexOf(tag.type_id) === -1);
    tagsType.forEach((type) => {
      const temp = { ...type };
      temp.children = [];
      tags.forEach((tag) => {
        if (tag.type_id === type.id) {
          temp.children.push(tag);
        }
      });
      if (temp.children.length) tagsGroup.push(temp);
    });
    tagsGroup = tagsGroup.concat(tagsGroupAble);
    const { details } = this.props;
    let initialValue = {};
    let brandValue;
    if (details[this.id]) {
      initialValue = details[this.id];
      brandValue = initialValue.brands.map(item => `${item.brand_id}`);
    }
    const staffBransData = brands.filter(item => staffBrandsAuth.indexOf(item.id) !== -1);
    return (
      <OAForm onSubmit={validateFields(this.handleSubmit)}>
        <Row gutter={rowGutter}>
          <Col {...colSpan}>
            <FormItem label="客户姓名" {...formItemLayout} required>
              {getFieldDecorator('name', {
                initialValue: initialValue.name || '',
                rules: [validatorRequired],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col {...colSpan}>
            <FormItem label="性别" {...formItemLayout} required>
              {getFieldDecorator('gender', {
                initialValue: initialValue.gender || '男',
                rules: [validatorRequired],
              })(
                <RadioGroup>
                  {sexOption.map(item =>
                    (<Radio key={item.value} value={item.value}>{item.label}</Radio>))
                  }
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...colSpan}>
            <FormItem label="民族" {...formItemLayout} required>
              {getFieldDecorator('nation', {
                initialValue: initialValue.nation || undefined,
                rules: [validatorRequired],
              })(
                <Select placeholder="请选择">
                  {nation.map(item =>
                    (<Option key={item.name}>{item.name}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...colSpan}>
            <FormItem label="籍贯" {...formItemLayout} >
              {getFieldDecorator('native_place', {
                initialValue: initialValue.native_place || undefined,
                // rules: [validatorRequired],
              })(
                <Select placeholder="请选择">
                  {province.map(item =>
                    (<Option key={`${item.name}`}>{item.name}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="身份证号码" {...rowFormItemLayout} required>
              {getFieldDecorator('id_card_number', {
                initialValue: initialValue.id_card_number || '',
                rules: [validatorRequired],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="现住地址" {...rowFormItemLayout}>
              {getFieldDecorator('present_address', {
                initialValue: initialValue.present_address || {},
              })(
                <Address />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="电话" {...rowFormItemLayout} required>
              {getFieldDecorator('mobile', {
                initialValue: initialValue.mobile || '',
                rules: [validatorRequired],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="微信" {...rowFormItemLayout}>
              {getFieldDecorator('wechat', {
                initialValue: initialValue.wechat || '',
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...colSpan}>
            <FormItem label="客户来源" {...formItemLayout} required>
              {getFieldDecorator('source_id', {
                initialValue: initialValue.source_id ? `${initialValue.source_id}` : undefined,
                rules: [validatorRequired],
              })(
                <Select placeholder="请选择">
                  {source.map(item =>
                    (<Option key={`${item.id}`}>{item.name}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...colSpan}>
            <FormItem label="客户状态" {...formItemLayout} required>
              {getFieldDecorator('status', {
                initialValue: initialValue.status !== undefined ? `${initialValue.status}` : undefined,
                rules: [validatorRequired],
              })(
                <Select placeholder="请选择">
                  {customerStatus.map(item =>
                    (<Option key={`${item.id}`}>{item.name}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...colSpan}>
            <FormItem label="合作品牌" {...formItemLayout} required>
              {getFieldDecorator('brands', {
                initialValue: brandValue || [],
                rules: [validatorRequired],
              })(
                <Select placeholder="请选择" mode="multiple">
                  {staffBransData.map(item =>
                    (<Option key={`${item.id}`}>{item.name}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...colSpan}>
            <FormItem label="初次合作时间" {...formItemLayout}>
              {getFieldDecorator('first_cooperation_at', {
                initialValue: initialValue.first_cooperation_at || '',
              })(
                <DatePicker placeholder="请输入" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="标签" {...rowFormItemLayout}>
              {getFieldDecorator('tags', {
                initialValue: initialValue.tags ? initialValue.tags.map(item => `${item.tag_id}`) : [],
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择"
                >
                  {tagsGroup.map((item) => {
                    return item.children ? (
                      <OptGroup key={`${item.id}`} label={item.name}>
                        {item.children.map(tag => (<Option key={`${tag.id}`} value={`${tag.id}`}>{tag.name}</Option>))}
                      </OptGroup>
                    ) :
                      (
                        <Option key={`${item.id}`}>{item.name}</Option>
                      );
                  })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="备注" {...rowFormItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: initialValue.remark || '',
              })(
                <Input.TextArea placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="维护人" {...rowFormItemLayout}>
              {getFieldDecorator('vindicator', {
                initialValue:
                  initialValue.vindicator_sn ? {
                    staff_sn: initialValue.vindicator_sn,
                    staff_name: initialValue.vindicator_name,
                  } : {},
              })(
                <SearchTable.Staff />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...colSpan}>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" style={{ width: 150 }}>保存</Button>
            </FormItem>
          </Col>
        </Row>
      </OAForm>
    );
  }
}
