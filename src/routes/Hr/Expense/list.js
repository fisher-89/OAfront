import React, { PureComponent, Fragment } from 'react';
import { Divider, Button } from 'antd';
import OATable from '../../../components/OATable';
import ExpenseForm from './form';

export default class extends PureComponent {
  state={
    visible: false,
  }
  handleModalVisible= (flag) => {
    this.setState({
      visible: !!flag,
    });
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
        dataIndex: 'brand',
        searcher: true,
      },
      {
        title: '操作',
        align: 'center',
        render: () => {
          return (
            <Fragment>
              <a>编辑</a>
              <Divider type="vertical" />
              <a>删除</a>
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
      添加
      </Button>));
    return extra;
  }
  render() {
    const data = [{
      id: '1',
      name: 'sss',
    },
    {
      id: '2',
      name: 'adsad',
    },
    ];
    const { visible } = this.state;
    return (
      <Fragment>
        <OATable
          columns={this.makeColumns()}
          data={data}
          extraOperator={this.makeExtraOperator()}
        />
        <ExpenseForm
          visible={visible}
          onCancel={this.handleModalVisible}
        />
      </Fragment>
    );
  }
}
