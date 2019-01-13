/* eslint no-param-reassign:0 */
import React, { Component } from 'react';
import FocusLine from './line_focus';
import Control from './control';
import styles from '../template.less';

class Board extends Component {
  state = {
    lines: 7,
  }

  componentDidMount() {
    const { bind } = this.props;
    bind(this.board);
  }

  handleAddLine = (row) => {
    const { fields, grids, form } = this.props;
    const options = {};
    fields.forEach((field) => {
      if (typeof field.y === 'number' && field.y >= row - 1) {
        field.y += 1;
      }
    });
    options.fields = fields;
    grids.forEach((grid, index) => {
      if (typeof grid.y === 'number' && grid.y >= row - 1) {
        options[`grids.${index}.y`] = grid.y + 1;
      } else if (typeof grid.y === 'number' && grid.y + grid.row >= row) {
        options[`grids.${index}.row`] = grid.row + 1;
        grid.fields.forEach((field) => {
          if (typeof field.y === 'number' && field.y + grid.y >= row - 2) {
            field.y += 1;
          }
        });
        options[`grids.${index}.fields`] = grid.fields;
      }
    });
    this.state.lines += 1;
    form.setFieldsValue(options);
  }

  handleDeleteLine = (row) => {
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
    this.state.lines -= 1;
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
          minRow = (field.y + field.row + 2) > minRow ? field.y + field.row + 2 : minRow;
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

  makeRowScales = () => {
    const { lines } = this.state;
    const scales = [];
    for (let i = 1; i <= lines; i += 1) {
      scales.push(<div key={`row_scale_${i}`} className={styles.rowScale}>{i}</div>);
    }
    return scales;
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
          lines={lines}
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
          lines={lines}
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
            height: `${(((lines - parentGrid.y - parentGrid.row) + 2) * 76) - 1}px`,
          }}
        />
      </React.Fragment>
    ) : null;
  }

  render() {
    const { onCancelSelect, selectedControl } = this.props;
    const { lines } = this.state;
    return (
      <div className={styles.board}>
        <div className={styles.leftScale}>{this.makeRowScales()}</div>
        <div className={styles.rightScale}>{this.makeRowScales()}</div>
        <div
          className={styles.scroller}
          style={{ height: `${(lines * 76) + 1}px` }}
          ref={(ele) => {
            this.board = ele;
          }}
        >
          <FocusLine
            board={this.board}
            lines={lines}
            addLine={this.handleAddLine}
            deleteLine={this.handleDeleteLine}
            onClick={selectedControl && onCancelSelect}
          />
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
