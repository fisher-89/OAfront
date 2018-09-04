import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Divider } from 'antd';
import Ellipsis from '../../../../../components/Ellipsis/index';

import OATable from '../../../../../components/OATable/index';

@connect(({ reimbursement, loading }) => ({
  beingRejectedList: reimbursement.beingRejectedList,
  fundsAttribution: reimbursement.fundsAttribution,
  loading: loading.effects['reimbursement/fetchBeingRejectedList'],
}))

export default class extends PureComponent {
  fetchProcessingList = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'reimbursement/fetchBeingRejectedList', payload: params });
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
        title: '资金归属',
        dataIndex: 'reim_department_id',
        filters: fundsAttribution.map(item => ({ text: item.name, value: item.id })),
        render: (cellData) => {
          return fundsAttribution.filter(item => item.id === cellData)[0].name || '';
        },
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
        title: '驳回人',
        dataIndex: 'second_rejecter_name',
        searcher: true,
      },
      {
        title: '驳回时间',
        dataIndex: 'second_rejected_at',
        sorter: true,
      },
    ];
    const columnsRight = [
      {
        title: '操作',
        render: (rowData) => {
          return [
            <a key="approve" onClick={() => this.handleApprove(rowData)}>通过</a>,
            <Divider key="devider1" type="vertical" />,
            <a key="showDetail" onClick={() => showDetail(rowData)}>查看详情</a>,
          ];
        },
      },
    ];

    return columnsLeftFixed.concat(visible ? [] : columnsMiddle).concat(columnsRight);
  }

  handleApprove = (rowData) => {
    const { dispatch } = this.props;
    const payload = {
      ...rowData,
      expenses: rowData.expenses.map((item) => {
        const response = { ...item };
        if (!item.audited_cost) {
          response.audited_cost = item.send_cost;
        }
        return response;
      }),
    };
    dispatch({
      type: 'reimbursement/approveByAccountant',
      payload,
    });
  }

  render() {
    const { beingRejectedList, loading, openPackageList } = this.props;
    return (
      <OATable
        bordered
        serverSide={false}
        extraOperator={[
          <Button key="submit" onClick={openPackageList}>批量送审</Button>,
        ]}
        loading={loading}
        columns={this.makeColumns()}
        dataSource={beingRejectedList}
        fetchDataSource={this.fetchProcessingList}
        scroll={{ x: 'auto' }}
      />
    );
  }
}
