import React, { PureComponent } from 'react';
import { Modal, notification } from 'antd';
import OAForm from './index';
import './notification.less';

const defaultProps = {
  form: {},
  children: {},
  formProps: {},
  onChange: null,
  id: null,
  loading: false,
  onSubmit: () => {

  },
  onError: () => {

  },
};
export default class OAModal extends PureComponent {
  handleSubmit = () => {
    const { form, onSubmit } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(values, this.handleOnError);
      }
    });
  }

  handleOnError = (error, message) => {
    if (Object.keys(error).length) {
      Object.keys(error).forEach((i) => {
        this.props.form.setFields({
          [i]: { errors: [new Error(error[i][0])] },
        });
      });
      this.props.onError(error);
    } else if (message) {
      notification.error({
        message: '错误信息!!',
        description: message,
      });
    }
  }

  makeModalProps = () => {
    const { title, okText } = this.props;
    const response = {
      ...this.props,
      title: title || '表单',
      okText: okText || '确定',
      onOk: this.handleSubmit,
      destroyOnClose: true,
    };
    Object.keys(defaultProps).forEach((key) => {
      delete response[key];
    });
    return response;
  }

  makeOAFormProps = () => {
    const { formProps, form, autoSave, loading } = this.props;
    const response = {
      form,
      autoSave,
      loading,
      ...formProps,
    };
    return response;
  }

  render() {
    const { children } = this.props;
    return (
      <Modal
        {...this.makeModalProps()}
      >
        <OAForm
          {...this.makeOAFormProps()}
        >
          {children}
        </OAForm>
      </Modal>
    );
  }
}
OAModal.defaultProps = defaultProps;
