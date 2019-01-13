import React, { Component } from 'react';
import styles from './index.less';
import dropDown from '../../../../../../../public/drop_down.png';

export default class extends Component {
  render() {
    const { data } = this.props;
    return data.is_checkbox ? (
      <div className={styles.text}>
        {data.description || '请选择'}
      </div>
    ) : (
      <div className={styles.text}>
        {data.description || '请选择'}
        <img src={dropDown} alt="drop down" />
      </div>
    );
  }
}
