import React from 'react';
import { Tabs } from 'antd';
import CheckList from './List';
import styles from './index.less';

const { TabPane } = Tabs;
export default class extends React.PureComponent {
  state = {
    processing: false,
    approved: false,
  }

  handleDrawerVisible = (flag, modal) => {
    this.setState({
      [modal]: !!flag,
    });
  };

  handleVisible = () => {
    this.setState({
      processing: false,
      approved: false,
    });
  }

  render() {
    const { processing, approved } = this.state;
    return (
      <div className={styles.tabs}>
        <Tabs
          defaultActiveKey="1"
          onChange={() => this.handleVisible()}
        >
          <TabPane
            tab="待我审核的"
            key="1"
            forceRender
          >
            <CheckList onClose={this.handleDrawerVisible} visible={processing} type="processing" />
          </TabPane>
          <TabPane tab="我已审核的" key="2" forceRender>
            <CheckList onClose={this.handleDrawerVisible} visible={approved} type="approved" />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
