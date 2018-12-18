import React, { PureComponent } from 'react';
import { Row, Col, Tabs, Card } from 'antd';
import style from './index.less';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Allstaff from './allstaff';
import DepartmentTree from './departmentlist';

const { TabPane } = Tabs;
export default class extends PureComponent {
  state= {
    panes: [],
    activeKey: 'alldepartment',
  }


  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  setDepartment = (params) => {
    const { panes } = this.state;
    let pushAble = true;
    panes.forEach((item) => {
      if (item.key === params.id.toString()) {
        pushAble = false;
      }
    });
    const activeKey = `${params.id}`;
    if (pushAble) {
      panes.push({ title: params.name, key: activeKey });
    }
    this.setState({ panes: [...panes], activeKey });
  }
  tabsChange = (activeKey) => {
    this.setState({ activeKey });
  }

  remove = (targetKey) => {
    const { panes } = this.state;
    let { activeKey } = this.state;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    } else { activeKey = 'alldepartment'; }

    if (newPanes.length === 0) {
      activeKey = 'alldepartment';
    }
    this.setState({ panes: [...newPanes], activeKey });
  }

  render() {
    const { panes, activeKey } = this.state;
    return (
      <PageHeaderLayout>
        <Row gutter={10}>
          <Col span={4} >
            <Card className={style.departTree} bordered={false}>
              <p>选择部门</p>
              <div className={style.xuxian} />
              <DepartmentTree setDepartment={this.setDepartment} />
            </Card>
          </Col>
          <Col span={20}>
            <Card className={style.detail} bordered={false}>
              <Tabs
                tabPosition="left"
                hideAdd
                type="editable-card"
                activeKey={activeKey}
                onEdit={this.onEdit}
                onChange={this.tabsChange}
                className={style.alltab}
              >
                <TabPane
                  tab="全部"
                  closable={false}
                  key="alldepartment"
                >
                  <Allstaff departmentId="alldepartment" />
                </TabPane>
                {panes.map(pane => (
                  <TabPane tab={pane.title} key={pane.key}>
                    <Allstaff departmentId={pane.key} />
                  </TabPane>
                ))}
              </Tabs>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
