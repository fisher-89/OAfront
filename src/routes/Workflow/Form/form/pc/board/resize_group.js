/* eslint no-param-reassign:0 */
import _fetchInsideFields from '../supports/fetch_fields_in_group';

export default { top: topResize, bottom: bottomResize, left: leftResize, right: rightResize };

function topResize(data, y) {
  const row = fetchRow.call(this, y);
  if (row !== data.top && row < data.bottom) {
    const origin = data.top;
    data.top = row;
    const insideField = fetchInsideFields.call(this, data);
    if (insideField !== false) {
      submitResize.call(this);
    } else {
      data.top = origin;
    }
  }
}

function bottomResize(data, y) {
  const row = fetchRow.call(this, y);
  if (row !== data.bottom && row > data.top) {
    const origin = data.bottom;
    data.bottom = row;
    const insideField = fetchInsideFields.call(this, data);
    if (insideField !== false) {
      submitResize.call(this);
    } else {
      data.bottom = origin;
    }
  }
}

function leftResize(data, x) {
  const col = fetchCol.call(this, x);
  if (col !== data.left && col < data.right) {
    const origin = data.left;
    data.left = col;
    const insideField = fetchInsideFields.call(this, data);
    if (insideField !== false) {
      submitResize.call(this);
    } else {
      data.left = origin;
    }
  }
}

function rightResize(data, x) {
  const col = fetchCol.call(this, x);
  if (col !== data.right && col > data.left) {
    const origin = data.right;
    data.right = col;
    const insideField = fetchInsideFields.call(this, data);
    if (insideField !== false) {
      submitResize.call(this);
    } else {
      data.right = origin;
    }
  }
}

function fetchRow(y) {
  const { top } = this.board.getBoundingClientRect();
  const { lines } = this.state;
  let row = Math.round((y - top) / 61);
  row = Math.min(row, lines.length);
  row = Math.max(row, 0);
  return row;
}

function fetchCol(x) {
  const { left } = this.board.getBoundingClientRect();
  let col = Math.round((x - left) / 61);
  col = Math.min(col, 20);
  col = Math.max(col, 0);
  return col;
}

function fetchInsideFields(data) {
  const { fields, grids, fieldGroups } = this.props;
  return _fetchInsideFields(data, fields, grids, fieldGroups);
}

function submitResize() {
  const { fieldGroups, form } = this.props;
  form.setFieldsValue({ field_groups: fieldGroups });
}
