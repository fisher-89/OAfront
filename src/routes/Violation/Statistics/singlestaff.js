import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import OATable from '../../../components/OATable';
import store from './store/store';

const { MonthPicker } = DatePicker;
@store()
export default class extends PureComponent {
  makeColumns = () => {
    const { rule, ruleType, loading } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '大爱类型',
        dataIndex: 'type_id',
        loading,
        render: (_, record) => {
          const type = OATable.findRenderKey(rule, record.rule_id).type_id;
          return OATable.findRenderKey(ruleType, type).name;
        },
      },
      {
        title: '大爱原因',
        dataIndex: 'rule_id',
        render: key => OATable.findRenderKey(rule, key).name,
      },
      {
        title: '违纪日期',
        dataIndex: 'violate_at',
      },
      {
        title: '当月次数',
        dataIndex: 'quantity',
      },
      {
        title: '大爱金额',
        dataIndex: 'money',
      },
      {
        title: '分值',
        dataIndex: 'score',
      },
      {
        title: '支付时间',
        dataIndex: 'paid_at',
      },
      {
        title: '开单人',
        dataIndex: 'billing_name',
      },
      {
        title: '开单日期',
        dataIndex: 'billing_at',
      },
      {
        title: '支付状态',
        dataIndex: 'has_paid',
        render: (key) => {
          if (key) {
            return '已支付';
          } else {
            return '未支付';
          }
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
    ];
    return columns;
  }

  selectMonth=() => {

  }

  makeExtraOperator = () => {
    const extra = [];
    extra.push((
      <MonthPicker
        key="monthPicker"
        placeholder="Select month"
        onChange={this.selectMonth}
      />
    ));
    return extra;
  }

  render() {
    const { fetchStaffViolation, loading } = this.props;
    const staffInfo = this.props.data.count_has_punish;
    const midkey = staffInfo.map(item => item.punish);
    return (
      <OATable
        columns={this.makeColumns()}
        dataSource={midkey}
        fetchDataSource={fetchStaffViolation}
        loading={loading}
        extraOperator={this.makeExtraOperator()}
      />
    );
  }
}
