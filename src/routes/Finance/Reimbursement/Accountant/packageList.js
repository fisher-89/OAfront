import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, Input, message } from 'antd';
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
      console.log('update:', newProps.packageList, packageList);
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
        width: 100,
      },
      {
        title: '资金归属',
        dataIndex: 'reim_department_id',
        width: 120,
        filters: fundsAttribution.map(item => ({ text: item.name, value: item.id })),
        render: (cellData) => {
          return fundsAttribution.filter(item => item.id === cellData)[0].name || '';
        },
      },
      {
        title: '审批人',
        dataIndex: 'approver_name',
        searcher: true,
        width: 90,
      },
      {
        title: '原金额',
        dataIndex: 'approved_cost',
        render: (cellData, rowData) => {
          return `￥ ${cellData || rowData.send_cost}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        width: 100,
      },
      {
        title: '调整后金额',
        dataIndex: 'audited_cost',
        render: (cellData) => {
          return cellData && `￥ ${cellData}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        width: 100,
      },
      {
        title: '财务审核',
        dataIndex: 'accountant_name',
        searcher: true,
        width: 110,
      },
      {
        title: '通过时间',
        dataIndex: 'audit_time',
      },
    ];
  }

  makeExtraOperators = () => {
    const { packageList } = this.props;
    const { selectedRowKeys } = this.state;
    return [
      (
        <span key="selectingStatus">
          选中{selectedRowKeys.length === packageList.length ? '全 ' : ` ${selectedRowKeys.length} 项，共 `}
          {packageList.length} 项
        </span>
      ),
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
      onOk: () => {
        const { onCancel, dispatch } = this.props;
        const { selectedRowKeys, packageRemark } = this.state;
        console.log(selectedRowKeys, packageRemark);
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
