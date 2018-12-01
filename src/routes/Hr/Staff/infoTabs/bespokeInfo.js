import React from 'react';
import { Drawer } from 'antd';

export default class extends React.PureComponent {
  render() {
    const { changes, visible } = this.props;
    const list = Object.keys(changes || {}).map(k => <p key={k}>{k}：{changes[k]}</p>);
    return (
      <Drawer
        title="变更信息"
        mask
        closable
        width={440}
        maskClosable
        placement="right"
        onClose={this.props.onClose}
        visible={visible}
      >
        {list}
      </Drawer>
    );
  }
}

