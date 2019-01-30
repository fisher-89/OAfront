import React, { Component } from 'react';
import { Row, Affix, Tag } from 'antd';
import styles from './template.less';
import Board from './board/index';
import FieldTag from './field_tag';
import GridTag from './grid_tag';
import FieldTagShadow from './dragging_field_tag';
import GroupingTable from './grouping_table';
import { handleDragGroupStart, handleDragGroupConfirm } from './supports/drag_group';

class PCTemplate extends Component {
  state = {
    selectedControl: null,
    selectedGrid: null,
    dataIndex: null,
    parentGridIndex: null,
    startPoint: { x: null, y: null },
    startPosition: { top: 0, bottom: 0, left: 0, right: 0 },
    onDragging: false,
    onGroupDragging: false,
    onGrouping: false,
  }

  componentWillMount() {
    document.addEventListener('keyup', this.keyboardControl);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.selectedControl && !this.state.selectedControl) {
      document.addEventListener('mousedown', this.handleCancelSelect);
      return true;
    }
    if (!nextState.selectedControl && this.state.selectedControl) {
      document.removeEventListener('mousedown', this.handleCancelSelect);
      return true;
    }
    if (nextState.selectedGrid !== this.state.selectedGrid) return true;
    if (nextState.selectedControl !== this.state.selectedControl) return true;
    if (nextProps.grids !== this.props.grids) return true;
    if (nextProps.fields !== this.props.fields) return true;
    if (nextProps.fieldGroups !== this.props.fieldGroups) return true;
    if (nextState.onDragging !== this.state.onDragging) return true;
    if (nextState.onGroupDragging !== this.state.onGroupDragging) return true;
    if (nextState.onGrouping !== this.state.onGrouping) return true;
    return false;
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.keyboardControl);
  }

  keyboardControl = (e) => {
    const { selectedControl } = this.state;
    if (e.keyCode === 46) {
      this.deleteSelectedControl(selectedControl);
    }
  }

  toggleGridField = (key) => {
    const { selectedGrid } = this.state;
    this.setState({
      selectedGrid: selectedGrid === key ? null : key,
    });
  }

  handleSelect = (data, grid) => {
    const { fields, grids, fieldGroups } = this.props;
    let index;
    let gridIndex = null;
    if ('fields' in data) {
      index = grids.indexOf(data);
    } else if ('top' in data) {
      index = fieldGroups.indexOf(data);
    } else if (grid) {
      gridIndex = grids.indexOf(grid);
      index = grid.fields.indexOf(data);
    } else {
      index = fields.indexOf(data);
    }
    this.setState({
      dataIndex: index,
      selectedControl: data,
      parentGridIndex: gridIndex,
    });
  }

  handleCancelSelect = (e) => {
    const controlReg = /__clickBoard(Selected)?___/;
    const resizeReg = /__(top|bottom|left|right)Resize___/;
    const tagReg = /ant-tag/;
    if (controlReg.test(e.target.className)) return false;
    if (resizeReg.test(e.target.className)) return false;
    if (tagReg.test(e.target.className)) return false;
    if (e.button === 0) this.setState({ selectedControl: null });
  }

  deleteSelectedControl = (data) => {
    const { form, fields, fieldGroups, grids } = this.props;
    const { dataIndex, parentGridIndex } = this.state;
    if ('fields' in data) {
      form.setFieldsValue({
        [`grids.${dataIndex}.x`]: null,
        [`grids.${dataIndex}.y`]: null,
      });
    } else if (parentGridIndex !== null) {
      const gridFields = grids[parentGridIndex].fields;
      gridFields[dataIndex].x = null;
      gridFields[dataIndex].y = null;
      form.setFieldsValue({
        [`grids.${parentGridIndex}.fields`]: gridFields,
      });
    } else if ('top' in data) {
      fieldGroups.splice(dataIndex, 1);
      form.setFieldsValue({ fieldGroups });
    } else {
      fields[dataIndex].x = null;
      fields[dataIndex].y = null;
      form.setFieldsValue({ fields });
    }
  }

  handleDragStart = (data, startPoint, startPosition, grid = null) => {
    const { fields, grids } = this.props;
    let index = 'fields' in data ? grids.indexOf(data) : fields.indexOf(data);
    const gridIndex = grid ? grids.indexOf(grid) : null;
    if (grid) index = grid.fields.indexOf(data);
    this.setState({
      dataIndex: index,
      onDragging: true,
      selectedControl: data,
      parentGridIndex: gridIndex,
      startPoint,
      startPosition,
    });
  }

  handleDragOnBoard = (data) => {
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

  handleDragOffBoard = (data) => {
    this.state.onDragging = false;
    this.deleteSelectedControl(data);
  }

  handleDragFail = () => {
    this.setState({ onDragging: false });
  }

  handleGroupingStart = () => {
    this.setState({ onGrouping: true });
  }

  handleGroupingConfirm = (data) => {
    const { form, fieldGroups } = this.props;
    fieldGroups.push({ ...data, title: '', background: '', created_at: new Date().getTime() });
    form.setFieldsValue({ field_groups: fieldGroups });
    this.setState({ onGrouping: false });
  }

  handleGroupingCancel = () => {
    this.setState({ onGrouping: false, onGroupDragging: false });
  }

  makeFieldOptions = () => {
    const { fields } = this.props;
    const { selectedControl } = this.state;
    return fields.map((field) => {
      return (
        <FieldTag
          key={field.id}
          data={field}
          onDrag={this.handleDragStart}
          onSelect={this.handleSelect}
          selectedControl={selectedControl}
        />
      );
    });
  }

  makeGridOptions = () => {
    const { grids } = this.props;
    const { selectedGrid, selectedControl } = this.state;
    return grids.map((grid) => {
      const { key } = grid;
      const unfolded = selectedGrid === key;
      return (
        <GridTag
          key={key}
          data={grid}
          unfolded={unfolded}
          onDrag={this.handleDragStart}
          onSelect={this.handleSelect}
          selectedControl={selectedControl}
          toggleGridField={this.toggleGridField}
        />
      );
    });
  }

  makeScale = () => {
    const scale = [];
    for (let i = 0; i <= 20; i += 1) {
      scale.push(
        <div key={`scale_${i}`}>
          <span />{i}
        </div>
      );
    }
    return scale;
  }

  render() {
    const { fields, grids, fieldGroups, form } = this.props;
    const {
      startPoint,
      startPosition,
      onDragging,
      onGroupDragging,
      onGrouping,
      parentGridIndex,
      selectedControl,
    } = this.state;
    return (
      <Row className={styles.pcTemplate}>
        <Affix offsetTop={16}>
          <div className={styles.component}>
            <h3>通用工具</h3>
            <div className={styles.fields}>
              <Tag onClick={this.handleGroupingStart} type={onDragging ? 'blue' : null}>分组</Tag>
            </div>
            <h3>字段</h3>
            <div className={styles.fields}>
              {this.makeFieldOptions()}
            </div>
            {grids.length > 0 && (<h3>列表控件</h3>)}
            <div className={styles.grids}>
              {this.makeGridOptions()}
            </div>
          </div>
        </Affix>
        <div>
          <h3>表单名称</h3>
          <div
            className={styles.template}
            onContextMenu={(e) => {
              e.preventDefault();
              return false;
            }}
          >
            <div className={styles.scaleHorizontal}>
              {this.makeScale()}
            </div>
            <Board
              grids={grids}
              fields={fields}
              fieldGroups={fieldGroups}
              draggingControl={onDragging ? selectedControl : null}
              draggingGroup={onGroupDragging ? selectedControl : null}
              form={form}
              selectedControl={selectedControl}
              onSelect={this.handleSelect}
              onDrag={this.handleDragStart}
              onDragGroup={handleDragGroupStart.bind(this)}
              parentGrid={parentGridIndex !== null ? grids[parentGridIndex] : null}
              bind={(board) => {
                this.board = board;
              }}
            />
            {(onGrouping || onGroupDragging) && (
              <GroupingTable
                data={onGroupDragging ? selectedControl : null}
                startPoint={startPoint}
                board={this.board}
                grids={grids}
                fields={fields}
                fieldGroups={fieldGroups}
                onConfirm={this.handleGroupingConfirm}
                onDragConfirm={handleDragGroupConfirm.bind(this)}
                onCancel={this.handleGroupingCancel}
              />
            )}
          </div>
        </div>
        {onDragging && (
          <FieldTagShadow
            data={selectedControl}
            startPosition={startPosition}
            startPoint={startPoint}
            onCancel={this.handleDragOffBoard}
            onConfirm={this.handleDragOnBoard}
            onFail={this.handleDragFail}
            board={this.board}
            parentGrid={parentGridIndex !== null ? grids[parentGridIndex] : null}
            fields={fields}
            grids={grids}
            fieldGroups={fieldGroups}
          />
        )}
      </Row>
    );
  }
}

export default PCTemplate;
