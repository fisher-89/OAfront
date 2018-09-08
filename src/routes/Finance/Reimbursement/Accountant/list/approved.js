import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import XLSX from 'xlsx';
import Ellipsis from '../../../../../components/Ellipsis';

import OATable from '../../../../../components/OATable';

@connect(({ reimbursement, loading }) => ({
  approvedList: reimbursement.approvedList,
  fundsAttribution: reimbursement.fundsAttribution,
  expenseTypes: reimbursement.expenseTypes,
  status: reimbursement.status,
  loading: loading.effects['reimbursement/fetchApprovedList'],
  exportLoading: loading.effects['reimbursement/exportApprovedList'],
}))

export default class extends PureComponent {
  fetchApprovedList = (params) => {
    const { dispatch } = this.props;
    this.currentParams = params;
    dispatch({ type: 'reimbursement/fetchApprovedList', payload: params });
  }

  makeColumns = () => {
    const { fundsAttribution, visible, showDetail, status } = this.props;
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
        title: '审批人',
        dataIndex: 'approver_name',
        searcher: true,
      },
      {
        title: '状态',
        dataIndex: 'status_id',
        filters: status.filter(item => item.id > 3 || item.id === -1)
          .map(item => ({ text: item.name, value: item.id })),
        render: cellData => status.filter(item => item.id === cellData)[0].name,
      },
      {
        title: '原金额',
        dataIndex: 'approved_cost',
        sorter: true,
        render: (cellData, rowData) => {
          return `￥ ${cellData || rowData.send_cost}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
      },
      {
        title: '调整后金额',
        dataIndex: 'audited_cost',
        sorter: true,
        rangeFilters: true,
        render: (cellData) => {
          return cellData && `￥ ${cellData}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

  handleExport = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reimbursement/exportApprovedList',
      payload: this.currentParams,
      onSuccess: (list) => {
        const { fundsAttribution, expenseTypes } = this.props;
        const workbook = XLSX.utils.book_new();
        const reimbursements = [];
        const expenses = [];
        list.forEach((item) => {
          const fundsName = fundsAttribution.find(fund => fund.id === item.reim_department_id).name;
          reimbursements.push([
            item.reim_sn, item.description, item.staff_sn, item.realname, item.department_name,
            fundsName, item.approved_cost || item.send_cost, item.audited_cost, item.approver_name,
            item.approve_time, item.accountant_name, item.audit_time, item.manager_name,
            item.manager_approved_at, item.remark, item.payee_bank_account, item.payee_name,
          ]);
          item.expenses.forEach((expense) => {
            expenses.push([
              item.reim_sn, item.realname,
              expenseTypes.find(type => type.id === expense.type_id).name,
              expense.date, expense.send_cost, expense.audited_cost, expense.description,
            ]);
          });
        });
        reimbursements.unshift([
          '报销单编号', '标题（描述）', '申请人工号', '申请人姓名', '部门',
          '资金归属', '原金额', '调整后金额', '审批人', '审批时间', '财务审核人',
          '审核时间', '品牌副总', '副总审批时间', '备注', '银行卡号', '开户人',
        ]);
        expenses.unshift([
          '报销单编号', '申请人姓名', '消费类型',
          '消费日期', '原金额', '调整后金额', '描述',
        ]);
        const reimbursementSheet = XLSX.utils.aoa_to_sheet(reimbursements);
        const expenseSheet = XLSX.utils.aoa_to_sheet(expenses);
        Object.keys(reimbursementSheet).forEach((key) => {
          const topLineKey = /^[A-Z]1$/;
          if (topLineKey.test(key)) {
            reimbursementSheet[key].s = { fill: { fgColor: { rgb: 'FFFF00' } }, font: { bold: true } };
          }
        });
        XLSX.utils.book_append_sheet(workbook, reimbursementSheet, '报销单');
        XLSX.utils.book_append_sheet(workbook, expenseSheet, '消费明细');
        XLSX.writeFile(workbook, '已通过报销单.xlsx');
      },
    });
  }

  render() {
    const { approvedList, loading, exportLoading } = this.props;
    return (
      <OATable
        bordered
        serverSide
        loading={loading}
        extraOperator={[
          <Button key="export" onClick={this.handleExport} loading={exportLoading} icon="download">导出</Button>,
        ]}
        columns={this.makeColumns()}
        dataSource={approvedList.data}
        total={approvedList.total}
        fetchDataSource={this.fetchApprovedList}
        scroll={{ x: 'auto' }}
      />
    );
  }
}
