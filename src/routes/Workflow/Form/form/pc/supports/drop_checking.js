import fetchInsideFields from './fetch_fields_in_group';

export { checkField, checkGrid, checkGroup, fetchUsedCell, fetchUsedRow, hasCell, insideGroup };

function checkField(data, newData, controls, grid = null) {
  const { fieldGroups } = controls;
  const usedCell = fetchUsedCell(data, controls, grid);
  let response = true;
  usedCell.forEach((cell) => {
    if (hasCell(cell, newData)) {
      response = false;
    }
  });
  if (response && !grid) {
    fieldGroups.forEach((item) => {
      if (insideGroup(newData, item) === undefined) {
        response = false;
      }
    });
  }
  return response;
}

function checkGrid(data, newData, controls) {
  const usedRow = fetchUsedRow(data, controls);
  const { y, row } = newData;
  let response = true;
  usedRow.forEach((item) => {
    if (item >= y && item < y + row) response = false;
  });
  return response;
}

function checkGroup(data, newData, controls) {
  const { fields, grids, fieldGroups } = controls;
  const insideFields = fetchInsideFields(data, fields, grids, fieldGroups);
  const insideCell = [];
  for (let x = newData.left; x < newData.right; x += 1) {
    for (let y = newData.top; y < newData.bottom; y += 1) {
      insideCell.push({ x, y });
    }
  }
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
        if (cell.x >= item.left && cell.x < item.right
          && cell.y >= item.top && cell.y < item.bottom) {
          response = false;
        }
      });
    }
  });
  return response;
}


function fetchUsedCell(data, controls, grid = null) {
  const { fields, grids, fieldGroups } = controls;
  const usedCell = [];
  if (grid) {
    grid.fields.forEach((item) => {
      if (item.x !== null && item !== data) {
        for (let { x } = item; x < item.x + item.col; x += 1) {
          for (let { y } = item; y < item.y + item.row; y += 1) {
            usedCell.push({ y, x });
          }
        }
      }
    });
  } else {
    fields.forEach((item) => {
      if (item.x !== null && item !== data) {
        for (let { x } = item; x < item.x + item.col; x += 1) {
          for (let { y } = item; y < item.y + item.row; y += 1) {
            usedCell.push({ y, x });
          }
        }
      }
    });
    grids.forEach((item) => {
      if (item.x !== null) {
        for (let x = 0; x < 20; x += 1) {
          for (let { y } = item; y < item.y + item.row; y += 1) {
            usedCell.push({ y, x });
          }
        }
      }
    });
    fieldGroups.forEach((item) => {
      for (let x = item.left; x < item.right; x += 1) {
        const y = item.top;
        usedCell.push({ y, x });
      }
    });
  }
  return usedCell;
}

function fetchUsedRow(data, controls) {
  const { fields, grids, fieldGroups } = controls;
  const usedRow = [];
  fields.forEach((item) => {
    if (item.x !== null) {
      for (let { y } = item; y < item.y + item.row; y += 1) {
        if (usedRow.indexOf(y) === -1) usedRow.push(y);
      }
    }
  });
  grids.forEach((item) => {
    if (item.x !== null && item !== data) {
      for (let { y } = item; y < item.y + item.row; y += 1) {
        if (usedRow.indexOf(y) === -1) usedRow.push(y);
      }
    }
  });
  fieldGroups.forEach((item) => {
    for (let y = item.top; y < item.bottom; y += 1) {
      if (usedRow.indexOf(y) === -1) usedRow.push(y);
    }
  });
  return usedRow;
}

function insideGroup(field, group) {
  const insideCell = [];
  for (let x = group.left; x < group.right; x += 1) {
    for (let y = group.top + 1; y < group.bottom; y += 1) {
      insideCell.push({ x, y });
    }
  }
  let insideCount = 0;
  insideCell.forEach((cell) => {
    if (hasCell(cell, field)) {
      insideCount += 1;
    }
  });
  if (insideCount === field.row * field.col) {
    return true;
  } else if (insideCount === 0) {
    return false;
  }
}

function hasCell(cell, item) {
  return cell.x >= item.x && cell.x < item.x + item.col
    && cell.y >= item.y && cell.y < item.y + item.row;
}
