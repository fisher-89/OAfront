import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default class extends Component {
  render() {
    return (
      <div className={styles.upload}>
        <Icon type="plus" style={{ color: '#999', fontSize: '32px' }} />
        <div>上传</div>
      </div>
    );
  }
}
