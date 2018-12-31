import React, { Component } from 'react';
import styles from './index.less';
import TextInput from './text';

export default class ControlContent extends Component {
  textInput = () => {
    const { data } = this.props;
    return <TextInput data={data} />;
  }

  intInput = () => {
    return this.textInput();
  }

  render() {
    const { data } = this.props;
    return 'fields' in data ? (
      <div className={styles.gridControl}>
        <div className={styles.gridTitle}>
          {data.name}
        </div>
      </div>
    ) : (
      <div className={styles.control}>
        <div className={styles.label}>
          {data.name}：
        </div>
        <div className={styles.input}>
          {eval(`this.${data.type}Input()`)}
        </div>
      </div>
    );
  }
}
