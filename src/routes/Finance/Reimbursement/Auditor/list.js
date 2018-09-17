import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';
import Ellipsis from '../../../../components/Ellipsis';
import OATable from '../../../../components/OATable';
import Detail from '../detail';
import { customerAuthority } from '../../../../utils/utils';

@connect(({ reimbursement, loading }) => ({
  approvedList: reimbursement.approvedList,
  fundsAttribution: reimbursement.fundsAttribution,
  loading: loading.effects['reimbursement/fetchApprovedList'],
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
    dispatch({ type: 'reimbursement/fetchApprovedList', payload: params });
  }

  makeColumns = () => {
    const { fundsAttribution } = this.props;
    const { visible } = this.state;
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
        dataIndex: 'reim_department.name',
        filters: fundsAttribution.map(item => ({ text: item.name, value: item.name })),
      },
      {
        title: '申请时间',
        dataIndex: 'send_time',
        sorter: true,
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
    ];
    const columnsRight = [
      {
        title: '操作',
        render: (rowData) => {
          return rowData.status_id === 3 ?
            (customerAuthority(34) && (
              <a onClick={() => this.showDetail(rowData)}>查看详情</a>
            )) : '';
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

  render() {
    const { approvedList, loading } = this.props;
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
