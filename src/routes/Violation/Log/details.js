import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import OATable from '../../../components/OATable';
import OAForm, { OAModal } from '../../../components/OAForm';
import store from './store/store';
import style from './details.less';

const FormItem = OAForm.Item;
@OAForm.create()
@store()
export default class extends PureComponent {
  render() {
    const {
      initialValue,
      visible,
      onCancel,
      ruleType,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const payment = initialValue.has_paid ? '已支付' : '未支付';
    const typerule = OATable.findRenderKey(ruleType, { ...initialValue.rules }.type_id).name;
    return (
      <OAModal
        visible={visible}
        title="大爱详情"
        onCancel={() => onCancel(false)}
        onSubmit={() => onCancel(false)}
      >
        <div className={style.name}>
          <FormItem><h1>{initialValue.staff_name}</h1></FormItem>
        </div>
        <div>
          <Row gutter={24}>
            <Col span={6}><FormItem {...formItemLayout} label="编号">{initialValue.id}</FormItem></Col>
            <Col span={8}><FormItem {...formItemLayout} label="品牌">{initialValue.brand_name}</FormItem></Col>
            <Col span={10}><FormItem {...formItemLayout} label="部门">{initialValue.department_name}</FormItem></Col>
          </Row>
        </div>
        <div className={style.details}>
          <p>违纪日期：{initialValue.violate_at}</p>
          <p>大爱类型：{typerule}</p>
          <p>大爱原因：{{ ...initialValue.rules }.name} &nbsp;&nbsp;&nbsp;&nbsp;
            <font className={style.quantity}>
              本月第{initialValue.quantity}次违纪
            </font>
          </p>
          <p>大爱金额：{initialValue.money}元</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分值：{initialValue.score}</p>
        </div>
        <div className={style.details}>
          <p>支付状态：{payment}</p>
          <p>支付时间：{initialValue.paid_at}</p>
        </div>
        <div className={style.details}>
          <p>&nbsp;&nbsp;&nbsp;开单人：{initialValue.billing_name}</p>
          <p>开单日期：{initialValue.billing_at}</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;备注：{initialValue.remark}</p>
        </div>
      </OAModal>
    );
  }
}
