/**
 * Created by sushaochun on 2019/1/4.
 */
import React from 'react';
import styles from '../mobile_template.less';

const Mask = ({ masktag }) => {
  if (masktag === 0) {
    return null;
  }
  if (masktag === 1 || masktag === 2) {
    return (
      <React.Fragment>
        <div
          className={styles.mask}
          style={{ position: 'absolute',
          left: '0',
          top: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          zIndex: 444 }}
        />
      </React.Fragment>
    );
  }
};
export default Mask;

