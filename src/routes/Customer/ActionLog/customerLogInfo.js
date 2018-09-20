import React from 'react';
import { Drawer, Button } from 'antd';
import store from './store/store';
import { getAddress } from '../Info/info';
import { customerAuthority } from '../../../utils/utils';
import OATable from '../../../components/OATable';

const columns = [{
  title: '变更信息',
  dataIndex: 'name',
  width: 100,
}, {
  width: 100,
  title: '变更前',
  dataIndex: 'dirty',
  render: (key) => {
    return OATable.renderEllipsis((<span style={{ color: '#8c8c8c' }}>{key}</span>), true);
  },
}, {
  width: 100,
  title: '变更后',
  dataIndex: 'original',
  tooltip: true,
}];

@store('clientReduction')
export default class extends React.PureComponent {
  handleClick = () => {
    const { onSuccess, initialValue, initialValue: { id }, clientReduction, type } = this.props;
    if (id && initialValue.status === 1) {
      clientReduction(id, () => {
        const params = !type ? { page: 1, pageSize: 10, filters: '' } : undefined;
        onSuccess(params);
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
      const [dirtyStr, originalStr] = changes[key];
      if (dirtyStr && Object.keys(dirtyStr).length) {
        dirty = getAddress(dirtyStr);
      } else {
        [dirty] = changes[key];
      }
      if (originalStr && Object.keys(originalStr).length) {
        original = getAddress(originalStr);
      } else {
        [, original] = changes[key];
      }
      data.push({
        key: index,
        name: key,
        create_at: initialValue.created_at,
        dirty,
        original,
      });
    });
    let disabled = true;
    if (initialValue.status === 1 || (
      customerAuthority(191) && initialValue.status === -1
    )) {
      disabled = false;
    }
    return (
      <Drawer
        {...restProps}
        width={540}
        title="操作信息"
      >
        <div style={{ marginBottom: 40 }}>
          <OATable
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </div>
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
            disabled={disabled}
          >还原
          </Button>
        </div>
      </Drawer>
    );
  }
}

