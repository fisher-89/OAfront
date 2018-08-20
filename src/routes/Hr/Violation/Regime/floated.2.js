import React from 'react';
import {
  Input,
  InputNumber,
  Row,
  Col,
} from 'antd';
import OAForm, { List } from '../../../../components/OAForm';

const FormItem = OAForm.Item;

export default class Floated extends React.Component {
  render() {
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
        <List
          onChange={this.props.onChange}
          initialValue={this.props.value}
          sorter
        >
          <FormItem
            {...formItemLayout}
            label="部门"
          >
            <Input placeholder="请输入" name="department_id" />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="品牌"
          >
            <Input placeholder="请输入" name="brand_id" />
          </FormItem>
          <FormItem>
            <Row>
              <Col {...fieldsBoxLayout}>
                <FormItem
                  {...filedsFormItem}
                  label="浮动"
                >
                  <InputNumber placeholder="请输入" min={0} name="floated" />
                </FormItem>
              </Col>
              <Col {...fieldsBoxLayout}>
                <FormItem
                  {...filedsFormItem}
                  label="次数"
                >
                  <InputNumber placeholder="请输入" min={0} name="number" />
                </FormItem>
              </Col>
              <Col {...fieldsBoxLayout}>
                <FormItem
                  {...filedsFormItem}
                  label="值"
                >
                  <InputNumber placeholder="请输入" min={0} name="value" />
                </FormItem>
              </Col>
            </Row>
          </FormItem>
        </List>
      </React.Fragment>
    );
  }
}
