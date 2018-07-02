import React, { PureComponent } from 'react';
import styles from './index.less';

class Operator extends PureComponent {
  render() {
    const { clearLocal, saveLocal, getLocal } = this.props;
    return (
      <div className={styles.OAFormOperator}>
        <a onClick={clearLocal}>重置表单</a>
        <a onClick={saveLocal}>本地备份</a>
        <a onClick={getLocal}>读取备份</a>
      </div>
    );
  }
}

export default Operator;
