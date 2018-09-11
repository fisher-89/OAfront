import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Divider, Checkbox } from 'antd';
import Ellipsis from '../../../../../components/Ellipsis/index';
import OATable from '../../../../../components/OATable/index';

@connect(({ reimbursement, loading }) => ({
  processingList: reimbursement.processingList,
  fundsAttribution: reimbursement.fundsAttribution,
  loading: loading.effects['reimbursement/fetchProcessingList'],
}))

export default class extends PureComponent {
  state = {
    isRejected: false,
  };

  fetchProcessingList = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'reimbursement/fetchProcessingList', payload: params });
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
        title: '申请时间',
        dataIndex: 'send_time',
        sorter: true,
        dateFilters: true,
      },
      {
        title: '审批人',
        dataIndex: 'approver_name',
        searcher: true,
      },
      {
        title: '审批时间',
        dataIndex: 'approve_time',
        sorter: true,
        dateFilters: true,
        defaultSortOrder: 'descend',
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

  toggleIsRejected = (e) => {
    const { checked } = e.target;
    this.setState({
      isRejected: checked,
    });
  }

  fetchRejectedList = () => {
    const { processingList } = this.props;
    return processingList.filter((item) => {
      return item.second_rejected_at !== null;
    });
  }

  render() {
    const { processingList, loading, openPackageList } = this.props;
    const { isRejected } = this.state;
    return (
      <OATable
        bordered
        serverSide={false}
        extraOperator={[
          <Button key="submit" onClick={openPackageList}>批量送审</Button>,
          <Checkbox key="isRejected" onChange={this.toggleIsRejected} style={{ marginLeft: 20 }}>仅显示重审</Checkbox>,
        ]}
        loading={loading}
        columns={this.makeColumns()}
        dataSource={isRejected ? this.fetchRejectedList() : processingList}
        fetchDataSource={this.fetchProcessingList}
        scroll={{ x: 'auto' }}
      />
    );
  }
}
