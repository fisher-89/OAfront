import React, { Component } from 'react';
import FocusLine from './line_focus';
import styles from './template.less';

class Board extends Component {
  state = {
    lines: [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ],
  }

  componentDidMount() {
    const { bind } = this.props;
    bind(this.board);
  }

  // handleAddLine = (index) => {
  //
  // }

  makeScale = () => {
    const { lines } = this.state;
    const scale = [];
    for (let i = 0; i <= lines.length; i += 1) {
      scale.push(
        <div key={`scale_${i}`}>
          {i}
        </div>
      );
    }
    return scale;
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
          <div>
            {lines.map(() => {
              return (<div className={styles.line} />);
            })}
          </div>
          <FocusLine board={this.board} />
        </div>
      </div>
    );
  }
}

export default Board;
