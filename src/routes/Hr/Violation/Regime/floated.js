import React from 'react';
import {
  Input,
  InputNumber,
  Row,
  Col,
} from 'antd';
import OAForm, { FormList } from '../../../../components/OAForm1';

const FormItem = OAForm.Item;
@FormList
export default class Floated extends React.Component {
  render() {
    const {
      form: { getFieldDecorator },
      name,
      value,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const fieldsBoxLayout = { xs: 24, lg: 8 };
    const filedsFormItem = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    return (
      <React.Fragment>
        <FormItem
          {...formItemLayout}
          label="部门"
        >
          {getFieldDecorator(`${name}.department_id`, {
            initialValue: value.department_id || '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="品牌"
        >
          {getFieldDecorator(`${name}.brand_id`, {
            initialValue: value.brand_id || '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem>
          <Row>
            <Col {...fieldsBoxLayout}>
              <FormItem
                {...filedsFormItem}
                label="浮动"
              >
                {getFieldDecorator(`${name}.float`, {
                  initialValue: value.float || '',
                })(
                  <InputNumber placeholder="请输入" min={0} />
                )}
              </FormItem>
            </Col>
            <Col {...fieldsBoxLayout}>
              <FormItem
                {...filedsFormItem}
                label="次数"
              >
                {getFieldDecorator(`${name}.condition`, {
                  initialValue: value.condition || '',
                })(
                  <InputNumber placeholder="请输入" min={0} />
                )}
              </FormItem>
            </Col>
            <Col {...fieldsBoxLayout}>
              <FormItem
                {...filedsFormItem}
                label="值"
              >
                {getFieldDecorator(`${name}.value`, {
                  initialValue: value.value || '',
                })(
                  <InputNumber placeholder="请输入" min={0} />
                )}
              </FormItem>
            </Col>
          </Row>
        </FormItem>
      </React.Fragment>
    );
  }
}
