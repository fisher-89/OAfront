import React, { PureComponent } from 'react';
import { connect } from 'dva';
import RevokeForm from './revokeForm';
import { customerAuthority } from '../../../utils/utils';

import OATable from '../../../components/OATable';

const stateList = { 0: '待初审', 1: '待终审', 2: '已通过', '-1': '已驳回', '-2': '已撤回', '-3': '已作废' };

@connect(({ point, loading }) => ({
  log: point.eventLog,
  logLoading: loading.effects['point/fetchEventLog'],
}))

export default class extends PureComponent {
  state = {
    visible: false,
    revokeInfo: {},
  }

  fetchEventLog = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/fetchEventLog', payload: params });
  }

  makeColumns = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        searcher: true,
        sorter: true,
      },
      {
        title: '标题',
        dataIndex: 'event_name',
        searcher: true,
      },
      {
        title: '执行时间',
        dataIndex: 'executed_at',
        sorter: true,
      },
      {
        title: '参与人',
        dataIndex: 'participant.staff_name',
        searcher: true,
        render: (_, rowData) => {
          return rowData.participant.map(
            participant => `${participant.staff_name}(A:${participant.point_a * participant.count} B:${participant.point_b * participant.count})`
          ).join(';');
        },
      },
      {
        title: '状态',
        dataIndex: 'status_id',
        filters: stateList,
        render: (text) => {
          return stateList[text];
        },
      },
      {
        title: '记录人',
        dataIndex: 'recorder_name',
        searcher: true,
      },
      {
        title: '初审人',
        dataIndex: 'first_approver_name',
        searcher: true,
      },
      {
        title: '终审人',
        dataIndex: 'final_approver_name',
        searcher: true,
      },
      {
        title: '操作',
        render: (rowData) => {
          return rowData.status_id === 2 ?
            (customerAuthority(173) && (
              <a onClick={() => this.showRevokeForm(rowData)}>作废</a>
            )) : '';
        },
      },
    ];
    return columns;
  }

  showRevokeForm = (rowData) => {
    this.setState({
      visible: true,
      revokeInfo: rowData,
    });
  }

  handleModalVisible = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { log, logLoading, dLoading, bLoading } = this.props;
    const { visible, revokeInfo } = this.state;
    return (
      <React.Fragment>
        <OATable
          serverSide
          loading={logLoading || dLoading || bLoading}
          columns={this.makeColumns()}
          dataSource={log && log.data}
          total={log && log.total}
          filtered={log && log.filtered}
          fetchDataSource={this.fetchEventLog}
          scroll={{ x: 300 }}
        />
        <RevokeForm
          visible={visible}
          initialValue={revokeInfo}
          onCancel={this.handleModalVisible}
          onClose={() => this.setState({ revokeInfo: {} })}
        />
      </React.Fragment>
    );
  }
}
