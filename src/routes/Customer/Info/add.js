import React from 'react';
import {
  Col,
  Row,
  Card,
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

import TagInput from '../../../components/TagInput';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const RadioGroup = Radio.Group;
const FormItem = OAForm.Item;
const { Option } = Select;

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
  { label: '男', value: 1 },
  { label: '女', value: 0 },
];

@connect(({ customer, loading }) => ({
  source: customer.source,
  loading: (
    loading.effects['customer/fetchSource']
  ),
}))
@OAForm.create()
export default class extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'customer/fetchSource' });
  }

  render() {
    const { source, form: { getFieldDecorator } } = this.props;
    return (
      <PageHeaderLayout>
        <Card title="基本信息" bordered={false}>
          <OAForm>
            <Row gutter={rowGutter}>
              <Col {...colSpan}>
                <FormItem label="客户姓名" {...formItemLayout}>
                  {getFieldDecorator('name', {})(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="性别" {...formItemLayout}>
                  {getFieldDecorator('gender', {
                    initialValue: 1,
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
                <FormItem label="名族" {...formItemLayout}>
                  {getFieldDecorator('nation', {})(
                    <Select>
                      {nation.map(item =>
                        (<Option value={item.id} key={item.id}>{item.name}</Option>))
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="籍贯" {...formItemLayout}>
                  {getFieldDecorator('native_place', {})(
                    <Select>
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
                <FormItem label="身份证号码" {...rowFormItemLayout}>
                  {getFieldDecorator('id_card_number', {})(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...rowGutter}>
                <FormItem label="现住地址" {...rowFormItemLayout}>
                  {getFieldDecorator('present_address', {})(
                    <Address />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...rowGutter}>
                <FormItem label="电话" {...rowFormItemLayout}>
                  {getFieldDecorator('mobile', {})(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...rowGutter}>
                <FormItem label="微信" {...rowFormItemLayout}>
                  {getFieldDecorator('wechat', {})(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...colSpan}>
                <FormItem label="客户来源" {...formItemLayout}>
                  {getFieldDecorator('source_id', {})(
                    <Select>
                      {source.map(item =>
                        (<Option value={item.id} key={item.id}>{item.name}</Option>))
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="客户状态" {...formItemLayout}>
                  {getFieldDecorator('status', {})(
                    <Select>
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
                <FormItem label="合作时间" {...rowFormItemLayout}>
                  {getFieldDecorator('first_cooperation_at', {})(
                    <DatePicker placeholder="请输入" style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...rowGutter}>
                <FormItem label="标签" {...rowFormItemLayout}>
                  {getFieldDecorator('tag_id', {})(
                    <TagInput />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...rowGutter}>
                <FormItem label="备注" {...rowFormItemLayout}>
                  {getFieldDecorator('remark', {})(
                    <Input.TextArea />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...rowGutter}>
                <FormItem label="维护人" {...rowFormItemLayout}>
                  {getFieldDecorator('vindicator', {})(
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
        </Card>
      </PageHeaderLayout>
    );
  }
}
