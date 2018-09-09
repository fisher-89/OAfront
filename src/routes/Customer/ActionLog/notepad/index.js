import React from 'react';
import { Tabs } from 'antd';
import NoteInfo from './Info';
import ChangeFields from './changeFields';
import store from '../store/store';

const { TabPane } = Tabs;

@store('fetchNoteLogs')
export default class extends React.PureComponent {
  render() {
    return (
      <Tabs defaultActiveKey="1" >
        <TabPane tab="详细信息" key="1"><NoteInfo /></TabPane>
        <TabPane tab="修改记录" key="2"><ChangeFields /></TabPane>
      </Tabs>
    );
  }
}
