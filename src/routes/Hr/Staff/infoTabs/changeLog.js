/**
 * Created by Administrator on 2018/4/15.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import ChangeInfo from '../changeInfo';
import OATable from '../../../../components/OATable';

@connect(({ staffs, loading }) => ({
  list: staffs.staffLogDetails,
  loading: loading.effects['staffs/fetchStaffLog'],
}))
export default class extends PureComponent {
  state = {
    visible: false,
    initialValue: {},
  }

  componentWillReceiveProps(nextProps) {
    if ('actionType' in nextProps) this.setState({ visible: false, initialValue: {} });
  }

  lookUpDetails = (record) => {
    return () => {
      this.setState({ visible: true, initialValue: record });
    };
  }

  columns = [
    {
      title: '执行日期',
      dataIndex: 'operate_at',
    },
    {
      title: '类型',
      dataIndex: 'operation_type',
    },
    {
      title: '操作时间',
      dataIndex: 'updated_at',
    },
    {
      title: '操作人',
      dataIndex: 'admin.realname',
    },
    {
      title: '操作',
      render: record => <a onClick={this.lookUpDetails(record)}>查看</a>,
    },
  ]

  fetch = () => {
    const { dispatch, staffSn } = this.props;
    this.id = staffSn;
    dispatch({ type: 'staffs/fetchStaffLog', payload: { id: this.id } });
  }

  render() {
    const { list, loading } = this.props;
    const { visible, initialValue } = this.state;
    const data = list[this.id] || [];
    return (
      <React.Fragment>
        <ChangeInfo
          visible={visible}
          onClose={() => {
            this.setState({ visible: false, initialValue: {} });
          }}
          initialValue={initialValue}
        />
        <OATable
          data={data}
          loading={loading}
          columns={this.columns}
          fetchDataSource={this.fetch}
        />
      </React.Fragment>
    );
  }
}
