/**
 * Created by Administrator on 2018/4/15.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import OATable from '../../../../components/OATable';

@connect(({ staffs, loading }) => ({
  list: staffs.staffBespokeDetails,
  loading: loading.effects['staffs/fetchBespokeStaff'] || loading.effects['staffs/deleteBespokeStaff'],
}))
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.id = props.staffSn;
  }

  columns = [
    {
      title: '执行日期',
      dataIndex: 'operate_at',
    },
    {
      title: '变更',
      dataIndex: 'changes',
      render: key => Object.keys(key).map(k => `${k}：${key[k]}`),
    },
    {
      title: '操作时间',
      dataIndex: 'updated_at',
    },
    {
      title: '操作',
      render: (record) => {
        return record.status === 1 ? <a onClick={() => this.handleCancel(record.id)}>撤消</a> : '';
      },
    },
  ]

  handleCancel = (id) => {
    const { dispatch, staffSn } = this.props;
    dispatch({ type: 'staffs/deleteBespokeStaff', payload: { id, staffSn } });
  }

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
