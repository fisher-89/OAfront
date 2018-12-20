import React, { Component } from 'react';
import FocusLine from './line_focus';
import styles from './template.less';

class Board extends Component {
  state = {
    lines: 13,
  }

  componentDidMount() {
    const { bind } = this.props;
    bind(this.board);
  }

  // handleAddLine = (index) => {
  //
  // }

  makeControls = () => {
    const { fields, grids } = this.props;
    return [...fields, ...grids].filter(item => typeof item.x === 'number')
      .map(item => (
        <div
          key={item.key}
          style={{
            position: 'absolute',
            width: `${(item.col * 76) - 1}px`,
            height: `${(item.row * 76) - 1}px`,
            top: `${(item.y * 76) + 1}px`,
            left: `${(item.x * 76) + 1}px`,
            backgroundColor: 'green',
          }}
        >
          {item.name}
        </div>
      ));
  }

  render() {
    const { lines } = this.state;
    return (
      <div className={styles.board}>
        <div
          className={styles.scroller}
          ref={(ele) => {
            this.board = ele;
          }}
        >
          <div className={styles.controls} style={{ height: `${(lines * 76) + 1}px` }}>
            {this.makeControls()}
          </div>
          <FocusLine board={this.board} />
        </div>
      </div>
    );
  }
}

export default Board;
