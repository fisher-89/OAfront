import React, { Component } from 'react';
import { Tag } from 'antd';

class FieldTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: typeof props.data.mobile_y === 'number',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      disabled: typeof nextProps.data.mobile_y === 'number',
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const changeData = nextProps.data !== this.props.data;
    const changeColor = nextProps.color !== this.props.color;
    const changeDisabled = nextState.disabled !== this.state.disabled;
    if (changeData || changeColor || changeDisabled) return true;
    return false;
  }

  mouseDown = (e) => {
    e.preventDefault();
    document.addEventListener('mouseup', this.mouseUp);
    const { onDrag, data } = this.props;
    const { disabled } = this.state;
    if (disabled) return false;
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
    const { data } = this.props;
    const { disabled } = this.state;
    return (
      <React.Fragment>
        <Tag
          color={disabled ? '' : 'blue'}
          style={disabled && { cursor: 'default' }}
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
