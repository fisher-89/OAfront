import React, { Component } from 'react';
import { Row } from 'antd';
import styles from './template.less';
import Board from './board/index';
import FieldTag from './field_tag';
import GridTag from './grid_tag';
import FieldTagShadow from './dragging_field_tag';

class PCTemplate extends Component {
  state = {
    selectedGrid: null,
    dataIndex: null,
    parentGridIndex: null,
    startPoint: { x: null, y: null },
    startPosition: { top: 0, bottom: 0, left: 0, right: 0 },
    onDragging: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    const changeSelectedGrid = nextState.selectedGrid !== this.state.selectedGrid;
    const changeList = (nextProps.grids !== this.props.grids)
      || (nextProps.fields !== this.props.fields);
    const changeDragging = nextState.onDragging !== this.state.onDragging;
    if (changeSelectedGrid || changeList || changeDragging) return true;
    return false;
  }

  toggleGridField = (key) => {
    const { selectedGrid } = this.state;
    this.setState({
      selectedGrid: selectedGrid === key ? null : key,
    });
  }

  handleDragStart = (data, startPoint, startPosition, grid = null) => {
    const { fields, grids } = this.props;
    let index = 'fields' in data ? grids.indexOf(data) : fields.indexOf(data);
    const gridIndex = grid ? grids.indexOf(grid) : null;
    if (grid) index = grid.fields.indexOf(data);
    this.setState({
      dataIndex: index,
      onDragging: data,
      parentGridIndex: gridIndex,
      startPoint,
      startPosition,
    });
  }

  handleDragCancel = (data) => {
    const { form, fields, grids } = this.props;
    const { dataIndex, parentGridIndex } = this.state;
    this.state.onDragging = false;
    if ('fields' in data) {
      form.setFieldsValue({
        [`grids.${dataIndex}.x`]: null,
        [`grids.${dataIndex}.y`]: null,
        [`grids.${dataIndex}.row`]: null,
        [`grids.${dataIndex}.col`]: null,
      });
    } else if (parentGridIndex !== null) {
      const gridFields = grids[parentGridIndex].fields;
      gridFields[dataIndex].x = null;
      gridFields[dataIndex].y = null;
      gridFields[dataIndex].row = null;
      gridFields[dataIndex].col = null;
      this.state.parentGridIndex = null;
      form.setFieldsValue({
        [`grids.${parentGridIndex}.fields`]: gridFields,
      });
    } else {
      fields[dataIndex].x = null;
      fields[dataIndex].y = null;
      fields[dataIndex].row = null;
      fields[dataIndex].col = null;
      form.setFieldsValue({ fields });
    }
  }

  handleDragConfirm = (data) => {
    const { form, fields, grids } = this.props;
    const { dataIndex, parentGridIndex } = this.state;
    this.state.onDragging = false;
    if ('fields' in data) {
      form.setFieldsValue({
        [`grids.${dataIndex}.x`]: data.x,
        [`grids.${dataIndex}.y`]: data.y,
        [`grids.${dataIndex}.row`]: data.row,
        [`grids.${dataIndex}.col`]: data.col,
      });
    } else if (parentGridIndex !== null) {
      const gridFields = grids[parentGridIndex].fields;
      gridFields[dataIndex].x = data.x;
      gridFields[dataIndex].y = data.y;
      gridFields[dataIndex].row = data.row;
      gridFields[dataIndex].col = data.col;
      this.state.parentGridIndex = null;
      form.setFieldsValue({
        [`grids.${parentGridIndex}.fields`]: gridFields,
      });
    } else {
      fields[dataIndex].x = data.x;
      fields[dataIndex].y = data.y;
      fields[dataIndex].row = data.row;
      fields[dataIndex].col = data.col;
      form.setFieldsValue({ fields });
    }
  }

  handleDragFail = () => {
    this.setState({
      onDragging: false,
      parentGridIndex: null,
    });
  }

  makeFieldOptions = () => {
    const { fields } = this.props;
    return fields.map((field) => {
      return (<FieldTag key={field.id} data={field} onDrag={this.handleDragStart} />);
    });
  }

  makeGridOptions = () => {
    const { grids } = this.props;
    const { selectedGrid } = this.state;
    return grids.map((grid) => {
      const { key } = grid;
      const selected = selectedGrid === key;
      return (
        <GridTag
          key={key}
          data={grid}
          selected={selected}
          onDrag={this.handleDragStart}
          toggleGridField={this.toggleGridField}
        />
      );
    });
  }

  makeScale = () => {
    const scale = [];
    for (let i = 0; i <= 12; i += 1) {
      scale.push(
        <div key={`scale_${i}`}>
          <span />{i}
        </div>
      );
    }
    return scale;
  }

  render() {
    const { fields, grids, form } = this.props;
    const { startPoint, startPosition, onDragging, parentGridIndex } = this.state;
    return (
      <Row className={styles.pcTemplate}>
        <div className={styles.component}>
          <h3>字段</h3>
          <div className={styles.fields}>
            {this.makeFieldOptions()}
          </div>
          {grids.length > 0 && (<h3>列表控件</h3>)}
          <div className={styles.grids}>
            {this.makeGridOptions()}
          </div>
        </div>
        <div>
          <h3>表单名称</h3>
          <div className={styles.template}>
            <div className={styles.scaleHorizontal}>
              {this.makeScale()}
            </div>
            <Board
              grids={grids}
              fields={fields}
              draggingControl={onDragging}
              form={form}
              onDrag={this.handleDragStart}
              parentGrid={parentGridIndex !== null ? grids[parentGridIndex] : null}
              bind={(board) => {
                this.board = board;
              }}
            />
          </div>
        </div>
        {onDragging && (
          <FieldTagShadow
            data={onDragging}
            startPosition={startPosition}
            startPoint={startPoint}
            onCancel={this.handleDragCancel}
            onConfirm={this.handleDragConfirm}
            onFail={this.handleDragFail}
            board={this.board}
            parentGrid={parentGridIndex !== null ? grids[parentGridIndex] : null}
            fields={fields}
            grids={grids}
          />
        )}
      </Row>
    );
  }
}

export default PCTemplate;
