import React, { PureComponent } from 'react';
import {
  Input,
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import OAForm from '../../../../../components/OAForm';

const {
  OAModal,
} = OAForm;
const FormItem = OAForm.Item;
const { TextArea } = Input;
@connect(({ loading }) => ({
  addLoading: loading.effects['point/addCertificate'],
  editLoading: loading.effects['point/editCertificate'],
}))

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

  handleSubmit = (params, onError) => {
    const { dispatch } = this.props;
    dispatch({
      type: params.id ? 'point/editCertificate' : 'point/addCertificate',
      payload: params,
      onError,
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
      editLoading,
      initialValue,
      onCancel,
      onError,
    } = this.props;
    const info = { ...initialValue };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <OAModal
        title="证书表单"
        visible={visible}
        onSubmit={this.handleSubmit}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
        form={form}
        formProps={{
          loading: addLoading || editLoading,
          onError,
        }}
      >
        {info.id ? (getFieldDecorator('id', {
          initialValue: info.id,
        }))(
          <Input type="hidden" placeholder="请输入" />
        ) : null}

        <FormItem {...formItemLayout} label="证书名称" required>
          {
            getFieldDecorator('name', {
              initialValue: info.name || '',
            })(
              <Input placeholder="请输入" />
            )
          }
        </FormItem>


        <FormItem {...formItemLayout} label="描述">
          {
            getFieldDecorator('description', {
              initialValue: info.description || '',
            })(
              <TextArea placeholder="请输入" />
            )
          }
        </FormItem>

        <FormItem {...formItemLayout} label="基础分">
          {
            getFieldDecorator('point', {
              initialValue: info.point || 0,
            })(
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>

      </OAModal>
    );
  }
}
