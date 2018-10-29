import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input } from 'antd';
import OAForm, { DatePicker, OAModal } from '../../../components/OAForm';

const FormItem = OAForm.Item;

@OAForm.create()
@connect(({ loading }) => ({ loading: loading.models.staffs }))
export default class extends PureComponent {
  render() {
    const {
      loading,
      visible,
      onCancel,
      onSubmit,
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 8 },
    };
    const formItemLayout1 = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    return (
      <OAModal
        width={500}
        title="操作设置"
        loading={loading}
        visible={visible}
        onCancel={onCancel}
        onSubmit={onSubmit}
      >
        <FormItem label="执行日期" {...formItemLayout} required>
          {getFieldDecorator('operate_at', {
            initialValue: '',
          })(
            <DatePicker />
          )}
        </FormItem>
        <FormItem label="操作说明" {...formItemLayout1} >
          {getFieldDecorator('operation_remark', {
            initialValue: '',
          })(
            <Input.TextArea
              placeholder="最大长度100个字符"
              autosize={{
                minRows: 4,
                maxRows: 6,
              }}
            />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
