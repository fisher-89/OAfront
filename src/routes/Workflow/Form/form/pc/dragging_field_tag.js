import React, { Component } from 'react';
import { Tag } from 'antd';
import { getDefaultSize } from './supports/control_size';
import _fetchUsedCell from './supports/fetch_used_cell';
import ControlContent from './board/controls';
import styles from './template.less';

class DraggingFieldTag extends Component {
  state = {
    offset: { x: 0, y: 0 },
    onTemplate: false, // 当前鼠标是否在模板上
    data: null,
    relativeX: 0, // 点击相对位置（水平）
    relativeY: 0, // 点击相对位置（垂直）
    usedCell: [], // 已占用的单元格
    dropAvailable: true, // 是否可以放置
  }

  componentWillMount() {
    document.addEventListener('mousemove', this.dragField);
    document.addEventListener('touchmove', this.dragField);
    document.addEventListener('mouseup', this.loosenDrag);
    document.addEventListener('touchend', this.loosenDrag);
    const { data, startPoint: { x, y }, startPosition: { top, bottom, left, right } } = this.props;
    const { col, row } = data.col !== null ? data : getDefaultSize(data);
    this.state.data = { ...data, col, row };
    this.state.relativeX = (x - left) / (right - left);
    this.state.relativeY = (y - top) / (bottom - top);
    if (data.x !== null) {
      this.state.onTemplate = true;
      this.state.offset = { x: data.x * 61, y: data.y * 61 };
    }
    this.state.usedCell = this.fetchUsedCell();
    this.fetchTemplatePosition();
  }

  fetchTemplatePosition = () => {
    const { board, parentGrid } = this.props;
    const boardRect = board.getBoundingClientRect();
    let { top, bottom, left, right } = boardRect;
    if (parentGrid && parentGrid.x !== null) {
      top += (parentGrid.y + 1) * 61;
      bottom = top + ((parentGrid.row - 2) * 61);
      left += parentGrid.x * 61;
      right = left + (parentGrid.col * 61);
    }
    this.templateTop = top;
    this.templateBottom = bottom;
    this.templateLeft = left;
    this.templateRight = right;
  }

  /**
   * 获取已占用的单元格
   * @returns {Array}
   */
  fetchUsedCell = () => {
    const { fields, grids, parentGrid, data } = this.props;
    return _fetchUsedCell(data, parentGrid, fields, grids);
  }

  /**
   * 鼠标拖拽
   * @param e
   */
  dragField = (e) => {
    e.preventDefault();
    const { parentGrid } = this.props;
    const { clientX, clientY } = event.type === 'touchmove' ? e.touches[0] : e;
    let onTemplate = clientX >= this.templateLeft
      && clientX <= this.templateRight
      && clientY >= this.templateTop
      && clientY <= this.templateBottom;
    if (parentGrid && parentGrid.x === null) onTemplate = false;
    if (onTemplate) {
      this.handleDragControl(clientX, clientY);
    } else {
      this.handleDragTag(clientX, clientY);
    }
  }

  handleDragTag = (clientX, clientY) => {
    const { startPoint: { x, y } } = this.props;
    this.setState({
      offset: { x: clientX - x, y: clientY - y },
      onTemplate: false,
    });
  }

  handleDragControl = (clientX, clientY) => {
    const { data, relativeX, relativeY } = this.state;
    const { width, height } = this.calculateSize();
    const pointCol = Math.floor(data.col * relativeX);
    const pointRow = Math.floor(data.row * relativeY);
    const maxX = Math.floor((this.templateRight - width - this.templateLeft) / 61);
    const maxY = Math.floor((this.templateBottom - height - this.templateTop) / 61);
    const newX = Math.min(Math.max(
      Math.floor((clientX - this.templateLeft) / 61) - pointCol, 0
    ), maxX);
    const newY = Math.min(Math.max(
      Math.floor((clientY - this.templateTop) / 61) - pointRow, 0
    ), maxY);
    const offsetX = newX * 61;
    const offsetY = newY * 61;
    data.x = newX;
    data.y = newY;
    this.setState({
      offset: { x: offsetX, y: offsetY },
      onTemplate: true,
      dropAvailable: this.checkDropAvailable(data),
    });
  }

  checkDropAvailable = (data) => {
    const { usedCell } = this.state;
    const { x, y, col, row } = data;
    if (x < 0 || y < 0) return false;
    let response = true;
    for (const i in usedCell) {
      if (Object.hasOwnProperty.call(usedCell, i)) {
        const cell = usedCell[i];
        const rowIsUsed = cell.row >= y && cell.row < y + row;
        const colIsUsed = cell.col >= x && cell.col < x + col;
        if (rowIsUsed && ('fields' in data || colIsUsed)) {
          response = false;
          break;
        }
      }
    }
    return response;
  }

  loosenDrag = (e) => {
    e.preventDefault();
    const { onCancel, onConfirm, onFail } = this.props;
    const { onTemplate, data, dropAvailable } = this.state;
    document.removeEventListener('mousemove', this.dragField);
    document.removeEventListener('touchmove', this.dragField);
    document.removeEventListener('mouseup', this.loosenDrag);
    document.removeEventListener('touchend', this.loosenDrag);
    if (onTemplate && dropAvailable) {
      onConfirm(data);
    } else if (onTemplate) {
      onFail();
    } else {
      onCancel(data);
    }
  }

  calculateSize = () => {
    const { data: { col, row } } = this.state;
    const colWidth = 61;
    const rowHeight = 61;
    return { width: (colWidth * col) - 1, height: (rowHeight * row) - 1 };
  }

  render() {
    const { startPoint } = this.props;
    const { offset: { x, y }, onTemplate, data, relativeX, relativeY, dropAvailable } = this.state;
    const { width, height } = this.calculateSize();
    return onTemplate ? (
      <div
        style={{
          top: this.templateTop,
          left: this.templateLeft,
          transform: `translate(${x}px,${y}px)`,
          backgroundColor: dropAvailable ? '#e7f3fe' : '#fee4e4',
        }}
        className={styles.dragShadow}
      >
        <div
          style={{ width: `${width}px`, height: `${height}px`, margin: '1px', position: 'relative' }}
        >
          <ControlContent data={data} />
        </div>
        <div
          className={styles.dragBorder}
          style={{ border: dropAvailable ? '1px solid #1890ff' : '1px solid #f00' }}
        />
        {'fields' in data && (
          <React.Fragment>
            <div
              className={styles.gridRow}
              style={{
                left: `-${data.x * 61}px`,
                width: `${Math.max((data.x * 61) - 1, 0)}px`,
                backgroundColor: dropAvailable ? '#e7f3fe' : '#fee4e4',
                paddingLeft: '1px',
              }}
            />
            <div
              className={styles.gridRow}
              style={{
                right: `-${(20 - data.x - data.col) * 61}px`,
                width: `${Math.max(((20 - data.x - data.col) * 61) - 1, 0)}px`,
                backgroundColor: dropAvailable ? '#e7f3fe' : '#fee4e4',
                paddingRight: '1px',
              }}
            />
          </React.Fragment>
        )}
      </div>
    ) : (
      <div
        style={{
          top: startPoint.y,
          left: startPoint.x,
          transform: `translate(${x}px,${y}px)`,
          height: '22px',
        }}
        className={styles.dragShadow}
      >
        <Tag style={{ left: `-${relativeX * 100}%`, top: `-${relativeY * 100}%` }} color="blue">
          {data.name}
        </Tag>
      </div>
    );
  }
}

export default DraggingFieldTag;
