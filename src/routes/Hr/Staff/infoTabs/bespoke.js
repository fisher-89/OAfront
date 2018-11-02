/**
 * Created by Administrator on 2018/4/15.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import OATable from '../../../../components/OATable';

@connect(({ staffs, loading }) => ({
  list: staffs.staffBespokeDetails,
  loading: loading.effects['staffs/fetchBespokeStaff'],
}))
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.id = props.staffSn;
  }

  columns = [
    {
      title: '执行日期',
      dataIndex: 'timer',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '变更前',
      dataIndex: 'cheng1',
    },
    {
      title: '变更后',
      dataIndex: 'change2',
    },
    {
      title: '操作时间',
      dataIndex: 'actiontimer',
    },
    {
      title: '操作',
      dataIndex: 'action',
    },
  ]

  fetch = () => {
    const { dispatch, staffSn } = this.props;
    this.id = staffSn;
    dispatch({ type: 'staffs/fetchBespokeStaff', payload: { id: this.id } });
  }

  render() {
    const { list, loading } = this.props;
    const data = list[this.id] || [];
    return (
      <OATable
        data={data}
        loading={loading}
        columns={this.columns}
        fetchDataSource={this.fetch}
      />
    );
  }
}
