import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Input,
  Select,
  Switch,
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

  handleNextForm = () => {
    this.setState({ visible: true });
  }

  handleSubmit = (params, onError) => {
    const { dispatch, onCancel } = this.props;
    dispatch({
      type: 'staffs/leave',
      payload: {
        ...params,
        skip_leaving: params.skip_leaving ? 1 : 0,
      },
      onError: (errors) => {
        this.setState({ visible: false }, onError(errors));
      },
      onSuccess: () => {
        this.setState({ visible: false }, onCancel());
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
          title="离职"
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
            initialValue: 'leave',
          })(
            <Input type="hidden" />
          )}
          <FormItem label="员工姓名" {...formItemLayout}>
            <span className="ant-form-text">{editStaff.realname}</span>
          </FormItem>
          <FormItem label="状态" required {...formItemLayout}>
            {getFieldDecorator('status_id', {
              initialValue: -1,
            })(
              <Select name="status_id" placeholer="请选择">
                <Option value={-1}>离职</Option>
                <Option value={-2}>自动离职</Option>
                <Option value={-3}>开除</Option>
                <Option value={-4}>劝退</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="跳过工作交接">
            {getFieldDecorator('skip_leaving', {
              initialValue: false,
              valuePropName: 'checked',
            })(
              <Switch />
            )}
          </FormItem>
        </OAModal>
      </React.Fragment>
    );
  }
}
