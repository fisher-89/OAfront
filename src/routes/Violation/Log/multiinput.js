import React, { PureComponent, Fragment } from 'react';
import {
  Table,
  Button,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Switch,
  message,
  notification,
  Tooltip,
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
    realIndex: 2,
    area: '1',
    point: 1,
    pushing: [],
    dataSource: [{
      id: 1,
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

  componentWillReceiveProps(nextProps) {
    const { dataSource } = this.state;
    if (JSON.stringify(nextProps.multimoney) !== JSON.stringify(this.props.multimoney)) {
      const params = {
        quantity: nextProps.multimoney.quantity,
        token: nextProps.multimoney.token,
        money: nextProps.multimoney.data,
        moneystate: nextProps.multimoney.states,
      };
      const [step1] = dataSource.filter(item => item.ids === nextProps.multimoney.ids);
      const step2 = {
        ...step1,
        ...params,
      };
      const step3 = dataSource.filter(item => item.ids !== nextProps.multimoney.ids);
      step3.push(step2);
      step3.sort((a, b) => {
        const x = a.ids;
        const y = b.ids;
        return x - y;
      });
      this.setState({ dataSource: step3 });
    }
    if (JSON.stringify(nextProps.multiscore) !== JSON.stringify(this.props.multiscore)) {
      const params = {
        score: nextProps.multiscore.data,
        scorestate: nextProps.multiscore.states,
      };
      const [step1] = dataSource.filter(item => item.ids === nextProps.multiscore.ids);
      const step2 = {
        ...step1,
        ...params,
      };
      const step3 = dataSource.filter(item => item.ids !== nextProps.multiscore.ids);
      step3.push(step2);
      step3.sort((a, b) => {
        const x = a.ids;
        const y = b.ids;
        return x - y;
      });
      this.setState({ dataSource: step3 });
    }
  }

  onSubmit = () => {
    const { dispatch } = this.props;
    const { area, pushing, point, dataSource } = this.state;
    const params = {
      area,
      pushing,
      sync_point: point,
      data: dataSource,
    };
    dispatch({
      type: 'violation/multiAddFineLog',
      payload: params,
      onSuccess: () => this.succeed(),
      onError: e => message.error(e),
    });
  }

  succeed = () => {
    const { fetchFineLog } = this.props;
    this.setState({
      index: 1,
      realIndex: 1,
      area: '1',
      point: 1,
      pushing: [],
      dataSource: [],
    }, () => this.add());
    notification.success({
      message: '添加成功',
    });
    fetchFineLog();
  }

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

  deletePre = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'violation/deletePreMoney',
      payload: params,
    });
  }

  add = () => {
    const { index, realIndex, dataSource } = this.state;
    dataSource.push({
      id: index,
      ids: realIndex,
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
    this.setState({ index: index + 1, realIndex: realIndex + 1 });
  }

  reset = () => {
    const { dataSource } = this.state;
    const source = dataSource.filter(item => item.token !== '');
    source.forEach((item) => {
      const params = {
        token: item.token,
      };
      this.deletePre(params);
    });
    this.setState({
      index: 1,
      realIndex: 1,
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

  staffOnChange = (sn, name, allValue) => { // 大爱人员改变
    const { dataSource } = this.state;
    const [step1] = dataSource.filter(item => item.ids === allValue.ids);
    const step2 = {
      ...step1,
      staff_sn: sn,
      staff_name: name,
    };
    const step3 = dataSource.filter(item => item.ids !== allValue.ids);
    step3.push(step2);
    step3.sort((a, b) => {
      const x = a.ids;
      const y = b.ids;
      return x - y;
    });
    this.setState({ dataSource: step3 });
    const rest = dataSource.filter(item => item.ids !== allValue.ids);
    let allQuest;
    if (allValue.staff_sn) {
      const lastStaff = rest.filter(item =>
        item.month === allValue.month &&
        item.staff_sn === allValue.staff_sn &&
        item.rule_id === allValue.rule_id);
      const thisStaff = rest.filter(item =>
        item.month === allValue.month &&
        item.staff_sn === sn &&
        item.rule_id === allValue.rule_id);
      allQuest = lastStaff.concat(thisStaff);
    } else {
      allQuest = rest.filter(item =>
        item.month === allValue.month &&
        item.staff_sn === sn &&
        item.rule_id === allValue.rule_id);
    }
    if (allQuest.length) {
      allQuest.forEach((item) => {
        if (item.staff_sn && item.violate_at && item.rule_id &&
          item.ids > allValue.ids) {
          const params = {
            token: item.token,
          };
          this.deletePre(params);
        }
      });
    }
    if (step2.staff_sn && step2.violate_at && step2.rule_id) {
      const params = {
        ids: step2.ids,
        staff_sn: step2.staff_sn,
        violate_at: step2.violate_at,
        rule_id: step2.rule_id,
        quantity: step2.quantity,
        token: step2.token,
      };
      this.fetchMoneyAndScore(params);
    }
    if (allQuest.length) {
      allQuest.forEach((item) => {
        if (item.staff_sn && item.violate_at && item.rule_id &&
          item.ids > allValue.ids) {
          const params = {
            ids: item.ids,
            staff_sn: item.staff_sn,
            violate_at: item.violate_at,
            rule_id: item.rule_id,
            quantity: item.quantity,
            token: '',
          };
          this.fetchMoneyAndScore(params);
        }
      });
    }
  }

  monthOnChange = (data, allValue, month) => { // 日期信息改变
    const { dataSource } = this.state;
    const [step1] = dataSource.filter(item => item.ids === allValue.ids);
    const step2 = {
      ...step1,
      violate_at: data,
      month,
    };
    const step3 = dataSource.filter(item => item.ids !== allValue.ids);
    step3.push(step2);
    step3.sort((a, b) => {
      const x = a.ids;
      const y = b.ids;
      return x - y;
    });
    this.setState({ dataSource: step3 });
    const rest = dataSource.filter(item => item.ids !== allValue.ids);
    let allQuest;
    if (allValue.month === month) {
      allQuest = rest.filter(item =>
        item.month === month &&
        item.staff_sn === allValue.staff_sn &&
        item.rule_id === allValue.rule_id);
    } else {
      const lastMonth = rest.filter(item =>
        item.month === allValue.month &&
        item.staff_sn === allValue.staff_sn &&
        item.rule_id === allValue.rule_id);
      const thisMonth = rest.filter(item =>
        item.month === month &&
        item.staff_sn === allValue.staff_sn &&
        item.rule_id === allValue.rule_id);
      allQuest = lastMonth.concat(thisMonth);
    }
    if (allQuest.length) {
      allQuest.forEach((item) => {
        if (item.staff_sn && item.violate_at && item.rule_id &&
          item.ids > allValue.ids) {
          const params = {
            token: item.token,
          };
          this.deletePre(params);
        }
      });
    }
    if (step2.staff_sn && step2.violate_at && step2.rule_id) {
      const params = {
        ids: step2.ids,
        staff_sn: step2.staff_sn,
        violate_at: step2.violate_at,
        rule_id: step2.rule_id,
        quantity: step2.quantity,
        token: step2.token,
      };
      this.fetchMoneyAndScore(params);
    }
    if (allQuest.length) {
      allQuest.forEach((item) => {
        if (item.staff_sn && item.violate_at && item.rule_id &&
          item.ids > allValue.ids) {
          const params = {
            ids: item.ids,
            staff_sn: item.staff_sn,
            violate_at: item.violate_at,
            rule_id: item.rule_id,
            quantity: item.quantity,
            token: '',
          };
          this.fetchMoneyAndScore(params);
        }
      });
    }
  }

  ruleOnChange = (data, allValue) => { // 大爱原因改变
    const { dataSource } = this.state;
    const [step1] = dataSource.filter(item => item.ids === allValue.ids);
    const step2 = {
      ...step1,
      rule_id: data,
    };
    const step3 = dataSource.filter(item => item.ids !== allValue.ids);
    step3.push(step2);
    step3.sort((a, b) => {
      const x = a.ids;
      const y = b.ids;
      return x - y;
    });
    this.setState({ dataSource: step3 });
    const rest = dataSource.filter(item => item.ids !== allValue.ids);
    let allQuest;
    if (allValue.rule_id) {
      const lastRule = rest.filter(item =>
        item.month === allValue.month &&
        item.staff_sn === allValue.staff_sn &&
        item.rule_id === allValue.rule_id);
      const thisRule = rest.filter(item =>
        item.month === allValue.month &&
        item.staff_sn === allValue.staff_sn &&
        item.rule_id === data);
      allQuest = lastRule.concat(thisRule);
    } else {
      allQuest = rest.filter(item =>
        item.month === allValue.month &&
        item.staff_sn === allValue.staff_sn &&
        item.rule_id === data);
    }
    if (allQuest.length) {
      allQuest.forEach((item) => {
        if (item.staff_sn && item.violate_at && item.rule_id &&
          item.ids > allValue.ids) {
          const params = {
            token: item.token,
          };
          this.deletePre(params);
        }
      });
    }
    if (step2.staff_sn && step2.violate_at && step2.rule_id) {
      const params = {
        ids: step2.ids,
        staff_sn: step2.staff_sn,
        violate_at: step2.violate_at,
        rule_id: step2.rule_id,
        quantity: step2.quantity,
        token: step2.token,
      };
      this.fetchMoneyAndScore(params);
    }
    if (allQuest.length) {
      allQuest.forEach((item) => {
        if (item.staff_sn && item.violate_at && item.rule_id &&
          item.ids > allValue.ids) {
          const params = {
            ids: item.ids,
            staff_sn: item.staff_sn,
            violate_at: item.violate_at,
            rule_id: item.rule_id,
            quantity: item.quantity,
            token: '',
          };
          this.fetchMoneyAndScore(params);
        }
      });
    }
  }

  quantityOnChange = (data, allValue) => { // 大爱次数改变
    if (data) {
      const { dataSource } = this.state;
      const step1 = dataSource.filter(item => item.ids > allValue.ids &&
        item.staff_sn === allValue.staff_sn &&
        item.violate_at === allValue.violate_at &&
        item.rule_id === allValue.rule_id);
      if (step1.length) {
        step1.forEach((item) => {
          if (item.staff_sn && item.violate_at && item.rule_id) {
            const params = {
              token: item.token,
            };
            this.deletePre(params);
          }
        });
      }
      if (allValue.staff_sn && allValue.violate_at && allValue.rule_id) {
        const params = {
          ids: allValue.ids,
          staff_sn: allValue.staff_sn,
          violate_at: allValue.violate_at,
          rule_id: allValue.rule_id,
          quantity: allValue.quantity,
          token: allValue.token,
        };
        this.fetchMoneyAndScore(params);
      }
      if (step1.length) {
        step1.forEach((item) => {
          if (item.staff_sn && item.violate_at && item.rule_id) {
            const params = {
              ids: item.ids,
              staff_sn: item.staff_sn,
              violate_at: item.violate_at,
              rule_id: item.rule_id,
              token: '',
            };
            this.fetchMoneyAndScore(params);
          }
        });
      }
    }
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

  quantityInput = (data, allValue) => {
    const { dataSource } = this.state;
    const [step1] = dataSource.filter(item => item.ids === allValue.ids);
    const step2 = {
      ...step1,
      quantity: data,
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

  delete = (rowData) => {
    const { dataSource } = this.state;
    const step1 = dataSource.filter(item => item.ids !== rowData.ids);
    let num = 0;
    const step2 = step1.map((item) => {
      num += 1;
      return {
        ...item,
        id: num,
      };
    });
    this.setState({ dataSource: step2, index: num + 1 });
    if (rowData.token !== '') {
      const params = {
        token: rowData.token,
      };
      this.deletePre(params);
    }
    const rest = dataSource.filter(item => item.ids > rowData.ids &&
      item.staff_sn === rowData.staff_sn &&
      item.month === rowData.month &&
      item.rule_id === rowData.rule_id);
    if (rest.length) {
      rest.forEach((item) => {
        if (item.token !== '') {
          const params = {
            token: item.token,
          };
          this.deletePre(params);
        }
      });
      rest.forEach((item) => {
        if (item.staff_sn && item.violate_at && item.rule_id) {
          const params = {
            ids: item.ids,
            staff_sn: item.staff_sn,
            violate_at: item.violate_at,
            rule_id: item.rule_id,
            quantity: item.quantity,
            token: '',
          };
          this.fetchMoneyAndScore(params);
        }
      });
    }
  }

  render() {
    const { rule, pushgroup } = this.props;
    const { area, point, pushing, dataSource } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '员工姓名',
        dataIndex: 'staff_name',
        render: (_, record) => {
          return (
            <SelectStaff
              onChange={this.staffOnChange}
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
              onChange={e => this.monthOnChange(moment(e).format('YYYY-MM-DD'), record, moment(e).format('YYYYMM'))}
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
              onChange={e => this.ruleOnChange(e, record)}
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
          if (record.moneystate) {
            return (
              <Tooltip title="回车键计算">
                <Input
                  style={{ width: 100 }}
                  value={record.quantity}
                  onChange={e => this.quantityInput(e.target.value, record)}
                  onPressEnter={e => this.quantityOnChange(e.target.value, record)}
                />
              </Tooltip>
            );
          } else {
            return (
              <InputNumber
                value={record.quantity}
                disabled
              />
            );
          }
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
          rowKey="id"
          dataSource={dataSource}
          columns={columns}
        />
        <Button onClick={() => this.add()}>添加</Button>
      </Fragment>
    );
  }
}
