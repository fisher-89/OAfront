import React from 'react';
import { Tabs, Card } from 'antd';
import FlowTable from './flow';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

export default class extends React.PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false} style={{ minHeight: 400 }}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane key="1" tab="流程">
              <FlowTable />
            </Tabs.TabPane>
            <Tabs.TabPane key="2" tab="表单"></Tabs.TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
