import React, { Component } from 'react';
import { Tag } from 'antd';
import controlSize from './control_size.json';
import styles from './template.less';

const templateArea = { minX: 593, maxX: 1505, minY: 301, maxY: 833 };

class DraggingFieldTag extends Component {
  state = {
    offset: { x: 0, y: 0 },
    onTemplate: false,
  }

  componentWillMount() {
    document.addEventListener('mousemove', this.dragField);
    document.addEventListener('touchmove', this.dragField);
    document.addEventListener('mouseup', this.loosenDrag);
    document.addEventListener('touchend', this.loosenDrag);
  }

  dragField = (e) => {
    e.preventDefault();
    const { minX, maxX, minY, maxY } = templateArea;
    const { startPoint: { x, y }, style: { top, left }, board } = this.props;
    const { clientX, clientY, pageX, pageY } = event.type === 'touchmove' ? e.touches[0] : e;
    let offsetX = clientX - x;
    let offsetY = clientY - y;
    let onTemplate = false;
    if (pageX >= minX && pageX <= maxX && pageY >= minY && pageY <= maxY) {
      onTemplate = true;
      const boardGeo = board.getBoundingClientRect();
      const { width, height } = this.calculateSize();
      console.log(boardGeo);
      offsetX = (Math.floor(
        (Math.min(clientX, boardGeo.right - width) - boardGeo.left) / 76
      ) * 76) + (boardGeo.left - left) + 1;
      offsetY = (Math.floor(
        (Math.min(clientY, boardGeo.bottom - height) - boardGeo.top) / 76
      ) * 76) + (boardGeo.top - top) + 1;
    }
    this.setState({
      offset: { x: offsetX, y: offsetY },
      onTemplate,
    });
  }

  loosenDrag = (e) => {
    e.preventDefault();
    const { onCancel, onConfirm } = this.props;
    const { onTemplate } = this.state;
    document.removeEventListener('mousemove', this.dragField);
    document.removeEventListener('touchmove', this.dragField);
    document.removeEventListener('mouseup', this.loosenDrag);
    document.removeEventListener('touchend', this.loosenDrag);
    if (onTemplate) {
      onConfirm();
    } else {
      onCancel();
    }
  }

  calculateSize = () => {
    const { data } = this.props;
    const colWidth = 76;
    const rowHeight = 76;
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
    return { width: (colWidth * col) - 1, height: (rowHeight * row) - 1 };
  }

  render() {
    const { style: { top, left }, data } = this.props;
    const { offset: { x, y }, onTemplate } = this.state;
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
