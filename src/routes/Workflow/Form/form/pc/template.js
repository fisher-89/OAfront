import React, { Component } from 'react';
import { Row } from 'antd';
import styles from './template.less';
import Board from './board';
import FieldTag from './field_tag';
import GridTag from './grid_tag';
import FieldTagShadow from './dragging_field_tag';

class PCTemplate extends Component {
  state = {
    selectedTag: null,
    overTemplate: false,
    startPoint: { x: null, y: null },
    tagPosition: { top: 0, left: 0 },
    onDragging: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    const changeSelectedTag = nextState.selectedTag !== this.state.selectedTag;
    const changeList = (nextProps.grids !== this.props.grids)
      || (nextProps.fields !== this.props.fields);
    const changeDragging = nextState.onDragging !== this.state.onDragging;
    if (changeSelectedTag || changeList || changeDragging) return true;
    if (this.state.onDragging && (nextState.overTemplate !== this.state.overTemplate)) return true;
    return false;
  }

  handleDragStart = (data, startPoint, tagPosition) => {
    this.setState({
      selectedTag: data,
      onDragging: true,
      startPoint,
      tagPosition,
    });
  }

  handleDragCancel = () => {
    this.setState({
      onDragging: false,
    });
  }

  handleDragConfirm = () => {
    this.setState({
      onDragging: false,
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
    const { selectedTag } = this.state;
    return grids.map((grid) => {
      const { key, fields } = grid;
      const selected = selectedTag === grid || fields.indexOf(selectedTag) !== -1;
      return (
        <div key={key}>
          <GridTag data={grid} onDrag={this.handleDragStart} selected={selected} />
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
    const { grids } = this.props;
    const { selectedTag, startPoint, tagPosition, onDragging } = this.state;
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
              bind={(board) => {
                this.board = board;
              }}
            />
          </div>
        </div>
        {onDragging && (
          <FieldTagShadow
            data={selectedTag}
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
