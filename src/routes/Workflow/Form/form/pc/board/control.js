import React, { Component } from 'react';
import { Dropdown, Menu } from 'antd';
import ControlContent from '../controls';
import defaultSize from '../supports/control_size';
import styles from '../template.less';

export default class Control extends Component {
  state = {
    direction: null,
  };

  mouseDown = (e) => {
    if (e.type === 'mousedown' && e.button !== 0) return false;
    const { className } = e.target;
    if (className === styles.leftResize || className === styles.rightResize) return false;
    this.target = e.target;
    this.client = this.fetchClientXY(e);
    document.addEventListener('mouseup', this.handleSelect);
    this.target.addEventListener('mouseup', this.cancelDrag);
    this.target.addEventListener('mouseleave', this.startDrag);
    this.dragTimeout = setTimeout(() => {
      this.startDrag();
    }, 100);
  }

  startDrag = () => {
    const { onDrag, data, grid } = this.props;
    const { top, bottom, left, right } = this.target.getBoundingClientRect();
    const { x, y } = this.client;
    onDrag(data, { x, y }, { top, bottom, left, right }, grid);
    this.target.removeEventListener('mouseup', this.cancelDrag);
    this.target.removeEventListener('mouseleave', this.startDrag);
    document.removeEventListener('mouseup', this.handleSelect);
  }

  cancelDrag = () => {
    clearTimeout(this.dragTimeout);
  }

  handleSelect = () => {
    document.removeEventListener('mouseup', this.handleSelect);
    document.removeEventListener('mouseleave', this.handleSelect);
    const { onSelect, data, grid } = this.props;
    onSelect(data, grid);
  }

  handleResize = (direction) => {
    return () => {
      this.state.direction = direction;
      document.addEventListener('mousemove', this.handleResizeMove);
      document.addEventListener('mouseup', this.handleResizeConfirm);
    };
  }

  handleResizeMove = (e) => {
    const { data, grid, onResize, board } = this.props;
    const { direction } = this.state;
    const { x } = this.fetchClientXY(e);
    const { left } = board.getBoundingClientRect();
    const minCol = defaultSize(data).col;
    const col = Math.round((x - left) / 76);
    if (col < 0 || col > 12) return false;
    let newCol = data.col;
    let newX = data.x;
    if (direction === 'left' && col !== data.x) {
      newCol -= col - data.x;
      newX = col;
    } else if (direction === 'right' && col !== data.x + newCol) {
      newCol = col - data.x;
    }
    if ((newCol !== data.col || newX !== data.x) && newCol >= minCol) {
      onResize(data, grid, newCol, newX);
    }
  }

  handleResizeConfirm = () => {
    document.removeEventListener('mousemove', this.handleResizeMove);
    document.removeEventListener('mouseup', this.handleResizeConfirm);
    this.state.direction = null;
  }

  fetchClientXY = (e) => {
    let x;
    let y;
    x = e.clientX;
    y = e.clientY;
    if (e.type === 'touchstart') {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }
    return { x, y };
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

  makeContent = () => {
    const { selectedControl, isGrid, data } = this.props;
    return (
      <div
        className={styles.content}
        onMouseDown={this.mouseDown}
        onTouchStart={this.mouseDown}
        onTouchEnd={this.mouseDown}
      >
        <ControlContent data={data} />
        {selectedControl === data ? (
          <div className={styles.clickBoardSelected}>
            {!isGrid && (
              <React.Fragment>
                <div
                  className={styles.leftResize}
                  onMouseDown={this.handleResize('left')}
                  onTouchStart={this.handleResize('left')}
                  onTouchEnd={this.handleResize('left')}
                />
                <div
                  className={styles.rightResize}
                  onMouseDown={this.handleResize('right')}
                  onTouchStart={this.handleResize('right')}
                  onTouchEnd={this.handleResize('right')}
                />
              </React.Fragment>
            )}
          </div>
        ) : (
          <div className={styles.clickBoard} />
        )}
      </div>
    );
  }

  render() {
    const { isGrid, selectedControl, onCancelSelect, data, draggingControl } = this.props;
    return (
      <div
        className={`${styles.control} ${selectedControl === data ? styles.selected : ''}`}
        style={{
          width: `${(data.col * 76) - 1}px`,
          height: `${(data.row * 76) - 1}px`,
          top: `${(data.y * 76) + 1}px`,
          left: `${(data.x * 76) + 1}px`,
        }}
      >
        {this.makeContent()}
        {isGrid && (
          <React.Fragment>
            <Dropdown
              trigger={['contextMenu']}
              overlay={this.gridChildrenContextMenu()}
            >
              <div
                className={styles.childrenBg}
                onClick={selectedControl && onCancelSelect}
                style={{ height: `${((data.row - 2) * 76) + 1}px` }}
              />
            </Dropdown>
            <div className={styles.children}>
              {data.fields.map((field) => {
                return field.x !== null && field !== draggingControl ? (
                  <Control
                    {...this.props}
                    key={field.key}
                    data={field}
                    grid={data}
                    isGrid={false}
                  />
                ) : null;
              })}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
