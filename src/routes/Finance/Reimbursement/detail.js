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
  Modal,
} from 'antd';
import { connect } from 'dva';
import RcViewer from 'rc-viewer';
import CountUp from 'react-countup';
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
  expenseTypes: reimbursement.expenseTypes,
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
      const auditedCost = newProps.info.audited_cost && `${newProps.info.audited_cost}`;
      const approvedCost = newProps.info.send_cost && `${newProps.info.approved_cost || newProps.info.send_cost}`;
      if (newProps.info.expenses) {
        newProps.info.expenses.forEach(item => { // eslint-disable-line arrow-parens
          if (item.audited_cost === null) {
            item.audited_cost = item.send_cost; // eslint-disable-line no-param-reassign
          }
        });
      }
      this.originalTotal = parseFloat(auditedCost !== null ? auditedCost : approvedCost);
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
      dataIndex: 'type_id',
      width: 80,
      render: (cellData) => {
        const { expenseTypes } = this.props;
        return (
          <Tooltip title={expenseTypes.filter(item => item.id === cellData)[0].name}>
            <Avatar size="small" src={`${expenseTypes.filter(item => item.id === cellData)[0].pic_path}`} />
          </Tooltip>
        );
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
        let afterChange;
        return info.status_id === 3 ? (
          <InputNumber
            defaultValue={cellData || rowData.send_cost}
            onChange={(value) => {
              clearTimeout(afterChange);
              afterChange = setTimeout(() => {
                if (info.expenses[index].audited_cost !== value.toFixed(2)) {
                  info.expenses[index].audited_cost = value.toFixed(2);
                  info.audited_cost = this.sumAuditedCost(info);
                  this.setState({ info }, () => {
                    this.originalTotal = parseFloat(info.audited_cost);
                  });
                  dispatch({
                    type: 'reimbursement/updateDetail',
                    payload: info,
                  });
                }
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
                        src={`${bill.pic_path}`}
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
    if (info.expenses) {
      info.expenses.forEach((expense) => {
        sum += parseFloat(expense.audited_cost) || parseFloat(expense.send_cost);
      });
    }
    return sum.toFixed(2);
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
        this.handleApprove();
      },
    });
  }

  handleApprove = () => {
    const { dispatch } = this.props;
    const { info } = this.state;

    dispatch({
      type: 'reimbursement/approveByAccountant',
      payload: {
        id: info.id,
        expenses: info.expenses.map((item) => {
          const response = { ...item };
          if (!item.audited_cost) {
            response.audited_cost = item.send_cost;
          }
          return response;
        }),
        accountant_remark: this.approveRemark,
      },
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

  handlePay = () => {
    const { dispatch } = this.props;
    const { info } = this.state;
    dispatch({
      type: 'reimbursement/pay',
      payload: {
        id: [info.id],
      },
    });
  }

  handlePayReject = () => {
    const { dispatch } = this.props;
    const { info, rejectRemark } = this.state;
    this.setState({
      rejectPopVisible: true,
    });
    dispatch({
      type: 'reimbursement/rejectByCashier',
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

  renderStamp = () => {
    const { info } = this.state;
    if (info.status_id === 6 && customerAuthority(135)) {
      return <img alt="未转账" style={{ position: 'absolute', top: 9, marginLeft: 10 }} src="/images/未转账.png" />;
    } else if (info.status_id === 7 && customerAuthority(135)) {
      return <img alt="已转账" style={{ position: 'absolute', top: 9, marginLeft: 10 }} src="/images/已转账.png" />;
    } else if (info.status_id === -1) {
      return <img alt="驳回" style={{ position: 'absolute', top: 9, marginLeft: 10 }} src="/images/驳回.png" />;
    } else if (info.audit_time !== null && customerAuthority(34)) {
      return <img alt="通过" style={{ position: 'absolute', top: 9, marginLeft: 10 }} src="/images/通过.png" />;
    } else if (info.second_rejected_at !== null && customerAuthority(135)) {
      return <img alt="被驳回" style={{ position: 'absolute', top: 9, marginLeft: 10 }} src="/images/被驳回.png" />;
    }
  }

  render() {
    const { onClose, status } = this.props;
    const { info, rejectPopVisible, rejectRemark } = this.state;
    if (info) {
      const auditedCost = info.audited_cost && `${info.audited_cost}`;
      const approvedCost = info.send_cost && `${info.approved_cost || info.send_cost}`;
      return (
        <div>
          <div>
            <button className={styles.detailClose} onClick={onClose}><span /></button>
            <h2>
              {info.description}&nbsp;
              <small style={{ color: '#8c8c8c' }}>{info.reim_sn}</small>
              {this.renderStamp()}
            </h2>
            <p style={{ color: '#8c8c8c' }}>{info.remark}</p>
            <Row style={{ color: '#8c8c8c' }}>
              <Col span={4}>状态：{status.filter(item => item.id === info.status_id)[0].name}</Col>
              <Col span={20}>
                收款账户：{info.payee_bank_other} {info.payee_bank_account} {info.payee_name}
                {info.payee_is_public ? (<span style={{ color: 'red' }}> (对公转账)</span>) : ''}
              </Col>
              <Col span={4}>申请人：{info.realname}</Col>
              <Col span={8}>申请时间：{info.send_time}</Col>
              {info.approve_time && (<Col span={4}>审批人：{info.approver_name}</Col>)}
              {info.approve_time && (<Col span={8}>通过时间：{info.approve_time}</Col>)}
            </Row>
            <Row style={{ color: '#8c8c8c', marginTop: 5 }}>
              {info.audit_time && (<Col span={4}>财务审核人：{info.accountant_name}</Col>)}
              {info.audit_time && (<Col span={8}>通过时间：{info.audit_time}</Col>)}
            </Row>
            {info.accountant_remark && (
              <Row style={{ color: '#8c8c8c' }}>
                {info.audit_time && (<Col span={22}>{info.accountant_remark}</Col>)}
              </Row>
            )}
            <Row style={{ color: '#8c8c8c', marginTop: 5 }}>
              {info.manager_approved_at && (<Col span={4}>品牌副总：{info.manager_name}</Col>)}
              {info.manager_approved_at && (<Col span={8}>通过时间：{info.manager_approved_at}</Col>)}
              {info.paid_at && (<Col span={4}>出纳：{info.payer_name}</Col>)}
              {info.paid_at && (<Col span={8}>转账时间：{info.paid_at}</Col>)}
            </Row>
            <Row style={{ color: '#8c8c8c' }}>
              {info.second_rejected_at && (<Col span={4}>驳回人：{info.second_rejecter_name}</Col>)}
              {info.second_rejected_at && (<Col span={8}>驳回时间：{info.second_rejected_at}</Col>)}
              {info.reject_time && (<Col span={4}>驳回人：{info.reject_name}</Col>)}
              {info.reject_time && (<Col span={8}>驳回时间：{info.reject_time}</Col>)}
            </Row>
            <Row style={{ color: '#8c8c8c' }}>
              {info.second_rejected_at && (<Col span={24}>驳回理由：{info.second_reject_remarks}</Col>)}
              {info.reject_time && (<Col span={24}>驳回理由：{info.reject_remarks}</Col>)}
            </Row>
            <Row>
              <Col span={4} style={{ textAlign: 'right' }}>
                <h3>
                  <Row>
                    <Col span={8}>金额：</Col>
                    <Col span={16} style={{ textAlign: 'right' }}>
                      <CountUp
                        start={this.originalTotal || 0}
                        end={parseFloat(auditedCost !== null ? auditedCost : approvedCost)}
                        delay={0}
                        duration={0.5}
                        decimals={2}
                        prefix="￥ "
                        separator=","
                      />
                    </Col>
                  </Row>
                </h3>
                {auditedCost !== null && (parseFloat(`${auditedCost}`) !== parseFloat(`${approvedCost}`)) && (
                  <div style={{ textDecoration: 'line-through', color: '#999', marginTop: -10 }}>
                    ￥ {approvedCost.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </div>
                )}
              </Col>
            </Row>
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
                      title={(
                        <div>
                          <p>确认驳回？</p>
                          <TextArea
                            placeholder="请输入驳回原因"
                            style={{ width: 300 }}
                            value={rejectRemark}
                            autosize={{ minRows: 4 }}
                            onChange={(e) => {
                              const { value } = e.target;
                              this.setState({ rejectRemark: value });
                            }}
                          />
                        </div>
                      )}
                      onConfirm={this.handleReject}
                    >
                      <Button>驳回</Button>
                    </Popconfirm>
                  </Col>
                  <Col span={2}>
                    <Button type="primary" onClick={this.confirmApprove}>通过</Button>
                  </Col>
                </React.Fragment>
              )}
              {customerAuthority(135) && info.status_id === 6 && (
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
                      title={(
                        <div>
                          <p>确认驳回？</p>
                          <TextArea
                            placeholder="请输入驳回原因"
                            style={{ width: 300 }}
                            value={rejectRemark}
                            autosize={{ minRows: 4 }}
                            onChange={(e) => {
                              const { value } = e.target;
                              this.setState({ rejectRemark: value });
                            }}
                          />
                        </div>
                      )}
                      onConfirm={this.handlePayReject}
                    >
                      <Button>驳回</Button>
                    </Popconfirm>
                  </Col>
                  <Col span={2}>
                    <Button type="primary" onClick={this.handlePay}>转账</Button>
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
