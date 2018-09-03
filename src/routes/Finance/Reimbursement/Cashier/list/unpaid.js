import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Divider } from 'antd';
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
    filteredList: null,
  }

  componentWillReceiveProps(newProps) {
    if (JSON.stringify(newProps.unPaidList) !== JSON.stringify(this.props.unPaidList)) {
      const { filteredList } = this.state;
      if (filteredList) {
        const unPaidListKeys = newProps.unPaidList.map(item => item.id);
        console.log('unPaid:', unPaidListKeys);
        const newList = filteredList.filter(item => unPaidListKeys.indexOf(item.id) !== -1);
        console.log('newList:', newList);
        this.setState(
          {
            filteredList: newList,
            selectedRowKeys: [],
          }
        );
      }
    }
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
        title: '卡号',
        dataIndex: 'payee_bank_account',
        searcher: true,
      },
      {
        title: '开户人',
        dataIndex: 'payee_name',
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
          return [
            <a key="remit" onClick={() => this.handleRemit(rowData)}>转账</a>,
            <Divider key="devider1" type="vertical" />,
            <a key="showDetail" onClick={() => showDetail(rowData)}>查看详情</a>,
          ];
        },
      },
    ];

    return columnsLeftFixed.concat(visible ? [] : columnsMiddle).concat(columnsRight);
  }

  makeExtraOperators = () => {
    const { unPaidList } = this.props;
    const { selectedRowKeys, filteredList } = this.state;
    const list = filteredList || unPaidList;
    const selectedCosts = list.filter(item => selectedRowKeys.indexOf(item.id) !== -1)
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
              selectedRowKeys: list.map(item => item.id),
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
          选中 {selectedRowKeys.length} / {list.length} 项，
          共计金额 {totalCost} 元
        </span>
      ),
    ];
  }

  handleRemit = (rowData) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reimbursement/pay',
      payload: {
        id: [rowData.id],
      },
    });
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

  handleRowSelectionChange = (selected) => {
    this.setState({
      selectedRowKeys: selected,
    });
  }

  handleTableChange = (pagination, filters, sorter, defaultOnChange) => {
    console.log(filters);
    const { unPaidList } = this.props;
    const { selectedRowKeys } = this.state;
    const filteredList = unPaidList.filter((item) => {
      for (const key in filters) {
        if (
          filters[key] && filters[key].length > 0 &&
          (
            (key === 'reim_department_id' && filters[key].indexOf(`${item[key]}`) === -1) ||
            item[key].indexOf(filters[key][0])
          )
        ) {
          return false;
        }
      }
      return true;
    });
    if (JSON.stringify(filteredList) !== JSON.stringify(unPaidList)) {
      const fiteredRowKeys = filteredList.map(i => i.id);
      this.setState(
        {
          filteredList,
          selectedRowKeys: selectedRowKeys.filter(item => fiteredRowKeys.indexOf(item) !== -1),
        }
      );
    } else {
      this.setState({ filteredList: null });
    }
    defaultOnChange(pagination, filters, sorter);
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
          onChange: this.handleRowSelectionChange,
        }}
        onChange={this.handleTableChange}
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
