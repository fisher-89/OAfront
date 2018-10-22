import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Divider } from 'antd';
import RevokeForm from './revokeForm';
import { customerAuthority } from '../../../utils/utils';
import EventLogInfo from './Info/info';
import OATable from '../../../components/OATable';
import Ellipsis from '../../../components/Ellipsis';

const stateList = { 0: '待初审', 1: '待终审', 2: '已通过', '-1': '已驳回', '-2': '已撤回', '-3': '已删除' };

@connect(({ point, loading }) => ({
  log: point.eventLog,
  logLoading: loading.effects['point/fetchEventLog'],
}))

export default class extends PureComponent {
  state = {
    visible: false,
    revokeInfo: {},
    dataInfo: {},
    infoVisible: false,
  }

  fetchEventLog = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/fetchEventLog', payload: params });
  }

  showInfo = (record) => {
    this.setState({ dataInfo: record, infoVisible: true });
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
        dataIndex: 'title',
        searcher: true,
      },
      {
        title: '执行时间',
        dataIndex: 'executed_at',
        sorter: true,
      },
      {
        title: '事件',
        dataIndex: 'logs.id',
        searcher: true,
        render: (_, rowData) => {
          const text = rowData.logs.map(
            log => `${log.event_name}`
          ).join(';');
          return <Ellipsis tooltip lines={1} style={{ width: 300 }}>{text}</Ellipsis>;
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
          const action = [
            <a
              key="info"
              onClick={() => this.showInfo(rowData)}
            >
              查看
            </a>,
          ];
          if (customerAuthority(173) && rowData.status_id === 2) {
            action.push(<Divider key="vertical" type="vertical" />);
            action.push(<a key="cancel" onClick={() => this.showRevokeForm(rowData)}>删除</a>);
          }
          return action;
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
    const { visible, revokeInfo, infoVisible, dataInfo } = this.state;
    return (
      <React.Fragment>
        <OATable
          serverSide
          total={log.total}
          scroll={{ x: 300 }}
          dataSource={log.data}
          columns={this.makeColumns()}
          fetchDataSource={this.fetchEventLog}
          loading={logLoading || dLoading || bLoading}
        />
        <RevokeForm
          visible={visible}
          initialValue={revokeInfo}
          onCancel={this.handleModalVisible}
          onClose={() => this.setState({ revokeInfo: {} })}
        />
        <EventLogInfo
          id={dataInfo.id || ''}
          visible={infoVisible}
          onClose={() => {
            this.setState({ infoVisible: false, dataInfo: {} });
          }}
        />
      </React.Fragment>
    );
  }
}
