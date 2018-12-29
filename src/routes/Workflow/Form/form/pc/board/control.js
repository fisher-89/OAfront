import React, { Component } from 'react';
import { Dropdown, Menu } from 'antd';
import styles from '../template.less';

export default class Control extends Component {
  mouseDown = (data, grid = null) => {
    return (e) => {
      if (e.type === 'mousedown' && e.button !== 0) return false;
      const { onDrag } = this.props;
      const { top, bottom, left, right } = e.target.getBoundingClientRect();
      let x;
      let y;
      x = e.clientX;
      y = e.clientY;
      if (e.type === 'touchstart') {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      }
      onDrag(data, { x, y }, { top, bottom, left, right }, grid);
    };
  }

  gridChildrenContextMenu = () => {
    return (
      <Menu>
        <Menu.Item
          onClick={() => {
            // addLine(row);
          }}
        >
          在上方插入行
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            // addLine(row + 1);
          }}
        >
          在下方插入行
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            // deleteLine(row);
          }}
        >
          删除行
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const { data, grid } = this.props;
    return (
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
        <div
          className={styles.content}
          onMouseDown={this.mouseDown(data)}
          onTouchStart={this.mouseDown(data)}
          onTouchEnd={this.mouseDown(data)}
        >
          {data.name}
        </div>
        {grid && (
          <Dropdown
            trigger={['contextMenu']}
            overlay={this.gridChildrenContextMenu()}
          >
            <div className={styles.children} style={{ height: `${((data.row - 2) * 76) - 1}px` }}>
              {data.fields.map((field) => {
                return field.x !== null ? (
                  <div
                    className={styles.control}
                    style={{
                      width: `${(field.col * 76) - 1}px`,
                      height: `${(field.row * 76) - 1}px`,
                      top: `${(field.y * 76) + 1}px`,
                      left: `${field.x * 76}px`,
                      backgroundColor: 'seagreen',
                    }}
                  >
                    <div
                      className={styles.content}
                      onMouseDown={this.mouseDown(field, data)}
                      onTouchStart={this.mouseDown(field, data)}
                      onTouchEnd={this.mouseDown(field, data)}
                    >
                      {field.name}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </Dropdown>
        )}
      </div>
    );
  }
}
