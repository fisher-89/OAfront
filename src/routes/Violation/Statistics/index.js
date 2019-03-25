import React, { PureComponent } from 'react';
import { Row, Col, Tabs, Card, DatePicker, Select } from 'antd';
import moment from 'moment';
import style from './index.less';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Allstaff from './allstaff';
import SingleDepart from './singledepart';
import DepartmentTree from './departmentlist';
import store from './store/store';

const { TabPane } = Tabs;
const { MonthPicker } = DatePicker;
const { Option } = Select;
@store()
export default class extends PureComponent {
  state = {
    panes: [],
    activeKey: 'alldepartment',
    month: moment().format('YYYYMM'),
    area: '1',
  }

  componentWillMount() {
    const { fetchFineDepartment } = this.props;
    const { month, area } = this.state;
    const params = {
      month,
      area,
    };
    fetchFineDepartment(params);
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

  filterDepart = (value, sub) => {
    const { department } = this.props;
    const [midkey] = department.filter(item => item.id === value);
    sub.push(midkey);
    if ((midkey || []).parent_id) {
      this.filterDepart(midkey.parent_id, sub);
    }
  }

  fineDepart = () => {
    const sub = [];
    const { finedepartment } = this.props;
    if (finedepartment.length) {
      finedepartment.forEach((item) => {
        this.filterDepart(item, sub);
      });
    }
    return sub;
  }

  selectMonth= (time) => {
    const { fetchFineDepartment } = this.props;
    const month = time.format('YYYYMM');
    const { area } = this.state;
    const item = { month, area };
    this.setState({ month });
    fetchFineDepartment(item);
  }

  selectArea = (area) => {
    const { fetchFineDepartment } = this.props;
    const { month } = this.state;
    const params = { month, area };
    this.setState({ area });
    fetchFineDepartment(params);
  }

  render() {
    const { panes, activeKey, area, month } = this.state;
    const { department,
      fetchStaffViolation,
      staffviolation,
      singleStaffPay,
      staffMultiPay,
      rule,
      ruleType,
      loading } = this.props;
    const finedepart = this.fineDepart();
    return (
      <PageHeaderLayout>
        <Row gutter={10} className={style.full}>
          <Col span={4} >
            <Card className={style.departTree} bordered={false}>
              <Select onChange={this.selectArea} style={{ width: 80 }} value={area} >
                <Option value="1" key="1">成都</Option>
                <Option value="2" key="2">濮院</Option>
                <Option value="3" key="3">市场</Option>
              </Select>
              <MonthPicker
                allowClear={false}
                key="monthPicker"
                defaultValue={moment()}
                style={{ width: 120 }}
                onChange={this.selectMonth}
              />
              <div className={style.xuxian} />
              <DepartmentTree
                setDepartment={this.setDepartment}
                finedepart={finedepart}
              />
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
                      defaultMonth={month}
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

