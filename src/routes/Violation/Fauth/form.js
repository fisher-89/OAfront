import React, { PureComponent } from 'react';
import {
  Switch,
  Select,
} from 'antd';
import OAForm, { OAModal, SearchTable } from '../../../components/OAForm';

const { Option } = Select;
const FormItem = OAForm.Item;
@OAForm.create()
export default class extends PureComponent {
  componentWillMount() {
    const { fetchDingGroup } = this.props;
    fetchDingGroup();
  }

  handleSubmit = (params) => {
    const { setPushAuth, dinggroup, onCancel } = this.props;
    const [midkey] = dinggroup.filter(item => item.group_sn === params.flock_sn);
    let payload;
    if (midkey) {
      payload = {
        ...params,
        ...params.staff,
        flock_name: midkey.group_name,
        default_push: params.default_push ? 1 : 0,
      };
    } else {
      payload = {
        ...params,
        ...params.staff,
        default_push: params.default_push ? 1 : 0,
      };
    }

    delete payload.staff;
    setPushAuth(payload, this.handleError, () => onCancel());
  }

  handleError = (error) => {
    const { onError } = this.props;
    onError(error, {
      staff_name: 'staff',
      staff_sn: 'staff',
      flock_sn: 'flock_sn',
      flock_name: 'flock_sn',
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const staffItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
    };
    const { dinggroup, initialValue, validateFields, onCancel, visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    const staffname = { staff_sn: initialValue.staff_sn, staff_name: initialValue.staff_name };
    return (
      <OAModal
        visible={visible}
        title="推送权限"
        onCancel={() => onCancel()}
        actionType={initialValue.id !== undefined}
        onSubmit={validateFields(this.handleSubmit)}
      >
        {getFieldDecorator('id', {
          initialValue: initialValue.id || undefined,
        })(<input type="hidden" />)}
        <FormItem label="员工姓名" {...staffItemLayout} required>
          {getFieldDecorator('staff', {
            initialValue: staffname || {},
          })(
            <SearchTable.Staff
              name={{
                staff_sn: 'staff_sn',
                staff_name: 'realname',
              }}
              showName="staff_name"
              placeholder="请选择员工"
            />)}
        </FormItem>
        <FormItem label="推送地址编号" {...formItemLayout} required>
          {getFieldDecorator('flock_sn', {
            initialValue: initialValue.flock_sn || '',
          })(
            <Select >
              {(dinggroup || []).map(item => (
                <Option key={item.group_sn} value={item.group_sn} >{item.group_name}</Option>
              )
              )}
            </Select>
          )}
        </FormItem>
        <FormItem label="是否默认选择" {...formItemLayout}>
          {getFieldDecorator('default_push', {
            initialValue: !!initialValue.default_push || 0,
          })(
            <Switch />
          )}
        </FormItem>
      </OAModal>
    );
  }
}

