import React from 'react';
import RcViewer from 'rc-viewer';
import { Drawer, Button } from 'antd';
import store from './store/store';
import district from '../../../assets/district';
import OATable from '../../../components/OATable';
import { customerAuthority } from '../../../utils/utils';

const columns = [{
  width: 100,
  title: '变更信息',
  dataIndex: 'name',
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


const rcViewerOptions = {
  navbar: true,
  toolbar: {
    zoomIn: 0,
    zoomOut: 0,
    oneToOne: 0,
    reset: 0,
    prev: {
      show: 2,
      size: 'large',
    },
    play: 0,

    rotateLeft: {
      show: 2,
      size: 'large',
    },
    rotateRight: {
      show: 2,
      size: 'large',
    },
    next: {
      show: 2,
      size: 'large',
    },
    flipHorizontal: 0,
    flipVertical: 0,
  },
};
@store('clientReduction')
export default class extends React.PureComponent {
  handleClick = () => {
    const {
      type,
      onSuccess,
      initialValue,
      clientReduction,
      initialValue: { id },
    } = this.props;
    if (id && (
      initialValue.status === 1 || (
        customerAuthority(191) && initialValue.status === -1
      )
    )) {
      clientReduction(id, () => {
        const params = !type ? { page: 1, pageSize: 10, filters: '', sort: 'id-desc' } : undefined;
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
    const style = { cursor: 'pointer' };
    Object.keys(changes).forEach((key, index) => {
      let [dirty, original] = changes[key];
      if (['县级', '市级', '省级'].indexOf(key) !== -1) {
        dirty = (district.find(item => `${item.id}` === dirty) || {}).name;
        original = (district.find(item => `${item.id}` === original) || {}).name;
      }

      if (['头像照片'].indexOf(key) !== -1) {
        dirty = dirty[1] && (
          <RcViewer options={rcViewerOptions}>
            <img src={dirty[1]} width={30} height={30} alt="变更前" style={style} />
          </RcViewer>
        );
        original = original[1] && (
          <RcViewer options={rcViewerOptions}>
            <img src={original[1]} width={30} height={30} alt="变更后" style={style} />
          </RcViewer>
        );
      }

      if (['身份证照片反面', '身份证照片正面'].indexOf(key) !== -1) {
        dirty = dirty && (
          <RcViewer options={rcViewerOptions}>
            <img src={dirty} width={30} height={30} alt="变更前" style={style} />
          </RcViewer>
        );
        original = original && (
          <RcViewer options={rcViewerOptions}>
            <img src={original} width={30} height={30} alt="变更后" style={style} />
          </RcViewer>
        );
      }

      data.push({
        key: index,
        name: key,
        create_at: initialValue.created_at,
        dirty: dirty || '(空)',
        original: original || '(空)',
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
            sync={false}
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

