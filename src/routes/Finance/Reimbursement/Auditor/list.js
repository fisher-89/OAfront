import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button, Modal } from 'antd';
import XLSX from 'xlsx';
import Ellipsis from '../../../../components/Ellipsis';
import OATable from '../../../../components/OATable';
import Detail from '../detail';

@connect(({ reimbursement, loading }) => ({
  approvedList: reimbursement.allApprovedList,
  fundsAttribution: reimbursement.fundsAttribution,
  expenseTypes: reimbursement.expenseTypes,
  status: reimbursement.status,
  loading: loading.effects['reimbursement/fetchAllApprovedList'],
  exportLoading: loading.effects['reimbursement/exportAllApprovedList'],
}))

export default class extends PureComponent {
  state = {
    visible: false,
    detail: {},
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'reimbursement/fetchFundsAttribution' });
    dispatch({ type: 'reimbursement/fetchStatus' });
    dispatch({ type: 'reimbursement/fetchExpenseTypes' });
  }

  fetchApprovedList = (params) => {
    const { dispatch } = this.props;
    this.currentParams = params;
    dispatch({ type: 'reimbursement/fetchAllApprovedList', payload: params });
  }

  makeColumns = () => {
    const { fundsAttribution, status } = this.props;
    const { visible } = this.state;
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
          return { ...fundsAttribution.find(item => item.id === cellData) }.name || '';
        },
      },
      {
        title: '对公转账',
        dataIndex: 'payee_is_public',
        filters: [{ text: '是', value: 1 }, { text: '否', value: 0 }],
        render: (cellData) => {
          return cellData ? '是' : '否';
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
          const actions = [];
          actions.push(<a key="showDetail" onClick={() => this.showDetail(rowData)}>查看详情</a>);
          return actions;
        },
      },
    ];

    return columnsLeftFixed.concat(visible ? [] : columnsMiddle).concat(columnsRight);
  }

  showDetail = (rowData) => {
    this.setState({
      visible: true,
      detail: rowData,
    });
  }

  confirmExport = () => {
    const { approvedList: { total } } = this.props;
    if (total > 3000) {
      Modal.confirm({
        title: '导出超过3000条。',
        content: '这会需要较长的时间，如果不需要全部内容，请筛选后再次尝试。',
        okText: '好',
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
      type: 'reimbursement/exportAllApprovedList',
      payload: this.currentParams,
      onSuccess: (list) => {
        console.log(list);
        const { fundsAttribution, expenseTypes } = this.props;
        const workbook = XLSX.utils.book_new();
        const reimbursements = [];
        const expenses = [];
        list.forEach((item) => {
          const fundsName = fundsAttribution.find(fund => fund.id === item.reim_department_id).name;
          reimbursements.push([
            item.reim_sn, item.description, item.staff_sn, item.realname, item.department_name,
            fundsName, parseFloat(item.approved_cost || item.send_cost),
            parseFloat(item.audited_cost), item.approver_name, item.approve_time,
            item.accountant_name, item.audit_time, item.manager_name,
            item.manager_approved_at, item.remark, item.payee_bank_account, item.payee_name,
          ]);
          item.expenses.forEach((expense) => {
            expenses.push([
              item.reim_sn, item.realname,
              expenseTypes.find(type => type.id === expense.type_id).name,
              expense.date, parseFloat(expense.send_cost),
              parseFloat(expense.audited_cost), expense.description,
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
        XLSX.utils.book_append_sheet(workbook, reimbursementSheet, '报销单');
        XLSX.utils.book_append_sheet(workbook, expenseSheet, '消费明细');
        XLSX.writeFile(workbook, '已通过报销单.xlsx');
      },
    });
  }

  render() {
    const { approvedList, loading, exportLoading } = this.props;
    const { visible, detail } = this.state;
    return (
      <React.Fragment>
        <Row>
          <Col span={visible ? 8 : 24} style={{ paddingRight: 10 }}>
            <Card bordered={false}>
              <OATable
                bordered
                serverSide
                loading={loading}
                extraOperator={[
                  <Button key="export" onClick={this.confirmExport} loading={exportLoading} icon="download">
                    导 出
                  </Button>,
                ]}
                columns={this.makeColumns()}
                dataSource={approvedList.data}
                total={approvedList.total}
                fetchDataSource={this.fetchApprovedList}
                scroll={{ x: 'auto' }}
              />
            </Card>
          </Col>
          <Col span={visible ? 16 : 0}>
            <Card bordered={false}>
              <Detail
                info={detail}
                onClose={() => this.setState({ visible: false, detail: {} })}
              />
            </Card>
          </Col>
        </Row>

      </React.Fragment>
    );
  }
}
