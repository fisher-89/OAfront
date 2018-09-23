import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Divider,
  Icon,
  Tooltip,
  Input,
  Modal,
  notification,
} from 'antd';
import Ellipsis from '../../../../../components/Ellipsis/index';
import OATable from '../../../../../components/OATable/index';
import PrintPage from '../../print';

const { TextArea } = Input;

@connect(({ reimbursement, loading }) => ({
  overtimeList: reimbursement.overtimeList,
  fundsAttribution: reimbursement.fundsAttribution,
  loading: loading.effects['reimbursement/fetchOvertimeList'],
}))

export default class extends PureComponent {
  state = { printData: null };

  fetchProcessingList = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'reimbursement/fetchOvertimeList', payload: params });
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
        rangeFilters: true,
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
          return [
            <a key="approve" onClick={this.confirmApprove}> 通过 </a>,
            <Divider key="devider1" type="vertical" />,
            <a key="showDetail" onClick={() => showDetail(rowData)}>查看详情</a>,
            <Divider key="devider2" type="vertical" />,
            <Tooltip key="print" title="打印">
              <a onClick={() => this.handlePrint(rowData)}><Icon type="printer" /></a>
            </Tooltip>,
          ];
        },
      },
    ];

    return columnsLeftFixed.concat(visible ? [] : columnsMiddle).concat(columnsRight);
  }

  confirmApprove = () => {
    this.approveRemark = '';
    Modal.confirm({
      title: '确认通过？',
      content: (
        <TextArea
          placeholder="备注"
          autosize={{ minRows: 4, maxRows: 4 }}
          onChange={(e) => {
            const { value } = e.target;
            this.approveRemark = value;
          }}
        />
      ),
      maskClosable: true,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.handleApprove(rowData);
      },
    });
  }

  handleApprove = (rowData) => {
    const { dispatch } = this.props;
    const payload = {
      id: rowData.id,
      expenses: rowData.expenses.map((item) => {
        const response = { ...item };
        if (!item.audited_cost) {
          response.audited_cost = item.send_cost;
        }
        return response;
      }),
      accountant_remark: this.approveRemark,
    };
    dispatch({
      type: 'reimbursement/approveByAccountant',
      payload,
      onSuccess: () => {
        notification.success({ message: `报销单 ${rowData.reim_sn} 已通过` });
      },
    });
  }

  handlePrint = (rowData) => {
    this.setState({ printData: rowData }, () => {
      printJS({
        printable: 'overtime-printing-page',
        type: 'html',
        targetStyles: ['border', 'padding', 'text-align', 'font-size', 'font-weight', 'color'],
      });
    });
  }

  render() {
    const { overtimeList, loading, openPackageList } = this.props;
    const { printData } = this.state;
    return (
      <React.Fragment>
        <OATable
          bordered
          serverSide={false}
          extraOperator={[
            <Button key="submit" onClick={openPackageList}>批量送审</Button>,
          ]}
          loading={loading}
          columns={this.makeColumns()}
          dataSource={overtimeList}
          fetchDataSource={this.fetchProcessingList}
          scroll={{ x: 'auto' }}
        />
        <div id="overtime-printing-page">
          <PrintPage data={printData} />
        </div>
      </React.Fragment>
    );
  }
}
