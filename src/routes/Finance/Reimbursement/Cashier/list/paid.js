import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Ellipsis from '../../../../../components/Ellipsis';

import OATable from '../../../../../components/OATable';

@connect(({ reimbursement, loading }) => ({
  paidList: reimbursement.paidList,
  fundsAttribution: reimbursement.fundsAttribution,
  status: reimbursement.status,
  loading: loading.effects['reimbursement/fetchPaidList'],
}))

export default class extends PureComponent {
  fetchPaidList = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'reimbursement/fetchPaidList', payload: params });
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

  render() {
    const { paidList, loading } = this.props;
    return (
      <OATable
        bordered
        serverSide
        loading={loading}
        columns={this.makeColumns()}
        dataSource={paidList.data}
        total={paidList.total}
        fetchDataSource={this.fetchPaidList}
        scroll={{ x: 'auto' }}
      />
    );
  }
}
