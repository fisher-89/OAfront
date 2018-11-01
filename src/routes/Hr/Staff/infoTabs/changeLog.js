/**
 * Created by Administrator on 2018/4/15.
 */
import React, { PureComponent } from 'react';
import OATable from '../../../../components/OATable';

export default class extends PureComponent {
  componentWillMount() {

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
      title: '操作时间',
      dataIndex: 'actiontimer',
    },
    {
      title: '操作人',
      dataIndex: 'action',
    },
  ]

  render() {
    return (
      <OATable
        columns={[]}
        data={[]}
      />
    );
  }
}
