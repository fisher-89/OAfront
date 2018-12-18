import React, { Component } from 'react';
import { Tag } from 'antd';

class FieldTag extends Component {
  shouldComponentUpdate(nextProps) {
    const changeData = nextProps.data !== this.props.data;
    const changeColor = nextProps.color !== this.props.color;
    if (changeData || changeColor) return true;
    return false;
  }

  mouseDown = (e) => {
    e.preventDefault();
    const { onDrag, data } = this.props;
    const { top, left } = e.target.getBoundingClientRect();
    let x;
    let y;
    x = e.clientX;
    y = e.clientY;
    if (e.type === 'touchstart') {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }
    onDrag(data, { x, y }, { top, left });
  }

  render() {
    const { data, color } = this.props;
    return (
      <React.Fragment>
        <Tag
          color={color || 'blue'}
          onMouseDown={this.mouseDown}
          onTouchStart={this.mouseDown}
          onTouchEnd={this.mouseDown}
        >
          {data.name}
        </Tag>
      </React.Fragment>
    );
  }
}

export default FieldTag;
