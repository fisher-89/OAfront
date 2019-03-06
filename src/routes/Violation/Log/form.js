import React, { PureComponent } from 'react';
import {
  Input,
  Row,
  Col,
  Select,
  Switch,
  InputNumber,
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
    if (midkey === 'staff' || midkey === 'rule_id' || midkey === 'violate_at' || (midkey === 'quantity' && allValues.quantity)) {
      if ((allValues.staff || {}).staff_sn && allValues.rule_id && allValues.violate_at) {
        if (props.initialValue.id) {
          const params = {
            id: props.initialValue.id,
            staff_sn: allValues.staff.staff_sn,
            rule_id: allValues.rule_id,
            violate_at: allValues.violate_at,
            quantity: allValues.quantity,
          };
          fetchMoneyAndScore(params, onError);
        } else {
          const params = {
            staff_sn: allValues.staff.staff_sn,
            rule_id: allValues.rule_id,
            violate_at: allValues.violate_at,
            quantity: allValues.quantity,
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
    if (JSON.stringify(this.props.initialValue) !== JSON.stringify(nextProps.initialValue)) {
      setFieldsValue({
        money: nextProps.initialValue.money,
        score: nextProps.initialValue.score,
        quantity: nextProps.initialValue.quantity,
      });
      this.setState({ moneyable: true, scoreable: true });
    } else if (JSON.stringify(this.props.money) !== JSON.stringify(nextProps.money) ||
      JSON.stringify(this.props.score) !== JSON.stringify(nextProps.score)) {
      if (({ ...nextProps.money.money } || {}).errors ||
        ({ ...nextProps.score.score } || {}).errors) {
        setFieldsValue({ money: null, score: null, quantity: null });
        this.setState({ moneyable: true, scoreable: true });
        setFields({ violate_at: { value: null, errors: [new Error('违纪日期 必须早于现在!')] } });
      } else if ({ ...nextProps.money.money }.states === 1 &&
        { ...nextProps.score.score }.states !== 1) {
        this.setState({ moneyable: false, scoreable: true });
        setFieldsValue({
          money: { ...{ ...nextProps.money }.money }.data,
          score: { ...{ ...nextProps.score }.score }.data,
        });
        if ({ ...{ ...(this.props).money }.money }.quantity !==
          { ...{ ...nextProps.money }.money }.quantity) {
          setFieldsValue({
            quantity: { ...{ ...nextProps.money }.money }.quantity,
          });
        }
      } else if ({ ...nextProps.money.money }.states !== 1 &&
        { ...nextProps.score.score }.states === 1) {
        this.setState({ moneyable: true, scoreable: false });
        setFieldsValue({
          money: { ...{ ...nextProps.money }.money }.data,
          score: { ...{ ...nextProps.score }.score }.data,
        });
        if ({ ...{ ...(this.props).money }.money }.quantity !==
          { ...{ ...nextProps.money }.money }.quantity) {
          setFieldsValue({
            quantity: { ...{ ...nextProps.money }.money }.quantity,
          });
        }
      } else if ({ ...nextProps.money.money }.states === 1 &&
        { ...nextProps.score.score }.states === 1) {
        this.setState({ moneyable: false, scoreable: false });
        setFieldsValue({
          money: { ...{ ...nextProps.money }.money }.data,
          score: { ...{ ...nextProps.score }.score }.data,
        });
        if ({ ...{ ...(this.props).money }.money }.quantity !==
          { ...{ ...nextProps.money }.money }.quantity) {
          setFieldsValue({
            quantity: { ...{ ...nextProps.money }.money }.quantity,
          });
        }
      } else {
        this.setState({ moneyable: true, scoreable: true });
        setFieldsValue({
          money: { ...{ ...nextProps.money }.money }.data,
          score: { ...{ ...nextProps.score }.score }.data,
        });
        if ({ ...{ ...(this.props).money }.money }.quantity !==
          { ...{ ...nextProps.money }.money }.quantity) {
          setFieldsValue({
            quantity: { ...{ ...nextProps.money }.money }.quantity,
          });
        }
      }
    }
  }

  handleError = (error) => {
    const { onError } = this.props;
    onError(error, {
      staff_name: 'staff',
      staff_sn: 'staff',
      sync_point: 'sync_point',
      billing_name: 'billing',
      billing_sn: 'billing',
      billing_at: 'billing_at',
      score: 'score',
      money: 'money',
      pushing: 'pushing',
      area: 'area',

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

  editPushGroup = () => {
    const { getFieldValue } = this.props.form;
    const { pushgroup } = this.props;
    function sortNumber(a, b) {
      return a - b;
    }
    const params = getFieldValue('pushing') ? getFieldValue('pushing') : [];
    const sGroup = pushgroup.filter(item => item.default_push === 1);
    const SGroupId = sGroup.map(item => item.id);
    const { dispatch } = this.props;
    if (params.length > 0 &&
      params.sort(sortNumber).toString() !== SGroupId.sort(sortNumber).toString()) {
      dispatch({
        type: 'violation/editPushQun',
        payload: params,
      });
    }
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
      pushgroup,
    } = this.props;
    const { selectrule, moneyable, scoreable } = this.state;
    const staffChoice = !!initialValue.id;
    const { getFieldDecorator } = this.props.form;
    const sGroup = pushgroup.filter(item => item.default_push === 1);
    const SGroupId = sGroup.map(item => item.id);
    const pg = ({ ...initialValue }.pushing || []).map(item => item.id);
    const selectedGroup = JSON.stringify(initialValue) !== '{}' ?
      pg : SGroupId;
    const pointdefault = JSON.stringify(initialValue) !== '{}' ? initialValue.sync_point : true;
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
                allowClear={false}
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
            <FormItem label="大爱金额" {...formItemLayout} required>
              {getFieldDecorator('money', {
                initialValue: initialValue.money || null,
              })(
                <InputNumber
                  disabled={moneyable}
                />
              )}
            </FormItem>
          </Col>

          <Col {...colSpan}>
            <FormItem label="分值" {...formItemLayout} required>
              {getFieldDecorator('score', {
                initialValue: initialValue.score || null,
              })(
                <InputNumber
                  disabled={scoreable}
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col {...colSpan}>
            <FormItem label="当月次数" {...formItemLayout} required>
              {getFieldDecorator('quantity', {
                initialValue: initialValue.quantity || null,
              })(<InputNumber
                disabled={scoreable || moneyable}
              />)}
            </FormItem>
          </Col>

          <Col {...colSpan}>
            <FormItem label="地区" {...formItemLayout} required>
              {getFieldDecorator('area',
                { initialValue: initialValue.area || '1' })(
                  <Select>
                    <Option key="1" value="1">成都</Option>
                    <Option key="2" value="2">濮院</Option>
                    <Option key="3" value="3">市场</Option>
                  </Select>
                )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col {...colSpan}>
            <FormItem label="是否同步积分制" {...formItemLayout}>
              {getFieldDecorator('sync_point',
                { initialValue: initialValue.paid_at || 1 })(
                  <Switch
                    defaultChecked={!!pointdefault}
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
                allowClear={false}
                disabledDate={this.disabledDate}
              />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col>
            <FormItem label="推送" {...longFormItemLayout} required>
              {getFieldDecorator('pushing', {
                initialValue: selectedGroup || [],
              })(
                <Select mode="multiple" onBlur={() => this.editPushGroup()}>
                  {pushgroup.map((item) => {
                    return (
                      <Option value={item.id} key={item.id} >
                        {item.flock_name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
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
