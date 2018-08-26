import React, { Component } from 'react';
import {
  Avatar,
  Tooltip,
  InputNumber,
  Row,
  Col,
  Button,
  Popconfirm,
  Input,
} from 'antd';
import { connect } from 'dva';
import RcViewer from 'rc-viewer';
import Ellipsis from '../../../components/Ellipsis';
import OATable from '../../../components/OATable';
import { customerAuthority } from '../../../utils/utils';
import styles from './detail.less';

const { TextArea } = Input;

const rcViewerOptions = {
  navbar: true,
  toolbar: {
    zoomIn: 0,
    zoomOut: 0,
    oneToOne: 0,
    reset: 0,
    prev: {
      show: 2,
      size: 'large',
    },
    play: 0,

    rotateLeft: {
      show: 2,
      size: 'large',
    },
    rotateRight: {
      show: 2,
      size: 'large',
    },
    next: {
      show: 2,
      size: 'large',
    },
    flipHorizontal: 0,
    flipVertical: 0,
  },
};

@connect(({ reimbursement, loading }) => ({
  status: reimbursement.status,
  loading: loading.effects['reimbursement/updateDetail'],
}))
export default class extends Component {
  state = {
    info: null,
    rejectPopVisible: false,
    rejectRemark: '',
  }

  componentWillReceiveProps(newProps) {
    if (JSON.stringify(newProps.info) !== JSON.stringify(this.props.info)) {
      if (newProps.info.expenses) {
        newProps.info.expenses.forEach(item => {
          if (item.audited_cost === null) {
            item.audited_cost = item.send_cost;
          }
        });
      }
      this.setState({
        info: newProps.info,
        rejectPopVisible: false,
        rejectRemark: '',
      });
    }
  }

  expenseColumns = [
    {
      title: '描述',
      dataIndex: 'description',
      width: 240,
      render: (cellData) => {
        return (
          <Ellipsis tooltip lines={3} style={{ width: 224 }}>
            {cellData}
          </Ellipsis>
        );
      },
    },
    {
      title: '消费时间',
      dataIndex: 'date',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: (cellData) => {
        return (<Tooltip title={cellData.name}><Avatar size="small" src={`http://${cellData.pic_path}`} /></Tooltip>);
      },
    },
    {
      title: '原金额',
      dataIndex: 'send_cost',
      width: 120,
      render: (cellData, rowData) => {
        return (
          <span
            style={(rowData.audited_cost && (cellData !== rowData.audited_cost)) ? { color: 'red' } : {}}
          >
            {`￥ ${cellData}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </span>
        );
      },
    },
    {
      title: '调整金额',
      dataIndex: 'audited_cost',
      width: 120,
      render: (cellData, rowData, index) => {
        const { dispatch } = this.props;
        const { info } = this.state;
        let afterChangeInterval;
        return info.status_id === 3 ? (
          <InputNumber
            defaultValue={cellData || rowData.send_cost}
            onChange={(value) => {
              if (afterChangeInterval) clearInterval(afterChangeInterval);
              afterChangeInterval = setInterval(() => {
                clearInterval(afterChangeInterval);
                info.expenses[index].audited_cost = parseFloat(value).toFixed(2);
                this.sumAuditedCost(info);
                this.setState({ info });
                dispatch({
                  type: 'reimbursement/updateDetail',
                  payload: info,
                });
              }, 500);
            }}
          />
        ) : `￥ ${cellData}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      },
    },
    {
      title: '发票',
      dataIndex: 'bills',
      render: (cellData) => {
        return (
          <RcViewer options={rcViewerOptions}>
            <Row gutter={4} style={{ width: 260 }}>
              {cellData.map((bill) => {
                return (
                  <Col span={4} style={{ marginBottom: 4 }} key={`bill-${bill.id}`}>
                    <div
                      style={{
                        width: '100%',
                        paddingBottom: '100%',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <img
                        alt="发票"
                        src={`http://${bill.pic_path}`}
                        style={{
                          position: 'absolute',
                          left: '-20%',
                          width: '140%',
                          minHeight: '100%',
                          display: 'block',
                        }}
                      />
                    </div>
                  </Col>
                );
              })}
            </Row>
          </RcViewer>
        );
      },
    },
  ];

  sumAuditedCost = (info) => {
    let sum = 0;
    info.expenses && info.expenses.forEach((expense) => {
      sum += parseFloat(expense.audited_cost) || parseFloat(expense.send_cost);
    });
    info.audited_cost = sum.toFixed(2);
    return sum.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  handleApprove = () => {
    const { dispatch } = this.props;
    const { info } = this.state;

    dispatch({
      type: 'reimbursement/approveByAccountant',
      payload: info,
    });
  }

  handleReject = () => {
    const { dispatch } = this.props;
    const { info, rejectRemark } = this.state;
    this.setState({
      rejectPopVisible: true,
    });
    dispatch({
      type: 'reimbursement/rejectByAccountant',
      payload: {
        id: info.id,
        remarks: rejectRemark,
      },
      onSuccess: () => {
        this.setState({
          rejectPopVisible: false,
        });
      },
    });
  }

  render() {
    const { onClose, status } = this.props;
    const { info, rejectPopVisible, rejectRemark } = this.state;
    if (info) {
      const auditedCost = info.audited_cost && info.audited_cost.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      const approvedCost = info.send_cost && (info.approved_cost || info.send_cost).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return (
        <div>
          <div>
            <button className={styles.detailClose} onClick={onClose}><span></span></button>
            <h2>
              {info.description}&nbsp;
              <small style={{ color: '#8c8c8c' }}>{info.reim_sn}</small>
              {info.audit_time !== null && (
                <img alt="通过" style={{ position: 'absolute', top: 9, marginLeft: 10 }} src="/images/通过.png" />
              )}
              {info.approve_time !== null && info.audit_time === null && info.status_id === -1 && (
                <img alt="驳回" style={{ position: 'absolute', top: 9, marginLeft: 10 }} src="/images/驳回.png" />
              )}
            </h2>
            <p style={{ color: '#8c8c8c' }}>{info.remark}</p>
            <Row style={{ color: '#8c8c8c' }}>
              <Col span={24}>状态：{status.filter(item => item.id === info.status_id)[0].name}</Col>
              <Col span={4}>申请人：{info.realname}</Col>
              <Col span={8}>申请时间：{info.send_time}</Col>
              {info.approve_time && (<Col span={4}>审批人：{info.approver_name}</Col>)}
              {info.approve_time && (<Col span={8}>通过时间：{info.approve_time}</Col>)}
              {info.audit_time && (<Col span={4}>财务审核人：{info.accountant_name}</Col>)}
              {info.audit_time && (<Col span={8}>通过时间：{info.audit_time}</Col>)}
              {info.manager_approved_at && (<Col span={4}>品牌副总：{info.manager_name}</Col>)}
              {info.manager_approved_at && (<Col span={8}>通过时间：{info.manager_approved_at}</Col>)}
              {info.paid_at && (<Col span={4}>出纳：{info.payer_name}</Col>)}
              {info.paid_at && (<Col span={8}>转账时间：{info.paid_at}</Col>)}
              {info.reject_time && (<Col span={4}>驳回人：{info.accountant_name}</Col>)}
              {info.reject_time && (<Col span={8}>驳回时间：{info.reject_time}</Col>)}
            </Row>
            <h3>
              金额：{auditedCost !== null && auditedCost !== approvedCost ?
              (<span>￥ {auditedCost}（原金额：<span style={{ color: 'red' }}>￥ {approvedCost}</span>）</span>)
              : `￥ ${approvedCost}`}
            </h3>
            <Row>
              {customerAuthority(34) && info.status_id === 3 && (
                <React.Fragment>
                  <Col span={2}>
                    <Popconfirm
                      visible={rejectPopVisible}
                      placement="bottom"
                      onVisibleChange={(visible) => {
                        this.setState({
                          rejectPopVisible: visible,
                        });
                      }}
                      title={(<div>
                        <p>确认驳回？</p>
                        <TextArea
                          placeholder="请输入驳回原因"
                          style={{ width: 300 }}
                          value={rejectRemark}
                          onChange={(e) => {
                            const value = e.target.value;
                            this.setState({ rejectRemark: value });
                          }} />
                      </div>)}
                      onConfirm={this.handleReject}
                    >
                      <Button>驳回</Button>
                    </Popconfirm>
                  </Col>
                  <Col span={2}>
                    <Button type="primary" onClick={this.handleApprove}>通过</Button>
                  </Col>
                </React.Fragment>
              )}
            </Row>
          </div>
          <OATable
            className={styles.expensesTable}
            sync={false}
            serverSide={false}
            pagination={false}
            columns={this.expenseColumns}
            dataSource={info.expenses}
            scroll={{ y: 450 }}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}
