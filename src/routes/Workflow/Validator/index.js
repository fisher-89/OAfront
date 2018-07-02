import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Tooltip,
  Divider,
  Input,
  Select,
} from 'antd';

import OATable from '../../../components/OATable';
import OAForm from '../../../components/OAForm';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const editableValidatorTypes = [
  { text: '正则', value: 'regex' },
  { text: '可选值', value: 'in' },
  { text: '文件类型', value: 'mimes' },
];

const validatorTypes = [
  ...editableValidatorTypes,
  { text: '值唯一', value: 'distinct' },
];

const { Option } = Select;

const { OAModal } = OAForm;
const FormItem = OAForm.Item;
@connect(({ workflow, loading }) => ({
  list: workflow.validator,
  loading: loading.models.workflow,
}))
@OAForm.Config
@OAForm.create({
  onValuesChange(props, fields) {
    Object.keys(fields).forEach(key => props.handleFieldsError(key));
  },
})
export default class Validator extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
    columns: [
      { title: 'ID', dataIndex: 'id', sorter: true, searcher: true },
      { title: '名称', dataIndex: 'name', searcher: true },
      { title: '描述', dataIndex: 'description', searcher: true },
      {
        title: '规则类型',
        dataIndex: 'type',
        filters: validatorTypes,
        render: (type) => {
          const validatorType = validatorTypes.filter(item => item.value === type)[0];
          return validatorType ? validatorType.text : type;
        },
      },
      { title: '规则参数', dataIndex: 'params' },
      {
        title: '操作',
        render: (rowData) => {
          return rowData.is_locked ? '已锁定' : (
            <Fragment>
              <a onClick={() => this.handleEdit(rowData)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleDelete(rowData.id)}>删除</a>
            </Fragment>
          );
        },
      },
    ],
  };

  componentDidMount() {
    const { form, bindForm } = this.props;
    bindForm(form);
  }

  fetchTable = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/fetchValidator',
      payload: {
        ...params,
      },
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
      type: 'workflow/addValidator',
      payload: {
        ...params,
      },
      onSuccess: this.handleSuccess,
      onError,
    });
  }

  handleAddSuccess = () => {
    this.handleAddModalVisible();
  }

  handleEditSubmit = (params, onError) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/editValidator',
      payload: {
        ...params,
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
      type: 'workflow/deleteValidator',
      payload: { id },
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      visible: !!flag,
    });
  }

  render() {
    const {
      list,
      loading,
      form,
      validateOnChange,
      form: { getFieldDecorator },
    } = this.props;
    const {
      columns,
      editInfo,
      visible,
    } = this.state;
    const multiOperator = [
      { text: '批量删除', action: selectedRows => this.handleDelete(selectedRows.map(row => row.id)) },
    ];

    const extraOperator = [
      (
        <Tooltip title="新建验证规则" key="addType">
          <Button type="primary" icon="plus" onClick={() => this.handleModalVisible(true)} />
        </Tooltip>
      ),
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <OATable
            loading={loading}
            data={list}
            fetchDataSource={this.fetchTable}
            columns={columns}
            multiOperator={multiOperator}
            extraOperator={extraOperator}
            serverSide
          />
        </Card>
        <OAModal
          form={form}
          formProps={{
            loading,
            validateOnChange,
          }}
          visible={visible}
          title="验证规则"
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
            required
          >
            {getFieldDecorator('name', {
              initialValue: editInfo.name || '',
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem
            label="描述"
          >
            {getFieldDecorator('description', {
              initialValue: editInfo.description || '',
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem
            label="规则类型"
            required
          >
            {getFieldDecorator('type', (editInfo ? {
              initialValue: editInfo.type,
            } : {}))(
              <Select placeholder="请输入">
                {editableValidatorTypes.map(item => <Option key={item.value}>{item.text}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem
            label="规则参数"
            required
          >
            {getFieldDecorator('params', {
              initialValue: editInfo.params || '',
            })(
              <Input.TextArea rows={3} autosize={{ minRows: 2, maxRows: 6 }} placeholder="请输入" />
            )}
          </FormItem>
        </OAModal>
      </PageHeaderLayout>
    );
  }
}
