import React, { PureComponent } from 'react';
import { Button, Tooltip } from 'antd';
import OAForm, { OAModal } from '../../../components/OAForm';
import { checkAuthority } from '../../../utils/utils';
import style from './details.less';

@OAForm.create()
export default class extends PureComponent {
  state = {
    value: {},
  }
  componentWillReceiveProps(nextProps) {
    const midkey = Object.keys(this.state.value);
    if (midkey.length) {
      const [nextValue] = nextProps.finelog.data.filter(item => item.id === this.state.value.id);
      if (this.state.value.id !== nextProps.initialValue.id) {
        this.setState({ value: { ...nextProps.initialValue } });
      } else if (this.state.value.has_paid !== nextValue.has_paid) {
        this.setState({ value: { ...nextValue } });
      }
    } else {
      this.setState({ value: { ...nextProps.initialValue } });
    }
  }

  render() {
    const {
      visible,
      onCancel,
      paymentChange,
    } = this.props;
    const { value } = this.state;
    const payment = value.has_paid ? '已支付' : '未支付';
    const pay = value.has_paid ? '退款' : '支付';
    const rulename = { ...value.rules }.name;
    const typename = { ...{ ...value.rules }.rule_types }.name;
    return (
      <OAModal
        visible={visible}
        title="查看大爱"
        onCancel={() => onCancel(false)}
        footer={null}
      >
        <div className={style.name}>
          <div className={style.namediv}><font>{value.staff_name}</font></div>
          <div className={style.staffsndiv}>
            <font className={style.staffsn}>({value.staff_sn})</font>
          </div>
        </div>

        <div className={style.staff}>
          <div className={style.branddiv}>
            <div className={style.brand}>品牌：</div>
            <div className={style.brandfont}>{value.brand_name}</div>
          </div>
          <div className={style.departmentdiv}>
            <div className={style.department}>部门：</div>
            <div className={style.departmentfont}>
              <Tooltip title={value.department_name}>{value.department_name}</Tooltip>
            </div>
          </div>
        </div>

        <div className={style.xuxian} />

        <div className={style.simple}>违纪日期：{value.violate_at}</div>

        <div className={style.normal}>大爱类型：{typename}</div>

        <div className={style.normal}>
          <div className={style.reason}>大爱原因：{rulename}</div>
          <div className={style.quantity}>本月第{value.quantity}次违纪</div>
        </div>

        <div className={style.normal}>大爱金额：{value.money}元</div>

        <div className={style.score}>分值：{value.score}</div>

        <div className={style.simple}><div className={style.payment}>支付状态：{payment}</div>{checkAuthority(203) && <div className={style.paychange}><Button onClick={() => paymentChange(value.id, pay)} type="danger" size="small">{pay}</Button></div>}</div>

        <div className={style.normal}>支付时间：{value.paid_at}</div>

        <div className={style.bill}>开单人：{value.billing_name}</div>

        <div className={style.normal}>开单日期：{value.billing_at}</div>

        <div className={style.score}>备注：{value.remark}</div>

        <div className={style.extr} />
      </OAModal>
    );
  }
}
