import React, { PureComponent } from 'react';
import { Button, Tooltip, Input, message } from 'antd';
import OAForm, { OAModal } from '../../../components/OAForm';
import { checkAuthority } from '../../../utils/utils';
import style from './details.less';

@OAForm.create()
export default class extends PureComponent {
  state = {
    value: {},
    inputdisable: true,
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

  keyEnter = (e, id) => {
    const { payFine } = this.props;
    const params = e.target.value;
    if (params < 5) {
      message.error('扣款金额应不少于五元');
    } else {
      payFine(id, params);
      this.setState({ inputdisable: true });
    }
  }

  render() {
    const {
      payFine,
      visible,
      onCancel,
      refund,
    } = this.props;
    const { value, inputdisable } = this.state;
    const payment = value.has_paid ? '已支付' : '未支付';
    const rulename = { ...value.rules }.name;
    const typename = { ...{ ...value.rules }.rule_types }.name;
    const payButton = value.has_paid ?
      <Button onClick={() => refund(value.id)} type="danger" size="small">退款</Button> :
      (
        <div>
          <Button onClick={() => payFine(value.id, '1')} icon="alipay" />
          <Button onClick={() => payFine(value.id, '2')} icon="wechat" />
          <Button onClick={() => this.setState({ inputdisable: false })} icon="dingding">工资扣款</Button>
          <Input disabled={inputdisable} type="number" style={{ position: 'relative', width: '80px', height: '31px' }} onPressEnter={e => this.keyEnter(e, value.id)} />
        </div>
      );
    const paidtime = value.paid_at ? value.paid_at : '当前未支付';
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

        <div className={style.simple}>
          <div className={style.payment}>支付状态：{payment}</div>
          {checkAuthority(203) && (
            <div className={style.paychange}>
              {payButton}
            </div>
          )}
        </div>

        <div className={style.normal}>支付时间：{paidtime}</div>

        <div className={style.bill}>开单人：{value.billing_name}</div>

        <div className={style.normal}>开单日期：{value.billing_at}</div>

        <div className={style.score}>备注：{value.remark}</div>

        <div className={style.extr} />
      </OAModal>
    );
  }
}
