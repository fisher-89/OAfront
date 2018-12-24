import React, { Component } from 'react';
import {
  Modal,
} from 'antd';
import { connect } from 'dva';
import Lodash from 'lodash';
import OATable from '../../../components/OATable';


@connect(({ workflow, loading }) => ({
  list: workflow.formList.data,
  total: workflow.formList.total,
  loading: loading.effects['workflow/formList'],
}))

export default class FormAuthModal extends Component {
  state = {
    visible: this.props.visible,
    dispatch: this.props.dispatch,
    // 选中的数据
    selectedRowKeys: this.props.selectedRowKeys,
    selectedRows: [],
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
    });
  }

  // 用户手动选择/取消选择所有行的回调
  onSelectAllRow = (selected, allSelectedRows, changeRows) => {
    // 全选
    if (selected) {
      const rowKeys = allSelectedRows.map((row) => {
        return row.number;
      });
      this.rowOnChange(rowKeys, allSelectedRows);
    } else {
      // 全部取消
      const rowKeys = changeRows.map((row) => {
        return row.number;
      });
      const { selectedRowKeys, selectedRows } = this.state;
      const newSelectedRowKeys = selectedRowKeys.filter(key => rowKeys.indexOf(key) === -1);
      const newSelectedRows = selectedRows.filter(flow => rowKeys.indexOf(flow.number) === -1);
      this.setState({
        selectedRowKeys: Lodash.uniq(newSelectedRowKeys),
        selectedRows: Lodash.uniq(newSelectedRows),
      });
    }
  };
  // 用户手动选择/取消选择某行的回调
  onSelectRow = (record, selected) => {
    const { selectedRowKeys, selectedRows } = this.state;
    if (selected) {
      // 选中
      // selectedRowKeys.push(record.number);
      // selectedRows.push(record);
      // this.setState({
      //   selectedRowKeys: Lodash.uniq(selectedRowKeys),
      //   selectedRows: Lodash.uniq(selectedRows),
      // });
    } else {
      const index = selectedRowKeys.indexOf(record.number);
      selectedRowKeys.splice(index, 1);
      const newSelectedRows = selectedRows.filter(flow => flow.number !== record.number);
      this.setState({
        selectedRowKeys: Lodash.uniq(selectedRowKeys),
        selectedRows: Lodash.uniq(newSelectedRows),
      });
    }
  };


  getFetchDataSource = (params) => {
    this.state.dispatch({
      type: 'workflow/formList',
      payload: params,
    });
  };
  // 关闭modal
  modalCancel = () => {
    this.props.onCancel();
  };
  // 确定modal
  flowOnOk = () => {
    const { selectedRowKeys, selectedRows } = this.state;
    this.props.onOk(selectedRowKeys, selectedRows);
  };
  // table 字段
  columns = [
    { title: '表单编号', dataIndex: 'number', align: 'center', searcher: true },
    { title: 'ID', dataIndex: 'id', align: 'center', sorter: true },
    { title: '表单名称', dataIndex: 'name', align: 'center', searcher: true },
  ];

  // 选中项发生变化时的回调
  rowOnChange = (rowKeys, rows) => {
    const { selectedRowKeys, selectedRows } = this.state;
    const newSelectedRowKeys = selectedRowKeys.concat(rowKeys);
    const newSelectedRows = selectedRows.concat(rows);
    this.setState({
      selectedRowKeys: Lodash.uniq(newSelectedRowKeys),
      selectedRows: Lodash.uniq(newSelectedRows),
    });
  };

  render() {
    const { list, total, loading } = this.props;
    const { selectedRowKeys, visible } = this.state;
    const rowSelection = {
      onChange: this.rowOnChange,
      selectedRowKeys,
      onSelectAll: this.onSelectAllRow,
      onSelect: this.onSelectRow,
    };
    return (
      <Modal
        title="关联流程"
        visible={visible}
        onCancel={this.modalCancel}
        onOk={this.flowOnOk}
        width={1000}
      >
        <OATable
          serverSide
          data={list}
          loading={loading}
          total={total}
          columns={this.columns}
          fetchDataSource={this.getFetchDataSource}
          rowKey="number"
          rowSelection={rowSelection}
        />
      </Modal>
    );
  }
}
