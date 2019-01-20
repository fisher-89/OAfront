const defaultSize = {
  int: { col: 5, row: 1 },
  text: { col: 5, row: 1, multiple: { col: 8, row: 2 } },
  date: { col: 5, row: 1 },
  datetime: { col: 5, row: 1 },
  time: { col: 5, row: 1 },
  file: { col: 8, row: 2 },
  array: { col: 8, row: 1 },
  select: { col: 5, row: 1, multiple: { col: 8, row: 1 } },
  department: { col: 5, row: 1, multiple: { col: 8, row: 1 } },
  staff: { col: 5, row: 1, multiple: { col: 8, row: 1 } },
  shop: { col: 5, row: 1, multiple: { col: 8, row: 1 } },
  region: { col: 8, row: 2 },
  api: { col: 5, row: 1, multiple: { col: 8, row: 1 } },
};

export default function (data) {
  let col;
  let row;
  if ('fields' in data) {
    col = 20;
    row = 3;
  } else if (data.type === 'text') {
    const size = defaultSize[data.type];
    col = data.max > 30 ? size.multiple.col : size.col;
    row = data.max > 30 ? size.multiple.row : size.row;
  } else {
    const size = defaultSize[data.type];
    col = data.is_checkbox ? size.multiple.col : size.col;
    row = data.is_checkbox ? size.multiple.row : size.row;
  }
  return { col, row };
}
