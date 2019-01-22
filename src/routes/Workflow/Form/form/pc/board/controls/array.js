import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default class extends Component {
  render() {
    return (
      <div className={styles.array}>
        <Icon type="plus" />
        {'添加'}
      </div>
    );
  }
}
