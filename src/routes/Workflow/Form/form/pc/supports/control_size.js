export { getDefaultSize, getMinSize };

const defaultSize = {
  int: { col: 4, row: 1, default: { col: 5, row: 1 } },
  text: { col: 4, row: 1, default: { col: 5, row: 1 } },
  date: { col: 5, row: 1 },
  datetime: { col: 5, row: 1 },
  time: { col: 5, row: 1 },
  file: { col: 4, row: 2, default: { col: 10, row: 2 } },
  array: { col: 6, row: 1, default: { col: 10, row: 1 } },
  select: {
    col: 4,
    row: 1,
    multiple: { col: 6, row: 1 },
    default: { col: 5, row: 1, multiple: { col: 10, row: 1 } },
  },
  department: {
    col: 5,
    row: 1,
    multiple: { col: 6, row: 1 },
    default: { col: 5, row: 1, multiple: { col: 10, row: 1 } },
  },
  staff: {
    col: 4,
    row: 1,
    multiple: { col: 6, row: 1 },
    default: { col: 5, row: 1, multiple: { col: 10, row: 1 } },
  },
  shop: {
    col: 5,
    row: 1,
    multiple: { col: 6, row: 1 },
    default: { col: 5, row: 1, multiple: { col: 10, row: 1 } },
  },
  api: {
    col: 4,
    row: 1,
    multiple: { col: 6, row: 1 },
    default: { col: 5, row: 1, multiple: { col: 10, row: 1 } },
  },
  region: { col: 8, default: { col: 10, row: 2 } },
};

function getDefaultSize(data) {
  let col;
  let row;
  if ('fields' in data) {
    col = 20;
    row = 3;
  } else {
    let size = defaultSize[data.type];
    size = 'default' in size ? size.default : size;
    col = data.is_checkbox ? size.multiple.col : size.col;
    row = data.is_checkbox ? size.multiple.row : size.row;
  }
  return { col, row };
}

function getMinSize(data) {
  let col;
  let row;
  if ('fields' in data) {
    col = 12;
    row = 3;
  } else {
    const size = defaultSize[data.type];
    col = data.is_checkbox ? size.multiple.col : size.col;
    row = data.is_checkbox ? size.multiple.row : size.row;
  }
  return { col, row };
}
