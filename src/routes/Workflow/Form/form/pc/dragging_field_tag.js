import React, { Component } from 'react';
import { Tag } from 'antd';
import controlSize from './control_size.json';
import styles from './template.less';

const templateArea = { minX: 593, maxX: 1505, minY: 301, maxY: 833 };

class DraggingFieldTag extends Component {
  state = {
    offset: { x: 0, y: 0 },
    onTemplate: false,
    data: null,
  }

  componentWillMount() {
    document.addEventListener('mousemove', this.dragField);
    document.addEventListener('touchmove', this.dragField);
    document.addEventListener('mouseup', this.loosenDrag);
    document.addEventListener('touchend', this.loosenDrag);
    const { data } = this.props;
    let { col, row } = data;
    if (col && row) {
      //
    } else if ('fields' in data) {
      col = 12;
      row = 3;
    } else {
      const size = controlSize[data.type];
      col = data.is_checkbox ? size.multiple.col : size.col;
      row = data.is_checkbox ? size.multiple.row : size.row;
    }
    this.state.data = { ...data, col, row };
  }

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
      top += ((parentGrid.y + 1) * 76) - 1;
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
    const { style } = this.props;
    const { data } = this.state;
    const { width, height } = this.calculateSize();
    const newX = Math.floor(
      (Math.min(clientX, right - width) - left) / 76
    );
    const newY = Math.max(Math.floor(
      (Math.min(clientY, bottom - height) - top) / 76
    ), 0);
    console.log(newY, clientY, bottom - height, top);
    const offsetX = (newX * 76) + (left - style.left) + 1;
    const offsetY = (newY * 76) + (top - style.top) + 1;
    this.state.data = { ...data, x: newX, y: newY };
    this.setState({
      offset: { x: offsetX, y: offsetY },
      onTemplate: true,
    });
  }

  loosenDrag = (e) => {
    e.preventDefault();
    const { onCancel, onConfirm } = this.props;
    const { onTemplate, data } = this.state;
    document.removeEventListener('mousemove', this.dragField);
    document.removeEventListener('touchmove', this.dragField);
    document.removeEventListener('mouseup', this.loosenDrag);
    document.removeEventListener('touchend', this.loosenDrag);
    if (onTemplate) {
      onConfirm(data);
    } else {
      onCancel();
    }
  }

  calculateSize = () => {
    const { data: { col, row } } = this.state;
    const colWidth = 76;
    const rowHeight = 76;
    return { width: (colWidth * col) - 1, height: (rowHeight * row) - 1 };
  }

  render() {
    const { style: { top, left } } = this.props;
    const { offset: { x, y }, onTemplate, data } = this.state;
    const { width, height } = this.calculateSize();
    return (
      <div style={{ top, left, transform: `translate(${x}px,${y}px)` }} className={styles.dragShadow}>
        {
          onTemplate ?
            (
              <div style={{ width: `${width}px`, height: `${height}px`, backgroundColor: 'red' }}>
                {data.name}
              </div>
            ) :
            (<Tag color="blue">{data.name}</Tag>)
        }
      </div>
    );
  }
}

export default DraggingFieldTag;
