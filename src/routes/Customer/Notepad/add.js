import React from 'react';
import {
  Tabs,
} from 'antd';
import NotepadForm from './form';

const { TabPane } = Tabs;
export default class extends React.PureComponent {
  render() {
    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab="记事本模板1" key="1">
          <NotepadForm {...this.props} />
        </TabPane>
      </Tabs>
    );
  }
}
