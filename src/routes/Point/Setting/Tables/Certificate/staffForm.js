import React, { PureComponent } from 'react';
import {
  Select,
} from 'antd';
import { connect } from 'dva';
import OAForm, {
  OAModal,
  SearchTable,
} from '../../../../../components/OAForm1';

const { Option } = Select;
const FormItem = OAForm.Item;


@connect(({ point, loading }) => ({
  certificate: point.certificate,
  loading: (
    loading.effects['point/fetchCertificate'] ||
    loading.effects['point/addCertificateAward']
  ),
}))
@OAForm.create()
export default class extends PureComponent {
  handleSubmit = (params) => {
    const { dispatch, onError } = this.props;
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
      onError,
      onSuccess: () => this.props.handleVisible(false),
    });
  }

  render() {
    const {
      validateFields,
      form: { getFieldDecorator },
      handleVisible,
      visible,
      certificate,
      onCancel,
    } = this.props;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <OAModal
        title="员工证书表单"
        visible={visible}
        loading={this.props.loading}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
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
