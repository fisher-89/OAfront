import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import Ellipsis from '../../../../../components/Ellipsis/index';

import OATable from '../../../../../components/OATable/index';

@connect(({ reimbursement, loading }) => ({
  unPaidList: reimbursement.unPaidList,
  fundsAttribution: reimbursement.fundsAttribution,
  loading: loading.effects['reimbursement/fetchUnPaidList'],
}))

export default class extends PureComponent {
  state = {
    selectedRowKeys: [],
  }

  fetchUnPaidList = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'reimbursement/fetchUnPaidList', payload: params });
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
          return (
            <a onClick={() => showDetail(rowData)}>查看详情</a>
          );
        },
      },
    ];

    return columnsLeftFixed.concat(visible ? [] : columnsMiddle).concat(columnsRight);
  }

  makeExtraOperators = () => {
    const { unPaidList } = this.props;
    const { selectedRowKeys } = this.state;
    const selectedCosts = unPaidList.filter(item => selectedRowKeys.indexOf(item.id) !== -1)
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
              selectedRowKeys: unPaidList.map(item => item.id),
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
        <Button type="primary" key="remit" onClick={this.remitInBatches}>批量转账</Button>
      ),
      (
        <span key="selectingStatus">
          选中 {selectedRowKeys.length} / {unPaidList.length} 项，
          共计金额 {totalCost} 元
        </span>
      ),
    ];
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

  render() {
    const { unPaidList, loading } = this.props;
    const { selectedRowKeys } = this.state;
    return (
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
        dataSource={unPaidList}
        fetchDataSource={this.fetchUnPaidList}
        scroll={{ x: 'auto' }}
      />
    );
  }
}
