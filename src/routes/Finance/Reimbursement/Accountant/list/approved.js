import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Ellipsis from '../../../../../components/Ellipsis';

import OATable from '../../../../../components/OATable';

@connect(({ reimbursement, loading }) => ({
  approvedList: reimbursement.approvedList,
  fundsAttribution: reimbursement.fundsAttribution,
  status: reimbursement.status,
  loading: loading.effects['reimbursement/fetchApprovedList'],
}))

export default class extends PureComponent {
  fetchApprovedList = (params) => {
    const { dispatch } = this.props;
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
        fixed: 'left',
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
        fixed: 'left',
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
    const { approvedList, loading } = this.props;
    return (
      <OATable
        bordered
        serverSide
        loading={loading}
        columns={this.makeColumns()}
        dataSource={approvedList.data}
        total={approvedList.total}
        fetchDataSource={this.fetchApprovedList}
        scroll={{ x: 'auto' }}
      />
    );
  }
}
