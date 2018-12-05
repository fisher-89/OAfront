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
import { split } from 'lodash';
import OATable from '../../../components/OATable';
import OAForm, { OAModal } from '../../../components/OAForm';
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

const fileData = [
  'jpeg',
  'png',
  'gif',
  'psd',
  'swf',
  'bmp',
  'emf',
  'txt',
  'html',
  'htm',
  'pdf',
  'xlsx',
  'xls',
  'doc',
  'docx',
  'ppt',
  'zip',
  'rar',
  'log',
  'sql',
  'mp4',
  '3gp',
  'avi',
  'mp3',
  'wmv',
  'wave',
];

const { Option } = Select;

const FormItem = OAForm.Item;
@connect(({ workflow, loading }) => ({
  list: workflow.validator,
  tableLoading: loading.effects['workflow/fetchValidator'],
  loading: (
    loading.effects['workflow/addValidator'] ||
    loading.effects['workflow/editValidator']
  ),
}))

@OAForm.create()
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


  handleSubmit = (params) => {
    const { dispatch, onError } = this.props;
    const newParams = { ...params };
    if (typeof newParams.params === 'object') {
      newParams.params = newParams.params.join(',');
    }
    dispatch({
      type: newParams.id ? 'workflow/editValidator' : 'workflow/addValidator',
      payload: newParams,
      onSuccess: this.handleModalVisible,
      onError,
    });
  }


  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/deleteValidator',
      payload: { id },
    });
  }

  handleModalVisible = flag => this.setState({ visible: !!flag });

  render() {
    const {
      list,
      loading,
      tableLoading,
      validateFields,
      form: { getFieldDecorator, getFieldValue },
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
    const fileType = (getFieldValue('type') || editInfo.type) === 'mimes';
    let paramsValue = editInfo.params || '';
    if (fileType) {
      paramsValue = editInfo.params ? split(editInfo.params, ',') : [];
    }
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <OATable
            loading={tableLoading}
            data={list}
            fetchDataSource={this.fetchTable}
            columns={columns}
            multiOperator={multiOperator}
            extraOperator={extraOperator}
            serverSide
          />
        </Card>
        <OAModal
          visible={visible}
          title="验证规则"
          loading={loading}
          onCancel={() => this.handleModalVisible(false)}
          afterClose={() => {
            this.setState({ editInfo: {} });
          }}
          onSubmit={validateFields(this.handleSubmit)}
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
              initialValue: paramsValue,
            })(
              fileType ? (
                <Select placeholder="请输入" mode="multiple">
                  {fileData.map((item, index) => {
                    const key = `cc-${index}`;
                    return <Option key={key} value={item}>{item}</Option>;
                  })}
                </Select>
              ) : <Input.TextArea rows={3} autosize={{ minRows: 2, maxRows: 6 }} placeholder="请输入" />
            )}
          </FormItem>
        </OAModal>
      </PageHeaderLayout>
    );
  }
}
