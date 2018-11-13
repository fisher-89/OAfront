import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { find } from 'lodash';
import { Button, Tooltip, Divider, Row, Col, Card, Icon } from 'antd';
import moment from 'moment';
import OATable from '../../../components/OATable';

@connect(({ workflow, loading }) => ({
  list: workflow.form,
  oldList: workflow.oldFormDetails,
  formType: workflow.formType,
  oldLoading: loading.effects['workflow/fetchOldForm'],
  loading: (
    loading.effects['workflow/fetchForm'] ||
    loading.effects['workflow/deleteForm'] ||
    loading.effects['workflow/fetchFormType']
  ),
}))
export default class List extends PureComponent {
  state = {
    formId: null,
  }

  componentWillMount() {
    this.fetchFormType();
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

  fetchOldForm = (params) => {
    const { dispatch } = this.props;
    const { formId } = this.state;
    dispatch({
      type: 'workflow/fetchOldForm',
      payload: { id: formId, ...params },
    });
  }

  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/deleteForm',
      payload: { id },
    });
  }

  searchHistory = (id) => {
    return () => {
      this.setState({ formId: id }, () => { if (this.state.formId) this.fetchOldForm(); });
    };
  }

  odlColumns = () => {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '描述',
        dataIndex: 'description',
      },
      {
        title: '生成时间',
        dataIndex: 'created_at',
        sorter: true,
        render: val => (<span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''}</span>),
      }, {
        title: '操作',
        render: ({ id }) => (
          <Fragment>
            <Link to={`/workflow/form/list/info/${id}`}> 查看 </Link>
          </Fragment>
        ),
      },
    ];
    return columns;
  }

  render() {
    const { list, oldList, oldLoading, loading, formType } = this.props;
    const { formId } = this.state;
    const formTypeIndexById = {};
    formType.forEach((item) => {
      formTypeIndexById[item.id] = item;
    });
    const columns = [
      { title: 'ID', width: 90, dataIndex: 'id', align: 'center', sorter: true, searcher: true },
      { title: '名称', dataIndex: 'name', align: 'center', searcher: true },
      { title: '描述', dataIndex: 'description', searcher: true, width: 100, tooltip: true },
      {
        title: '分类',
        dataIndex: 'form_type_id',
        align: 'center',
        filters: formType.map((item) => {
          return { text: item.name, value: item.id };
        }),
        render: val => (formTypeIndexById[val] || {}).name,
      },
      {
        sorter: true,
        title: '更新时间',
        dataIndex: 'updated_at',
        render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
      {
        title: '操作',
        render: ({ id }) => (
          <Fragment>
            <a onClick={this.searchHistory(id)}>查看</a>
            <Divider type="vertical" />
            <Link to={`/workflow/form/list/edit/${id}`}> 编辑 </Link>
            <Divider type="vertical" />
            <a onClick={() => this.handleDelete(id)}>删除</a>
          </Fragment>
        ),
      },
    ];

    const extraOperator = [
      <Link to="/workflow/form/list/type" key="addType">
        <Button type="primary" icon="folder">
          分类管理
        </Button>
      </Link>,
      <Tooltip title="新建表单" key="add">
        <Link to="/workflow/form/list/add">
          <Button type="primary" icon="plus" />
        </Link>
      </Tooltip>,
    ];

    const span = formId ? 12 : 24;
    const oldData = oldList[formId] || [];
    return (
      <Row type="flex" justify="space-around">
        <Col span={span} key="1">
          <Card bordered={false}>
            <OATable
              data={list}
              columns={columns}
              loading={loading}
              extraOperator={extraOperator}
              fetchDataSource={this.fetchForm}
            />
          </Card>
        </Col>
        {formId && (
          <Col span={10} key="2">
            <Card
              bordered={false}
              title={(
                <Row type="flex" justify="space-around">
                  <Col span={12}>
                    {find(list, ['id', formId]).name}
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Icon type="close" style={{ cursor: 'pointer' }} onClick={() => this.setState({ formId: null })} />
                  </Col>
                </Row>
              )}
            >
              <OATable
                data={oldData}
                loading={oldLoading}
                columns={this.odlColumns()}
                fetchDataSource={this.fetchOldForm}
              />
            </Card>
          </Col>
        )}
      </Row>
    );
  }
}
