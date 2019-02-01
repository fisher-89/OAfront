/* eslint no-param-reassign:0 */
import React, { Component } from 'react';
import Line from './line';
import Control from './control';
import FieldGroup from './field_group';
import { topResize, bottomResize, leftResize, rightResize } from './resize_control';
import groupResize from './resize_group';
import fetchFieldsInGroup from '../supports/fetch_fields_in_group';
import styles from './index.less';

class Board extends Component {
  constructor(props) {
    super(props);
    const { fields, grids } = props;
    this.state = { lines: this.initLine(fields, grids) };
  }

  componentDidMount() {
    const { bind } = this.props;
    bind(this.board);
  }

  componentWillReceiveProps(newProps) {
    const { fields, grids } = this.props;
    if (fields.length === 0 && newProps.fields.length > 0) {
      this.setState({ lines: this.initLine(newProps.fields, newProps.grids) });
    }
    if (grids.length === 0 && newProps.grids.length > 0) {
      this.setState({ lines: this.initLine(newProps.fields, newProps.grids) });
    }
  }

  initLine = (fields, grids) => {
    let rowMax = 9;
    fields.forEach((field) => {
      if (field.y !== null) rowMax = Math.max(field.y + field.row, rowMax);
    });
    grids.forEach((grid) => {
      if (grid.y !== null) rowMax = Math.max(grid.y + grid.row, rowMax);
    });
    const lines = [];
    for (let i = 1; i <= rowMax; i += 1) {
      lines.push(i);
    }
    return lines;
  }

  handleAddLine = (row, addRow) => {
    const { lines } = this.state;
    const { fields, grids, fieldGroups, form } = this.props;
    const options = {};
    fields.forEach((field) => {
      if (typeof field.y === 'number' && field.y >= row - 1) {
        field.y += parseInt(addRow, 0);
      }
    });
    options.fields = fields;
    grids.forEach((grid, index) => {
      if (typeof grid.y === 'number' && grid.y >= row - 1) {
        options[`grids.${index}.y`] = grid.y + parseInt(addRow, 0);
      } else if (typeof grid.y === 'number' && grid.y + grid.row >= row) {
        options[`grids.${index}.row`] = grid.row + parseInt(addRow, 0);
        grid.fields.forEach((field) => {
          if (typeof field.y === 'number' && field.y + grid.y >= row - 2) {
            field.y += parseInt(addRow, 0);
          }
        });
        options[`grids.${index}.fields`] = grid.fields;
      }
    });
    fieldGroups.forEach((group) => {
      if (group.top >= row - 1) {
        group.top += parseInt(addRow, 0);
        group.bottom += parseInt(addRow, 0);
      } else if (group.bottom > row - 1) {
        group.bottom += parseInt(addRow, 0);
      }
    });
    options.fieldGroups = fieldGroups;
    for (let i = 1; i <= addRow; i += 1) {
      lines.splice(row - 1, 0, `${new Date().getTime()}${i}`);
    }
    form.setFieldsValue(options);
  }

  handleDeleteLine = (row) => {
    const { lines } = this.state;
    if (lines.length <= 9) return false;
    const { fields, grids, fieldGroups, form } = this.props;
    const options = {};
    fields.forEach((field) => {
      if (typeof field.y === 'number' && field.y > row - 1) {
        field.y -= 1;
      } else if (typeof field.y === 'number' && field.y + field.row > row - 1) {
        field.x = null;
        field.y = null;
        field.row = null;
        field.col = null;
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
            field.y -= 1;
          } else if (typeof field.y === 'number' && field.y + grid.y + field.row > row - 2) {
            field.x = null;
            field.y = null;
            field.row = null;
            field.col = null;
          }
        });
        options[`grids.${index}.fields`] = grid.fields;
      } else if (typeof grid.y === 'number' && grid.y + grid.row > row - 1) {
        options[`grids.${index}.x`] = null;
        options[`grids.${index}.y`] = null;
      }
    });
    fieldGroups.forEach((group, index) => {
      if (group.top === row - 1) {
        fieldGroups.splice(index, 1);
      } else if (group.top > row - 1) {
        group.top -= 1;
        group.bottom -= 1;
      } else if (group.bottom > row - 1) {
        group.bottom -= 1;
      }
    });
    options.fieldGroups = fieldGroups;
    lines.splice(row - 1, 1);
    form.setFieldsValue(options);
  }

  handleResize = (data, grid, direction, x, y) => {
    switch (direction) {
      case 'top':
        topResize.call(this, data, grid, y);
        break;
      case 'bottom':
        bottomResize.call(this, data, grid, y);
        break;
      case 'left':
        leftResize.call(this, data, grid, x);
        break;
      case 'right':
        rightResize.call(this, data, grid, x);
        break;
      default:
        return false;
    }
  }

  handleGroupResize = (data, direction, x, y) => {
    switch (direction) {
      case 'top':
        groupResize.top.call(this, data, y);
        break;
      case 'bottom':
        groupResize.bottom.call(this, data, y);
        break;
      case 'left':
        groupResize.left.call(this, data, x);
        break;
      case 'right':
        groupResize.right.call(this, data, x);
        break;
      default:
        return false;
    }
  }

  handleEditTitle = (data, newTitle) => {
    const { fieldGroups, form } = this.props;
    data.title = newTitle;
    form.setFieldsValue({ field_groups: fieldGroups });
  }

  makeLines = () => {
    const { lines } = this.state;
    return lines.map((line, index) => {
      return (
        <Line
          key={`line_${line}`}
          index={index}
          addLine={this.handleAddLine}
          deleteLine={this.handleDeleteLine}
        />
      );
    });
  }

  makeControls = () => {
    const {
      fields,
      grids,
      fieldGroups,
      onDrag,
      onDragGroup,
      draggingControl,
      draggingGroup,
      selectedControl,
      onSelect,
    } = this.props;
    const { lines } = this.state;
    const fieldsInGroup = draggingGroup ?
      fetchFieldsInGroup(draggingGroup, fields, grids, fieldGroups) : [];
    return [
      ...fieldGroups.filter(item => item !== draggingGroup).map((item) => {
        return (
          <FieldGroup
            key={`group_${item.created_at}`}
            data={item}
            onDrag={onDragGroup}
            onSelect={onSelect}
            onResize={this.handleGroupResize}
            onTitleChange={this.handleEditTitle}
            selectedControl={selectedControl}
          />
        );
      }),
      ...fields
        .filter(item => typeof item.x === 'number' && item !== draggingControl && fieldsInGroup.indexOf(item) === -1)
        .map(item => (
          <Control
            key={item.key}
            data={item}
            onDrag={onDrag}
            onSelect={onSelect}
            onResize={this.handleResize}
            selectedControl={selectedControl}
            board={this.board}
            lines={lines.length}
          />
        )),
      ...grids.filter(item => typeof item.x === 'number' && item !== draggingControl).map(item => (
        <Control
          key={item.key}
          data={item}
          onDrag={onDrag}
          onSelect={onSelect}
          onResize={this.handleResize}
          selectedControl={selectedControl}
          board={this.board}
          lines={lines.length}
          addLine={this.handleAddLine}
          deleteLine={this.handleDeleteLine}
          draggingControl={draggingControl}
          isGrid
        />
      )),
    ];
  }

  makeMask = () => {
    const { draggingControl, parentGrid } = this.props;
    const { lines } = this.state;
    if (draggingControl && parentGrid && parentGrid.x !== null) {
      const maskWidth = (parentGrid.col * 61) + 1;
      const maskHeight = ((parentGrid.row - 2) * 61) + 1;
      const maskTop = (parentGrid.y + 1) * 61;
      const maskBottom = (((lines.length - parentGrid.y - parentGrid.row) + 2) * 61) - 1;
      const maskLeft = (parentGrid.x * 61);
      const maskRight = ((20 - parentGrid.x - parentGrid.col) * 61) - 1;
      return (
        <div
          className={styles.mask}
          style={{
            width: `${maskWidth}px`,
            height: `${maskHeight}px`,
            borderTopWidth: `${maskTop}px`,
            borderBottomWidth: `${maskBottom}px`,
            borderLeftWidth: `${maskLeft}px`,
            borderRightWidth: `${maskRight}px`,
          }}
        />
      );
    } else {
      return null;
    }
  }

  render() {
    const { lines } = this.state;
    return (
      <div className={styles.board}>
        <div
          className={styles.scroller}
          style={{ height: `${(lines.length * 61) + 1}px` }}
          ref={(ele) => {
            this.board = ele;
          }}
        >
          {this.makeLines()}
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
