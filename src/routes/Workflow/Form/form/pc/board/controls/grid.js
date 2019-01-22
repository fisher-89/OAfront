import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default class extends Component {
  render() {
    const { data } = this.props;
    return (
      <div className={styles.gridControl}>
        <div className={styles.gridHeader}>
          {data.name}
        </div>
        <div className={styles.gridContent}>
          <div className={styles.deleteButton}>
            <Icon type="close" />
          </div>
        </div>
        <div className={styles.gridFooter}>
          <div className={styles.addButton}>
            <Icon type="plus" />
          </div>
        </div>
      </div>
    );
  }
}
