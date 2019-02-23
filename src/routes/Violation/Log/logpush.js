import React, { PureComponent } from 'react';
import OATable from '../../../components/OATable';
import {
  getFiltersData,
  findRenderKey,
} from '../../../utils/utils';
import Form from './pushform';

export default class extends PureComponent {
  state = {
    selectedRows: [],
    selectedRowKeys: [],
    visible: false,
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows, selectedRowKeys });
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  makeColumns = () => {
    const { department, brand } = this.props;
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        width: 50,
        fixed: 'left',
        sorter: (a, b) => a.id - b.id,
        defaultSortOrder: 'ascend',
      },
      {
        title: '姓名',
        dataIndex: 'staff_name',
        searcher: true,
        width: 60,
        fixed: 'left',
      },
      {
        title: '品牌',
        dataIndex: 'brand_id',
        width: 120,
        filters: getFiltersData(brand),
        render: key => OATable.renderEllipsis(findRenderKey(brand, key).name, true),
      },
      {
        title: '部门',
        dataIndex: 'department_id',
        treeFilters: {
          value: 'id',
          title: 'name',
          data: department,
          parentId: 'parent_id',
        },
        width: 285,
        render: key => OATable.renderEllipsis(findRenderKey(department, key).full_name, true),
      },
      {
        title: '违纪日期',
        dateFilters: true,
        dataIndex: 'violate_at',
        width: 100,
      },
      {
        title: '大爱原因',
        dataIndex: 'rules.name',
        width: 120,
        exportRender: (record) => {
          const { name } = record.rules;
          return name;
        },
        render: key => OATable.renderEllipsis(key, true),
      },
      {
        title: '大爱类型',
        dataIndex: 'rules.rule_types.name',
        width: 105,
        exportRender: (record) => {
          const { name } = record.rules.rule_types;
          return name;
        },
      },
      {
        title: '当月次数',
        dataIndex: 'quantity',
        width: 50,
      },
      {
        title: '大爱金额',
        dataIndex: 'money',
        width: 50,
      },
      {
        title: '分值',
        dataIndex: 'score',
        width: 50,
      },
      {
        title: '支付状态',
        dataIndex: 'has_paid',
        filters: [
          { text: '已支付', value: 1 },
          { text: '未支付', value: 0 },
        ],
        width: 50,
        render: key => (key ? '已支付' : '未支付'),
      },
      {
        title: '开单日期',
        dateFilters: true,
        dataIndex: 'billing_at',
        width: 100,
      },
      {
        title: '开单人',
        searcher: true,
        dataIndex: 'billing_name',
        width: 60,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 300,
      },
    ];
    return columns;
  }
  render() {
    const { loading, dispatch, fetchFineLog, finelog, pushgroup } = this.props;
    const { selectedRowKeys, selectedRows, visible } = this.state;
    const rowSelection = {
      selectedRows,
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const multiOperator = [
      {
        text: '推送',
        action: () => {
          this.setState({ visible: true });
        },
      },
      {
        text: '清空选择',
        action: () => {
          this.onSelectChange([], []);
        },
      },
    ];
    return (
      <div>
        <OATable
          loading={loading}
          columns={this.makeColumns()}
          fetchDataSource={fetchFineLog}
          data={finelog.data}
          serverSide
          total={finelog.total}
          rowSelection={rowSelection}
          multiOperator={multiOperator}
        />
        <Form
          visible={visible}
          dispatch={dispatch}
          keys={selectedRowKeys}
          onCancel={this.handleModalVisible}
          pushgroup={pushgroup}
        />
      </div>
    );
  }
}
