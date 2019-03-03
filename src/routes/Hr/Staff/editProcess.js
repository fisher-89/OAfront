import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input } from 'antd';
import OAForm, { OAModal, DatePicker } from '../../../components/OAForm';

const FormItem = OAForm.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
@OAForm.create()
@connect(({ loading }) => ({ loading: loading.staffs }))
export default class extends PureComponent {
  handleSubmit = (params, onError) => {
    const { dispatch, onCancel } = this.props;
    dispatch({
      type: 'staffs/process',
      payload: params,
      onError: errors => onError(errors),
      onSuccess: () => onCancel(),
    });
  }

  render() {
    const {
      loading,
      visible,
      onCancel,
      editStaff,
      validateFields,
      validatorRequired,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <React.Fragment>
        <OAModal
          width={600}
          title="转正"
          loading={loading}
          visible={visible}
          style={{ top: 30 }}
          onCancel={onCancel}
          onSubmit={validateFields(this.handleSubmit)}
        >
          {getFieldDecorator('staff_sn', {
            initialValue: editStaff.staff_sn || '',
          })(<Input type="hidden" />)}
          {getFieldDecorator('operation_type', {
            initialValue: 'employ',
          })(<Input type="hidden" />)}
          {getFieldDecorator('status_id', {
            initialValue: 2,
          })(<Input type="hidden" />)}
          <FormItem label="员工姓名" {...formItemLayout}>
            <span className="ant-form-text">{editStaff.realname}</span>
          </FormItem>
          <FormItem label="执行日期" {...formItemLayout} required>
            {getFieldDecorator('operate_at', {
              initialValue: '',
              rules: [validatorRequired],
            })(
              <DatePicker />
            )}
          </FormItem>
          <FormItem label="操作说明" {...formItemLayout} >
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
      </React.Fragment>
    );
  }
}
