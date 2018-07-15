import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button,
  Tooltip,
  Divider,
  Input,
  InputNumber,
} from 'antd';
import moment from 'moment';

import OATable from '../../../../components/OATable1';
import OAForm from '../../../../components/OAForm';

const { OAModal } = OAForm;
const FormItem = OAForm.Item;

@connect(({ workflow, loading }) => ({
  list: workflow.flowType,
  loading: loading.models.workflow,
}))


@OAForm.create({
  onValuesChange(props, changeValues) {
    Object.keys(changeValues).forEach(key => props.handleFieldsError(key));
  },
})
export default class List extends PureComponent {
  state = {
    editInfo: {},
    visible: false,
    columns: [
      { title: 'ID', dataIndex: 'id', sorter: true, searcher: true },
      { title: '名称', dataIndex: 'name', searcher: true },
      { title: '排序', dataIndex: 'sort', sorter: true },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        sorter: true,
        render: val => (<span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''}</span>),
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        sorter: true,
        render: val => (<span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''}</span>),
      },
      {
        title: '操作',
        render: rowData => (
          <Fragment>
            <a onClick={() => this.handleEdit(rowData)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDelete(rowData.id)}>删除</a>
          </Fragment>
        ),
      },
    ],
  }

  componentDidMount() {
    const { form, bindForm } = this.props;
    bindForm(form);
  }

  fetchFlowType = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/fetchFlowType',
      payload: {
        ...params,
      },
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      visible: !!flag,
    });
  }

  handleEdit = (rowData) => {
    this.setState({
      editInfo: rowData,
    }, () => {
      this.handleModalVisible(true);
    });
  }

  handleAddSubmit = (params, onError) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/addFlowType',
      payload: {
        ...params,
      },
      onSuccess: this.handleSuccess,
      onError,
    });
  }

  handleEditSubmit = (params, onError) => {
    // ly修改start
    const newParams = { ...params };
    if (params.sort === undefined || params.sort === '') {
      // 排序重新赋值
      newParams.sort = 0;
    }
    // ly修改end
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/editFlowType',
      payload: {
        ...newParams,
      },
      onSuccess: this.handleSuccess,
      onError,
    });
  }

  handleSuccess = () => {
    this.handleModalVisible(false);
  }

  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/deleteFlowType',
      payload: { id },
    });
  }

  render() {
    const { visible, editInfo, columns } = this.state;
    const {
      list,
      loading,
      form,
      form: { getFieldDecorator },
    } = this.props;

    const extraOperator = [
      <Tooltip title="新建分类" key="add">
        <Button type="primary" icon="plus" onClick={() => this.handleModalVisible(true)} />
      </Tooltip>,
    ];

    return (
      <React.Fragment>
        <OATable
          loading={loading}
          data={list}
          fetchDataSource={this.fetchFlowType}
          columns={columns}
          extraOperator={extraOperator}
        // serverSide={true}
        />
        <OAModal
          form={form}
          visible={visible}
          onCancel={() => this.handleModalVisible(false)}
          afterClose={() => { this.setState({ editInfo: {} }); }}
          onSubmit={editInfo.id ? this.handleEditSubmit : this.handleAddSubmit}
        >
          {getFieldDecorator('id', {
            initialValue: editInfo.id || '',
          })(
            <Input type="hidden" />
          )}
          <FormItem
            label="名称"
          >
            {getFieldDecorator('name', {
              initialValue: editInfo.name || '',
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem
            label="排序"
            name="sort"
            key="sort"
            type="number"
          >
            {getFieldDecorator('sort', {
              initialValue: editInfo.sort || 0,
            })(
              <InputNumber placeholder="请输入" />
            )}
          </FormItem>
        </OAModal>
      </React.Fragment>
    );
  }
}
