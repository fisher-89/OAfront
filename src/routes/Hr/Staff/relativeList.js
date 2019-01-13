import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  Select,
} from 'antd';
import OAForm, { SearchTable, FormList } from '../../../components/OAForm';

const { Option } = Select;
const FormItem = OAForm.Item;

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
@FormList
export default class extends PureComponent {
  render() {
    const fieldsBoxLayout = {
      xs: 24,
      lg: 12,
    };
    const { form: { getFieldDecorator }, value, name, validatorRequired } = this.props;
    const forName = `${name}`;
    return (
      <FormItem>
        <Row>
          <Col {...fieldsBoxLayout}>
            <FormItem label="姓名" {...formItemLayout} required>
              {getFieldDecorator(`${forName}.relative`, {
                initialValue: value.staff_sn ? {
                  relative_sn: value.staff_sn,
                  relative_name: value.realname,
                } : {},
                rules: [validatorRequired],
              })(
                <SearchTable.Staff
                  name={{
                    relative_sn: 'staff_sn',
                    relative_name: 'realname',
                  }}
                  filters={{
                    status: ['0', '1', '2', '3', '-1', '-2', '-3', '-4'],
                  }}
                  valueIndex="relative_sn"
                  showName="relative_name"
                  placeholder="请选择关系人"
                />
              )}
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label="关系类型" {...formItemLayout} required>
              {getFieldDecorator(`${forName}.relative_type`, {
                initialValue: `${(value.relative_type || {}).id || ''}`,
                rules: [validatorRequired],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">-- 无 --</Option>
                  <Option value="1">父亲</Option>
                  <Option value="2">母亲</Option>
                  <Option value="3">儿子</Option>
                  <Option value="4">女儿</Option>
                  <Option value="5">哥哥</Option>
                  <Option value="6">姐姐</Option>
                  <Option value="7">弟弟</Option>
                  <Option value="8">妹妹</Option>
                  <Option value="9">丈夫</Option>
                  <Option value="10">妻子</Option>
                  <Option value="11">朋友</Option>
                  <Option value="16">同学</Option>
                  <Option value="12">师傅</Option>
                  <Option value="13">徒弟</Option>
                  <Option value="14">男友</Option>
                  <Option value="15">女友</Option>
                  <Option value="19">女婿</Option>
                  <Option value="22">儿媳</Option>
                  <Option value="17">岳父</Option>
                  <Option value="18">岳母</Option>
                  <Option value="20">公公</Option>
                  <Option value="21">婆婆</Option>
                  <Option value="23">其他长辈</Option>
                  <Option value="24">其他晚辈</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </FormItem>
    );
  }
}
