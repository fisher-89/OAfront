import React from 'react';
import {
  Modal,
} from 'antd';

const defaultProps = {
  formItem: null,
};
export default class ModalList extends React.PureComponent {
  makeProps = () => {
    const response = this.props;
    Object.keys(defaultProps).forEach((key) => {
      delete response[key];
    });
    return response;
  }

  render() {
    const { formItem, visible } = this.props;
    return (
      <Modal
        visible={visible === true}
      >
        {formItem}
      </Modal>
    );
  }
}
ModalList.defaultProps = defaultProps;

