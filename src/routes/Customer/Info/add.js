import React from 'react';
import {
  Col,
  Row,
  Card,
  Input,
  Select,
  Button,
  Checkbox,
} from 'antd';
import OAForm, {
  Address,
  DatePicker,
} from '../../../components/OAForm';
import TagInput from '../../../components/TagInput';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const CheckboxGroup = Checkbox.Group;
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

@OAForm.create()
export default class extends React.PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Card title="基本信息" bordered={false}>
          <OAForm>
            <Row gutter={rowGutter}>
              <Col {...colSpan}>
                <FormItem label="客户姓名" {...formItemLayout}>
                  <Input placeholder="请输入" />
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="性别" {...formItemLayout}>
                  <CheckboxGroup options={sexOption} defaultValue={[1]} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...colSpan}>
                <FormItem label="名族" {...formItemLayout}>
                  <Select defaultValue="汉族" >
                    <Option value="汉族">汉族</Option>
                    <Option value="回族">回族</Option>
                    <Option value="苗族">苗族</Option>
                    <Option value="羌族">羌族</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="籍贯" {...formItemLayout}>
                  <Select defaultValue="四川" >
                    <Option value="四川">四川</Option>
                    <Option value="北京">北京</Option>
                    <Option value="上海">上海</Option>
                    <Option value="南京">南京</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...rowGutter}>
                <FormItem label="证件号码" {...rowFormItemLayout}>
                  <Input placeholder="请输入" />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...rowGutter}>
                <FormItem label="现住地址" {...rowFormItemLayout}>
                  <Address />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...rowGutter}>
                <FormItem label="电话" {...rowFormItemLayout}>
                  <Input placeholder="请输入" />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...rowGutter}>
                <FormItem label="微信" {...rowFormItemLayout}>
                  <Input placeholder="请输入" />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...colSpan}>
                <FormItem label="客户来源" {...formItemLayout}>
                  <Select defaultValue="天选" >
                    <Option value="天选">天选</Option>
                    <Option value="投票">投票</Option>
                    <Option value="抢位">抢位</Option>
                    <Option value="购物">购物</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="客户状态" {...formItemLayout}>
                  <Select defaultValue="死亡" >
                    <Option value="死亡">死亡</Option>
                    <Option value="活着">活着</Option>
                    <Option value="残疾">残疾</Option>
                    <Option value="正常">正常</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...rowGutter}>
                <FormItem label="合作时间" {...rowFormItemLayout}>
                  <DatePicker placeholder="请输入" style={{ width: '100%' }} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...rowGutter}>
                <FormItem label="标签" {...rowFormItemLayout}>
                  <TagInput />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...rowGutter}>
                <FormItem label="备注" {...rowFormItemLayout}>
                  <Input.TextArea />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...colSpan}>
                <FormItem label="维护人" {...formItemLayout}>
                  <Input />
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
