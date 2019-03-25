import React, { PureComponent, Fragment } from 'react';
import {
  Table,
  Button,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Switch,
  // message,
  // notification
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import SelectStaff from './selectstaff';

const { TextArea } = Input;
const { Option } = Select;
@connect(({ violation }) => ({
  multimoney: violation.multimoney,
  multiscore: violation.multiscore,
}))
export default class extends PureComponent {
  state = {
    index: 2,
    area: '1',
    point: 1,
    pushing: [],
    dataSource: [{
      ids: 1,
      staff_sn: undefined,
      staff_name: undefined,
      violate_at: undefined,
      month: undefined,
      rule_id: undefined,
      quantity: null,
      money: null,
      moneystate: false,
      score: null,
      scorestate: false,
      billing_sn: undefined,
      billing_name: undefined,
      billing_at: undefined,
      remark: '',
      token: '',
    }],
  }

  // componentWillReceiveProps(nextProps) {
  //   const { changeId, dataSource } = this.state;
  //   if (JSON.stringify(this.props.multimoney) !== JSON.stringify(nextProps.multimoney)) {
  //     const [step1] = dataSource.filter(item => item.ids === changeId.ids);
  //     const step2 = {
  //       ...step1,
  //       money: nextProps.multimoney.data,
  //       moneystate: nextProps.multimoney.states,
  //       quantity: nextProps.multimoney.quantity,
  //       token: nextProps.multimoney.token,
  //     };
  //     const step3 = dataSource.filter(item => item.ids !== changeId.ids);
  //     step3.push(step2);
  //     step3.sort((a, b) => {
  //       const x = a.ids;
  //       const y = b.ids;
  //       return x - y;
  //     });
  //     this.setState({ dataSource: step3 });
  //   }
  //   if (JSON.stringify(this.props.multiscore) !== JSON.stringify(nextProps.multiscore)) {
  //     const [step1] = dataSource.filter(item => item.ids === changeId.ids);
  //     const step2 = {
  //       ...step1,
  //       score: nextProps.multiscore.data,
  //       scorestate: nextProps.multiscore.states,
  //       quantity: nextProps.multiscore.quantity,
  //       token: nextProps.multimoney.token,
  //     };
  //     const step3 = dataSource.filter(item => item.ids !== changeId.ids);
  //     step3.push(step2);
  //     step3.sort((a, b) => {
  //       const x = a.ids;
  //       const y = b.ids;
  //       return x - y;
  //     });
  //     this.setState({ dataSource: step3 });
  //   }
  // }

  // onSubmit = () => {
  //   const { dispatch } = this.props;
  //   const { area, pushing, point, dataSource } = this.state;
  //   const params = {
  //     area,
  //     pushing,
  //     sync_point: point,
  //     data: dataSource,
  //   };
  //   dispatch({
  //     type: 'violation/multiAddFineLog',
  //     payload: params,
  //     onSuccess: () => this.succeed(),
  //     onError: e => message.error(e),
  //   });
  // }

  // succeed = () => {
  //   const { fetchFineLog } = this.props;
  //   this.reset();
  //   notification.success({
  //     message: '添加成功',
  //   });
  //   fetchFineLog();
  // }

  fetchMoneyAndScore = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'violation/fetchMultiFineMoney',
      payload: params,
    });
    dispatch({
      type: 'violation/fetchMultiFineScore',
      payload: params,
    });
  }

  add = () => {
    const { index, dataSource } = this.state;
    dataSource.push({
      ids: index,
      staff_sn: undefined,
      staff_name: undefined,
      violate_at: undefined,
      rule_id: undefined,
      quantity: null,
      money: null,
      moneystate: false,
      score: null,
      scorestate: false,
      billing_sn: undefined,
      billing_name: undefined,
      billing_at: undefined,
      remark: '',
      token: '',
    });
    this.setState({ index: index + 1 });
  }

  reset = () => {
    this.setState({
      index: 1,
      area: '1',
      point: 1,
      pushing: [],
      dataSource: [],
    }, () => this.add());
  }

  tableOnChange = (data, allValue, indexName) => { // 不影响因子录入信息改变
    const { dataSource } = this.state;
    const [step1] = dataSource.filter(item => item.ids === allValue.ids);
    const step2 = {
      ...step1,
      [indexName]: data,
    };
    const step3 = dataSource.filter(item => item.ids !== allValue.ids);
    step3.push(step2);
    step3.sort((a, b) => {
      const x = a.ids;
      const y = b.ids;
      return x - y;
    });
    this.setState({ dataSource: step3 });
  }

  // infoOnChange = (data, allValue, indexName, month) => { // 影响因子录入信息改变
  //   const { dataSource } = this.state;
  //   const [step1] = dataSource.filter(item => item.ids === allValue.ids);
  //   const step2 = month ? {
  //     ...step1,
  //     [indexName]: data,
  //     month,
  //   } : {
  //     ...step1,
  //     [indexName]: data,
  //   };
  //   const step3 = dataSource.filter(item => item.ids !== allValue.ids);
  //   step3.push(step2);
  //   step3.sort((a, b) => {
  //     const x = a.ids;
  //     const y = b.ids;
  //     return x - y;
  //   });
  //   if (indexName === 'violate_at') {
  //     if (allValue.staff_sn && data && allValue.rule_id) {
  //       const params = {
  //         staff_sn: allValue.staff_sn,
  //         violate_at: data,
  //         rule_id: allValue.rule_id,
  //         quantity: allValue.quantity,
  //       };
  //       this.setState({ dataSource: step3, changeId: allValue },
  //         () => this.fetchMoneyAndScore(params));
  //     } else {
  //       this.setState({ dataSource: step3 });
  //     }
  //   } else if (indexName === 'rule_id') {
  //     if (allValue.staff_sn && allValue.violate_at && data) {
  //       const params = {
  //         staff_sn: allValue.staff_sn,
  //         violate_at: allValue.violate_at,
  //         rule_id: data,
  //         quantity: allValue.quantity,
  //       };
  //       this.setState({ dataSource: step3, changeId: allValue },
  //         () => this.fetchMoneyAndScore(params));
  //     } else {
  //       this.setState({ dataSource: step3 });
  //     }
  //   } else if (allValue.staff_sn && allValue.violate_at && allValue.rule_id && data) {
  //     const params = {
  //       staff_sn: allValue.staff_sn,
  //       violate_at: allValue.violate_at,
  //       rule_id: allValue.rule_id,
  //       quantity: data,
  //     };
  //     this.setState({ dataSource: step3, changeId: allValue },
  //       () => this.fetchMoneyAndScore(params));
  //   } else { this.setState({ dataSource: step3 }); }
  // }

  infoChange = () => {

  }

  billOnChange = (sn, name, allValue) => { // 开单人改变
    const { dataSource } = this.state;
    const [step1] = dataSource.filter(item => item.ids === allValue.ids);
    const step2 = {
      ...step1,
      billing_sn: sn,
      billing_name: name,
    };
    const step3 = dataSource.filter(item => item.ids !== allValue.ids);
    step3.push(step2);
    step3.sort((a, b) => {
      const x = a.ids;
      const y = b.ids;
      return x - y;
    });
    this.setState({ dataSource: step3 });
  }

  // staffOnChange = (sn, name, allValue) => { // 大爱人员信息改变
  //   const { dataSource } = this.state;
  //   const [step1] = dataSource.filter(item => item.ids === allValue.ids);
  //   const step2 = {
  //     ...step1,
  //     staff_sn: sn,
  //     staff_name: name,
  //   };
  //   const step3 = dataSource.filter(item => item.ids !== allValue.ids);
  //   step3.push(step2);
  //   step3.sort((a, b) => {
  //     const x = a.ids;
  //     const y = b.ids;
  //     return x - y;
  //   });
  //   this.setState({ dataSource: step3 });
  // }

  pointSwitch = (e) => { // 是否同步积分制
    if (e) {
      this.setState({ point: 1 });
    } else {
      this.setState({ point: 0 });
    }
  }

  pushingSelect = (e) => { // 是否推送
    this.setState({ pushing: e });
  }

  areaChange = (e) => { // 区域改变
    this.setState({ area: e });
  }

  disabledDate = (current) => {
    return current && current >= moment().endOf('day');
  }

  delete = (rowData) => {
    const { dataSource } = this.state;
    const step1 = dataSource.filter(item => item.ids !== rowData.ids);
    let num = 0;
    const step2 = step1.map((item) => {
      num += 1;
      return {
        ...item,
        ids: num,
      };
    });
    this.setState({ dataSource: step2, index: num + 1 });
  }

  render() {
    const { rule, pushgroup } = this.props;
    const { area, point, pushing, dataSource } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'ids',
      },
      {
        title: '员工姓名',
        dataIndex: 'staff_name',
        render: (_, record) => {
          return (
            <SelectStaff
              // onChange={this.staffOnChange}
              values={record}
              staffname={record.staff_name}
            />
          );
        },
      },
      {
        title: '违纪日期',
        dataIndex: 'violate_at',
        render: (_, record) => {
          const date = record.violate_at ? moment(record.violate_at, 'YYYY-MM-DD') : undefined;
          return (
            <DatePicker
              value={date}
              allowClear={false}
              onChange={e => this.infoOnChange(moment(e).format('YYYY-MM-DD'), record, 'violate_at', moment(e).format('YYYY-MM'))}
              style={{ width: 120 }}
              disabledDate={this.disabledDate}
            />
          );
        },
      },
      {
        title: '大爱原因',
        dataIndex: 'rule_id',
        width: '120',
        render: (_, record) => {
          return (
            <Select
              value={record.rule_id}
              style={{ minWidth: 140 }}
            // onChange={e => this.infoOnChange(e, record, 'rule_id')}
            >
              {rule.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>{item.name}</Option>
                );
              })}
            </Select>
          );
        },
      },
      {
        title: '当前次数',
        dataIndex: 'quantity',
        render: (_, record) => {
          return (
            <InputNumber
              value={record.quantity}
              // onChange={e => this.infoOnChange(e, record, 'quantity')}
              disabled={!(record.moneystate || record.scorestate)}
            />
          );
        },
      },
      {
        title: '大爱金额',
        dataIndex: 'money',
        render: (_, record) => {
          return (
            <InputNumber
              value={record.money}
              onChange={e => this.tableOnChange(e, record, 'rule_id')}
              disabled={!record.moneystate}
            />
          );
        },
      },
      {
        title: '扣分分值',
        dataIndex: 'score',
        render: (_, record) => {
          return (
            <InputNumber
              value={record.score}
              onChange={e => this.tableOnChange(e, record, 'rule_id')}
              disabled={!record.scorestate}
            />
          );
        },
      },
      {
        title: '开单人',
        dataIndex: 'billing_name',
        render: (_, record) => {
          return (
            <SelectStaff
              onChange={this.billOnChange}
              values={record}
              staffname={record.billing_name}
            />
          );
        },
      },
      {
        title: '开单日期',
        dataIndex: 'billing_at',
        render: (_, record) => {
          const date = record.billing_at ? moment(record.billing_at, 'YYYY-MM-DD') : undefined;
          return (
            <DatePicker
              style={{ width: 120 }}
              value={date}
              allowClear={false}
              onChange={e => this.tableOnChange(moment(e).format('YYYY-MM-DD'), record, 'billing_at')}
              disabledDate={this.disabledDate}
            />
          );
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        render: (_, record) => {
          return (
            <TextArea
              value={record.remark}
              onChange={e => this.tableOnChange(e.target.value, record, 'remark')}
              autosize
            />
          );
        },
      },
      {
        title: '操作',
        render: (rowData) => {
          return (
            <a onClick={() => this.delete(rowData)}>删除</a>
          );
        },
      },
    ];
    return (
      <Fragment>
        <div style={{ marginBottom: 3 }}>
          <span>选择地区：</span>
          <Select
            style={{ marginBottom: 3 }}
            value={area}
            onChange={e => this.areaChange(e)}
          >
            <Option value="1" key="1">成都</Option>
            <Option value="2" key="2">濮院</Option>
            <Option value="3" key="3">市场</Option>
          </Select>
          <span style={{ marginLeft: 10 }} >是否同步积分制:</span>
          <Switch
            style={{ marginLeft: 10 }}
            onChange={e => this.pointSwitch(e)}
            checked={!!point}
          />
          <span style={{ marginLeft: 10 }} >推送群:</span>
          <Select
            style={{ minWidth: 200, marginLeft: 10 }}
            onChange={e => this.pushingSelect(e)}
            value={pushing}
            mode="multiple"
          >
            {pushgroup.map((item) => {
              return (
                <Option value={item.id} key={item.id}>{item.flock_name}</Option>
              );
            })}
          </Select>
          <Button type="primary" style={{ float: 'right' }} onClick={() => this.onSubmit()}>提交</Button>
          <Button style={{ float: 'right' }} onClick={() => this.reset()} >重置</Button>

        </div>
        <Table
          rowKey="ids"
          dataSource={dataSource}
          columns={columns}
        />
        <Button onClick={() => this.add()}>添加</Button>
      </Fragment>
    );
  }
}
