import React, { Component } from 'react';
import { Tag } from 'antd';

class FieldTag extends Component {
  mouseDown = (e) => {
    const { top, left } = e.target.getBoundingClientRect();
    this.clientX = e.clientX;
    this.clientY = e.clientY;
    this.shadowStartX = left;
    this.shadowStartY = top;
    const shadowTag = e.target.cloneNode(true);
    shadowTag.className += ' drag-shadow';
    shadowTag.style.left = `${left}px`;
    shadowTag.style.top = `${top}px`;
    shadowTag.setAttribute('id', 'fieldShadow');
    document.body.appendChild(shadowTag);
    this.shadowTag = shadowTag;
    document.addEventListener('mousemove', this.dragField);
    document.addEventListener('mouseup', this.loosenDrag);
    return false;
  }
  dragField = (e) => {
    const { clientX, clientY } = e;
    const offsetX = clientX - this.clientX;
    const offsetY = clientY - this.clientY;
    this.shadowTag.style.left = `${this.shadowStartX + offsetX}px`;
    this.shadowTag.style.top = `${this.shadowStartY + offsetY}px`;
    return false;
  }
  loosenDrag = () => {
    document.removeEventListener('mousemove', dragField);
    document.removeEventListener('mouseup', this.loosenDrag);
    this.shadowTag.remove();
  }

  render() {
    return (
      <Tag
        {...this.props}
        color="blue"
        onMouseDown={this.mouseDown}
      >
        {this.props.children}
      </Tag>
    );
  }
}

export default FieldTag;
