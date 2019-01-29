import fetchInsideFields from './fetch_fields_in_group';

export { handleDragGroupStart, handleDragGroupConfirm };

function handleDragGroupStart(data, startPoint, startPosition) {
  const { fieldGroups } = this.props;
  const index = fieldGroups.indexOf(data);
  this.setState({
    dataIndex: index,
    onGroupDragging: true,
    selectedControl: data,
    startPoint,
    startPosition,
  });
}


function handleDragGroupConfirm(data, offsetX, offsetY) {
  const { fields, grids, fieldGroups, form } = this.props;
  const { dataIndex } = this.state;
  const insideFields = fetchInsideFields(data, fields, grids, fieldGroups);
  fieldGroups[dataIndex].left = data.left + offsetX;
  fieldGroups[dataIndex].right = data.right + offsetX;
  fieldGroups[dataIndex].top = data.top + offsetY;
  fieldGroups[dataIndex].bottom = data.bottom + offsetY;
  insideFields.forEach((item) => {
    item.x += offsetX; // eslint-disable-line no-param-reassign
    item.y += offsetY; // eslint-disable-line no-param-reassign
  });
  form.setFieldsValue({ field_groups: fieldGroups, fields });
  this.setState({
    onGroupDragging: false,
  });
}
