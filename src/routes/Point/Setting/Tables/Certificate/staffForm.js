import React, { PureComponent } from 'react';
import {
  Select,
} from 'antd';
import { connect } from 'dva';
import OAForm from '../../../../../components/OAForm';

const {
  OAModal,
  SearchTable,
} = OAForm;
const { Option } = Select;
const FormItem = OAForm.Item;
@connect(({ point, loading }) => ({
  certificate: point.certificate,
  certificateLoading: loading.effects['point/fetchCertificate'],
  addLoading: loading.effects['point/addCertificateAward'],
}))
@OAForm.Config
@OAForm.create({
  onValuesChange(props, changeValues, allValues) {
    props.onChange(allValues);
    Object.keys(changeValues).forEach(key => props.handleFieldsError(key));
  },
})
export default class extends PureComponent {
  componentDidMount() {
    const { bindForm, form } = this.props;
    bindForm(form);
  }

  handleError = (error) => {
    return error;
  }

  handleSubmit = (params) => {
    const { dispatch } = this.props;
    const { staff, certificateId } = params;
    const body = [];
    staff.forEach((item) => {
      certificateId.forEach((cate) => {
        body.push({
          staff_sn: item.staff_sn,
          certificate_id: cate,
        });
      });
    });
    dispatch({
      type: 'point/addCertificateAward',
      payload: { data: body },
      onError: this.handleError,
      onSuccess: () => this.props.handleVisible(false),
    });
  }

  render() {
    const {
      form,
      form: { getFieldDecorator },
      handleVisible,
      visible,
      addLoading,
      certificateLoading,
      certificate,
      onCancel,
      onError,
    } = this.props;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <OAModal
        title="员工证书表单"
        visible={visible}
        onSubmit={this.handleSubmit}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
        form={form}
        formProps={{
          loading: addLoading || certificateLoading,
          onError,
        }}
      >
        <FormItem {...formItemLayout} label="员工" required>
          {
            getFieldDecorator('staff', {
              initialValue: [],
            })(
              <SearchTable.Staff
                multiple
                name={{
                  staff_sn: 'staff_sn',
                  realname: 'realname',
                }}
                showName="realname"
                placeholder="请选择员工"
              />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="证书" required>
          {
            getFieldDecorator('certificateId', {
              initialValue: [],
            })(
              <Select placeholder="请输入" mode="multiple">
                {certificate.map(item =>
                  (<Option key={item.id} value={item.id}>{item.name}</Option>)
                )}
              </Select>
            )
          }
        </FormItem>
      </OAModal>
    );
  }
}
