import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Input,
  notification,
} from 'antd';

import NextForm from './nextForm';
import OAForm, { OAModal, DatePicker } from '../../../components/OAForm';

const FormItem = OAForm.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 8 },
};

@OAForm.create()
@connect(({ loading }) => ({ loading: loading.staffs }))
export default class extends PureComponent {
  state = {
    visible: false,
  }

  handleNextForm = () => {
    this.setState({ visible: true });
  }

  handleSubmit = (params) => {
    const { dispatch, onCancel } = this.props;
    dispatch({
      type: 'staffs/leaving',
      payload: {
        ...params,
      },
      onError: (errors) => {
        this.setState({ visible: false }, () => {
          notification.error({
            message: errors.message,
          });
        });
      },
      onSuccess: (response) => {
        this.setState({ visible: false }, () => {
          onCancel();
          notification.success({
            message: response.message,
          });
        });
      },
    });
  }

  render() {
    const {
      form,
      loading,
      visible,
      onCancel,
      editStaff,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <React.Fragment>
        <NextForm
          form={form}
          visible={this.state.visible}
          onSubmit={validateFields(this.handleSubmit)}
          onCancel={() => { this.setState({ visible: false }); }}
        />
        <OAModal
          width={600}
          title="离职交接"
          okText="下一步"
          loading={loading}
          visible={visible}
          style={{ top: 30 }}
          onCancel={onCancel}
          onSubmit={validateFields(this.handleNextForm)}
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
          <FormItem label="离职时间" {...formItemLayout}>
            {getFieldDecorator('left_at', {
              initialValue: '',
            })(
              <DatePicker />
            )}
          </FormItem>
        </OAModal>
      </React.Fragment>
    );
  }
}
