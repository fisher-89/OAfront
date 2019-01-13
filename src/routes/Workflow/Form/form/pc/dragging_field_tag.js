import React, { Component } from 'react';
import { Tag } from 'antd';
import defaultSize from './supports/control_size';
import ControlContent from './controls';
import styles from './template.less';

const templateArea = { minX: 593, maxX: 1505, minY: 301, maxY: 833 };

class DraggingFieldTag extends Component {
  state = {
    offset: { x: 1, y: 1 },
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
    const { col, row } = data.col !== null ? data : defaultSize(data);
    this.state.data = { ...data, col, row };
    this.state.relativeX = (x - left) / (right - left);
    this.state.relativeY = (y - top) / (bottom - top);
    if (bottom - top >= 75) {
      this.state.onTemplate = true;
    }
    this.state.usedCell = this.fetchUsedCell();
  }

  /**
   * 获取已占用的单元格
   * @returns {Array}
   */
  fetchUsedCell = () => {
    const { fields, grids, parentGrid, data } = this.props;
    const usedCell = [];
    if (parentGrid) {
      parentGrid.fields.forEach((item) => {
        if (item.x !== null && item !== data) {
          for (let col = item.x; col < item.x + item.col; col += 1) {
            for (let row = item.y; row < item.y + item.row; row += 1) {
              usedCell.push({ row, col });
            }
          }
        }
      });
    } else {
      [...fields, ...grids].forEach((item) => {
        if (item.x !== null && item !== data) {
          for (let col = item.x; col < item.x + item.col; col += 1) {
            for (let row = item.y; row < item.y + item.row; row += 1) {
              usedCell.push({ row, col });
            }
          }
        }
      });
    }
    return usedCell;
  }

  /**
   * 鼠标拖拽
   * @param e
   */
  dragField = (e) => {
    e.preventDefault();
    const { parentGrid, board } = this.props;
    const { clientX, clientY, pageX, pageY } = event.type === 'touchmove' ? e.touches[0] : e;
    const { minX, maxX, minY, maxY } = templateArea;
    const onTemplate = pageX >= minX && pageX <= maxX && pageY >= minY && pageY <= maxY;
    const boardRect = board.getBoundingClientRect();
    let { top, bottom } = boardRect;
    const { left, right } = boardRect;
    let inGrid = !parentGrid;
    if (parentGrid && parentGrid.x !== null) {
      top += ((parentGrid.y + 1) * 76);
      bottom = top + ((parentGrid.row - 2) * 76);
      inGrid = parentGrid.x !== null && clientY >= top && clientY <= bottom;
    }
    if (onTemplate && inGrid) {
      this.handleDragControl(clientX, clientY, { top, bottom, left, right });
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

  handleDragControl = (clientX, clientY, { top, bottom, left, right }) => {
    const { startPosition } = this.props;
    const { data, relativeX, relativeY } = this.state;
    const { width, height } = this.calculateSize();
    const pointCol = Math.floor(data.col * relativeX);
    const pointRow = Math.floor(data.row * relativeY);
    const maxX = Math.floor((right - width - left) / 76);
    const maxY = Math.floor((bottom - height - top) / 76);
    const newX = Math.min(Math.max(Math.floor((clientX - left) / 76) - pointCol, 0), maxX);
    const newY = Math.min(Math.max(Math.floor((clientY - top) / 76) - pointRow, 0), maxY);
    const offsetX = (newX * 76) + Math.round(left - startPosition.left) + 1;
    const offsetY = (newY * 76) + Math.round(top - startPosition.top) + 1;
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
        if (cell.row >= y && cell.row < y + row && cell.col >= x && cell.col < x + col) {
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
    const colWidth = 76;
    const rowHeight = 76;
    return { width: (colWidth * col) - 1, height: (rowHeight * row) - 1 };
  }

  render() {
    const { startPoint, startPosition: { top, left } } = this.props;
    const { offset: { x, y }, onTemplate, data, relativeX, relativeY, dropAvailable } = this.state;
    const { width, height } = this.calculateSize();
    return onTemplate ? (
      <div
        style={{
          top: top - 1,
          left: left - 1,
          transform: `translate(${x}px,${y}px)`,
          backgroundColor: dropAvailable ? '#e7f3fe' : '#fee4e4',
          border: dropAvailable ? '1px solid #1890ff' : '1px solid #f00',
        }}
        className={styles.dragShadow}
      >
        <div
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <ControlContent data={data} />
        </div>
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
