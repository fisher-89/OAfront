import React, { PureComponent, Fragment } from 'react';
import { Tabs, Divider, DatePicker } from 'antd';
import OATable from '../../../components/OATable';
import store from './store/store';
import StaffInfo from './singlestaff';

const { TabPane } = Tabs;
const { MonthPicker } = DatePicker;
@store()
export default class extends PureComponent {
  state= {
    panes: [],
    activeKey: 'allstaff',
    departs: [],
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
    const { panes } = this.state;
    let pushAble = true;
    panes.forEach((item) => {
      if (item.key === info.id.toString()) {
        pushAble = false;
      }
    });
    const activeKey = `${info.id}`;
    if (pushAble) {
      panes.push({ title: info.staff_name, key: activeKey });
    }
    this.setState({ panes: [...panes], activeKey });
  }

  findStaffInfo = (id) => {
    const { staffviolation } = this.props;
    return OATable.findRenderKey(staffviolation, id);
  }

  singleStaffPay = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'violation/editSinglePayment', payload: params });
  }

  makeColumns = () => {
    const { brand, department, loading } = this.props;
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
        loading,
        dataIndex: 'brand_name',
        render: (_, record) => {
          const [brandId] = department.filter(item => item.id === record.department_id);
          const [bd] = brand.filter(item => item.id === brandId.brand_id);
          return (bd || {}).name;
        },
      },
      {
        title: '部门',
        dataIndex: 'department_id',
        render: key => OATable.findRenderKey(department, key).name,
      },
      {
        title: '大爱总金额',
        dataIndex: 'money',
      },
      {
        title: '已支付金额',
        dataIndex: 'paid_money',
      },
      {
        title: '总分值',
        dataIndex: 'score',
      },
      {
        title: '是否结清',
        render: (rowData) => {
          if (rowData.paid_money === rowData.money) {
            return '结清';
          } else { return '未结清'; }
        },
      },
      {
        title: '操作',
        render: (rowData) => {
          return (
            <Fragment>
              <a onClick={() => this.staffInfo(rowData)}>查看</a>
              <Divider type="vertical" />
              <a onClick={() => this.singleStaffPay([rowData.id])}>全部支付</a>
            </Fragment>
          );
        },
      },
    ];
    return columns;
  }

  filterDepart = (departmentId) => {
    const { department } = this.props;
    const { departs } = this.state;
    const sonDepart = department.filter(item => item.parent_id === departmentId);
    if (sonDepart) {
      sonDepart.forEach((item) => {
        departs.push(item.id);
        this.filterDepart(item.id);
      });
    }
  }

  selectMonth= () => {
  }

  filterStaff = (departmentId) => {
    const departId = parseInt(departmentId, 10);
    const { departs } = this.state;
    this.state.departs = [departId];
    this.filterDepart(departId);
    const { staffviolation } = this.props;
    let departarr = [];
    if (departmentId !== 'alldepartment') {
      departs.forEach((id) => {
        const newarr = staffviolation.filter(item => item.department_id === id);
        departarr.push(...newarr);
      });
    } else {
      departarr = staffviolation;
    }
    return departarr;
  }

  makeExtraOperator = () => {
    const extra = [];
    extra.push((
      <MonthPicker
        key="monthPicker"
        placeholder="Select month"
        onChange={this.selectMonth}
      />
    ));
    return extra;
  }

  render() {
    const { departmentId, fetchStaffViolation, loading } = this.props;
    const { panes, activeKey } = this.state;
    let excelExport = null;
    excelExport = { actionType: 'violation/downloadExcelFinLog', fileName: '大爱记录.xlsx' };
    const fulldepart = departmentId === 'alldepartment';
    return (
      <Tabs
        hideAdd
        type="editable-card"
        activeKey={activeKey}
        onEdit={this.onEdit}
        onChange={this.tabsChange}
      >
        <TabPane
          tab="全部"
          key="allstaff"
          closable={false}
        >
          <OATable
            columns={this.makeColumns()}
            dataSource={this.filterStaff(departmentId)}
            fetchDataSource={fetchStaffViolation}
            excelExport={excelExport}
            extraOperator={this.makeExtraOperator()}
            loading={loading}
          />
          <p hidden={fulldepart}>部门大爱金额: &nbsp;&nbsp;&nbsp;已支付金额：&nbsp;&nbsp;&nbsp; 部门总分值：</p>
        </TabPane>
        {panes.map(pane => (
          <TabPane tab={pane.title} key={pane.key} >
            <StaffInfo
              data={this.findStaffInfo(pane.key)}
            />
          </TabPane>
        ))}
      </Tabs>
    );
  }
}
