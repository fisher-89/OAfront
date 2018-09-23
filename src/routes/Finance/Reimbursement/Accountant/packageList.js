import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, Input, message } from 'antd';
import XLSX from 'xlsx';
import Ellipsis from '../../../../components/Ellipsis/index';
import OATable from '../../../../components/OATable/index';

@connect(({ reimbursement, loading }) => ({
  packageList: reimbursement.packageList,
  fundsAttribution: reimbursement.fundsAttribution,
  loading: loading.effects['reimbursement/fetchPackageList'],
}))

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: props.packageList.map(item => item.id),
      packageRemark: '',
    };
  }

  componentWillReceiveProps = (newProps) => {
    const { packageList } = this.props;
    if (JSON.stringify(newProps.packageList) !== JSON.stringify(packageList)) {
      this.state.selectedRowKeys = newProps.packageList.map(item => item.id);
    }
  }

  selectedRowKeys = [];

  fetchPackageList = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'reimbursement/fetchPackageList', payload: params });
  }

  makeColumns = () => {
    const { fundsAttribution } = this.props;
    return [
      {
        title: '报销单编号',
        dataIndex: 'reim_sn',
        searcher: true,
        width: 140,
        render: (cellData) => {
          return (
            <Ellipsis tooltip lines={1} style={{ width: 123 }}>{cellData}</Ellipsis>
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
            <div style={{ width: 143 }}>
              <Ellipsis tooltip lines={1}>{cellData}</Ellipsis>
            </div>
          );
        },
      },
      {
        title: '申请人',
        dataIndex: 'realname',
        searcher: true,
        width: 90,
      },
      {
        title: '资金归属',
        dataIndex: 'reim_department_id',
        width: 110,
        filters: fundsAttribution.map(item => ({ text: item.name, value: item.id })),
        render: (cellData) => {
          return fundsAttribution.filter(item => item.id === cellData)[0].name || '';
        },
      },
      {
        title: '金额',
        dataIndex: 'audited_cost',
        render: (cellData) => {
          return cellData && `￥ ${cellData}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        width: 100,
      },
      {
        title: '财务审核人',
        dataIndex: 'accountant_name',
        searcher: true,
        width: 110,
      },
      {
        title: '通过时间',
        dataIndex: 'audit_time',
        dateFilters: true,
        width: 100,
        render: (cellData) => {
          return (
            <div style={{ width: 83 }}>
              <Ellipsis tooltip lines={1}>{cellData}</Ellipsis>
            </div>
          );
        },
      },
      {
        title: '备注',
        dataIndex: 'accountant_remark',
        render: (cellData) => {
          return (<Ellipsis tooltip lines={1}>{cellData}</Ellipsis>);
        },
      },
    ];
  }

  makeExtraOperators = () => {
    const { packageList } = this.props;
    const { selectedRowKeys } = this.state;
    const selectedCosts = packageList.filter(item => selectedRowKeys.indexOf(item.id) !== -1)
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
              selectedRowKeys: packageList.map(item => item.id),
            });
          }}
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
      (
        <span key="selectingStatus">
          选中 {selectedRowKeys.length} / {packageList.length} 项，
          共计金额 {totalCost} 元
        </span>
      ),
      <Button key="export" onClick={this.handleExport} icon="download">导 出</Button>,
    ];
  }

  handleSubmit = () => {
    Modal.confirm({
      content: (
        <Input.TextArea
          placeholder="请输入备注"
          defaultValue={this.state.packageRemark}
          onChange={(e) => {
            this.state.packageRemark = e.target.value;
          }}
        />
      ),
      iconType: false,
      title: '确认提交',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { onCancel, dispatch } = this.props;
        const { selectedRowKeys, packageRemark } = this.state;
        if (selectedRowKeys.length > 0) {
          dispatch({ type: 'reimbursement/sendPackages', payload: { id: selectedRowKeys, remark: packageRemark } });
          this.state.packageRemark = '';
          onCancel();
        } else {
          message.warning('请选择要提交的报销单');
        }
      },
    });
  }

  handleExport = () => {
    const { packageList, fundsAttribution } = this.props;
    const { selectedRowKeys } = this.state;
    const list = packageList.filter(item => selectedRowKeys.indexOf(item.id) !== -1);
    const workbook = XLSX.utils.book_new();
    const reimbursements = [];
    list.forEach((item) => {
      const fundsName = fundsAttribution.find(fund => fund.id === item.reim_department_id).name;
      let firstExpenseDate = '';
      let lastExpenseDate = '';
      item.expenses.forEach((expense) => {
        firstExpenseDate = !firstExpenseDate || expense.date < firstExpenseDate ?
          expense.date : firstExpenseDate;
        lastExpenseDate = !lastExpenseDate || expense.date > lastExpenseDate ?
          expense.date : lastExpenseDate;
      });
      reimbursements.push([
        item.reim_sn, item.description, `${firstExpenseDate} 至 ${lastExpenseDate}`,
        item.staff_sn, item.realname, item.department_name, fundsName,
        parseFloat(item.audited_cost), item.approver_name, item.approve_time, item.accountant_name,
        item.audit_time, item.remark, item.accountant_remark, item.payee_bank_account,
      ]);
    });
    reimbursements.unshift([
      '报销单编号', '标题（描述）', '报销区间', '申请人工号', '申请人姓名', '部门', '资金归属',
      '金额', '审批人', '审批时间', '财务审核人', '审核时间', '申请人备注', '财务审核备注', '银行卡号',
    ]);
    const reimbursementSheet = XLSX.utils.aoa_to_sheet(reimbursements);
    XLSX.utils.book_append_sheet(workbook, reimbursementSheet, '报销单');
    XLSX.writeFile(workbook, '送审报销单.xlsx');
  }

  render() {
    const { packageList, loading, visible, onCancel } = this.props;
    const { selectedRowKeys } = this.state;
    return (
      <Modal visible={visible} width={1200} onCancel={onCancel} onOk={this.handleSubmit}>
        <OATable
          bordered
          serverSide={false}
          rowSelection={{
            selectedRowKeys,
            onChange: (selected) => {
              this.setState({
                selectedRowKeys: selected,
              });
            },
          }}
          extraOperator={this.makeExtraOperators()}
          loading={loading}
          columns={this.makeColumns()}
          dataSource={packageList}
          fetchDataSource={this.fetchPackageList}
          scroll={{ y: 500 }}
          pagination={{
            pageSize: 100,
          }}
        />
      </Modal>
    );
  }
}
