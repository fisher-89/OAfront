import React, { PureComponent } from 'react';
import {
  Form,
  Spin,
  Button,
  notification,
} from 'antd';
import OAModal from './modal';
import Operator from './operator';
import styles from './index.less';
import create from './Create';
import DatePicker from './DatePicker';
import Address from './Address';
import InputTags from './InputTags';
import SearchTable from './SearchTable';
import FormList from './FormList';
import StaticList from './StaticList';
import TreeSelect from './TreeSelect';
import FooterToolbar from '../../components/FooterToolbar';

const defaultProps = {
  autoSave: null,
  /** 自动存储 ---- 默认值 */
  form: null,
  loading: null,
  onSubmitBtn: null,
  /** 是否显示提交按钮 ---- 默认值 onSubmitBtn: []/string 'default' */
  validateOnChange: () => { },
  /** 验证错误信息 */
  onSubmit: () => {

  },
  /** 成功回掉函数 ---- 默认值 */
  onError: () => {

  },
  /** 失败回调函数 ---- 默认值 */
  localStorage: () => {

  },

};
export default class OAForm extends PureComponent {
  makeFormProps = () => {
    const response = {
      ...this.props,
      onSubmit: this.handleSubmit,
    };
    Object.keys(defaultProps).forEach((key) => {
      delete response[key];
    });
    return response;
  }

  makeOperatorProps = () => {
    const { form, autoSave, localStorage } = this.props;
    const { getFieldsValue } = form;
    const response = {
      ...autoSave,
      saveLocal: () => {
        const fieldsValue = getFieldsValue();
        autoSave.saveLocal(fieldsValue);
      },
      getLocal: localStorage,
    };
    return response;
  }

  handleSubmit = (e) => {
    const { form, onSubmit } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
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

  render() {
    const {
      children,
      loading,
      autoSave,
      onSubmitBtn,
    } = this.props;
    return (
      <div className={styles.OAForm}>
        <Spin spinning={loading} delay={500}>
          {autoSave && <Operator {...this.makeOperatorProps()} />}
          <Form
            {...this.makeFormProps()}
          >
            {children}
            {(Array.isArray(onSubmitBtn) || onSubmitBtn === 'default') ? (
              <Form.Item>
                <div style={{ position: 'relative', marginTop: 12, height: 32, lineHeight: '32px', borderTop: '1px solid #e8e8e8' }}>
                  <div style={{ position: 'absolute', right: '30%', marginTop: 12 }}>
                    {Array.isArray(onSubmitBtn) ? onSubmitBtn.map(item => item) : null}
                    <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>
                      提交
                    </Button>
                  </div>
                </div>
              </Form.Item>
            ) : onSubmitBtn ? (
              <FooterToolbar>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.handleSubmit}
                >
                  提交
                </Button>
              </FooterToolbar>
            ) : null}
          </Form>
        </Spin>
      </div>
    );
  }
}
OAForm.Item = Form.Item;
OAForm.OAModal = OAModal;
OAForm.DatePicker = DatePicker;
OAForm.Address = Address;
OAForm.InputTags = InputTags;
OAForm.SearchTable = SearchTable;
OAForm.create = create;
OAForm.defaultProps = defaultProps;
OAForm.FormList = FormList;
OAForm.List = StaticList;
OAForm.TreeSelect = TreeSelect;

