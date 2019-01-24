import React, { PureComponent } from 'react';
import {
  Input,
  Row,
  Col,
  Select,
  Switch,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import OAForm, { OAModal, SearchTable, DatePicker } from '../../../components/OAForm';
import store from './store/store';


const { TextArea } = Input;
const FormItem = OAForm.Item;
const { Option } = Select;
@store()
@connect(({ loading }) => ({
  loading: (
    loading.effects['violation/editFineLog'] ||
    loading.effects['violation/addFineLog']
  ),
}))
@OAForm.create({
  onValuesChange(props, changedValues, allValues) {
    const { fetchMoneyAndScore, onError } = props;
    const [midkey] = Object.keys(changedValues);
    if (midkey === 'staff' || midkey === 'rule_id' || midkey === 'violate_at') {
      if ((allValues.staff || {}).staff_sn && allValues.rule_id && allValues.violate_at) {
        if (props.initialValue.id) {
          const params = {
            id: props.initialValue.id,
            staff_sn: allValues.staff.staff_sn,
            rule_id: allValues.rule_id,
            violate_at: allValues.violate_at,
          };
          fetchMoneyAndScore(params, onError);
        } else {
          const params = {
            staff_sn: allValues.staff.staff_sn,
            rule_id: allValues.rule_id,
            violate_at: allValues.violate_at,
          };
          fetchMoneyAndScore(params, onError);
        }
      }
    }
  },
})

export default class extends PureComponent {
  state = {
    selectrule: undefined,
    moneyable: true,
    scoreable: true,
  }

  componentWillReceiveProps(nextProps) {
    const { rule } = this.props;
    const { setFields, setFieldsValue } = nextProps.form;
    if (JSON.stringify(this.props.initialValue) !== JSON.stringify(nextProps.initialValue)) {
      const midkey = { ...nextProps.initialValue.rules }.type_id;
      this.setState({ selectrule: midkey ? rule.filter(item => `${item.type_id}` === `${midkey}`) : [] });
    }
    console.log(nextProps);
    if (JSON.stringify(this.props.initialValue) !== JSON.stringify(nextProps.initialValue)) {
      setFieldsValue({ money: nextProps.initialValue.money, score: nextProps.initialValue.score });
      this.setState({ moneyable: true, scoreable: true });
    } else if (JSON.stringify(this.props.money) !== JSON.stringify(nextProps.money) ||
    JSON.stringify(this.props.score) !== JSON.stringify(nextProps.score)) {
      if (({ ...nextProps.money.money } || {}).errors ||
      ({ ...nextProps.score.score } || {}).errors) {
        setFieldsValue({ money: null, score: null });
        this.setState({ moneyable: true, scoreable: true });
        setFields({ violate_at: { value: null, errors: [new Error('违纪日期 必须早于现在!')] } });
      } else if (nextProps.money.money === 'CustomSettings' && nextProps.score.score !== 'CustomSettings') {
        this.setState({ moneyable: false, scoreable: true });
        setFieldsValue({ money: null, score: nextProps.score.score });
      } else if (nextProps.money.money !== 'CustomSettings' && nextProps.score.score === 'CustomSettings') {
        this.setState({ moneyable: true, scoreable: false });
        setFieldsValue({ money: nextProps.money.money, score: null });
      } else if (nextProps.money.money === 'CustomSettings' && nextProps.score.score === 'CustomSettings') {
        this.setState({ moneyable: false, scoreable: false });
        setFieldsValue({ money: null, score: null });
      } else {
        this.setState({ moneyable: true, scoreable: true });
        setFieldsValue({ money: nextProps.money.money, score: nextProps.score.score });
      }
    }
  }

  handleError = (error) => {
    const { onError } = this.props;
    onError(error, {
      staff_name: 'staff',
      staff_sn: 'staff',
      billing_name: 'billing',
      billing_sn: 'billing',
    });
  }

  handleSubmit = (values) => {
    const { dispatch, initialValue, onCancel } = this.props;
    const params = {
      ...initialValue,
      ...values,
      ...values.billing,
      ...values.staff,
      has_paid: values.has_paid ? 1 : 0,
      sync_point: values.sync_point ? 1 : 0,
    };
    dispatch({
      type: params.id ? 'violation/editFineLog' : 'violation/addFineLog',
      payload: params,
      onSuccess: () => onCancel(false),
      onError: this.handleError,
    });
  }

  selectRuleType = (value) => {
    const { rule } = this.props;
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ rule_id: undefined });
    this.setState({ selectrule: value ? rule.filter(item => `${item.type_id}` === `${value}`) : [] });
  }

  clear = () => {
    const { rule, initialValue } = this.props;
    const midkey = { ...initialValue.rules }.type_id || null;
    this.setState({ moneyable: true, scoreable: true });
    if (initialValue) {
      this.setState({ selectrule: rule.filter(item => `${item.type_id}` === `${midkey}`) });
    } else {
      this.setState({ selectrule: undefined });
    }
  }

   disabledDate = (current) => {
     return current && current >= moment().endOf('day');
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
       onCancel,
       loading,
       ruleType,
       validateFields,
     } = this.props;
     const { selectrule, moneyable, scoreable } = this.state;
     const staffChoice = !!initialValue.id;
     const { getFieldDecorator } = this.props.form;
     const payTrue = { ...initialValue }.has_paid === 1;
     return (
       <OAModal
         title="大爱"
         visible={visible}
         loading={loading}
         actionType={initialValue.id !== undefined}
         onCancel={() => onCancel(false)}
         onSubmit={validateFields(this.handleSubmit)}
         afterClose={this.clear}
       >
         <Row>
           <Col {...colSpan}>
             <FormItem label="员工姓名" {...formItemLayout} required>
               {getFieldDecorator('staff', {
                initialValue: initialValue.staff || [],
              })(
                <SearchTable.Staff
                  disabled={staffChoice}
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
              })(<DatePicker
                disabledDate={this.disabledDate}
              />)}
             </FormItem>
           </Col>

           <Col {...colSpan}>
             <FormItem label="大爱类型" {...formItemLayout} required>
               {getFieldDecorator('type_id', {
                initialValue: { ...initialValue.rules }.type_id || undefined,
              })(
                <Select
                  onSelect={this.selectRuleType}
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
                <Select >
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
             <FormItem label="大爱金额" {...formItemLayout}>
               {getFieldDecorator('money', {
              initialValue: initialValue.money || null,
              })(
                <Input
                  disabled={moneyable}
                />
              )}
             </FormItem>
           </Col>

           <Col {...colSpan}>
             <FormItem label="分值" {...formItemLayout}>
               {getFieldDecorator('score', {
              initialValue: initialValue.score || null,
              })(
                <Input
                  disabled={scoreable}
                />
              )}
             </FormItem>
           </Col>
         </Row>

         <Row>
           <Col {...colSpan}>
             <FormItem label="是否付款" {...formItemLayout}>
               {getFieldDecorator('has_paid', {
                initialValue: initialValue.has_paid,
              })(<Switch
                disabled={payTrue}
                defaultChecked={!!initialValue.has_paid}
              />)}
             </FormItem>
           </Col>

           <Col {...colSpan}>
             <FormItem label="付款时间" {...formItemLayout}>
               {getFieldDecorator('paid_at', {
                initialValue: initialValue.paid_at || undefined,
              })(<DatePicker
                disabledDate={this.disabledDate}
              />)}
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
               {getFieldDecorator('billing', {
                initialValue: initialValue.billing || [],
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
             <FormItem label="开单日期" {...formItemLayout} required>
               {getFieldDecorator('billing_at', {
                initialValue: initialValue.billing_at || moment().format('YYYY-MM-DD'),
              })(<DatePicker
                disabledDate={this.disabledDate}
              />)}
             </FormItem>
           </Col>
         </Row>

         <Row>
           <Col>
             <FormItem label="备注" {...longFormItemLayout}>
               {getFieldDecorator('remark', {
                initialValue: initialValue.remark || '',
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
