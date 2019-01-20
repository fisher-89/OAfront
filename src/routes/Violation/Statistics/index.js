import React, { PureComponent } from 'react';
import { Row, Col, Tabs, Card } from 'antd';
import style from './index.less';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Allstaff from './allstaff';
import SingleDepart from './singledepart';
import DepartmentTree from './departmentlist';
import store from './store/store';

const { TabPane } = Tabs;
@store()
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
    const activeKey = `${params.id}`;
    panes.forEach((item) => {
      if (item.key === params.id.toString()) {
        pushAble = false;
      }
    });
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
    const { department,
      fetchStaffViolation,
      staffviolation,
      singleStaffPay,
      staffMultiPay,
      rule,
      ruleType,
      loading } = this.props;
    return (
      <PageHeaderLayout>
        <Row gutter={10} className={style.full}>
          <Col span={4} >
            <Card className={style.departTree} bordered={false}>
              <p className={style.biaoti}>选择部门</p>
              <div className={style.xuxian} />
              <DepartmentTree setDepartment={this.setDepartment} department={department} />
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
                  <Allstaff
                    fetchStaffViolation={fetchStaffViolation}
                    rule={rule}
                    staffMultiPay={staffMultiPay}
                    singleStaffPay={singleStaffPay}
                    ruleType={ruleType}
                    dataSource={staffviolation}
                    department={department}
                    loading={loading}
                  />
                </TabPane>
                {panes.map(pane => (
                  <TabPane tab={pane.title} key={pane.key}>
                    <SingleDepart
                      rule={rule}
                      ruleType={ruleType}
                      staffMultiPay={staffMultiPay}
                      singleStaffPay={singleStaffPay}
                      department={department}
                      departname={pane.title}
                      departmentId={pane.key}
                      dataSource={staffviolation}
                      loading={loading}
                      fetchStaffViolation={fetchStaffViolation}
                    />
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

