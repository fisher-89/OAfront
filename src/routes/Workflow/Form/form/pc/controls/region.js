import React, { Component } from 'react';
import styles from './index.less';
import dropDown from '../../../../../../../public/drop_down.png';

export default class extends Component {
  render() {
    const { data } = this.props;
    return (
      <div className={styles.region}>
        <div className={styles.regionSelects}>
          <div className={styles.text}>请选择<img src={dropDown} alt="drop down" /></div>
          <div className={styles.text}>请选择<img src={dropDown} alt="drop down" /></div>
          <div className={styles.text}>请选择<img src={dropDown} alt="drop down" /></div>
        </div>
        <div className={styles.address}>{data.description || '详细地址，请输入0-30个字符'}</div>
      </div>
    );
  }
}
