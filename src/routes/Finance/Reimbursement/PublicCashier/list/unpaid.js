import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Divider } from 'antd';
import XLSX from 'xlsx';
import Ellipsis from '../../../../../components/Ellipsis/index';

import OATable from '../../../../../components/OATable/index';

@connect(({ reimbursement, loading }) => ({
  unPaidList: reimbursement.unPaidPublicList,
  fundsAttribution: reimbursement.fundsAttribution,
  expenseTypes: reimbursement.expenseTypes,
  loading: loading.effects['reimbursement/fetchUnPaidPublicList'],
}))

export default class extends PureComponent {
  state = {
    selectedRowKeys: [],
    filteredList: null,
  }

  componentWillReceiveProps(newProps) {
    if (JSON.stringify(newProps.unPaidList) !== JSON.stringify(this.props.unPaidList)) {
      const { filteredList } = this.state;
      if (filteredList) {
        const unPaidListKeys = newProps.unPaidList.map(item => item.id);
        const newList = filteredList.filter(item => unPaidListKeys.indexOf(item.id) !== -1);
        this.setState(
          {
            filteredList: newList,
            selectedRowKeys: [],
          }
        );
      }
    }
  }

  fetchUnPaidList = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'reimbursement/fetchUnPaidPublicList', payload: params });
  }

  makeColumns = () => {
    const { fundsAttribution, visible, showDetail } = this.props;
    const columnsLeftFixed = [
      {
        title: '报销单编号',
        dataIndex: 'reim_sn',
        searcher: true,
        sorter: true,
        width: 140,
        render: (cellData) => {
          return (
            <Ellipsis tooltip lines={1} style={{ width: 124 }}>{cellData}</Ellipsis>
          );
        },
      },
      {
        title: '描述',
        dataIndex: 'description',
        searcher: true,
        width: 160,
        render: (cellData) => {
          return (
            <div style={{ width: 144 }}>
              <Ellipsis tooltip lines={1}>{cellData}</Ellipsis>
            </div>
          );
        },
      },
    ];
    const columnsMiddle = [
      {
        title: '申请人',
        dataIndex: 'realname',
        searcher: true,
      },
      {
        title: '卡号',
        dataIndex: 'payee_bank_account',
        searcher: true,
      },
      {
        title: '开户人',
        dataIndex: 'payee_name',
        searcher: true,
      },
      {
        title: '资金归属',
        dataIndex: 'reim_department_id',
        filters: fundsAttribution.map(item => ({ text: item.name, value: item.id })),
        render: (cellData) => {
          return fundsAttribution.filter(item => item.id === cellData)[0].name || '';
        },
      },
      {
        title: '审批人',
        dataIndex: 'approver_name',
        searcher: true,
      },
      {
        title: '财务审核人',
        dataIndex: 'accountant_name',
        searcher: true,
      },
      {
        title: '通过时间',
        dataIndex: 'audit_time',
        sorter: true,
      },
      {
        title: '金额',
        dataIndex: 'audited_cost',
        sorter: true,
        render: (cellData) => {
          return cellData && `￥ ${cellData}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
      },
    ];
    const columnsRight = [
      {
        title: '操作',
        render: (rowData) => {
          return [
            <a key="remit" onClick={() => this.handleRemit(rowData)}>转账</a>,
            <Divider key="devider1" type="vertical" />,
            <a key="showDetail" onClick={() => showDetail(rowData)}>查看详情</a>,
          ];
        },
      },
    ];

    return columnsLeftFixed.concat(visible ? [] : columnsMiddle).concat(columnsRight);
  }

  makeExtraOperators = () => {
    const { unPaidList } = this.props;
    const { selectedRowKeys, filteredList } = this.state;
    const list = filteredList || unPaidList;
    const selectedCosts = list.filter(item => selectedRowKeys.indexOf(item.id) !== -1)
      .map(item => parseFloat(item.audited_cost));
    const totalCost = selectedCosts.length > 0 ?
      selectedCosts.reduce((total, item) => total + item).toFixed(2) :
      0;
    return [
      (
        <Button
          key="selectAll"
          onClick={() => {
            this.setState({
              selectedRowKeys: list.map(item => item.id),
            });
          }}
          style={{ marginLeft: 20 }}
        >
          全选
        </Button>
      ),
      (
        <Button
          key="clear"
          onClick={() => {
            this.setState({
              selectedRowKeys: [],
            });
          }}
        >
          清空
        </Button>
      ),
      <Button type="primary" key="remit" onClick={this.remitInBatches}>批量转账</Button>,
      (
        <span key="selectingStatus">
          选中 {selectedRowKeys.length} / {list.length} 项，
          共计金额 {totalCost} 元
        </span>
      ),
      <Button key="export" onClick={this.handleExport} icon="download">导 出</Button>,
    ];
  }

  handleRemit = (rowData) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reimbursement/pay',
      payload: {
        id: [rowData.id],
      },
    });
  }

  remitInBatches = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    dispatch({
      type: 'reimbursement/pay',
      payload: {
        id: selectedRowKeys,
      },
      onSuccess: () => {
        this.setState({
          selectedRowKeys: [],
        });
      },
    });
  }

  handleRowSelectionChange = (selected) => {
    this.setState({
      selectedRowKeys: selected,
    });
  }

  handleTableChange = (pagination, filters, sorter, defaultOnChange) => {
    const { unPaidList } = this.props;
    const { selectedRowKeys } = this.state;
    const filteredList = unPaidList.filter((item) => {
      for (const key in filters) {
        if (
          filters[key] && filters[key].length > 0 &&
          (
            (key === 'reim_department_id' && filters[key].indexOf(`${item[key]}`) === -1) ||
            (key !== 'reim_department_id' && item[key].indexOf(filters[key][0]))
          )
        ) {
          return false;
        }
      }
      return true;
    });
    if (JSON.stringify(filteredList) !== JSON.stringify(unPaidList)) {
      const fiteredRowKeys = filteredList.map(i => i.id);
      this.setState(
        {
          filteredList,
          selectedRowKeys: selectedRowKeys.filter(item => fiteredRowKeys.indexOf(item) !== -1),
        }
      );
    } else {
      this.setState({ filteredList: null });
    }
    defaultOnChange(pagination, filters, sorter);
  }

  handleExport = () => {
    const { unPaidList, fundsAttribution, expenseTypes } = this.props;
    const { filteredList } = this.state;
    const list = filteredList || unPaidList;
    const workbook = XLSX.utils.book_new();
    const reimbursements = [];
    const expenses = [];
    const payees = [];
    list.forEach((item) => {
      const fundsName = fundsAttribution.find(fund => fund.id === item.reim_department_id).name;
      reimbursements.push([
        item.reim_sn, item.description, item.staff_sn, item.realname, item.department_name,
        fundsName, parseFloat(item.audited_cost), item.approver_name, item.approve_time,
        item.accountant_name, item.audit_time, item.manager_name, item.manager_approved_at,
        item.remark, item.payee_bank_account,
      ]);
      item.expenses.forEach((expense) => {
        expenses.push([
          item.reim_sn, item.realname,
          expenseTypes.find(type => type.id === expense.type_id).name,
          expense.date, parseFloat(expense.audited_cost), expense.description,
        ]);
      });
      const existedPayee = payees.find(payee => payee[1] === item.payee_bank_account &&
        payee[3] === fundsName);
      if (existedPayee) {
        existedPayee[4] += parseFloat(item.audited_cost);
        existedPayee[8] = `${existedPayee[8]}，${item.reim_sn}`;
      } else {
        payees.push([
          item.payee_bank_other, item.payee_bank_account, item.payee_name,
          fundsName, parseFloat(item.audited_cost), item.payee_phone,
          item.payee_city ? `${item.payee_province}-${item.payee_city}` : item.payee_province,
          item.payee_bank_dot, item.reim_sn,
        ]);
      }
    });
    reimbursements.unshift([
      '报销单编号', '标题（描述）', '申请人工号', '申请人姓名', '部门',
      '资金归属', '金额', '审批人', '审批时间', '财务审核人',
      '审核时间', '品牌副总', '副总审批时间', '备注', '银行卡号',
    ]);
    expenses.unshift([
      '报销单编号', '申请人姓名', '消费类型',
      '消费日期', '金额', '描述',
    ]);
    payees.unshift([
      '开户行', '卡号', '开户人', '资金归属', '金额', '预留手机', '所在省市', '开户网点', '报销单',
    ]);
    const reimbursementSheet = XLSX.utils.aoa_to_sheet(reimbursements);
    const expenseSheet = XLSX.utils.aoa_to_sheet(expenses);
    const payeeSheet = XLSX.utils.aoa_to_sheet(payees);
    XLSX.utils.book_append_sheet(workbook, reimbursementSheet, '报销单');
    XLSX.utils.book_append_sheet(workbook, expenseSheet, '消费明细');
    XLSX.utils.book_append_sheet(workbook, payeeSheet, '收款人');
    XLSX.writeFile(workbook, '未对公转账报销单.xlsx');
  }

  render() {
    const { unPaidList, loading } = this.props;
    const { selectedRowKeys } = this.state;
    return (
      <OATable
        bordered
        serverSide={false}
        rowSelection={{
          selectedRowKeys,
          onChange: this.handleRowSelectionChange,
        }}
        onChange={this.handleTableChange}
        extraOperator={this.makeExtraOperators()}
        loading={loading}
        columns={this.makeColumns()}
        dataSource={unPaidList}
        fetchDataSource={this.fetchUnPaidList}
        scroll={{ x: 'auto' }}
      />
    );
  }
}
