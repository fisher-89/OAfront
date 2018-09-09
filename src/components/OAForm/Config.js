import React from 'react';
import { Spin, message } from 'antd';
import Operator from './operator';
import Create from './Create';
import { unicodeFieldsError, dotFieldsValue } from '../../utils/utils';

import './message.less';
import styles from './index.less';

function getFieldsName(fields) {
  const changeFields = dotFieldsValue(fields);
  const nameKey = Object.keys(changeFields);
  const rule = /(\.name)$/;
  const dirty = /(\.dirty)$/;
  const key = nameKey.find(item => rule.test(item) && item.indexOf('value') === -1);
  const dirtyKey = nameKey.find(item => dirty.test(item) && item.indexOf('value') === -1);
  return dirtyKey !== undefined ? changeFields[key] : undefined;
}

function getFieldsValueKey(name) {
  const names = name.split('.');
  let executeStr = '';
  const point = /(\.)$/;
  names.forEach((key) => {
    const newKey = parseInt(key, 10);
    if (isNaN(newKey)) {
      executeStr += `${key}.`;
    } else {
      executeStr = executeStr.replace(point, '');
      executeStr += `[${newKey}].`;
    }
  });
  return executeStr.replace(point, '');
}


export default formCreate => option => (Componet) => {
  const newOption = {
    ...option,
    onFieldsChange(props, fields) {
      const name = getFieldsName(fields);
      if (name) {
        const newName = getFieldsValueKey(name);
        const fieldsKey = eval(`fields.${newName}`);
        if (fieldsKey && fieldsKey.value) props.setFiedError(name, fieldsKey.value);
      }
    },
    onValuesChange(props, _, allValues) {
      props.onChange(allValues, props.index);
    },
  };
  const { localBackUpKey, modal } = option || {};
  delete newOption.localBackUpKey;
  delete newOption.modal;
  const FormComponent = Create(formCreate)(newOption)(Componet);
  class NewFormComponent extends React.PureComponent {
    state = {
      autoSave: false,
      localSave: false,
      modalSave: false,
    }

    getlocalBackUp = (value) => {
      if (!this.form) return;
      const { setFieldsValue } = this.form;
      setFieldsValue(value);
    }

    savelocalBackUp = () => {
      if (!this.form) return;
      const { getFieldsValue } = this.form;
      return getFieldsValue();
    }

    bindAutoSave = (autoSave, localSave) => {
      this.setState({ autoSave, localSave });
    }

    handleFieldsError = (name, value) => {
      if (!this.form) return;
      const { setFields, getFieldError } = this.form;
      const fieldsErrors = getFieldError(name);
      if (fieldsErrors && value) {
        setFields({ [name]: { value } });
      } else if (value === null) { setFields({ [name]: {} }); }
    }

    handleOnChange = (changedFields, index) => {
      const { onChange } = this.props;
      if (onChange) onChange(changedFields, index);
      if (!this.state.autoSave) return;
      clearInterval(this.localSavingInterval);
      if (this.opertor) {
        this.localSavingInterval = setInterval(() => {
          this.opertor.saveByLocal(changedFields, clearInterval(this.localSavingInterval));
        }, 4000);
      }
    }

    bindModalAutoSave = (autoSave) => {
      this.setState({ autoSave, modalSave: true });
      return {
        getlocalBackUp: this.getlocalBackUp,
        savelocalBackUp: this.savelocalBackUp,
      };
    }

    makeExtraError = (errResult, extraConfig, _, name) => {
      const { setFields } = this.form;
      const index = extraConfig[name];
      const value = eval(`arguments[2].${index}`);
      const customErr = {};
      if (
        extraConfig &&
        extraConfig[name] &&
        value !== undefined &&
        typeof extraConfig === 'object'
      ) {
        const key = extraConfig[name].replace(/(\[)|(\]\.)/g, '.');
        setFields({ [key]: { ...errResult[name], value } });
      } else {
        customErr[name] = errResult[name];
      }
      return customErr;
    }

    disposeErrorResult = (errResult, extraConfig, values) => {
      let customErr = {};
      const formError = {};
      Object.keys(errResult).forEach((name) => {
        if (!Object.hasOwnProperty.call(errResult[name], 'value')) {
          customErr = {
            ...customErr,
            ...this.makeExtraError(errResult, extraConfig, values, name),
          };
        } else {
          formError[name] = errResult[name];
        }
      });
      return { customErr, formError };
    }

    handleOnError = (error, extraConfig = {}, callback, isUnicode) => {
      if (!this.form) return;
      const { setFields, getFieldsValue } = this.form;
      if (extraConfig === false) {
        if (Object.keys(error).length) setFields(error);
        return;
      }
      const values = getFieldsValue();
      const errResult = unicodeFieldsError(error, isUnicode, { ...values });

      const { customErr, formError } = this.disposeErrorResult(errResult, extraConfig, values);
      if (typeof extraConfig === 'function') extraConfig(customErr, values, error);
      if (callback) callback(customErr, values, error);
      if (Object.keys(formError).length) setFields(formError);
    }

    handleSubmit = (callback) => {
      return (e) => {
        if (e) e.preventDefault();
        if (!this.form) return;
        const fieldsError = dotFieldsValue(this.form.getFieldsError());
        let errorAble = false;
        Object.keys(fieldsError).forEach((key) => {
          if (fieldsError[key]) {
            errorAble = true;
          }
        });
        if (errorAble) { message.destroy(); message.error('表单存在未处理的错误信息！'); }
        this.form.validateFieldsAndScroll(false, { force: true }, (err, values) => {
          if (!err && !errorAble) {
            callback(values, this.handleOnError);
          }
        });
      };
    }

    validatorRequired = (_, value, cb) => {
      if (value === '' || !value) cb('必填选项!');
      if (Array.isArray(value) && value.length === 0) cb('必填选项!');
      if (typeof value === 'object' && Object.keys(value).length === 0) cb('必填选项!');
      cb();
    }

    makeNewFormComponetProps = () => {
      const respone = {
        bindAutoSave: this.bindAutoSave,
        bindModalAutoSave: this.bindModalAutoSave,
        setFiedError: this.handleFieldsError,
        onChange: this.handleOnChange,
        validateFields: this.handleSubmit,
        onError: this.handleOnError,
        ...this.props,
      };
      respone.validatorRequired = { validator: this.validatorRequired };
      return respone;
    }

    render() {
      const { loading } = this.props;
      const { autoSave, localSave, modalSave } = this.state;
      return (
        <Spin spinning={modal ? false : loading === true}>
          <div className={styles.OAForm}>
            {(autoSave || localSave) && (
              <Operator
                autoSave
                ref={(e) => {
                  this.opertor = e;
                }}
                modalSave={modalSave}
                localBackUpKey={localBackUpKey}
                savelocalBackUp={this.savelocalBackUp}
                getlocalBackUp={this.getlocalBackUp}
              />
            )}
            <FormComponent
              {...this.makeNewFormComponetProps()}
              bindForm={(form) => {
                this.form = form;
              }}
            />
          </div>
        </Spin>
      );
    }
  }
  return NewFormComponent;
};
