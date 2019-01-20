import React, { Component } from 'react';
import ControlContent from '../controls';
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
    const { direction } = this.state;
    const isSelected = selectedControl && (
      selectedControl === data ||
      ('fields' in selectedControl && 'fields' in data && selectedControl.key === data.key)
    );
    return (
      <div
        className={`${styles.control} ${isSelected ? styles.selected : ''}`}
        style={{
          width: `${(data.col * 61) - 1}px`,
          height: `${(data.row * 61) - 1}px`,
          top: `${(data.y * 61) + 1}px`,
          left: `${(data.x * 61) + 1}px`,
        }}
      >
        {this.makeContent()}
        {isGrid && (
          <React.Fragment>
            <div
              className={styles.childrenBg}
              onClick={selectedControl && onCancelSelect}
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
            style={{
              position: 'fixed',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              cursor: direction === 'left' || direction === 'right' ? 'ew-resize' : 'ns-resize',
              zIndex: 1000,
            }}
          />
        )}
      </div>
    );
  }
}
