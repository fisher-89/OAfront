import React from 'react';
// import RcViewer from 'rc-viewer';
import { Drawer } from 'antd';
import { forIn, isArray } from 'lodash';
// import district from '../../../assets/district';
import OATable from '../../../../components/OATable';
// import { customerAuthority } from '../../../../utils/utils';

const columns = [{
  width: 100,
  tooltip: true,
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


// const rcViewerOptions = {
//   navbar: true,
//   toolbar: {
//     zoomIn: 0,
//     zoomOut: 0,
//     oneToOne: 0,
//     reset: 0,
//     prev: {
//       show: 2,
//       size: 'large',
//     },
//     play: 0,

//     rotateLeft: {
//       show: 2,
//       size: 'large',
//     },
//     rotateRight: {
//       show: 2,
//       size: 'large',
//     },
//     next: {
//       show: 2,
//       size: 'large',
//     },
//     flipHorizontal: 0,
//     flipVertical: 0,
//   },
// };

export default class extends React.PureComponent {
  render() {
    const restProps = { ...this.props };
    const { initialValue } = restProps;
    delete restProps.initialValue;
    const changes = initialValue.changes || {};
    const data = [];
    // const style = { cursor: 'pointer' };
    forIn(changes, (value, name) => {
      let dirty;
      let original;
      if (isArray(value)) {
        [dirty, original] = value;
        data.push({
          name,
          key: name,
          dirty: dirty || '(空)',
          original: original || '(空)',
        });
      } else {
        forIn(value, (v, n) => {
          [dirty, original] = v;
          data.push({
            key: `${name}-${n}`,
            name: `${name}-${n}`,
            dirty: dirty || '(空)',
            original: original || '(空)',
          });
        });
      }
    });

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
      </Drawer>
    );
  }
}

