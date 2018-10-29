import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Input,
  Select,

} from 'antd';

import NextForm from './nextForm';
import OAForm, { OAModal } from '../../../components/OAForm';

const FormItem = OAForm.Item;
const { Option } = Select;


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

  handleSubmit = (params, onError) => {
    const { dispatch, onCancel } = this.props;
    dispatch({
      type: 'staffs/process',
      payload: params,
      onError: (errors) => {
        this.setState({ visible: false }, onError(errors));
      },
      onSuccess: () => {
        this.setState({ visible: false }, onCancel());
      },
    });
  }

  handleNextForm = () => {
    this.setState({ visible: true });
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
          title="转正"
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
            initialValue: 'employ',
          })(
            <Input type="hidden" />
          )}
          <FormItem label="姓名" {...formItemLayout}>
            {getFieldDecorator('realname', {
              initialValue: editStaff.realname,
            })(
              <Input placeholder="请输入" name="realname" disabled />
            )}
          </FormItem>
          <FormItem label="状态" required {...formItemLayout}>
            {getFieldDecorator('status_id', {
              initialValue: 2,
            })(
              <Select name="status_id" placeholer="请选择">
                <Option value={2}>在职</Option>
              </Select>
            )}
          </FormItem>
        </OAModal>
      </React.Fragment>
    );
  }
}
