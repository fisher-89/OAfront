import React, { PureComponent, Fragment } from 'react';
import { Divider, Button } from 'antd';
import { connect } from 'dva';
import OATable from '../../../components/OATable';
import ExpenseForm from './form';

@connect(({ expense, loading }) => ({
  expense: expense.expense,
  fetchExpenseLoading: loading.effects['expense/fetchExpense'],
  deleteExpenseLoading: loading.effects['expense/deleteExpoense'],
}))

export default class extends PureComponent {
  state={
    visible: false,
    editInfo: {},
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'expense/fetchExpense',
      payload: 'params',
    });
  }
  handleEdit = (data) => {
    this.setState({ editInfo: data }, () => this.handleModalVisible(true));
  }
  handleModalVisible= (flag) => {
    this.setState({
      visible: !!flag,
    });
  }
  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'expense/deleteExpense', payload: { id } });
  }
  makeColumns = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        sorter: (a, b) => a.id - b.id,
        defaultSortOrder: 'ascend',
      },
      {
        title: '名称',
        dataIndex: 'name',
        align: 'center',
        searcher: true,
      },
      {
        title: '关联品牌',
        align: 'center',
        dataIndex: 'brands',
        searcher: true,
        render: (_, record) => {
          const name = (record.brands || []).map(item => item.name);
          return name.join(',');
        },
      },
      {
        title: '操作',
        align: 'center',
        render: (rowData) => {
          return (
            <Fragment>
              <a onClick={() => this.handleEdit(rowData)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleDelete(rowData.id)}>删除</a>
            </Fragment>);
        },
      },
    ];
    return columns;
  }
  makeExtraOperator = () => {
    const extra = [];
    extra.push((
      <Button
        icon="plus"
        key="plus"
        type="primary"
        style={{ marginLeft: '10px' }}
        onClick={() => this.handleModalVisible(true)}
      >
      添加费用品牌
      </Button>));
    return extra;
  }
  render() {
    const { visible, editInfo } = this.state;
    const { expense, fetchExpenseLoading } = this.props;
    return (
      <Fragment>
        <OATable
          loading={fetchExpenseLoading || false}
          columns={this.makeColumns()}
          data={expense}
          extraOperator={this.makeExtraOperator()}
        />
        <ExpenseForm
          initialValue={editInfo}
          visible={visible}
          onCancel={() => { this.setState({ editInfo: {} }); }}
          handleVisible={this.handleModalVisible}
        />
      </Fragment>
    );
  }
}
