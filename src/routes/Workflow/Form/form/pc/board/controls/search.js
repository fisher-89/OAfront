import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default class extends Component {
  render() {
    const { data } = this.props;
    return (
      <div className={styles.text}>
        {data.description || '请搜索'}
        <Icon type="search" />
        <div style={{ height: '100%', borderRight: '1px solid #ccc', float: 'right' }} />
      </div>
    );
  }
}
