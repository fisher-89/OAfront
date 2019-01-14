import React, { Component } from 'react';
import { Dropdown, Menu } from 'antd';
import styles from '../template.less';

class DraggingFieldTag extends Component {
  state = { opacity: 0, color: '#ccc' }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ opacity: 1 });
    }, 10);
  }

  contextMenu = () => {
    const { addLine, deleteLine, index } = this.props;
    const row = index + 1;
    return (
      <Menu>
        <Menu.Item
          onClick={() => {
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('touchmove', this.handleMouseMove);
            addLine(row);
          }}
        >
          插入行
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

  render() {
    const { onClick, index } = this.props;
    const { opacity, color } = this.state;

    return (
      <Dropdown
        trigger={['contextMenu']}
        onVisibleChange={this.handleContextMenuToggle}
        overlay={this.contextMenu()}
      >
        <div className={styles.line} onClick={onClick} style={{ top: `${(76 * index)}px`, opacity }}>
          <div className={styles.leftScale} style={{ color }}>{index + 1}</div>
          <div className={styles.rightScale} style={{ color }}>{index + 1}</div>
        </div>
      </Dropdown>
    );
  }
}

export default DraggingFieldTag;
