import React, { Component } from 'react';
import FocusLine from './line_focus';
import Control from './control';
import styles from '../template.less';

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
      } else if (typeof grid.y === 'number' && grid.y + grid.row >= row) {
        options[`grids.${index}.row`] = grid.row + 1;
        grid.fields.forEach((field) => {
          if (typeof field.y === 'number' && field.y + grid.y >= row - 2) {
            field.y += 1; // eslint-disable-line no-param-reassign
          }
        });
        options[`grids.${index}.fields`] = grid.fields;
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
      } else if (typeof grid.y === 'number' && grid.y !== row - 1 && grid.y + grid.row > row && grid.row > 3) {
        options[`grids.${index}.row`] = grid.row - 1;
        grid.fields.forEach((field) => {
          if (typeof field.y === 'number' && field.y + grid.y > row - 2) {
            field.y -= 1; // eslint-disable-line no-param-reassign
          } else if (typeof field.y === 'number' && field.y + grid.y + field.row > row - 2) {
            field.x = null; // eslint-disable-line no-param-reassign
            field.y = null; // eslint-disable-line no-param-reassign
            field.row = null; // eslint-disable-line no-param-reassign
            field.col = null; // eslint-disable-line no-param-reassign
          }
        });
        options[`grids.${index}.fields`] = grid.fields;
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
    const { fields, grids, onDrag, draggingControl } = this.props;
    return [
      ...fields.filter(item => typeof item.x === 'number' && item !== draggingControl).map(item => (
        <Control
          key={item.key}
          data={item}
          onDrag={onDrag}
          addLine={this.handleAddLine}
          deleteLine={this.handleDeleteLine}
        />
      )),
      ...grids.filter(item => typeof item.x === 'number' && item !== draggingControl).map(item => (
        <Control
          key={item.key}
          data={item}
          onDrag={onDrag}
          addLine={this.handleAddLine}
          deleteLine={this.handleDeleteLine}
          grid
        />
      )),
    ];
  }

  makeMask = () => {
    const { parentGrid } = this.props;
    const { lines } = this.state;
    return parentGrid && parentGrid.x !== null ? (
      <React.Fragment>
        <div className={styles.mask} style={{ top: 0, height: `${(parentGrid.y + 1) * 76}px` }} />
        <div
          className={styles.mask}
          style={{
            top: `${((parentGrid.row - 2) * 76) + 1}px`,
            height: `${(((lines - parentGrid.y - parentGrid.row) + 2) * 76) - 1}px`,
          }}
        />
      </React.Fragment>
    ) : null;
  }

  render() {
    const { lines } = this.state;
    return (
      <div className={styles.board}>
        <div
          className={styles.scroller}
          style={{ height: `${(lines * 76) + 1}px` }}
          onContextMenu={(e) => {
            e.preventDefault();
            return false;
          }}
          ref={(ele) => {
            this.board = ele;
          }}
        >
          <FocusLine
            board={this.board}
            addLine={this.handleAddLine}
            deleteLine={this.handleDeleteLine}
          />
          <div className={styles.controls}>
            {this.makeControls()}
            {this.makeMask()}
          </div>
        </div>
      </div>
    );
  }
}

export default Board;
