import React from 'react';
import { Form } from 'antd';

const FormItem = Form.Item;
export default class extends React.PureComponent {
  render() {
    return (
      <div>
        <FormItem label="修改前" />
        <FormItem label="修改后" />
      </div>
    );
  }
}
