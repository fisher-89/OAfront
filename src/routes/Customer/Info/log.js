import React, { PureComponent } from 'react';
// import { connect } from 'dva';

import OATable from '../../../components/OATable';
// import OAForm, { OAModal } from '../../../components/OAForm';

export default class Validator extends PureComponent {
  state = {};

  makeColumns = () => {
    const columns = [
      {
        // width: 80,
        title: '序号',
        align: 'center',
        dataIndex: 'id',
        sorter: true,
      },
      {
        // width: 100,
        align: 'center',
        title: '操作类型',
        dataIndex: 'type_id',
        searcher: true,
      },
      {
        // width: 200,
        align: 'center',
        title: '员工姓名',
        dataIndex: 'staff_name',
      },
      {
        // width: 80,
        title: 'IP地址',
        align: 'center',
        dataIndex: 'ip',
      },
      {
        // width: 80,
        title: '操作时间',
        align: 'center',
        dataIndex: 'time',
      },
      {
        title: '操作',
        render: (rowData) => {
          return <a onClick={() => this.handleEdit(rowData)}>查看</a>;
        },
      },
    ];
    return columns;
  }

  render() {
    return (
      <OATable
        data={[]}
        serverSide
        columns={this.makeColumns()}
      />
    );
  }
}
