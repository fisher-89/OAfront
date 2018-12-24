import React, { Component } from 'react';
import { Dropdown, Menu } from 'antd';
import styles from './template.less';

const templateArea = { minX: 553, maxX: 1545, minY: 301, maxY: 833 };

class DraggingFieldTag extends Component {
  state = {
    row: 0,
    offsetY: 0,
  }

  componentWillMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('touchmove', this.handleMouseMove);
  }


  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.row !== this.state.row) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    console.log('unmount');
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('touchmove', this.handleMouseMove);
  }

  contextMenu = () => {
    const { addLine, deleteLine } = this.props;
    const { row } = this.state;
    return (
      <Menu>
        <Menu.Item
          onClick={() => {
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('touchmove', this.handleMouseMove);
            addLine(row);
          }}
        >
          在上方插入行
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('touchmove', this.handleMouseMove);
            addLine(row + 1);
          }}
        >
          在下方插入行
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('touchmove', this.handleMouseMove);
            deleteLine(row);
          }}
        >
          删除行
        </Menu.Item>
      </Menu>
    );
  }

  handleContextMenuToggle = (visible) => {
    console.log('visible:', visible);
    if (visible) {
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('touchmove', this.handleMouseMove);
    } else {
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('touchmove', this.handleMouseMove);
    }
  }

  handleMouseMove = (e) => {
    e.preventDefault();
    const { minX, maxX, minY, maxY } = templateArea;
    const { board } = this.props;
    const { clientY, pageX, pageY } = event.type === 'touchmove' ? e.touches[0] : e;
    if (!board) return false;
    let offsetY = 0;
    let row = 0;
    if (pageX >= minX && pageX <= maxX && pageY >= minY && pageY <= maxY) {
      const boardGeo = board.getBoundingClientRect();
      const index = Math.floor((clientY - boardGeo.top) / 76);
      offsetY = index * 76;
      row = index + 1;
    }
    this.setState({
      offsetY,
      row,
    });
  }

  render() {
    const { row, offsetY } = this.state;
    return row > 0 && (
      <Dropdown
        trigger={['contextMenu']}
        onVisibleChange={this.handleContextMenuToggle}
        overlay={this.contextMenu()}
      >
        <div
          style={{ transform: `translate(0px,${offsetY}px)` }}
          className={styles.lineFocus}
        >
          <div className={styles.leftControl}>{row}</div>
          <div className={styles.boxShadow} />
          <div className={styles.rightControl}>&nbsp;</div>
        </div>
      </Dropdown>
    );
  }
}

export default DraggingFieldTag;
