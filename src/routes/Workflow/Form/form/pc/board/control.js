import React, { Component } from 'react';
import { Dropdown, Menu } from 'antd';

export default class Control extends Component {
  contextMenu = () => {
    return (
      <Menu>
        <Menu.Item>
          删除
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const { data, grid } = this.props;
    return (
      <Dropdown
        trigger={['contextMenu']}
        overlay={this.contextMenu()}
      >
        <div
          style={{
            width: `${(data.col * 76) - 1}px`,
            height: `${(data.row * 76) - 1}px`,
            top: `${(data.y * 76) + 1}px`,
            left: `${(data.x * 76) + 1}px`,
            backgroundColor: grid ? 'none' : 'seagreen',
            border: grid ? '1px solid seagreen' : 'none',
          }}
        >
          {data.name}
        </div>
      </Dropdown>
    );
  }
}
