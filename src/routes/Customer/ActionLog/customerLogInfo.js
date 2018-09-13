import React from 'react';
import { Drawer, Table } from 'antd';

const columns = [{
  title: '变更信息',
  dataIndex: 'name',
}, {
  title: '操作时间',
  dataIndex: 'create_at',
}];


export default class extends React.PureComponent {
  render() {
    const restProps = { ...this.props };
    const { initialValue } = restProps;
    delete restProps.initialValue;
    const changes = !Array.isArray(initialValue.changes) ? (initialValue.changes || {}) : {};
    const data = [];
    Object.keys(changes).forEach((key, index) => {
      data.push({
        key: index,
        name: key,
        create_at: initialValue.created_at,
        ...changes[key],
      });
    });
    const expandedRowRender = record => (
      <React.Fragment>
        <p>变更前：<span style={{ color: '#c3c3c3' }}>{record.dirty || ''}</span></p>
        <p>变更后：<span style={{ color: '' }}>{record.original || ''}</span></p>
      </React.Fragment>
    );
    return (
      <Drawer
        {...restProps}
        width={540}
        title="操作信息"
      >
        <Table
          size="middle"
          indentSize={20}
          columns={columns}
          dataSource={data}
          pagination={false}
          expandedRowRender={expandedRowRender}
        />
      </Drawer>
    );
  }
}

