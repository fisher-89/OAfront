import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Ellipsis from '../../../../../components/Ellipsis';
import { checkAuthority } from '../../../../../utils/utils';

import OATable from '../../../../../components/OATable';

@connect(({ reimbursement, loading }) => ({
  rejectedList: reimbursement.rejectedList,
  fundsAttribution: reimbursement.fundsAttribution,
  loading: loading.effects['reimbursement/fetchRejectedList'],
}))

export default class extends PureComponent {
  fetchApprovedList = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'reimbursement/fetchRejectedList', payload: params });
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
        title: '对公转账',
        dataIndex: 'payee_is_public',
        filters: [{ text: '是', value: 1 }, { text: '否', value: '0' }],
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
        title: '原金额',
        dataIndex: 'approved_cost',
        sorter: true,
        render: (cellData, rowData) => {
          return `￥ ${cellData || rowData.send_cost}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
      },
      {
        title: '驳回人',
        dataIndex: 'reject_name',
        searcher: true,
      },
      {
        title: '驳回时间',
        dataIndex: 'reject_time',
        sorter: true,
        dateFilters: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '驳回理由',
        dataIndex: 'reject_remarks',
        searcher: true,
      },
    ];
    const columnsRight = [
      {
        title: '操作',
        render: (rowData) => {
          return checkAuthority(34) && (
            <a onClick={() => showDetail(rowData)}>查看详情</a>
          );
        },
      },
    ];

    return columnsLeftFixed.concat(visible ? [] : columnsMiddle).concat(columnsRight);
  }

  render() {
    const { rejectedList, loading } = this.props;
    return (
      <OATable
        bordered
        serverSide
        loading={loading}
        columns={this.makeColumns()}
        dataSource={rejectedList.data}
        total={rejectedList.total}
        fetchDataSource={this.fetchApprovedList}
        scroll={{ x: 'auto' }}
      />
    );
  }
}
