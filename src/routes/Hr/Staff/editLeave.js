import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Tabs,
  Input,
  Select,
  Switch,
} from 'antd';
import OAForm, { OAModal, DatePicker } from '../../../components/OAForm';

const FormItem = OAForm.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
@OAForm.create()
@connect(({ loading }) => ({ loading: loading.staffs }))
export default class extends PureComponent {
  handleSubmit = (params, onError) => {
    const { dispatch, onCancel } = this.props;
    dispatch({
      type: 'staffs/leave',
      payload: {
        ...params,
        skip_leaving: params.skip_leaving ? 1 : 0,
      },
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
    const style = { maxHeight: 600, overflowY: 'auto', overflowX: 'hidden' };
    const renderTitle = title => <div style={{ width: 220, textAlign: 'center' }}>{title}</div>;
    return (
      <React.Fragment>
        <OAModal
          width={600}
          title="离职"
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
            initialValue: 'leave',
          })(
            <Input type="hidden" />
          )}
          <Tabs defaultActiveKey="1">
            <TabPane forceRender tab={renderTitle('基础信息')} key="1" style={style}>
              <FormItem label="员工姓名" {...formItemLayout}>
                <span className="ant-form-text">{editStaff.realname}</span>
              </FormItem>
              <FormItem label="跳过工作交接" {...formItemLayout}>
                {getFieldDecorator('skip_leaving', {
                  initialValue: false,
                  valuePropName: 'checked',
                })(
                  <Switch />
                )}
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
            </TabPane>
            <TabPane forceRender tab={renderTitle('操作设置')} key="2" style={style}>
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
            </TabPane>
          </Tabs>
        </OAModal>
      </React.Fragment>
    );
  }
}
