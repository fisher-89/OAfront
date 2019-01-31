import React, { Component } from 'react';
import ControlContent from './controls';
import styles from './index.less';

export default class Control extends Component {
  state = {
    direction: null,
  };

  checkSelected = () => {
    const { selectedControl, data, isGrid } = this.props;
    return selectedControl && (
      selectedControl === data || ('fields' in selectedControl && isGrid && selectedControl.key === data.key)
    );
  }

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
    const { data, grid, onResize } = this.props;
    const { direction } = this.state;
    const { x, y } = this.fetchClientXY(e);
    onResize(data, grid, direction, x, y);
  }

  handleResizeConfirm = () => {
    document.removeEventListener('mousemove', this.handleResizeMove);
    document.removeEventListener('mouseup', this.handleResizeConfirm);
    this.setState({ direction: null });
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

  makeContent = () => {
    const { isGrid, data } = this.props;
    const isSelected = this.checkSelected();
    const typesWithMultipleRow = ['array', 'file', 'text'];
    return (
      <div
        className={styles.content}
        onMouseDown={this.mouseDown}
      >
        <ControlContent data={data} />
        {isSelected ? (
          <div className={styles.clickBoardSelected}>
            {(isGrid || data.is_checkbox || typesWithMultipleRow.indexOf(data.type) !== -1) ? (
              <React.Fragment>
                <div
                  className={`${styles.topResize} is-control`}
                  onMouseDown={this.handleResize('top')}
                />
                <div
                  className={`${styles.bottomResize} is-control`}
                  onMouseDown={this.handleResize('bottom')}
                />
              </React.Fragment>
            ) : null}
            <React.Fragment>
              <div
                className={`${styles.leftResize} is-control`}
                onMouseDown={this.handleResize('left')}
              />
              <div
                className={`${styles.rightResize} is-control`}
                onMouseDown={this.handleResize('right')}
              />
            </React.Fragment>
          </div>
        ) : (
          <div className={styles.clickBoard} />
        )}
      </div>
    );
  }

  render() {
    const { isGrid, data, draggingControl } = this.props;
    const { direction } = this.state;
    const isSelected = this.checkSelected();
    return (
      <div
        className={`${styles.control} is-control`}
        style={{
          width: `${(data.col * 61) - 1}px`,
          height: `${(data.row * 61) - 1}px`,
          top: `${(data.y * 61) + 1}px`,
          left: `${(data.x * 61) + 1}px`,
          zIndex: isSelected ? 1 : 0,
        }}
      >
        {this.makeContent()}
        {isGrid && (
          <React.Fragment>
            <div
              className={styles.gridRow}
              style={{
                left: `-${data.x * 61}px`,
                width: `${Math.max((data.x * 61) - 1, 0)}px`,
              }}
            />
            <div
              className={styles.gridRow}
              style={{
                right: `-${(20 - data.x - data.col) * 61}px`,
                width: `${Math.max(((20 - data.x - data.col) * 61) - 1, 0)}px`,
              }}
            />
            <div
              className={styles.childrenBg}
              style={{ height: `${((data.row - 2) * 61) + 1}px` }}
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
        {direction && (
          <div
            className={styles.resizingBoard}
            style={{
              cursor: direction === 'left' || direction === 'right' ? 'ew-resize' : 'ns-resize',
            }}
          />
        )}
      </div>
    );
  }
}
