import React, { PureComponent } from 'react';
import {
  Input,
} from 'antd';
import { connect } from 'dva';
import OAForm from '../../../../components/OAForm';

const FormItem = OAForm.Item;

@connect(({ point, loading }) => {
  return {
    basePoint: point.base_seniority,
    bLoading: loading.effects['point/fetchBase'],
    editLoading: loading.effects['point/editBaseForm'],
  };
})
@OAForm.Config
@OAForm.create()
export default class extends PureComponent {
  componentDidMount() {
    const { form, bindForm, dispatch } = this.props;
    bindForm(form);
    dispatch({
      type: 'point/fetchBase',
      payload: {
        name: 'seniority',
      },
    });
  }

  handleSubmit = (values, onError) => {
    const params = Object.keys(values).map((name) => {
      return {
        name,
        value: values[name],
      };
    });
    if (params.length) {
      const { dispatch } = this.props;
      dispatch({
        type: 'point/editBaseForm',
        payload: { data: params },
        onError,
      });
    }
  }

  makeOAFormProps = () => {
    const { form, onError, editLoading, bLoading } = this.props;
    const response = {
      form,
      onError,
      loading: bLoading || editLoading,
      onSubmit: this.handleSubmit,
      onSubmitBtn: 'default',
    };
    return response;
  }

  render() {
    const { form, basePoint } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    const info = {};
    if (basePoint) {
      basePoint.forEach((item) => {
        info[item.name] = item.value;
      });
    }
    return (
      <OAForm {...this.makeOAFormProps()}>
        <FormItem {...formItemLayout} label="单位工龄积分">
          {
            getFieldDecorator('ratio', {
              initialValue: info.ratio || '0',
              rules: [{
                required: true,
                message: '单位工龄积分不能为空!',
              }],
            })(
              <Input type="number" placeholder="请输入" style={{ width: '100%' }} addonAfter="分/月" />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="工龄分上限">
          {
            getFieldDecorator('max_point', {
              initialValue: info.max_point || '0',
              rules: [{
                required: true,
                message: '工龄分上限不能为空!',
              }],
            })(
              <Input type="number" placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>
      </OAForm>
    );
  }
}
