import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input } from 'antd';

import OAForm, { OAModal, DatePicker } from '../../../components/OAForm';

const FormItem = OAForm.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

@OAForm.create()
@connect(({ loading }) => ({ loading: loading.staffs }))
export default class extends PureComponent {
  handleSubmit = (params) => {
    const { dispatch, onCancel, onError } = this.props;
    dispatch({
      type: 'staffs/leaving',
      payload: params,
      onSuccess: () => {
        onCancel(false);
        console.log(111);
      },
      onError: errors => onError(errors),
    });
  }

  render() {
    const {
      loading,
      visible,
      onCancel,
      editStaff,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <React.Fragment>
        <OAModal
          width={600}
          title="离职交接"
          loading={loading}
          visible={visible}
          style={{ top: 30 }}
          onCancel={onCancel}
          onSubmit={validateFields(this.handleSubmit)}
        >
          {getFieldDecorator('staff_sn', {
            initialValue: editStaff.staff_sn || '',
          })(
            <Input type="hidden" />
          )}
          {getFieldDecorator('operation_type', {
            initialValue: 'leaving',
          })(
            <Input type="hidden" />
          )}
          <FormItem label="离职" {...formItemLayout} required>
            {getFieldDecorator('operate_at', {
              initialValue: '',
            })(
              <DatePicker />
            )}
          </FormItem>
          <FormItem label="备注" {...formItemLayout} >
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
