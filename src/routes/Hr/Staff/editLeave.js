import React, { PureComponent } from 'react';
import {
  Input,
  Select,
  Switch,
} from 'antd';

import OAFrom, { DatePicker } from '../../../components/OAForm1';

const FormItem = OAFrom.Item;
const { Option } = Select;


@OAForm.create()
export default class extends PureComponent {
  handleSubmitSuccess = (e) => {
    return e;
  };

  render() {
    // const { staffInfo } = this.props;
    // const initialFieldsValue = {
    //   realname: staffInfo.realname,
    //   status_id: -1,
    // };
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <OAFrom
        form={this.props.form}
        onSubmit={() => { }}
      >
        <FormItem label="姓名" {...formItemLayout}>
          <Input placeholder="请输入" name="realname" disabled />
        </FormItem>
        <FormItem label="状态" required {...formItemLayout}>
          <Select name="status_id" placeholer="请选择">
            <Option value={-1}>离职</Option>
            <Option value={-2}>自动离职</Option>
            <Option value={-3}>开除</Option>
            <Option value={-4}>劝退</Option>
          </Select>
        </FormItem>
        <FormItem {...formItemLayout} label="工作交接" name="skip_leaving">
          <Switch />
        </FormItem>
        <FormItem label="执行时间" name="operate_at" required {...formItemLayout}>
          <DatePicker />
        </FormItem>
        <FormItem label="操作说明" {...formItemLayout} name="operation_remark">
          <Input.TextArea
            placeholder="最大长度100个字符"
            autosize={{
              minRows: 4,
              maxRows: 6,
            }}
          />
        </FormItem>
      </OAFrom>
    );
  }
}
