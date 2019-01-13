import React, { Component } from 'react';
import {
  Card,
  Tabs,
} from 'antd';
import { connect } from 'dva';
import { find } from 'lodash';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
// 列表
import List from './list';
// 新增
import Add from './add';

const { TabPane } = Tabs;

@connect()
export default class Auth extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    this.dispatch = dispatch;
    // 初始添加的值
    this.newTabIndex = 0;
    // 初始panes
    const panes = [
      {
        title: '权限配置',
        key: '0',
        content: <List
          addRole={this.handleAddRole}
          updateRole={this.handleUpdateRole}
          deleteRole={this.handleDeleteRole}
        />,
        closable: false,
      },
    ];

    this.state = {
      activeKey: panes[0].key, // 当前key
      panes,
    };
  }

  // 切换
  onChange = (activeKey) => {
    this.setState({ activeKey });
  };
  // 新增与删除回调
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  // 删除pane
  remove = (targetKey) => {
    const { activeKey, panes } = this.state;
    let newActiveKey = activeKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && newActiveKey === targetKey) {
      newActiveKey = newPanes[lastIndex].key;
    }
    this.setState({
      panes: newPanes,
      activeKey: newActiveKey,
    });
  };

  // 新建角色
  handleAddRole = () => {
    const { panes } = this.state;
    const activeKey = `新建角色${this.newTabIndex += 1}`;
    panes.push({
      title: activeKey,
      key: activeKey,
      content: <Add onCancel={() => this.remove(activeKey)} />,
    });
    this.setState({
      panes,
      activeKey,
    });
  };
  // 编辑角色
  handleUpdateRole = (id, text) => {
    const { panes } = this.state;
    const activeKey = text.name;
    const check = find(panes, (pane) => {
      return pane.key === activeKey;
    });
    if (check) {
      this.setState({
        activeKey,
      });
    } else {
      panes.push({
        title: activeKey,
        key: activeKey,
        content: <Add onCancel={() => this.remove(activeKey)} data={text} />,
      });
      this.setState({
        panes,
        activeKey,
      });
    }
  };
  // 删除角色
  handleDeleteRole = (id) => {
    this.dispatch({
      type: 'workflow/authDelete',
      payload: id,
    });
  };

  render() {
    const { panes, activeKey } = this.state;
    const tabPane = panes.map(pane => (
      <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
        {pane.content}
      </TabPane>
    ));
    return (
      <PageHeaderLayout>
        <Card>
          <Tabs
            hideAdd
            type="editable-card"
            activeKey={activeKey}
            onEdit={this.onEdit}
            onChange={this.onChange}
          >
            {tabPane}
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
