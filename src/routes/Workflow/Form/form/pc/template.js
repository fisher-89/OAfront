import React, { Component } from 'react';
import { Row } from 'antd';
import styles from './template.less';
import Board from './board';
import FieldTag from './field_tag';
import GridTag from './grid_tag';
import FieldTagShadow from './dragging_field_tag';

class PCTemplate extends Component {
  state = {
    selectedGrid: null,
    dataIndex: null,
    overTemplate: false,
    startPoint: { x: null, y: null },
    tagPosition: { top: 0, left: 0 },
    onDragging: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    const changeSelectedGrid = nextState.selectedGrid !== this.state.selectedGrid;
    const changeList = (nextProps.grids !== this.props.grids)
      || (nextProps.fields !== this.props.fields);
    const changeDragging = nextState.onDragging !== this.state.onDragging;
    if (changeSelectedGrid || changeList || changeDragging) return true;
    if (this.state.onDragging && (nextState.overTemplate !== this.state.overTemplate)) return true;
    return false;
  }

  toggleGridField = (key) => {
    const { selectedGrid } = this.state;
    this.setState({
      selectedGrid: selectedGrid === key ? null : key,
    });
  }

  handleDragStart = (data, startPoint, tagPosition) => {
    const { fields, grids } = this.props;
    const index = 'fields' in data ? grids.indexOf(data) : fields.indexOf(data);
    this.setState({
      dataIndex: index,
      onDragging: data,
      startPoint,
      tagPosition,
    });
  }

  handleDragCancel = () => {
    this.setState({
      onDragging: false,
    });
  }

  handleDragConfirm = (data) => {
    const { form, fields } = this.props;
    const { dataIndex } = this.state;
    this.state.onDragging = false;
    if ('fields' in data) {
      form.setFieldsValue({
        [`grids.${dataIndex}.x`]: data.x,
        [`grids.${dataIndex}.y`]: data.y,
        [`grids.${dataIndex}.row`]: data.row,
        [`grids.${dataIndex}.col`]: data.col,
      });
    } else {
      fields[dataIndex].x = data.x;
      fields[dataIndex].y = data.y;
      fields[dataIndex].row = data.row;
      fields[dataIndex].col = data.col;
      form.setFieldsValue({ fields });
    }
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
        <div key={key}>
          <GridTag
            data={grid}
            onDrag={this.handleDragStart}
            selected={selected}
            toggleGridField={this.toggleGridField}
          />
        </div>
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
    console.log('pc_template:render');
    const { fields, grids } = this.props;
    const { startPoint, tagPosition, onDragging } = this.state;
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
              bind={(board) => {
                this.board = board;
              }}
            />
          </div>
        </div>
        {onDragging && (
          <FieldTagShadow
            data={onDragging}
            style={{ ...tagPosition }}
            startPoint={startPoint}
            onCancel={this.handleDragCancel}
            onConfirm={this.handleDragConfirm}
            board={this.board}
          />
        )}
      </Row>
    );
  }
}

export default PCTemplate;
