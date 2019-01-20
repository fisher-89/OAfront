import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import OATable from '../../../components/OATable';

const { MonthPicker } = DatePicker;
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      month: props.time,
      selectedRows: [],
      selectedRowKeys: [],
    };
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows, selectedRowKeys });
  }

  makeColumns = () => {
    const { rule, ruleType, loading } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '大爱类型',
        dataIndex: 'updated_at',
        loading,
        render: (_, record) => {
          const type = OATable.findRenderKey(rule, record.rule_id).type_id;
          return OATable.findRenderKey(ruleType, type).name;
        },

      },
      {
        title: '大爱原因',
        dataIndex: 'rule_id',
        render: key => OATable.findRenderKey(rule, key).name,
      },
      {
        title: '违纪日期',
        dataIndex: 'violate_at',
      },
      {
        title: '当月次数',
        dataIndex: 'quantity',
      },
      {
        title: '大爱金额',
        dataIndex: 'money',
      },
      {
        title: '分值',
        dataIndex: 'score',
      },
      {
        title: '支付时间',
        dataIndex: 'paid_at',
      },
      {
        title: '开单人',
        dataIndex: 'billing_name',
      },
      {
        title: '开单日期',
        dataIndex: 'billing_at',
      },
      {
        title: '支付状态',
        dataIndex: 'has_paid',
        render: key => (key ? '已支付' : '未支付'),
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
    ];
    return columns;
  }

  selectMonth= (time) => {
    const { fetchStaffViolation, departmentId, id } = this.props;
    const month = time.format('YYYYMM');
    const item = { filters: '', department_id: departmentId, staff_sn: id, month };
    this.setState({ month });
    fetchStaffViolation(item);
  }

  sendPay = (payload, onError) => {
    const { staffMultiPay } = this.props;
    let selectId = [];
    selectId = payload.map(item => item.id);
    staffMultiPay(selectId, onError);
    this.onSelectChange([], []);
  }

  fetchDataSource = (item) => {
    const { fetchStaffViolation, departmentId, id } = this.props;
    const { month } = this.state;
    const term = {
      filters: '',
      ...item,
      month,
      department_id: departmentId,
      staff_sn: id,
    };
    fetchStaffViolation(term);
  }

  makeExtraOperator = () => {
    const extra = [];
    const { month } = this.state;
    const defalutMonth = moment(month, 'YYYYMM');
    extra.push((
      <MonthPicker
        key="monthPicker"
        defaultValue={defalutMonth}
        placeholder="Select month"
        onChange={this.selectMonth}
      />
    ));
    return extra;
  }

  render() {
    const { dataSource, departmentId, id, staffname, loading } = this.props;
    const { month, selectedRows, selectedRowKeys } = this.state;

    const data = dataSource[departmentId.toString()];
    let realData = [];
    if (departmentId === 'all') {
      realData = { ...{ ...data }[month] }.data;
    } else {
      realData = { ...data }[month];
    }

    const [staffInfo] = (realData || []).length > 0 ?
      realData.filter(item => item.staff_sn.toString() === id) : [];
    const staffFine = staffInfo ? (staffInfo.count_has_punish || []).map(item => item.punish) : [];

    let excelExport = null;
    excelExport = { actionType: 'violation/downloadStaffExcel',
      fileName: `${staffname}${month}月大爱记录.xlsx`,
      filter: `month=${month};staff_sn=${id}` };

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
        disabled: record.has_paid === 1,
      }),
    };
    return (
      <OATable
        columns={this.makeColumns()}
        dataSource={staffFine}
        fetchDataSource={this.fetchDataSource}
        loading={loading}
        multiOperator={multiOperator}
        rowSelection={rowSelection}
        excelExport={excelExport}
        extraOperator={this.makeExtraOperator()}
      />
    );
  }
}
