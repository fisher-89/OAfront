export default function (data, grid, fields, grids) {
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
    fields.forEach((item) => {
      if (item.x !== null && item !== data) {
        for (let col = item.x; col < item.x + item.col; col += 1) {
          for (let row = item.y; row < item.y + item.row; row += 1) {
            usedCell.push({ row, col });
          }
        }
      }
    });
    grids.forEach((item) => {
      if (item.x !== null && item !== data) {
        for (let col = 0; col < 20; col += 1) {
          for (let row = item.y; row < item.y + item.row; row += 1) {
            usedCell.push({ row, col });
          }
        }
      }
    });
  }
  return usedCell;
}
