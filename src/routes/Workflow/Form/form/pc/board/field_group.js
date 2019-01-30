import React, { Component } from 'react';
import styles from './index.less';

export default class extends Component {
  state = { resizing: false }

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
    const { onDrag, data } = this.props;
    const { top, bottom, left, right } = this.target.getBoundingClientRect();
    const { x, y } = this.client;
    onDrag(data, { x, y }, { top, bottom, left, right });
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
    const { onSelect, data } = this.props;
    onSelect(data, null);
  }

  handleResize = (direction) => {
    return () => {
      this.direction = direction;
      document.addEventListener('mousemove', this.handleResizeMove);
      document.addEventListener('mouseup', this.handleResizeConfirm);
      this.setState({ resizing: true });
    };
  }

  handleResizeMove = (e) => {
    const { data, onResize } = this.props;
    const { x, y } = this.fetchClientXY(e);
    onResize(data, this.direction, x, y);
  }

  handleResizeConfirm = () => {
    document.removeEventListener('mousemove', this.handleResizeMove);
    document.removeEventListener('mouseup', this.handleResizeConfirm);
    this.direction = null;
    this.setState({ resizing: false });
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

  render() {
    const { data, selectedControl } = this.props;
    const { resizing } = this.state;
    const isSelected = selectedControl && selectedControl === data;
    return (
      <div
        className={styles.fieldGroup}
        style={{
          top: `${data.top * 61}px`,
          left: `${data.left * 61}px`,
          width: `${((data.right - data.left) * 61) + 1}px`,
          height: `${((data.bottom - data.top) * 61) + 1}px`,
          border: isSelected ? '1px solid #1890ff' : '1px solid #999',
          zIndex: isSelected ? 1 : 0,
        }}
      >
        <div className={styles.header} onMouseDown={this.mouseDown}>{data.title}</div>
        {isSelected && (
          <React.Fragment>
            <div
              className={styles.topResize}
              onMouseDown={this.handleResize('top')}
            />
            <div
              className={styles.bottomResize}
              onMouseDown={this.handleResize('bottom')}
            />
            <div
              className={styles.leftResize}
              onMouseDown={this.handleResize('left')}
            />
            <div
              className={styles.rightResize}
              onMouseDown={this.handleResize('right')}
            />
          </React.Fragment>
        )}
        {resizing && (
          <div
            className={styles.resizingBoard}
            style={{
              cursor: this.direction === 'left' || this.direction === 'right' ? 'ew-resize' : 'ns-resize',
            }}
          />
        )}
      </div>
    );
  }
}
