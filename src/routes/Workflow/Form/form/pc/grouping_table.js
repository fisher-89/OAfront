import React, { Component } from 'react';
import fetchInsideFields from './supports/fetch_fields_in_group';
import styles from './grouping_table.less';

export default class extends Component {
  constructor(props) {
    super(props);
    if (props.data !== null) {
      const { data: { left, top, right, bottom } } = props;
      this.state = {
        left,
        top,
        right,
        bottom,
        available: true,
        isDrag: true,
      };
    }
  }

  state = {
    left: null,
    top: null,
    right: null,
    bottom: null,
    available: true,
    isDrag: false,
  }

  componentWillMount() {
    const { isDrag } = this.state;
    const { board } = this.props;
    const boardRect = board.getBoundingClientRect();
    this.templateTop = boardRect.top;
    this.templateBottom = boardRect.bottom;
    this.templateLeft = boardRect.left;
    this.templateRight = boardRect.right;
    this.templateHeight = boardRect.height;
    this.templateWidth = boardRect.width;
    if (isDrag) {
      const { startPoint: { x, y } } = this.props;
      this.startX = Math.floor((x - this.templateLeft) / this.cellSize);
      this.startY = Math.floor((y - this.templateTop) / this.cellSize);
      document.addEventListener('mousemove', this.handleDrag);
      document.addEventListener('mouseup', this.loosenDrag);
    } else {
      document.addEventListener('mousedown', this.startDrawing);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.loosenDrag);
    document.removeEventListener('mousedown', this.startDrawing);
  }

  cellSize = 61;

  /**
   * 鼠标拖拽
   * @param e
   */
  handleDrag = (e) => {
    e.preventDefault();
    const { clientX, clientY } = event.type === 'touchmove' ? e.touches[0] : e;
    const { data: { top, bottom, left, right } } = this.props;
    const lines = Math.floor((this.templateBottom - this.templateTop) / this.cellSize);
    const minX = -left;
    const maxX = 20 - right - 1;
    const minY = -top;
    const maxY = lines - bottom - 1;
    this.offsetX = Math.min(Math.max(
      Math.floor((clientX - this.templateLeft) / this.cellSize) - this.startX, minX
    ), maxX);
    this.offsetY = Math.min(Math.max(
      Math.floor((clientY - this.templateTop) / this.cellSize) - this.startY, minY
    ), maxY);
    const newData = {
      left: left + this.offsetX,
      right: right + this.offsetX,
      top: top + this.offsetY,
      bottom: bottom + this.offsetY,
    };
    this.state.available = this.checkDropAvailable(newData);
    this.setState({
      ...newData,
    });
  }

  loosenDrag = () => {
    const { data, onCancel, onDragConfirm } = this.props;
    const { available } = this.state;
    if (available) {
      onDragConfirm(data, this.offsetX, this.offsetY);
    } else {
      onCancel();
    }
  }

  checkDropAvailable = (newData) => {
    const { data, fields, grids, fieldGroups } = this.props;
    const insideFields = fetchInsideFields(data, fields, grids, fieldGroups);
    const insideCell = this.fetchNewInsideCell(newData);
    let response = true;
    fields.forEach((item) => {
      if (item.x !== null && insideFields.indexOf(item) === -1) {
        insideCell.forEach((cell) => {
          if (cell.x >= item.x && cell.x < item.x + item.col
            && cell.y >= item.y && cell.y < item.y + item.row) {
            response = false;
          }
        });
      }
    });
    grids.forEach((item) => {
      if (item.x !== null) {
        insideCell.forEach((cell) => {
          if (cell.y >= item.y && cell.y < item.y + item.row) {
            response = false;
          }
        });
      }
    });
    fieldGroups.forEach((item) => {
      if (item !== data) {
        insideCell.forEach((cell) => {
          if (cell.x >= item.left && cell.x <= item.right
            && cell.y >= item.top && cell.y <= item.bottom) {
            response = false;
          }
        });
      }
    });
    return response;
  }

  fetchNewInsideCell = (group) => {
    const cells = [];
    for (let x = group.left; x <= group.right; x += 1) {
      for (let y = group.top; y <= group.bottom; y += 1) {
        cells.push({ x, y });
      }
    }
    return cells;
  }

  cellInside = (cell, item) => {
    return cell.x >= item.x && cell.x < item.x + item.col
      && cell.y >= item.y && cell.y < item.y + item.row;
  }

  startDrawing = (e) => {
    const { clientX, clientY } = e;
    const { fields, grids, fieldGroups } = this.props;
    const onTemplate = clientX >= this.templateLeft
      && clientX <= this.templateRight
      && clientY >= this.templateTop
      && clientY <= this.templateBottom;
    if (onTemplate) {
      document.addEventListener('mousemove', this.drawing);
      document.addEventListener('mouseup', this.endDrawing);
      const left = Math.floor((clientX - this.templateLeft) / 61);
      const top = Math.floor((clientY - this.templateTop) / 61);
      this.setState({ left, top, right: left, bottom: top }, () => {
        const insideFields = fetchInsideFields(this.fetchPosition(), fields, grids, fieldGroups);
        this.setState({ available: !!insideFields });
      });
    } else {
      const { onCancel } = this.props;
      onCancel();
    }
  }

  drawing = (e) => {
    const { clientX, clientY } = e;
    const { fields, grids, fieldGroups } = this.props;
    const { right, bottom } = this.state;
    const x = Math.floor(Math.max(
      Math.min(clientX, this.templateRight - 2) - this.templateLeft, 0) / 61);
    const y = Math.floor(Math.max(
      Math.min(clientY, this.templateBottom - 2) - this.templateTop, 0) / 61);
    if (x !== right || y !== bottom) {
      this.state.right = x;
      this.state.bottom = y;
      const insideFields = fetchInsideFields(this.fetchPosition(), fields, grids, fieldGroups);
      this.setState({ available: !!insideFields });
    }
  }

  endDrawing = () => {
    document.removeEventListener('mousemove', this.drawing);
    document.removeEventListener('mouseup', this.endDrawing);
    const { onConfirm } = this.props;
    const { available } = this.state;
    if (available) {
      onConfirm(this.fetchPosition());
    } else {
      this.setState({
        left: null,
        top: null,
        right: null,
        bottom: null,
        available: true,
      });
    }
  }

  fetchPosition = () => {
    const { left, top, right, bottom } = this.state;
    return {
      top: Math.min(top, bottom),
      bottom: Math.max(top, bottom),
      left: Math.min(left, right),
      right: Math.max(left, right),
    };
  }

  render() {
    const { left, top, right, bottom, available } = this.state;
    return (
      <div
        className={styles.shadow}
        style={{
          height: `${this.templateHeight}px`,
          width: `${this.templateWidth}px`,
        }}
      >
        <div className={styles.table}>
          {left !== null && (
            <div
              className={`${styles.group} ${available ? '' : styles.forbidden}`}
              style={{
                top: `${Math.min(top, bottom) * 61}px`,
                left: `${Math.min(left, right) * 61}px`,
                height: `${((Math.abs(bottom - top) + 1) * 61) + 1}px`,
                width: `${((Math.abs(right - left) + 1) * 61) + 1}px`,
              }}
            >
              <div className={styles.header} />
            </div>
          )}
        </div>
      </div>
    );
  }
}
