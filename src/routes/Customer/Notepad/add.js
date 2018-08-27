import React from 'react';
import {
  Card,
  Tabs,
  Input,
  Button,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import OAForm, {
  SearchTable,
} from '../../../components/OAForm';

const FormItem = OAForm.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12, pull: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8, pull: 10 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 12, offset: 2 },
  },
};

const { TabPane } = Tabs;
@OAForm.create()
export default class extends React.PureComponent {
  render() {
    // const { form: { getFieldDecortor } } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <OAForm>
            <Tabs defaultActiveKey="1">
              <TabPane tab="记事本模板1" key="1">
                <FormItem label="标题" {...formItemLayout}>
                  <Input placeholder="请输入" />
                </FormItem>
                <FormItem label="内容" {...formItemLayout}>
                  <Input.TextArea placeholder="请输入" autosize={{ minRows: 10, maxRows: 10 }} />
                </FormItem>
                <FormItem label="关联客户" {...formItemLayout}>
                  <SearchTable.Staff placeholder="请输入" />
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit" style={{ width: 150 }}>保存</Button>
                </FormItem>
              </TabPane>
              <TabPane tab="记事本模板2" key="2">记事本模板2</TabPane>
              <TabPane tab="通用模板" key="3">通用模板</TabPane>
            </Tabs>
          </OAForm>
        </Card>
      </PageHeaderLayout>
    );
  }
}
