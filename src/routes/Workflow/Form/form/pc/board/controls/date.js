import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default class extends Component {
  render() {
    const { data } = this.props;
    return (
      <div className={styles.text}>
        {data.description || '请选择'}
        <Icon type="calendar" />
      </div>
    );
  }
}
