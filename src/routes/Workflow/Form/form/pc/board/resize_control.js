/* eslint no-param-reassign:0 */
import { getMinSize } from '../supports/control_size';
import _fetchUsedCell from '../supports/fetch_used_cell';

export { topResize, bottomResize, leftResize, rightResize };

function topResize(data, grid, y) {
  const { row, min } = fetchRowAndMin.call(this, y, data, grid);
  let newRow = Math.max((data.y + data.row) - row, min);
  let newY = (data.y + data.row) - newRow;
  const usedCell = fetchUsedCell.call(this, data, grid);
  usedCell.forEach((cell) => {
    const rowIsUsed = cell.row >= newY && cell.row < newY + newRow;
    const colIsUsed = cell.col >= data.x && cell.col < data.x + data.col;
    if (rowIsUsed && ('fields' in data || colIsUsed)) {
      newY = cell.row + 1;
      newRow = (data.y + data.row) - newY;
    }
  });
  if (newY !== data.y) submitResize.call(this, data, grid, { y: newY, row: newRow });
}

function bottomResize(data, grid, y) {
  const { row, min } = fetchRowAndMin.call(this, y, data, grid);
  let newRow = Math.max(row - data.y, min);
  const usedCell = fetchUsedCell.call(this, data, grid);
  usedCell.forEach((cell) => {
    const rowIsUsed = cell.row >= data.y && cell.row < data.y + newRow;
    const colIsUsed = cell.col >= data.x && cell.col < data.x + data.col;
    if (rowIsUsed && ('fields' in data || colIsUsed)) {
      newRow = cell.row - data.y;
    }
  });
  if (newRow !== data.row) submitResize.call(this, data, grid, { row: newRow });
}

function leftResize(data, grid, x) {
  const { col, min } = fetchColAndMin.call(this, x, data, grid);
  let newCol = Math.max((data.x + data.col) - col, min);
  let newX = (data.x + data.col) - newCol;
  if (!('fields' in data)) {
    const usedCell = fetchUsedCell.call(this, data, grid);
    usedCell.forEach((cell) => {
      if (cell.row >= data.y && cell.row < data.y + data.row
        && cell.col >= newX && cell.col < newX + newCol) {
        newX = cell.col + 1;
        newCol = (data.x + data.col) - newX;
      }
    });
  }
  if (newX !== data.x) submitResize.call(this, data, grid, { x: newX, col: newCol });
}

function rightResize(data, grid, x) {
  const { col, min } = fetchColAndMin.call(this, x, data, grid);
  let newCol = Math.max(col - data.x, min);
  if (!('fields' in data)) {
    const usedCell = fetchUsedCell.call(this, data, grid);
    usedCell.forEach((cell) => {
      if (cell.row >= data.y && cell.row < data.y + data.row
        && cell.col >= data.x && cell.col < data.x + newCol) {
        newCol = cell.col - data.x;
      }
    });
  }
  if (newCol !== data.col) submitResize.call(this, data, grid, { col: newCol });
}

function fetchRowAndMin(y, data, grid) {
  const { top } = this.board.getBoundingClientRect();
  let row = Math.round((y - top) / 61);
  if (grid) {
    row -= grid.y + 1;
    row = Math.min(row, grid.row - 2);
  } else {
    const { lines } = this.state;
    row = Math.min(row, lines.length);
  }
  row = Math.max(row, 0);
  let min = getMinSize(data).row;
  if ('fields' in data) {
    data.fields.forEach((field) => {
      min = Math.max(field.y + field.row + 2, min);
    });
  }
  return { row, min };
}

function fetchColAndMin(x, data, grid) {
  const { left } = this.board.getBoundingClientRect();
  let col = Math.round((x - left) / 61);
  if (grid) {
    col -= grid.x;
    col = Math.min(col, grid.col);
  } else {
    col = Math.min(col, 20);
  }
  col = Math.max(col, 0);
  let min = getMinSize(data).col;
  if ('fields' in data) {
    data.fields.forEach((field) => {
      min = Math.max(field.x + field.col, min);
    });
  }
  return { col, min };
}

/**
 * 获取已占用的单元格
 * @returns {Array}
 */
function fetchUsedCell(data, grid) {
  const { fields, grids } = this.props;
  return _fetchUsedCell(data, grid, fields, grids);
}

function submitResize(data, grid, options) {
  const { fields, grids, form } = this.props;
  if (grid) {
    const gridIndex = grids.indexOf(grid);
    Object.keys(options).forEach((key) => {
      data[key] = options[key];
    });
    form.setFieldsValue({ [`grids.${gridIndex}.fields`]: grid.fields });
  } else if ('fields' in data) {
    const gridIndex = grids.indexOf(data);
    const gridOptions = {};
    Object.keys(options).forEach((key) => {
      gridOptions[`grids.${gridIndex}.${key}`] = options[key];
    });
    form.setFieldsValue(gridOptions);
  } else {
    Object.keys(options).forEach((key) => {
      data[key] = options[key];
    });
    form.setFieldsValue({ fields });
  }
}
