import React, { Component } from 'react';
import { Dropdown, Menu } from 'antd';
import styles from './template.less';

const templateArea = { minX: 553, maxX: 1545, minY: 301, maxY: 833 };

class DraggingFieldTag extends Component {
  state = {
    offsetY: 0,
    onTemplate: false,
  }

  componentWillMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('touchmove', this.handleMouseMove);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('touchmove', this.handleMouseMove);
  }

  contextMenu = (
    <Menu>
      <Menu.Item>在上方插入行</Menu.Item>
      <Menu.Item>在下方插入行</Menu.Item>
      <Menu.Item>删除行</Menu.Item>
    </Menu>
  )

  handleContextMenuToggle = (visible) => {
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
    let offsetY = 0;
    let onTemplate = false;
    if (pageX >= minX && pageX <= maxX && pageY >= minY && pageY <= maxY) {
      onTemplate = true;
      const boardGeo = board.getBoundingClientRect();
      offsetY = (Math.floor((clientY - boardGeo.top) / 76) * 76);
    }
    this.setState({
      offsetY,
      onTemplate,
    });
  }

  render() {
    const { offsetY, onTemplate } = this.state;
    return onTemplate && (
      <div
        style={{ transform: `translate(0px,${offsetY}px)` }}
        className={styles.lineFocus}
      >
        <div className={styles.leftControl}>{(offsetY / 76) + 1}</div>
        <Dropdown
          trigger={['contextMenu']}
          onVisibleChange={this.handleContextMenuToggle}
          overlay={this.contextMenu}
        >
          <div className={styles.boxShadow} />
        </Dropdown>
        <div className={styles.rightControl}>&nbsp;</div>
      </div>

    );
  }
}

export default DraggingFieldTag;
