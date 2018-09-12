import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cny from 'rmb-x';
import moment from 'moment';
import styles from './print.less';

@connect(({ reimbursement }) => ({
  fundsAttribution: reimbursement.fundsAttribution,
  expenseTypes: reimbursement.expenseTypes,
}))

export default class extends PureComponent {
  render() {
    const { fundsAttribution, expenseTypes, data } = this.props;
    let billsLength = 0;
    const header = [];
    for (let i = 1; i <= 24; i += 1) {
      header.push(<th key={i} style={{ width: 40 }} />);
    }
    return data && (
      <div style={{ height: 0 }}>
        <table style={{ width: 960 }} className={styles.printTable}>
          <thead>
            <tr>{header}</tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '2px solid #000', fontWeight: 700 }}>
              <td colSpan="10">成都阿喜杰尼威尼服饰有限公司</td>
              <td colSpan="14" style={{ textAlign: 'right' }}>{data.reim_sn}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #000', fontWeight: 700 }}>
              <td colSpan="4" style={{ padding: '10px 5px' }}>申请人：{data.realname}</td>
              <td colSpan="6" style={{ borderLeft: '1px solid #000', padding: '10px 5px' }}>
                资金归属：{fundsAttribution.find(item => item.id === data.reim_department_id).name}
              </td>
              <td colSpan="2" style={{ borderLeft: '1px solid #000', padding: '10px 5px' }}>部门：</td>
              <td colSpan="7" style={{ padding: '10px 5px' }}>
                {data.department_name}
              </td>
              <td colSpan="5" style={{ borderLeft: '1px solid #000', padding: '10px 5px' }}>
                申请日期：{data.send_time.substring(0, 10)}
              </td>
            </tr>
            <tr style={{ fontWeight: 700 }}>
              <td colSpan="2">类型</td>
              <td colSpan="17" style={{ borderLeft: '1px dotted #666', textAlign: 'center' }}>消费明细</td>
              <td colSpan="2" style={{ borderLeft: '1px dotted #666', textAlign: 'right' }}>发票数量</td>
              <td colSpan="3" style={{ borderLeft: '1px dotted #666', textAlign: 'right' }}>金额</td>
            </tr>
            {data.expenses.filter(item => data.status_id <= 3 || item.is_audited === 1)
              .map((item) => {
                billsLength += item.bills.length;
                return (
                  <tr key={item.id} style={{ borderTop: '1px dotted #666' }}>
                    <td colSpan="2">{expenseTypes.find(type => type.id === item.type_id).name}</td>
                    <td colSpan="4" style={{ borderLeft: '1px dotted #666' }}>{item.date}</td>
                    <td colSpan="13" style={{ borderLeft: '1px dotted #666' }}>{item.description}</td>
                    <td colSpan="2" style={{ borderLeft: '1px dotted #666', textAlign: 'right' }}>
                      {item.bills.length}
                    </td>
                    <td colSpan="3" style={{ borderLeft: '1px dotted #666', textAlign: 'right' }}>
                      ￥{item.audited_cost || item.send_cost}
                    </td>
                  </tr>
                );
            })}
            <tr style={{ borderTop: '2px solid #000', lineHeight: '36px' }}>
              <td colSpan="6">合计人民币（大写）：</td>
              <td colSpan="13">{cny(parseFloat(data.audited_cost || data.approved_cost || data.send_cost))}</td>
              <td colSpan="2" style={{ borderLeft: '1px dotted #666', textAlign: 'right' }}>{billsLength}张</td>
              <td colSpan="3" style={{ borderLeft: '1px dotted #666', textAlign: 'right' }}>
                ￥{data.audited_cost || data.approved_cost || data.send_cost}
              </td>
            </tr>
            <tr style={{ borderTop: '2px solid #000', lineHeight: '36px' }}>
              <td colSpan="19">
                收款人：{data.payee_name} {data.payee_bank_other} {data.payee_bank_account}
              </td>
              <td colSpan="5">付款日期：{data.paid_at && data.paid_at.substring(0, 10)}</td>
            </tr>
            <tr style={{ borderTop: '2px solid #000', fontWeight: 700, lineHeight: '40px' }}>
              <td colSpan="8">审批人 ：{data.approver_name || '无'}</td>
              <td colSpan="8">财务审核人 ：{data.accountant_name}</td>
              <td colSpan="8">出纳 ：{data.payer_name}</td>
            </tr>
            <tr>
              <td colSpan="24" style={{ color: '#999', fontSize: '12px', textAlign: 'right' }}>
                打印时间：{moment().format('YYYY-MM-DD hh:mm:ss')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
