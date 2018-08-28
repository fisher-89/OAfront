import React from 'react';
import { Modal } from 'antd';
import styles from './modal.less';

export default class OAModal extends React.PureComponent {
  render() {
    const { title, titleStyle, bodyStyle } = this.props;
    const titleView = (
      <div
        className={styles.titleContent}
        style={titleStyle}
      >
        {title}
      </div>
    );
    return (
      <Modal
        destroyOnClose
        {...this.props}
        bodyStyle={{ ...bodyStyle }}
        title={titleView}
      />
    );
  }
}
OAModal.defaultProps = {
  title: '',
  width: 600,
  titleStyle: {},
};
