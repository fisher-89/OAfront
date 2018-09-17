import React from 'react';
import { Drawer, Table, Button } from 'antd';
import store from './store/store';
import { getAddress } from '../Info/info';

const columns = [{
  title: '变更信息',
  dataIndex: 'name',
}, {
  title: '操作时间',
  dataIndex: 'create_at',
}];

@store('clientReduction')
export default class extends React.PureComponent {
  handleClick = () => {
    const { initialValue: { id }, clientReduction } = this.props;
    if (id && initialValue.status === 1) {
      clientReduction(id, () => {
        this.props.onClose();
      });
    }
  }

  render() {
    const restProps = { ...this.props };
    const { initialValue } = restProps;
    delete restProps.initialValue;
    const changes = !Array.isArray(initialValue.changes) ? (initialValue.changes || {}) : {};
    const data = [];
    Object.keys(changes).forEach((key, index) => {
      let dirty;
      let original;
      try {
        const dirtyStr = JSON.parse(changes[key][0]);
        const originalStr = JSON.parse(changes[key][1]);
        if (Object.keys(dirtyStr).length) {
          dirty = getAddress(dirtyStr);
        } else {
          [dirty] = changes[key];
        }
        if (Object.keys(originalStr).length) {
          original = getAddress(originalStr);
        } else {
          [, original] = changes[key];
        }
      } catch (e) {
        [dirty, original] = changes[key];
      }
      data.push({
        key: index,
        name: key,
        create_at: initialValue.created_at,
        dirty,
        original,
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
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button
            style={{
              marginRight: 8,
            }}
            onClick={this.props.onClose}
          >
            取消
          </Button>
          <Button
            type="primary"
            onClick={this.handleClick}
            disabled={initialValue.status !== 1}
          >还原
          </Button>
        </div>
      </Drawer>
    );
  }
}

