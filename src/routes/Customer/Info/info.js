import React from 'react';
import {
  // Card,
  Tabs,
  Button,
  Form,
} from 'antd';
import Notepad from '../Notepad/list';
import ActionLog from './log';
// import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

function CustomerInfo() {
  return (
    <React.Fragment>
      <FormItem label="客户姓名" {...formItemLayout}>马云</FormItem>
      <FormItem label="性别" {...formItemLayout}>男</FormItem>
      <FormItem label="籍贯" {...formItemLayout}>浙江</FormItem>
      <FormItem label="证件号码" {...formItemLayout}>888888888888888888</FormItem>
      <FormItem label="现住地址" {...formItemLayout}>四川省成都市武侯区益州大道中段1999号阿里中心</FormItem>
      <FormItem
        label="电话"
        {...formItemLayout}
      >
        13800000000
      </FormItem>
      <FormItem
        label="微信"
        {...formItemLayout}
      >
        13800000000
      </FormItem>
      <FormItem
        label="客户来源"
        {...formItemLayout}
      >
        主动上门
      </FormItem>
      <FormItem
        label="客户状态"
        {...formItemLayout}
      >
        正在合作
      </FormItem>
      <FormItem
        label="合作时间"
        {...formItemLayout}
      >
        2018-08-13
      </FormItem>
      <FormItem
        label="标签"
        {...formItemLayout}
      >
        VIP客户、省代、市代
      </FormItem>
      <FormItem
        label="备注"
        {...formItemLayout}
      >
        888888888888888888
      </FormItem>
      <FormItem
        label="维护人"
        {...formItemLayout}
      >
        张博涵
      </FormItem>
    </React.Fragment>
  );
}


const { TabPane } = Tabs;
export default class extends React.PureComponent {
  render() {
    // const { form: { getFieldDecortor } } = this.props;
    return (
      <React.Fragment>
        <Button icon="left">返回客户列表</Button>
        <Tabs defaultActiveKey="1" style={{ marginTop: 10 }}>
          <TabPane tab="基本信息" key="1" ><CustomerInfo /></TabPane>
          <TabPane tab="记事本" key="2">
            <Notepad type="user" />
          </TabPane>
          <TabPane tab="操作日志" key="3">
            <ActionLog type="user" />
          </TabPane>
        </Tabs>
      </React.Fragment>
    );
  }
}
