import React, { Component } from 'react';
import styles from './index.less';

export default class extends Component {
  render() {
    const { data } = this.props;
    return (
      <div className={styles.text}>{data.description || '请输入...'}</div>
    );
  }
}
