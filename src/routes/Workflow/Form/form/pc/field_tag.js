import React, { Component } from 'react';
import { Tag } from 'antd';

class FieldTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: typeof props.data.x === 'number',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      disabled: typeof nextProps.data.x === 'number',
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data !== this.props.data) return true;
    if (nextState.disabled !== this.state.disabled) return true;
    if (nextProps.selectedControl !== this.props.selectedControl) return true;
    return false;
  }

  mouseDown = (e) => {
    e.preventDefault();
    if (e.type === 'mousedown' && e.button !== 0) return false;
    const { onDrag, onSelect, data } = this.props;
    const { disabled } = this.state;
    if (disabled) {
      onSelect(data);
      return false;
    }
    const startPoint = e.target.getBoundingClientRect();
    let x;
    let y;
    x = e.clientX;
    y = e.clientY;
    if (e.type === 'touchstart') {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }
    onDrag(data, { x, y }, startPoint);
  }

  render() {
    const { data, selectedControl } = this.props;
    const { disabled } = this.state;
    return (
      <React.Fragment>
        <Tag
          color={disabled ? '' : 'blue'}
          style={disabled && selectedControl === data && { borderColor: '#1890ff', boxShadow: '#1890ff 0 0 2px 0' }}
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
