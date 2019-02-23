import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { find } from 'lodash';
import { Button, Card, Divider, Tabs, Tooltip } from 'antd';
import moment from 'moment';
import OATable from '../../../components/OATable';
import { echo } from '../../../utils/echo';

const { TabPane } = Tabs;

@connect(({ currentUser, workflow, loading }) => ({
  currentUserId: currentUser.currentUser.staff_sn,
  list: workflow.form,
  oldList: workflow.oldFormDetails,
  formType: workflow.formType,
  superData: workflow.superData,
  oldLoading: loading.effects['workflow/fetchOldForm'],
  loading: (
    loading.effects['workflow/fetchForm'] ||
    loading.effects['workflow/deleteForm'] ||
    loading.effects['workflow/fetchFormType']
  ),
}))
export default class List extends PureComponent {
  state = {
    historyKeys: [],
    activeKey: 'list',
  }

  componentWillMount() {
    const { formType, superData, dispatch } = this.props;
    if (formType.length === 0) {
      this.fetchFormType();
    }
    // 超级管理员获取
    if (superData.length === 0) {
      dispatch({ type: 'workflow/getSuper' });
    }

    // 监听权限事件
    echo.channel('role')
      .listen('RoleUpdateEvent', () => {
        dispatch({ type: 'workflow/getSuper' });
        this.fetchForm();
      })
      .listen('RoleAddEvent', () => {
        dispatch({ type: 'workflow/getSuper' });
        this.fetchForm();
      })
      .listen('RoleDeleteEvent', () => {
        dispatch({ type: 'workflow/getSuper' });
        this.fetchForm();
      });
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

  fetchOldForm = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/fetchOldForm',
      payload: { id },
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
      const historyKeys = [...this.state.historyKeys];
      historyKeys.push(id);
      this.setState({ historyKeys, activeKey: `history-${id}` }, () => {
        this.fetchOldForm(id);
      });
    };
  }

  fetchBasicColumns = () => {
    const { formType } = this.props;
    const formTypeIndexById = {};
    formType.forEach((item) => {
      formTypeIndexById[item.id] = item;
    });
    const columns = [
      { title: 'ID', width: 90, dataIndex: 'id', align: 'center', sorter: true, searcher: true },
      { title: '名称', dataIndex: 'name', align: 'center', searcher: true },
      { title: '描述', dataIndex: 'description', searcher: true, width: 400, tooltip: true },
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
        title: '生成时间',
        dataIndex: 'created_at',
        sorter: true,
        render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        sorter: true,
        render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
    ];
    return columns;
  }

  fetchColumns = (isAdmin) => {
    const columns = this.fetchBasicColumns();
    columns.push({
      title: '操作',
      render: ({ id }, text) => (
        <Fragment>
          {isAdmin ? (<a onClick={this.searchHistory(id)}>历史</a>) : null}
          {
            text.handle_id.includes(2) ?
              (
                <span>
                  {isAdmin ? (<Divider type="vertical" />) : null}
                  <Link to={`/workflow/form/list/edit/${id}`}> 编辑 </Link>
                </span>
              )
              : null
          }
          {
            text.handle_id.includes(3) ?
              (
                <span>
                  {
                    text.handle_id.includes(2) ?
                      <Divider type="vertical" />
                      : null
                  }
                  <a onClick={() => this.handleDelete(id)}>删除</a>
                </span>
              )
              : null
          }
        </Fragment>
      ),
    });
    return columns;
  }

  fetchHistoryColumns = () => {
    const columns = this.fetchBasicColumns();
    columns.push({
      title: '操作',
      render: ({ id }) => (
        <Fragment>
          <Link to={`/workflow/form/list/info/${id}`}> 查看 </Link>
        </Fragment>
      ),
    });
    return columns;
  }

  closeHistoryTab = (targetKey, action) => {
    if (action === 'remove') {
      let { activeKey } = this.state;
      const historyKeys = [...this.state.historyKeys];
      const key = targetKey.match(/^history-(\d+)$/)[1];
      historyKeys.splice(historyKeys.indexOf(key), 1);
      if (activeKey === targetKey) activeKey = 'list';
      this.setState({ historyKeys, activeKey });
    }
  }

  render() {
    const { list, oldList, oldLoading, loading, superData, currentUserId } = this.props;
    const { historyKeys, activeKey } = this.state;

    const isAdmin = superData.includes(currentUserId);
    const columns = this.fetchColumns(isAdmin);
    const extraOperator = [
      <Link to="/workflow/form/list/type" key="addType">
        <Button type="primary" icon="folder">
          分类管理
        </Button>
      </Link>,
    ];
    if (isAdmin) {
      const add = (
        <Tooltip title="新建表单" key="add">
          <Link to="/workflow/form/list/add">
            <Button type="primary" icon="plus" />
          </Link>
        </Tooltip>
      );
      extraOperator.push(add);
    }
    return (
      <Card bordered={false}>
        <Tabs
          activeKey={activeKey}
          onChange={key => this.setState({ activeKey: key })}
          type="editable-card"
          hideAdd
          onEdit={this.closeHistoryTab}
        >
          <TabPane tab="列表" key="list" closable={false}>
            <OATable
              data={list}
              columns={columns}
              loading={loading}
              extraOperator={extraOperator}
              fetchDataSource={this.fetchForm}
            />
          </TabPane>
          {historyKeys.map((key) => {
            return (
              <TabPane tab={`${find(list, ['id', key]).name}-历史`} key={`history-${key}`}>
                <OATable
                  data={oldList[key]}
                  loading={oldLoading}
                  columns={this.fetchHistoryColumns()}
                  fetchDataSource={() => this.fetchOldForm(key)}
                />
              </TabPane>
            );
          })}
        </Tabs>
      </Card>
    );
  }
}
