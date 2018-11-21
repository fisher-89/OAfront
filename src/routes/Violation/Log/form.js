import React, { PureComponent } from 'react';
import {
  Input,
  Row,
  Col,
  Select,
  Switch,
} from 'antd';
import OAForm, { OAModal, SearchTable, DatePicker } from '../../../components/OAForm';
import store from './store/store';

const { TextArea } = Input;
const FormItem = OAForm.Item;
const { Option } = Select;
@OAForm.create()
@store('submit')
export default class extends PureComponent {
  state = {
    selectrule: undefined,
  }

  componentWillReceiveProps(nextProps) {
    const { rule } = this.props;
    if (this.props.initialValue !== nextProps.initialValue) {
      const midkey = { ...nextProps.initialValue.rules }.type_id;
      this.setState({ selectrule: midkey ? rule.filter(item => `${item.type_id}` === `${midkey}`) : [] });
    }
  }

  handleSubmit = (values, onError) => {
    const { submit, onCancel, initialValue } = this.props;

    submit({
      ...initialValue,
      ...values,
      ...values.billing_sn,
      ...values.staff_sn,
      has_paid: values.has_paid ? 1 : 0,
      sync_point: values.sync_point ? 1 : 0,
    }, onError, () => {
      onCancel(false);
    });
  }


  selectRule = (value) => {
    const { rule } = this.props;
    this.setState({ selectrule: value ? rule.filter(item => `${item.type_id}` === `${value}`) : [] });
  }
  render() {
    const longFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const colSpan = { xs: 24, lg: 12 };

    const {
      initialValue,
      visible,
      loading,
      ruleType,
      onCancel,
      validateFields,
    } = this.props;
    const { selectrule } = this.state;
    const { getFieldDecorator } = this.props.form;
    const staff = {};
    staff.staff_sn = initialValue.staff_sn;
    staff.staff_name = initialValue.staff_name;
    const billing = {};
    billing.billing_sn = initialValue.billing_sn;
    billing.billing_name = initialValue.billing_name;
    return (
      <OAModal
        visible={visible}
        loading={loading}
        onCancel={() => onCancel(false)}
        onSubmit={validateFields(this.handleSubmit)}
      >
        <Row>
          <Col {...colSpan}>
            <FormItem label="员工姓名" {...formItemLayout} required>
              {getFieldDecorator('staff_sn', {
              initialValue: staff || [],
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
          </Col>
        </Row>

        <Row>
          <Col {...colSpan}>
            <FormItem label="违纪日期" {...formItemLayout} required>
              {getFieldDecorator('violate_at', {
              initialValue: initialValue.violate_at || undefined,
            })(<DatePicker />)}
            </FormItem>
          </Col>

          <Col {...colSpan}>
            <FormItem label="大爱类型" {...formItemLayout} required>
              {getFieldDecorator('type_id', {
                   initialValue: { ...initialValue.rules }.type_id || undefined,
                 })(
                   <Select
                     onChange={this.selectRule}
                   >
                     {ruleType.map(item => (
                       <Option key={item.id} value={item.id}>
                         {item.name}
                       </Option>
                  ))}
                   </Select>
                    )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col>
            <FormItem label="大爱原因" {...longFormItemLayout} required>
              {getFieldDecorator('rule_id', {
                   initialValue: { ...initialValue }.rule_id || undefined,
                 })(
                   <Select>
                     {(selectrule || []).map(item => (
                       <Option key={item.id} value={item.id}>
                         {item.name}
                       </Option>
                  ))}
                   </Select>
                   )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col {...colSpan}>
            <FormItem label="大爱金额" {...formItemLayout} required>
              {getFieldDecorator('money', {
                   initialValue: initialValue.money || null,
                 })(<Input />)}
            </FormItem>
          </Col>

          <Col {...colSpan}>
            <FormItem label="分值" {...formItemLayout} required>
              {getFieldDecorator('score', {
                   initialValue: initialValue.score || null,
                 })(<Input />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col {...colSpan}>
            <FormItem label="是否付款" {...formItemLayout}>
              {getFieldDecorator('has_paid', {
                   initialValue: initialValue.has_paid,
                 })(<Switch
                   defaultChecked={!!initialValue.has_paid}
                 />)}
            </FormItem>
          </Col>

          <Col {...colSpan}>
            <FormItem label="付款时间" {...formItemLayout}>
              {getFieldDecorator('paid_at', {
                   initialValue: initialValue.paid_at || undefined,
                 })(<DatePicker />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col {...colSpan}>
            <FormItem label="是否同步积分制" {...formItemLayout}>
              {getFieldDecorator('sync_point', {
                   initialValue: !!initialValue.sync_point,
                 })(
                   <Switch
                     defaultChecked={!!initialValue.sync_point}
                   />
                   )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col {...colSpan}>
            <FormItem label="开单人" {...formItemLayout} required>
              {getFieldDecorator('billing_sn', {
                   initialValue: billing || [],
                 })(
                   <SearchTable.Staff
                     name={{
                      billing_sn: 'staff_sn',
                      billing_name: 'realname',
                  }}
                     showName="billing_name"
                     placeholder="请选择员工"
                   />
                   )}
            </FormItem>
          </Col>

          <Col {...colSpan}>
            <FormItem label="开单日期" {...formItemLayout}>
              {getFieldDecorator('billing_at', {
                   initialValue: initialValue.billing_at || undefined,
                 })(<DatePicker />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col>
            <FormItem label="备注" {...longFormItemLayout}>
              {getFieldDecorator('remark', {
                   initialValue: initialValue.remark || [],
                 })(
                   <TextArea />
                   )}
            </FormItem>
          </Col>
        </Row>
      </OAModal>
    );
  }
}
