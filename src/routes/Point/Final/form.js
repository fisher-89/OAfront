import React, { PureComponent } from 'react';
import {
  Input,
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import OAForm, {
  OAModal,
  SearchTable,
} from '../../../components/OAForm';

const FormItem = OAForm.Item;

@connect(({ loading }) => ({
  loading: (
    loading.effects['point/addFinal'] ||
    loading.effects['point/editFinal']
  ),
}))
@OAForm.create()
export default class extends PureComponent {
  handleError = (error) => {
    const { onError, form: { setFields } } = this.props;
    onError(error, (err, values) => {
      const errors = err.staff_name || err.staff_sn;
      setFields({ staff: { ...errors, value: values.staff } });
    });
  }

  handleSubmit = (params) => {
    const { dispatch } = this.props;
    const body = {
      ...params,
      ...params.staff,
    };
    delete body.staff;
    dispatch({
      type: params.id ? 'point/editFinal' : 'point/addFinal',
      payload: body,
      onError: this.handleError,
      onSuccess: () => this.props.handleVisible(false),
    });
  }

  render() {
    const {
      handleVisible,
      visible,
      initialValue,
      onCancel,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;
    const info = { ...initialValue };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <OAModal
        title="终审人表单"
        visible={visible}
        loading={this.props.loading}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
      >
        {info.id ? (getFieldDecorator('id', {
          initialValue: info.id,
        }))(
          <Input type="hidden" placeholder="请输入" />
        ) : null}

        <FormItem {...formItemLayout} label="终审人" required>
          {
            getFieldDecorator('staff', {
              initialValue: info.staff || [],
            })(
              <SearchTable.Staff
                name={{
                  staff_sn: 'staff_sn',
                  staff_name: 'realname',
                }}
                showName="staff_name"
                placeholder="请选择员工"
              />
            )
          }
        </FormItem>

        <FormItem {...formItemLayout} label="A分加分上限" required>
          {
            getFieldDecorator('point_a_awarding_limit', {
              initialValue: info.id ? info.point_a_awarding_limit.toString() : '',
            })(
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>

        <FormItem {...formItemLayout} label="A分减分上限" required>
          {
            getFieldDecorator('point_a_deducting_limit', {
              initialValue: info.id ? info.point_a_deducting_limit.toString() : '',
            })(
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>

        <FormItem {...formItemLayout} label="B分加分上限" required>
          {
            getFieldDecorator('point_b_awarding_limit', {
              initialValue: info.id ? info.point_b_awarding_limit.toString() : '',
            })(
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>

        <FormItem {...formItemLayout} label="B分减分上限" required>
          {
            getFieldDecorator('point_b_deducting_limit', {
              initialValue: info.id ? info.point_b_deducting_limit.toString() : '',
            })(
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>
      </OAModal>
    );
  }
}
