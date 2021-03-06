import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Input,
} from 'antd';
import OAForm, { OAModal, SearchTable } from '../../../components/OAForm';

const FormItem = OAForm.Item;

@OAForm.create()
@connect(({ authority }) => ({
  authority: authority.authority,
}))
export default class extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'authority/fetchAuth' });
  }

  handleSubmit = (params) => {
    const { dispatch } = this.props;
    const staffSn = params.staff.map(item => item.staff_sn);

    dispatch({
      type: 'roles/editRole',
      payload: {
        ...params,
        staff: staffSn,
      },
      onError: this.handleError,
      onSuccess: () => this.props.handleVisible(false),
    });
  }

  handleError = (error) => {
    const { onError } = this.props;
    onError(error);
  }

  render() {
    const {
      visible,
      onCancel,
      initialValue,
      handleVisible,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <OAModal
        title={`关联 "${initialValue.role_name}" 员工`}
        visible={visible}
        loading={this.props.loading}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
      >
        {initialValue.id ? (getFieldDecorator('id', {
          initialValue: initialValue.id,
        }))(
          <Input type="hidden" placeholder="请输入" />
        ) : null}

        {initialValue.role_name ? (getFieldDecorator('role_name', {
          initialValue: initialValue.role_name,
        }))(
          <Input type="hidden" placeholder="请输入" />
        ) : null}

        <FormItem {...formItemLayout} label="关联员工" >
          {
            getFieldDecorator('staff', {
              initialValue: initialValue.staff || [],
            })(
              <SearchTable.Staff
                multiple
                name={{
                  staff_sn: 'staff_sn',
                  realname: 'realname',
                }}
                showName="realname"
              />
            )
          }
        </FormItem>
      </OAModal>
    );
  }
}
