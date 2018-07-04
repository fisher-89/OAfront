import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Tooltip, Divider } from 'antd';
import moment from 'moment';
import OATable from '../../../components/OATable';

@connect(({ workflow, loading }) => ({
  list: workflow.form,
  formType: workflow.formType,
  loading: loading.models.workflow,
}))
export default class List extends PureComponent {
  componentWillMount() {
    const { formType } = this.props;
    if (formType.length === 0) {
      this.fetchFormType();
    }
  }

  fetchForm = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/fetchForm',
      payload: {
        ...params,
      },
    });
  }

  fetchFormType = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'workflow/fetchFormType' });
  }

  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/deleteForm',
      payload: { id },
    });
  }

  render() {
    const { list, loading, formType } = this.props;
    const formTypeIndexById = {};
    formType.forEach((item) => {
      formTypeIndexById[item.id] = item;
    });
    const columns = [
      { title: 'ID', dataIndex: 'id', sorter: true, searcher: true },
      { title: '名称', dataIndex: 'name', searcher: true },
      { title: '描述', dataIndex: 'description', searcher: true },
      {
        title: '分类',
        dataIndex: 'form_type_id',
        sorter: true,
        filters: formType.map((item) => {
          return { text: item.name, value: item.id };
        }),
        render: val => formTypeIndexById[val] && formTypeIndexById[val].name,
      },
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
        render: ({ id }) => (
          <Fragment>
            <Link to={`/workflow/form/edit/${id}`}> 编辑 </Link>
            <Divider type="vertical" />
            <a onClick={() => this.handleDelete(id)}>删除</a>
          </Fragment>
        ),
      },
    ];

    const extraOperator = [
      <Link to="/workflow/form/type" key="addType">
        <Button type="primary" icon="folder">
          分类管理
        </Button>
      </Link>,
      <Tooltip title="新建表单" key="add">
        <Link to="/workflow/form/add">
          <Button type="primary" icon="plus" />
        </Link>
      </Tooltip>,
    ];

    return (
      <OATable
        loading={loading}
        data={list}
        fetchDataSource={this.fetchForm}
        columns={columns}
        extraOperator={extraOperator}
        // serverSide={true}
      />
    );
  }
}
