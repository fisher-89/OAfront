import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Modal } from 'antd';
import XLSX from 'xlsx';
import Ellipsis from '../../../../../components/Ellipsis';

import OATable from '../../../../../components/OATable';

@connect(({ reimbursement, loading }) => ({
  paidList: reimbursement.paidPublicList,
  fundsAttribution: reimbursement.fundsAttribution,
  expenseTypes: reimbursement.expenseTypes,
  loading: loading.effects['reimbursement/fetchPaidPublicList'],
  exportLoading: loading.effects['reimbursement/exportPaidPublicList'],
}))

export default class extends PureComponent {
  fetchPaidList = (params) => {
    const { dispatch } = this.props;
    this.currentParams = params;
    dispatch({ type: 'reimbursement/fetchPaidPublicList', payload: params });
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
        title: '部门',
        dataIndex: 'department_name',
        searcher: true,
        width: 120,
        render: (cellData) => {
          return (
            <Ellipsis tooltip lines={1} style={{ width: 104 }}>{cellData}</Ellipsis>
          );
        },
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
        rangeFilters: true,
        sorter: true,
        render: (cellData) => {
          return cellData && `￥ ${cellData}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
      },
      {
        title: '转账人',
        dataIndex: 'payer_name',
        searcher: true,
      },
      {
        title: '转账时间',
        dataIndex: 'paid_at',
        sorter: true,
        dateFilters: true,
        sortOrder: 'descend',
        defaultSortOrder: 'descend',
      },
    ];
    const columnsRight = [
      {
        title: '操作',
        render: (rowData) => {
          return (
            <a onClick={() => showDetail(rowData)}>查看详情</a>
          );
        },
      },
    ];

    return columnsLeftFixed.concat(visible ? [] : columnsMiddle).concat(columnsRight);
  }


  confirmExport = () => {
    const { paidList: { total } } = this.props;
    if (total > 3000) {
      Modal.confirm({
        title: '导出超过3000条。',
        content: '这会需要较长的时间，如果不需要全部内容，请筛选后再次尝试。',
        okText: '确认',
        cancelText: '继续导出',
        onCancel: () => {
          this.handleExport();
        },
      });
    } else {
      this.handleExport();
    }
  }

  handleExport = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reimbursement/exportPaidPublicList',
      payload: this.currentParams,
      onSuccess: (list) => {
        const { fundsAttribution, expenseTypes } = this.props;
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
            item.payer_name, item.paid_at, item.remark, item.payee_bank_account,
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
          '资金归属', '金额', '审批人', '审批时间', '财务审核人', '审核时间',
          '品牌副总', '副总审批时间', '出纳', '转账时间', '备注', '银行卡号',
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
        XLSX.writeFile(workbook, '已对公转账报销单.xlsx');
      },
    });
  }

  render() {
    const { paidList, loading, exportLoading } = this.props;
    return (
      <OATable
        bordered
        serverSide
        loading={loading}
        extraOperator={[
          <Button key="export" onClick={this.confirmExport} loading={exportLoading} icon="download">导 出</Button>,
        ]}
        columns={this.makeColumns()}
        dataSource={paidList.data}
        total={paidList.total}
        fetchDataSource={this.fetchPaidList}
        scroll={{ x: 'auto' }}
      />
    );
  }
}
