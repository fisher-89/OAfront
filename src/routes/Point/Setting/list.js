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
import { customerAuthority } from '../../../utils/utils';

const { TabPane } = Tabs;

export default class extends PureComponent {
  render() {
    return (
      <Tabs>
        <TabPane tab="学历" key="1" forceRender>
          {
            customerAuthority(158) ?
              (
                <Educational />
              ) : '暂无权限'
          }
        </TabPane>
        <TabPane tab="职位" key="2" forceRender>
          {
            customerAuthority(158) ?
              (
                <Position />
              ) : '暂无权限'
          }

        </TabPane>
        <TabPane tab="工龄" key="3" forceRender>
          {
            customerAuthority(158) ?
              (
                <Seniority />
              ) : '暂无权限'
          }
        </TabPane>
        <TabPane tab="证书" key="4" forceRender>
          {
            customerAuthority(159) ?
              (
                <Certificate />
              ) : '暂无权限'
          }
        </TabPane>
      </Tabs>
    );
  }
}
