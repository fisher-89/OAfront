import React, { Component } from 'react';
import { Tag } from 'antd';

class FieldTag extends Component {
  mouseDown = (e) => {
    e.preventDefault();
    const { top, left } = e.target.getBoundingClientRect();
    this.clientX = e.clientX;
    this.clientY = e.clientY;
    if (e.type === 'touchstart') {
      this.clientX = e.touches[0].clientX;
      this.clientY = e.touches[0].clientY;
    }
    const shadowTag = e.target.cloneNode(true);
    const dragBox = document.createElement('div');
    dragBox.appendChild(shadowTag);
    dragBox.className += ' drag-shadow';
    dragBox.style.left = `${left}px`;
    dragBox.style.top = `${top}px`;
    document.body.appendChild(dragBox);
    this.shadowTag = dragBox;
    document.addEventListener('mousemove', this.dragField);
    document.addEventListener('mouseup', this.loosenDrag);
    document.addEventListener('touchmove', this.dragField);
    document.addEventListener('touchend', this.loosenDrag);
  }
  dragField = (e) => {
    e.preventDefault();
    const { clientX, clientY } = event.type === 'touchmove' ? e.touches[0] : e;
    const offsetX = clientX - this.clientX;
    const offsetY = clientY - this.clientY;
    this.shadowTag.style.transform = `translate(${offsetX}px,${offsetY}px)`;
  }
  loosenDrag = (e) => {
    e.preventDefault();
    document.removeEventListener('mousemove', this.dragField);
    document.removeEventListener('mouseup', this.loosenDrag);
    document.removeEventListener('touchmove', this.dragField);
    document.removeEventListener('touchend', this.loosenDrag);
    this.shadowTag.remove();
  }

  render() {
    return (
      <Tag
        color="blue"
        {...this.props}
        onMouseDown={this.mouseDown}
        onTouchStart={this.mouseDown}
      >
        {this.props.children}
      </Tag>
    );
  }
}

export default FieldTag;
