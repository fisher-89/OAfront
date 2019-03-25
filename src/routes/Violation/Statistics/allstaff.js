import React, { PureComponent, Fragment } from 'react';
import { Tabs, Divider, DatePicker } from 'antd';
import moment from 'moment';
import OATable from '../../../components/OATable';
import PayDom from './paydom';
import StaffInfo from './singlestaff';


const { TabPane } = Tabs;
const { MonthPicker } = DatePicker;
export default class extends PureComponent {
  state= {
    month: moment().format('YYYYMM'),
    panes: [],
    activeKey: 'allstaff',
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
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
    } else { activeKey = 'allstaff'; }

    if (newPanes.length === 0) {
      activeKey = 'allstaff';
    }
    this.setState({ panes: [...newPanes], activeKey });
  }

  staffInfo = (info) => {
    const { panes, month } = this.state;
    let pushAble = true;
    const activeKey = `${info.staff_sn}`;
    panes.forEach((item) => {
      if (item.key === info.staff_sn.toString()) {
        pushAble = false;
      }
    });

    if (pushAble) {
      panes.push({ title: info.staff_name, content: month, key: activeKey });
    }
    this.setState({ panes: [...panes], activeKey });
  }

  makeColumns = () => {
    const { singleStaffPay, department, loading } = this.props;
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'staff_name',
      },
      {
        title: '品牌',
        dataIndex: 'brand_name',
      },
      {
        title: '部门',
        loading,
        dataIndex: 'department_id',
        render: key => OATable.findRenderKey(department, key).full_name,
      },
      {
        title: '大爱总金额',
        dataIndex: 'money',
      },
      {
        title: '已支付金额',
        dataIndex: 'paid_money',
        render: key => (key || '0'),
      },
      {
        title: '总分值',
        dataIndex: 'score',
      },
      {
        title: '是否结清',
        dataIndex: 'has_settle',
        render: key => (key ? '结清' : '未结清'),
      },
      {
        title: '操作',
        render: (rowData) => {
          const disable = rowData.money === rowData.paid_money;
          return (
            <Fragment>
              <a onClick={() => this.staffInfo(rowData)}>查看</a>
              <Divider type="vertical" />
              <PayDom disabled={disable} id={rowData.id} payFine={singleStaffPay} paytext="全部支付" />
            </Fragment>
          );
        },
      },
    ];
    return columns;
  }

  selectMonth= (time) => {
    const { fetchStaffViolation } = this.props;
    const month = time.format('YYYYMM');
    const item = { filters: '', page: 1, pagesize: 10, month, department_id: 'all' };
    this.setState({ month });
    fetchStaffViolation(item);
  }

  fetchDataSource = (item) => {
    const { fetchStaffViolation } = this.props;
    const { month } = this.state;
    const term = {
      ...item,
      month,
      department_id: 'all',
    };
    fetchStaffViolation(term);
  }

  makeExtraOperator = () => {
    const extra = [];
    extra.push((
      <MonthPicker
        allowClear={false}
        key="monthPicker"
        defaultValue={moment()}
        placeholder="Select month"
        onChange={this.selectMonth}
      />
    ));
    return extra;
  }

  render() {
    const {
      rule,
      ruleType,
      dataSource,
      loading,
      staffMultiPay,
      fetchStaffViolation } = this.props;
    const { panes, month, activeKey } = this.state;
    const realData = ({ ...dataSource }.all || {})[month];
    let excelExport = null;
    excelExport = { actionType: 'violation/downloadDepartmentExcel',
      fileName: `${month}月大爱记录.xlsx`,
      filter: `month=${month}` };
    return (
      <Tabs
        hideAdd
        type="editable-card"
        activeKey={activeKey}
        onEdit={this.onEdit}
        onChange={this.tabsChange}
      >
        <TabPane
          tab="全员"
          key="allstaff"
          closable={false}
        >
          <OATable
            columns={this.makeColumns()}
            dataSource={{ ...realData }.data}
            serverSide
            excelExport={excelExport}
            total={{ ...realData }.total}
            extraOperator={this.makeExtraOperator()}
            loading={loading}
            fetchDataSource={this.fetchDataSource}
          />
        </TabPane>
        {panes.map(pane => (
          <TabPane tab={pane.title} key={pane.key} >
            <StaffInfo
              staffMultiPay={staffMultiPay}
              ruleType={ruleType}
              rule={rule}
              dataSource={dataSource}
              staffname={pane.title}
              id={pane.key} // id是staff_sn
              time={pane.content}
              fetchStaffViolation={fetchStaffViolation}
              departmentId="all"
            />
          </TabPane>
        ))}
      </Tabs>
    );
  }
}
