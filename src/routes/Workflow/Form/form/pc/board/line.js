import React, { Component } from 'react';
import { Dropdown, Menu, Input } from 'antd';
import styles from '../template.less';

class DraggingFieldTag extends Component {
  state = { opacity: 0, color: '#ccc', dropdownVisible: false, addRow: 1 }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ opacity: 1 });
    }, 10);
  }

  contextMenu = () => {
    const { addLine, deleteLine, index } = this.props;
    const { addRow } = this.state;
    const row = index + 1;
    return (
      <Menu style={{ width: '200px' }}>
        <Menu.Item>
          <div
            style={{ width: '100%' }}
            onClick={() => {
              this.setState({ dropdownVisible: false });
              addLine(row, addRow);
            }}
          >
            插入行
          </div>
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            this.setState({ dropdownVisible: false });
            addLine(row + 1, addRow);
          }}
        >
          在下方插入行
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            this.setState({ dropdownVisible: false });
            deleteLine(row);
          }}
        >
          删除行
        </Menu.Item>
        <div style={{ position: 'absolute', right: 0, top: '8px', width: '85px', fontSize: '12px' }}>
          行数
          <Input
            type="number"
            size="small"
            value={addRow}
            onChange={(e) => {
              this.setState({ addRow: e.target.value });
            }}
            style={{
              display: 'inline-block',
              width: '40px',
              paddingLeft: '5px',
              paddingRight: 0,
              height: '21px',
              marginLeft: '5px',
              position: 'relative',
              top: '1px',
            }}
          />
        </div>
        <div style={{ position: 'absolute', right: 0, top: '40px', width: '85px', fontSize: '12px' }}>
          行数
          <Input
            type="number"
            size="small"
            value={addRow}
            onChange={(e) => {
              this.setState({ addRow: e.target.value });
            }}
            style={{
              display: 'inline-block',
              width: '40px',
              paddingLeft: '5px',
              paddingRight: 0,
              height: '21px',
              marginLeft: '5px',
              position: 'relative',
              top: '1px',
            }}
          />
        </div>
      </Menu>
    );
  }

  render() {
    const { onClick, index } = this.props;
    const { opacity, color, dropdownVisible } = this.state;

    return (
      <Dropdown
        trigger={['contextMenu']}
        overlay={this.contextMenu()}
        visible={dropdownVisible}
        onVisibleChange={(visible) => {
          if (visible) this.state.addRow = 1;
          this.setState({ dropdownVisible: visible });
        }}
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
