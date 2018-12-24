import React, { Component } from 'react';
import FocusLine from './line_focus';
import styles from './template.less';

class Board extends Component {
  state = {
    lines: 7,
  }

  componentDidMount() {
    const { bind } = this.props;
    bind(this.board);
  }

  handleAddLine = (row) => {
    const { fields, grids, form } = this.props;
    const options = {};
    fields.forEach((field) => {
      if (typeof field.y === 'number' && field.y >= row - 1) {
        field.y += 1; // eslint-disable-line no-param-reassign
      }
    });
    options.fields = fields;
    grids.forEach((grid, index) => {
      if (typeof grid.y === 'number' && grid.y >= row - 1) {
        options[`grids.${index}.y`] = grid.y + 1;
      }
    });
    this.state.lines += 1;
    form.setFieldsValue(options);
  }

  handleDeleteLine = (row) => {
    const { fields, grids, form } = this.props;
    const options = {};
    fields.forEach((field) => {
      if (typeof field.y === 'number' && field.y > row - 1) {
        field.y -= 1; // eslint-disable-line no-param-reassign
      } else if (typeof field.y === 'number' && field.y + field.row > row - 1) {
        field.x = null; // eslint-disable-line no-param-reassign
        field.y = null; // eslint-disable-line no-param-reassign
        field.row = null; // eslint-disable-line no-param-reassign
        field.col = null; // eslint-disable-line no-param-reassign
      }
    });
    options.fields = fields;
    grids.forEach((grid, index) => {
      if (typeof grid.y === 'number' && grid.y > row - 1) {
        options[`grids.${index}.y`] = grid.y - 1;
      } else if (typeof grid.y === 'number' && grid.y + grid.row > row - 1) {
        options[`grids.${index}.x`] = null;
        options[`grids.${index}.y`] = null;
        options[`grids.${index}.row`] = null;
        options[`grids.${index}.col`] = null;
      }
    });
    this.state.lines -= 1;
    form.setFieldsValue(options);
  }

  makeControls = () => {
    const { fields, grids } = this.props;
    return [...fields, ...grids].filter(item => typeof item.x === 'number')
      .map(item => (
        <div
          key={item.key}
          style={{
            position: 'absolute',
            width: `${(item.col * 76) - 1}px`,
            height: `${(item.row * 76) - 1}px`,
            top: `${(item.y * 76) + 1}px`,
            left: `${(item.x * 76) + 1}px`,
            backgroundColor: 'green',
          }}
        >
          {item.name}
        </div>
      ));
  }

  render() {
    const { lines } = this.state;
    return (
      <div className={styles.board}>
        <div
          className={styles.scroller}
          ref={(ele) => {
            this.board = ele;
          }}
        >
          <div className={styles.controls} style={{ height: `${(lines * 76) + 1}px` }}>
            {this.makeControls()}
          </div>
          <FocusLine
            board={this.board}
            addLine={this.handleAddLine}
            deleteLine={this.handleDeleteLine}
          />
        </div>
      </div>
    );
  }
}

export default Board;
