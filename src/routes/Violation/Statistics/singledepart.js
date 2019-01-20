import React, { PureComponent, Fragment } from 'react';
import { Tabs, Divider, DatePicker } from 'antd';
import moment from 'moment';
import OATable from '../../../components/OATable';
import StaffInfo from './singlestaff';


const { TabPane } = Tabs;
const { MonthPicker } = DatePicker;
export default class extends PureComponent {
  state= {
    panes: [],
    month: moment().format('YYYYMM'),
    activeKey: 'allstaff',
    selectedRows: [],
    selectedRowKeys: [],
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows, selectedRowKeys });
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
    panes.forEach((item) => {
      if (item.key === info.staff_sn.toString()) {
        pushAble = false;
      }
    });
    const activeKey = `${info.staff_sn}`;
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
              <a disabled={disable} onClick={() => singleStaffPay(rowData.id)}>全部支付</a>
            </Fragment>
          );
        },
      },
    ];
    return columns;
  }

  selectMonth= (time) => {
    const { fetchStaffViolation, departmentId } = this.props;
    const month = time.format('YYYYMM');
    const item = { filters: '', page: 1, pagesize: 10, month, department_id: departmentId };
    this.setState({ month });
    fetchStaffViolation(item);
  }

  sendPay = (payload, onError) => {
    const { singleStaffPay } = this.props;
    let selectId = [];
    selectId = payload.map(item => item.id);
    singleStaffPay(selectId, onError);
    this.onSelectChange([], []);
  }

  fetchDataSource = (item) => {
    const { fetchStaffViolation, departmentId } = this.props;
    const { month } = this.state;
    const term = {
      filters: '',
      ...item,
      month,
      department_id: departmentId,
    };
    fetchStaffViolation(term);
  }

  makeExtraOperator = () => {
    const extra = [];
    extra.push((
      <MonthPicker
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
      departmentId,
      departname,
      dataSource,
      loading,
      staffMultiPay,
      fetchStaffViolation } = this.props;
    const { panes, month, activeKey, selectedRowKeys, selectedRows } = this.state;
    const realData = ({ ...dataSource }[departmentId] || {})[month];
    let excelExport = null;
    excelExport = { actionType: 'violation/downloadDepartmentExcel',
      fileName: `${month}月${departname}大爱记录.xlsx`,
      filter: `month=${month};department_id=${departmentId}` };
    let wholeMoney = 0;
    let paidMoney = 0;
    let wholeScore = 0;
    if (realData && realData.length > 1) {
      realData.forEach((item) => {
        wholeMoney += item.money;
        paidMoney += item.paid_money;
        wholeScore += item.score;
      });
    }

    const multiOperator = [
      {
        text: '已支付',
        action: (selectedRowsReal) => {
          this.sendPay(selectedRowsReal);
        },
      },
      {
        text: '清空选择',
        action: () => {
          this.onSelectChange([], []);
        },
      },
    ];

    const rowSelection = {
      selectedRows,
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.has_settle === 1,
      }),
    };
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
            dataSource={realData}
            multiOperator={multiOperator}
            excelExport={excelExport}
            rowSelection={rowSelection}
            extraOperator={this.makeExtraOperator()}
            loading={loading}
            fetchDataSource={this.fetchDataSource}
          />
          <p>部门大爱金额: {wholeMoney}元&nbsp;&nbsp;&nbsp;已支付金额：{paidMoney}元
          &nbsp;&nbsp;&nbsp; 部门总分值：{wholeScore}
          </p>
        </TabPane>
        {panes.map(pane => (
          <TabPane tab={pane.title} key={pane.key} >
            <StaffInfo
              ruleType={ruleType}
              rule={rule}
              id={pane.key}
              staffname={pane.title}
              dataSource={dataSource}
              staffMultiPay={staffMultiPay}
              time={pane.content}
              departmentId={departmentId}
              fetchStaffViolation={fetchStaffViolation}
            />
          </TabPane>
        ))}
      </Tabs>
    );
  }
}
