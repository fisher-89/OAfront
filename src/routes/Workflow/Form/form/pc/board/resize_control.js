/* eslint no-param-reassign:0 */
import defaultSize from '../supports/control_size';

export { topResize, bottomResize, leftResize, rightResize };

function topResize(data, grid, y) {
  const { row, min } = fetchRowAndMin.call(this, y, data, grid);
  let newRow = Math.max((data.y + data.row) - row, min);
  let newY = (data.y + data.row) - newRow;
  const usedCell = fetchUsedCell.call(this, data, grid);
  usedCell.forEach((cell) => {
    if (cell.col >= data.x && cell.col < data.x + data.col
      && cell.row >= newY && cell.row < newY + newRow) {
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
    if (cell.col >= data.x && cell.col < data.x + data.col
      && cell.row >= data.y && cell.row < data.y + newRow) {
      newRow = cell.row - data.y;
    }
  });
  if (newRow !== data.row) submitResize.call(this, data, grid, { row: newRow });
}

function leftResize(data, grid, x) {
  const { col, min } = fetchColAndMin.call(this, x, data);
  let newCol = Math.max((data.x + data.col) - col, min);
  let newX = (data.x + data.col) - newCol;
  const usedCell = fetchUsedCell.call(this, data, grid);
  usedCell.forEach((cell) => {
    if (cell.row >= data.y && cell.row < data.y + data.row
      && cell.col >= newX && cell.col < newX + newCol) {
      newX = cell.col + 1;
      newCol = (data.x + data.col) - newX;
    }
  });
  if (newX !== data.x) submitResize.call(this, data, grid, { x: newX, col: newCol });
}

function rightResize(data, grid, x) {
  const { col, min } = fetchColAndMin.call(this, x, data);
  let newCol = Math.max(col - data.x, min);
  const usedCell = fetchUsedCell.call(this, data, grid);
  usedCell.forEach((cell) => {
    if (cell.row >= data.y && cell.row < data.y + data.row
      && cell.col >= data.x && cell.col < data.x + newCol) {
      newCol = cell.col - data.x;
    }
  });
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
  let min = defaultSize(data).row;
  if ('fields' in data) {
    data.fields.forEach((field) => {
      min = Math.max(field.y + field.row + 2, min);
    });
  }
  return { row, min };
}

function fetchColAndMin(x, data) {
  const { left } = this.board.getBoundingClientRect();
  let col = Math.round((x - left) / 61);
  col = Math.max(col, 0);
  col = Math.min(col, 20);
  const min = defaultSize(data).col;
  return { col, min };
}

/**
 * 获取已占用的单元格
 * @returns {Array}
 */
function fetchUsedCell(data, grid) {
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
