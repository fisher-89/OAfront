import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import OAForm from './index';
import OAModal from '../OAModal';
import Operator from './operator';
import './notification.less';

const defaultProps = {
  formProps: {},
  onChange: null,
  loading: false,
  onSubmit: () => {

  },
  onError: () => {

  },
};
export default class Modal extends PureComponent {
  makeModalProps = () => {
    const { title, okText, onSubmit, loading, actionType } = this.props;
    let titleType = '';
    if (actionType === false) {
      titleType = '添加';
    }
    if (actionType === true) {
      titleType = '编辑';
    }
    const response = {
      ...this.props,
      confirmLoading: loading,
      title: title ? `${titleType}${title}` : '',
      okText: okText || '确定',
      onOk: onSubmit,
      destroyOnClose: true,
    };
    Object.keys(defaultProps).forEach((key) => {
      delete response[key];
    });
    return response;
  }

  makeOAFormProps = () => {
    const { formProps } = this.props;
    const response = { ...formProps };
    return response;
  }

  render() {
    const { children, localBackUpKey, savelocalBackUp, loading } = this.props;
    return (
      <OAModal {...this.makeModalProps()}>
        <Spin spinning={loading || false}>
          {(savelocalBackUp) && (
            <Operator
              autoSave
              ref={(e) => {
                this.opertor = e;
              }}
              localBackUpKey={localBackUpKey}
              savelocalBackUp={this.props.savelocalBackUp}
              getlocalBackUp={this.props.getlocalBackUp}
            />
          )}
          <OAForm {...this.makeOAFormProps()}>
            {children}
          </OAForm>
        </Spin>
      </OAModal>
    );
  }
}
Modal.defaultProps = defaultProps;
