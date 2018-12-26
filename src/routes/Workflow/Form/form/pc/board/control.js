import React, { Component } from 'react';
import { Dropdown, Menu } from 'antd';
import styles from '../template.less';

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
          className={styles.control}
          style={{
            width: `${(data.col * 76) - 1}px`,
            height: `${(data.row * 76) - 1}px`,
            top: `${(data.y * 76) + 1}px`,
            left: `${(data.x * 76) + 1}px`,
            backgroundColor: grid ? 'yellowgreen' : 'seagreen',
          }}
        >
          {data.name}
          {grid && (
            <div className={styles.content}>
              {data.fields.map((field) => {
                return field.x !== null ? (
                  <Dropdown
                    key={`${data.key}-${field.key}`}
                    trigger={['contextMenu']}
                    overlay={this.contextMenu()}
                  >
                    <div
                      className={styles.control}
                      style={{
                        width: `${(field.col * 76) - 1}px`,
                        height: `${(field.row * 76) - 1}px`,
                        top: `${field.y * 76}px`,
                        left: `${field.x * 76}px`,
                        backgroundColor: 'seagreen',
                      }}
                    >
                      {field.name}
                    </div>
                  </Dropdown>
                ) : null;
              })}
            </div>
          )}
        </div>
      </Dropdown>
    );
  }
}
