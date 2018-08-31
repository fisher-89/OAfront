import React from 'react';
import { Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 8, pull: 2 },
  wrapperCol: { span: 16, pull: 2 },
};

export default class extends React.PureComponent {
  render() {
    return (
      <div className={styles.content}>
        <FormItem label="标题" {...formItemLayout}>客户拜访计划</FormItem>
        <FormItem label="内容" {...formItemLayout}>8.17日去阿里巴巴拜访马云</FormItem>
        <FormItem label="记录事件" {...formItemLayout}>2018-08-16  15:28:47</FormItem>
      </div>
    );
  }
}
