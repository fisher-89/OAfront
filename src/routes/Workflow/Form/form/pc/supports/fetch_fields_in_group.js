export default function (group, fields, grids, groups) {
  if (group.top === group.bottom) return false;
  const fieldsInGroup = [];
  let available = true;
  const insideCell = getInsideCell(group);
  const headerCell = getHeaderCell(group);
  fields.forEach((item) => {
    if (item.x !== null) {
      let insideCount = 0;
      let inHeader = false;
      insideCell.forEach((cell) => {
        if (cellInside(cell, item)) {
          insideCount += 1;
        }
      });
      headerCell.forEach((cell) => {
        if (cellInside(cell, item)) {
          inHeader = true;
        }
      });
      if (insideCount === item.row * item.col) {
        fieldsInGroup.push(item);
      } else if (insideCount > 0 || inHeader) {
        available = false;
      }
    }
  });
  grids.forEach((item) => {
    if (item.x !== null) {
      let inside = false;
      insideCell.forEach((cell) => {
        if (cellInside(cell, item)) {
          inside = true;
        }
      });
      headerCell.forEach((cell) => {
        if (cellInside(cell, item)) {
          inside = true;
        }
      });
      if (inside) {
        available = false;
      }
    }
  });
  groups.forEach((item) => {
    if (item !== group) {
      let inside = false;
      insideCell.forEach((cell) => {
        if (cell.x >= item.left && cell.x <= item.right
          && cell.y >= item.top && cell.y <= item.bottom) {
          inside = true;
        }
      });
      headerCell.forEach((cell) => {
        if (cell.x >= item.left && cell.x <= item.right
          && cell.y >= item.top && cell.y <= item.bottom) {
          inside = true;
        }
      });
      if (inside) {
        available = false;
      }
    }
  });
  return available && fieldsInGroup;
}

function getInsideCell(group) {
  const cells = [];
  for (let x = group.left; x <= group.right; x += 1) {
    for (let y = group.top + 1; y <= group.bottom; y += 1) {
      cells.push({ x, y });
    }
  }
  return cells;
}

function getHeaderCell(group) {
  const cells = [];
  for (let x = group.left; x <= group.right; x += 1) {
    cells.push({ x, y: group.top });
  }
  return cells;
}

function cellInside(cell, item) {
  return cell.x >= item.x && cell.x < item.x + item.col
    && cell.y >= item.y && cell.y < item.y + item.row;
}
