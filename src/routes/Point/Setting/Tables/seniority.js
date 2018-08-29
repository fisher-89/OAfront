import React, { PureComponent } from 'react';
import {
  Input,
  Button,
} from 'antd';
import { connect } from 'dva';
import OAForm from '../../../../components/OAForm';

const FormItem = OAForm.Item;

@connect(({ point, loading }) => {
  return {
    basePoint: point.base_seniority,
    loading: (
      loading.effects['point/editBaseForm'] ||
      loading.effects['point/fetchBase']
    ),
  };
})
@OAForm.create()
export default class extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'point/fetchBase',
      payload: {
        name: 'seniority',
      },
    });
  }

  handleSubmit = (values) => {
    const params = Object.keys(values).map((name) => {
      return {
        name,
        value: values[name],
      };
    });
    if (params.length) {
      const { dispatch, onError } = this.props;
      dispatch({
        type: 'point/editBaseForm',
        payload: { data: params },
        onError,
      });
    }
  }

  makeOAFormProps = () => {
    const { validateFields } = this.props;
    const response = {
      onSubmit: validateFields(this.handleSubmit),
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
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
              <Input type="number" placeholder="请输入" style={{ width: '100%' }} addonAfter="分/年" />
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
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">保存</Button>
        </FormItem>
      </OAForm>
    );
  }
}
