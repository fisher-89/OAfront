import React from 'react';
import {
  message,
} from 'antd';
import './message.less';
import { undotFieldsValue } from '../../utils/utils';


export default (FormComponet) => {
  class NewFormComponent extends React.PureComponent {
    constructor(props) {
      super(props);
      const { id } = props;
      this.state = {
        localSavingKey: `${location.href}${id || 'StandardForm'}`,
        fieldsError: {},
      };
      this.autoSave = false;
    }

    bindForm = (form) => {
      this.form = form;
    }

    bindAutoSave = () => {
      this.autoSave = true;
    }

    saveByLocal = (fieldsValue) => {
      if (!this.autoSave) return;
      message.destroy();
      const saveLoading = message.loading('备份中', 1);
      const { localSavingKey } = this.state;
      localStorage.setItem(localSavingKey, JSON.stringify(fieldsValue));
      clearInterval(this.localSavingInterval);
      setTimeout(saveLoading, 1);
    }

    fetchLocalSaving = () => {
      message.destroy();
      const { localSavingKey } = this.state;
      const storageValue = JSON.parse(localStorage.getItem(localSavingKey));
      if (Object.keys(storageValue || {}).length === 0) {
        setTimeout(message.error('表单没有备份'), 1);
      } else {
        setTimeout(message.loading('读取中'), 1);
      }
      return storageValue;
    }

    clearFormAndLocalSaving = () => {
      const { localSavingKey } = this.state;
      clearInterval(this.localSavingInterval);
      localStorage.removeItem(localSavingKey);
    }


    handleFieldsError = (name) => {
      const { setFields, getFieldsError } = this.form;
      const err = getFieldsError();
      if (err[name]) {
        setFields({ [name]: undefined });
      }
      const { fieldsError } = this.state;
      if (fieldsError[name]) {
        delete fieldsError[name];
        this.setState({ fieldsError });
      }
    }

    handleOnChange = (changedFields) => {
      clearInterval(this.localSavingInterval);
      const fieldsValue = {};
      Object.keys(changedFields).forEach((key) => {
        fieldsValue[key] = changedFields[key];
      });
      this.localSavingInterval = setInterval(() => {
        this.saveByLocal(fieldsValue);
      }, 4000);
    }

    handleOnError = (error) => {
      const newError = undotFieldsValue(error);
      this.setState({ fieldsError: newError });
    }

    makeNewFormComponetProps = () => {
      const { fieldsError } = this.state;
      const respone = {
        ...this.props,
        bindForm: this.bindForm,
        bindAutoSave: this.bindAutoSave,
        handleFieldsError: this.handleFieldsError,
        fieldsError,
        onError: this.handleOnError,
        onChange: this.handleOnChange,
      };
      respone.autoSave = {
        getLocal: this.fetchLocalSaving,
        saveLocal: this.saveByLocal,
        clearLocal: this.clearFormAndLocalSaving,
      };
      return respone;
    }

    render() {
      return (
        <FormComponet {...this.makeNewFormComponetProps()} />
      );
    }
  }
  return NewFormComponent;
};

