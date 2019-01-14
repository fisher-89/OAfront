import React, { Component } from 'react';
import { Menu } from 'antd';
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
    if (className.indexOf('Resize') !== -1) return false;
    this.target = e.target;
    this.client = this.fetchClientXY(e);
    document.addEventListener('mouseup', this.handleSelect);
    this.target.addEventListener('mouseup', this.cancelDrag);
    this.target.addEventListener('mouseleave', this.startDrag);
    this.dragTimeout = setTimeout(() => {
      this.startDrag();
    }, 150);
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
    this.target.removeEventListener('mouseleave', this.startDrag);
    this.target.removeEventListener('mouseup', this.cancelDrag);
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
    const { direction } = this.state;
    if (direction === 'top' || direction === 'bottom') this.nsMove(e);
    if (direction === 'left' || direction === 'right') this.ewMove(e);
  }

  nsMove = (e) => {
    const { data, grid, onResize, board, lines } = this.props;
    const { direction } = this.state;
    const { y } = this.fetchClientXY(e);
    const { top } = board.getBoundingClientRect();
    const minRow = defaultSize(data).row;
    const originRow = direction === 'top' ? data.y : data.y + data.row;
    const exactRow = (y - top) / 76;
    const row = Math.round(exactRow + (exactRow < originRow ? 0.1 : -0.1));
    if (row < 0 || row > lines) return false;
    let newRow = data.row;
    let newY = data.y;
    if (direction === 'top' && row !== data.y) {
      newRow -= row - data.y;
      newY = row;
    } else if (direction === 'bottom' && row !== data.y + newRow) {
      newRow = row - data.y;
    }
    if ((newRow !== data.row || newY !== data.y) && newRow >= minRow) {
      onResize(data, grid, data.col, newRow, data.x, newY);
    }
  }

  ewMove = (e) => {
    const { data, grid, onResize, board } = this.props;
    const { direction } = this.state;
    const { x } = this.fetchClientXY(e);
    const { left } = board.getBoundingClientRect();
    const minCol = defaultSize(data).col;
    const originCol = direction === 'left' ? data.x : data.x + data.col;
    const exactCol = (x - left) / 76;
    const col = Math.round(exactCol + (exactCol < originCol ? 0.1 : -0.1));
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
      onResize(data, grid, newCol, data.row, newX, data.y);
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
    const isSelected = selectedControl && (
      selectedControl === data ||
      ('fields' in selectedControl && 'fields' in data && selectedControl.key === data.key)
    );
    return (
      <div
        className={styles.content}
        onMouseDown={this.mouseDown}
        onTouchStart={this.mouseDown}
        onTouchEnd={this.mouseDown}
      >
        <ControlContent data={data} />
        {isSelected ? (
          <div className={styles.clickBoardSelected}>
            {(isGrid || data.is_checkbox || data.type === 'array') ? (
              <React.Fragment>
                <div
                  className={styles.topResize}
                  onMouseDown={this.handleResize('top')}
                  onTouchStart={this.handleResize('top')}
                  onTouchEnd={this.handleResize('top')}
                />
                <div
                  className={styles.bottomResize}
                  onMouseDown={this.handleResize('bottom')}
                  onTouchStart={this.handleResize('bottom')}
                  onTouchEnd={this.handleResize('bottom')}
                />
              </React.Fragment>
            ) : null}
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
    const isSelected = selectedControl && (
      selectedControl === data ||
      ('fields' in selectedControl && 'fields' in data && selectedControl.key === data.key)
    );
    return (
      <div
        className={`${styles.control} ${isSelected ? styles.selected : ''}`}
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
            <div
              className={styles.childrenBg}
              onClick={selectedControl && onCancelSelect}
              style={{ height: `${((data.row - 2) * 76) + 1}px` }}
            />
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
