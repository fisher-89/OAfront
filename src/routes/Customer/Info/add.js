import React from 'react';
import {
  Col,
  Row,
  // Card,
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

// import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

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
  source: customer.source,
  tags: customer.tags,
  tagsType: customer.tagsType,
  loading: (
    loading.effects['customer/fetchSource'] ||
    loading.effects['customer/fetchTags'] ||
    loading.effects['customer/fetchTagsType'] ||
    loading.effects['customer/addCustomer']
  ),
}))
@OAForm.create()
export default class extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'customer/fetchSource' });
    dispatch({ type: 'customer/fetchTags' });
    dispatch({ type: 'customer/fetchTagsType' });
  }

  handleSubmit = (values, onError) => {
    const params = {
      ...values,
      vindicator_sn: values.vindicator.staff_sn || '',
      vindicator_name: values.vindicator.staff_name || '',
    };
    delete params.vindicator;
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/addCustomer',
      payload: params,
      onError: errors => onError(errors, { vindicator_name: 'vindicator' }),
    });
  }

  render() {
    const {
      tags, tagsType, source, form: { getFieldDecorator }, validateFields, validatorRequired,
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
    return (
      <OAForm onSubmit={validateFields(this.handleSubmit)}>
        <Row gutter={rowGutter}>
          <Col {...colSpan}>
            <FormItem label="客户姓名" {...formItemLayout} required>
              {getFieldDecorator('name', {
                initialValue: '',
                rules: [validatorRequired],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col {...colSpan}>
            <FormItem label="性别" {...formItemLayout} required>
              {getFieldDecorator('gender', {
                initialValue: '男',
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
            <FormItem label="名族" {...formItemLayout} required>
              {getFieldDecorator('nation', {
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
            <FormItem label="籍贯" {...formItemLayout} required>
              {getFieldDecorator('native_place', {
                rules: [validatorRequired],
              })(
                <Select placeholder="请选择">
                  {province.map(item =>
                    (<Option value={item.id} key={item.id}>{item.name}</Option>))
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
                initialValue: '',
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
                initialValue: {},
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
                initialValue: '',
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
                initialValue: '',
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
                rules: [validatorRequired],
              })(
                <Select placeholder="请选择">
                  {source.map(item =>
                    (<Option value={item.id} key={item.id}>{item.name}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...colSpan}>
            <FormItem label="客户状态" {...formItemLayout} required>
              {getFieldDecorator('status', {
                rules: [validatorRequired],
              })(
                <Select placeholder="请选择">
                  {customerStatus.map(item =>
                    (<Option value={item.id} key={item.id}>{item.name}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="合作时间" {...rowFormItemLayout} required>
              {getFieldDecorator('first_cooperation_at', {
                initialValue: '',
                rules: [validatorRequired],
              })(
                <DatePicker placeholder="请输入" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="标签" {...rowFormItemLayout}>
              {getFieldDecorator('tag_id', {
                initialValue: [],
              })(
                <Select optionFilterProp="children" mode="tags" tokenSeparators={[',']} placeholder="请选择">
                  {tagsGroup.map((item) => {
                    return item.children ? (
                      <OptGroup key={`${item.id}`} label={item.name}>
                        {item.children.map(tag => (<Option key={`${tag.id}`}>{tag.name}</Option>))}
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
                initialValue: '',
              })(
                <Input.TextArea />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col {...rowGutter}>
            <FormItem label="维护人" {...rowFormItemLayout}>
              {getFieldDecorator('vindicator', {
                initialValue: {},
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
