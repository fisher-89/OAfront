import React, { PureComponent } from 'react';
import {
  Tabs,
} from 'antd';
import {
  Educational,
  Position,
  Certificate,
  Seniority,
} from './Tables';
import { checkAuthority } from '../../../utils/utils';

const { TabPane } = Tabs;

export default class extends PureComponent {
  render() {
    const style = { maxHeight: 650, overflowY: 'scroll' };
    return (
      <Tabs style={{ overflow: 'visible' }} defaultActiveKey="4">
        <TabPane tab="学历" key="1" forceRender style={style}>
          {
            checkAuthority(158) ?
              (
                <Educational />
              ) : '暂无权限'
          }
        </TabPane>
        <TabPane tab="职位" key="2" forceRender style={style}>
          {
            checkAuthority(158) ?
              (
                <Position />
              ) : '暂无权限'
          }

        </TabPane>
        <TabPane tab="工龄" key="3" forceRender style={style}>
          {
            checkAuthority(158) ?
              (
                <Seniority />
              ) : '暂无权限'
          }
        </TabPane>
        <TabPane tab="证书" key="4" forceRender style={style}>
          {
            checkAuthority(159) ?
              (
                <Certificate />
              ) : '暂无权限'
          }
        </TabPane>
      </Tabs>
    );
  }
}
