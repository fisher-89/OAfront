/* eslint no-param-reassign:0 */
import React, { Component } from 'react';
import Line from './line';
import Control from './control';
import styles from '../template.less';

class Board extends Component {
  constructor(props) {
    super(props);
    const { fields, grids } = props;
    let rowMax = 7;
    fields.forEach((field) => {
      rowMax = Math.max(field.y + field.row, rowMax);
    });
    grids.forEach((grid) => {
      rowMax = Math.max(grid.y + grid.row, rowMax);
    });
    const lines = [];
    for (let i = 1; i <= rowMax; i += 1) {
      lines.push(i);
    }
    this.state = { lines };
  }

  componentDidMount() {
    const { bind } = this.props;
    bind(this.board);
  }

  handleAddLine = (row, addRow) => {
    const { lines } = this.state;
    const { fields, grids, form } = this.props;
    const options = {};
    fields.forEach((field) => {
      if (typeof field.y === 'number' && field.y >= row - 1) {
        field.y += parseInt(addRow, 0);
      }
    });
    options.fields = fields;
    grids.forEach((grid, index) => {
      if (typeof grid.y === 'number' && grid.y >= row - 1) {
        options[`grids.${index}.y`] = grid.y + parseInt(addRow, 0);
      } else if (typeof grid.y === 'number' && grid.y + grid.row >= row) {
        options[`grids.${index}.row`] = grid.row + parseInt(addRow, 0);
        grid.fields.forEach((field) => {
          if (typeof field.y === 'number' && field.y + grid.y >= row - 2) {
            field.y += parseInt(addRow, 0);
          }
        });
        options[`grids.${index}.fields`] = grid.fields;
      }
    });
    for (let i = 1; i <= addRow; i += 1) {
      lines.splice(row - 1, 0, `${new Date().getTime()}${i}`);
    }
    form.setFieldsValue(options);
  }

  handleDeleteLine = (row) => {
    const { lines } = this.state;
    if (lines.length <= 7) return false;
    const { fields, grids, form } = this.props;
    const options = {};
    fields.forEach((field) => {
      if (typeof field.y === 'number' && field.y > row - 1) {
        field.y -= 1;
      } else if (typeof field.y === 'number' && field.y + field.row > row - 1) {
        field.x = null;
        field.y = null;
        field.row = null;
        field.col = null;
      }
    });
    options.fields = fields;
    grids.forEach((grid, index) => {
      if (typeof grid.y === 'number' && grid.y > row - 1) {
        options[`grids.${index}.y`] = grid.y - 1;
      } else if (typeof grid.y === 'number' && grid.y !== row - 1 && grid.y + grid.row > row && grid.row > 3) {
        options[`grids.${index}.row`] = grid.row - 1;
        grid.fields.forEach((field) => {
          if (typeof field.y === 'number' && field.y + grid.y > row - 2) {
            field.y -= 1;
          } else if (typeof field.y === 'number' && field.y + grid.y + field.row > row - 2) {
            field.x = null;
            field.y = null;
            field.row = null;
            field.col = null;
          }
        });
        options[`grids.${index}.fields`] = grid.fields;
      } else if (typeof grid.y === 'number' && grid.y + grid.row > row - 1) {
        options[`grids.${index}.x`] = null;
        options[`grids.${index}.y`] = null;
      }
    });
    lines.splice(row - 1, 1);
    form.setFieldsValue(options);
  }

  handleResize = (control, parentGrid, newCol, newRow, newX, newY) => {
    const { fields, grids, form } = this.props;
    const usedCell = this.fetchUsedCell(control, parentGrid);
    let resizeable = true;
    for (const i in usedCell) {
      if (Object.hasOwnProperty.call(usedCell, i)) {
        const cell = usedCell[i];
        if (
          cell.col >= newX &&
          cell.col < newX + newCol &&
          cell.row >= newY &&
          cell.row < newY + newRow
        ) {
          resizeable = false;
          break;
        }
      }
    }
    if (resizeable) {
      if (parentGrid) {
        const gridIndex = grids.indexOf(parentGrid);
        control.x = newX;
        control.y = newY;
        control.col = newCol;
        control.row = newRow;
        form.setFieldsValue({ [`grids.${gridIndex}.fields`]: parentGrid.fields });
      } else if ('fields' in control) {
        const gridIndex = grids.indexOf(control);
        let minRow = 0;
        control.fields.forEach((field) => {
          minRow = Math.max(field.y + field.row + 2, minRow);
        });
        if (newRow >= minRow) {
          form.setFieldsValue({
            [`grids.${gridIndex}.x`]: newX,
            [`grids.${gridIndex}.y`]: newY,
            [`grids.${gridIndex}.col`]: newCol,
            [`grids.${gridIndex}.row`]: newRow,
          });
        }
      } else {
        control.x = newX;
        control.y = newY;
        control.col = newCol;
        control.row = newRow;
        form.setFieldsValue({ fields });
      }
    }
  }

  /**
   * 获取已占用的单元格
   * @returns {Array}
   */
  fetchUsedCell = (data, grid) => {
    const { fields, grids } = this.props;
    const usedCell = [];
    if (grid) {
      grid.fields.forEach((item) => {
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

  makeLines = () => {
    const { onCancelSelect, selectedControl } = this.props;
    const { lines } = this.state;
    return lines.map((line, index) => {
      return (
        <Line
          key={`line_${line}`}
          index={index}
          addLine={this.handleAddLine}
          deleteLine={this.handleDeleteLine}
          onClick={selectedControl && onCancelSelect}
        />
      );
    });
  }

  makeControls = () => {
    const {
      fields,
      grids,
      onDrag,
      draggingControl,
      selectedControl,
      onSelect,
      onCancelSelect,
    } = this.props;
    const { lines } = this.state;
    return [
      ...fields.filter(item => typeof item.x === 'number' && item !== draggingControl).map(item => (
        <Control
          key={item.key}
          data={item}
          onDrag={onDrag}
          onSelect={onSelect}
          onResize={this.handleResize}
          selectedControl={selectedControl}
          board={this.board}
          lines={lines.length}
        />
      )),
      ...grids.filter(item => typeof item.x === 'number' && item !== draggingControl).map(item => (
        <Control
          key={item.key}
          data={item}
          onDrag={onDrag}
          onSelect={onSelect}
          onResize={this.handleResize}
          selectedControl={selectedControl}
          board={this.board}
          lines={lines.length}
          addLine={this.handleAddLine}
          deleteLine={this.handleDeleteLine}
          onCancelSelect={onCancelSelect}
          draggingControl={draggingControl}
          isGrid
        />
      )),
    ];
  }

  makeMask = () => {
    const { draggingControl, parentGrid } = this.props;
    const { lines } = this.state;
    return draggingControl && parentGrid && parentGrid.x !== null ? (
      <React.Fragment>
        <div className={styles.mask} style={{ top: 0, height: `${(parentGrid.y + 1) * 76}px` }} />
        <div
          className={styles.mask}
          style={{
            top: `${((parentGrid.row - 2) * 76) + 1}px`,
            height: `${(((lines.length - parentGrid.y - parentGrid.row) + 2) * 76) - 1}px`,
          }}
        />
      </React.Fragment>
    ) : null;
  }

  render() {
    const { lines } = this.state;
    return (
      <div className={styles.board}>
        <div
          className={styles.scroller}
          style={{ height: `${(lines.length * 76) + 1}px` }}
          ref={(ele) => {
            this.board = ele;
          }}
        >
          {this.makeLines()}
          <div className={styles.controls}>
            {this.makeControls()}
            {this.makeMask()}
          </div>
        </div>
      </div>
    );
  }
}

export default Board;
