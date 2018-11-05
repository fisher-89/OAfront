import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Badge,
  Divider,
  Tooltip,
  Button,
  Popconfirm,
} from 'antd';
import moment from 'moment';
import { Link } from 'dva/router';
import OATable from '../../../components/OATable';
import { getFiltersData } from '../../../utils/utils';

@connect(({ workflow, loading }) => ({
  list: workflow.flow,
  flowType: workflow.flowType,
  loading: loading.models.workflow,
}))
export default class Flow extends PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'workflow/fetchFlowType' });
  }

  fetchTable = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/fetchFlow',
      payload: {
        ...params,
      },
    });
  };

  deleteFlows = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/deleteFlow',
      payload: { id },
    });
  };

  fetchClone = (id) => {
    return () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'workflow/flowClone',
        payload: { id },
      });
    };
  }

  render() {
    const { list, loading, flowType } = this.props;

    const status = ['停用', '启用'];

    const statusMap = ['default', 'processing', 'success', 'error'];

    const multiOperator = [
      {
        text: '删除',
        action: (selectedRows) => {
          return selectedRows;
        },
      },
    ];

    const columns = [
      {
        title: '流程编号',
        dataIndex: 'id',
        searcher: true,
      },
      {
        title: '流程名称',
        dataIndex: 'name',
        searcher: true,
      },
      {
        title: '类型',
        dataIndex: 'flow_type_id',
        filters: getFiltersData(flowType),
        render: key => OATable.findRenderKey(flowType, key).name,
      },
      {
        title: '状态',
        dataIndex: 'is_active',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
        ],
        render: val => <Badge status={statusMap[val]} text={status[val]} />,
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        sorter: true,
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '操作',
        render: ({ id }) => (
          <Fragment>
            <Popconfirm onConfirm={this.fetchClone(id)} title="确定要克隆该流程？">
              <a>克隆</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Link to={`/workflow/flow/edit/${id}`}>编辑</Link>
            <Divider type="vertical" />
            <Popconfirm onConfirm={() => this.deleteFlows(id)} title="确定要删除该流程？">
              <a>删除</a>
            </Popconfirm>

          </Fragment>
        ),
      },
    ];

    const extraOperator = [
      (
        <Link to="/workflow/flow/type" key="addType">
          <Button type="primary" icon="folder">
            分类管理
          </Button>
        </Link>
      ),
      (
        <Tooltip title="添加新流程" key="add">
          <Link to="/workflow/flow/add">
            <Button type="primary" icon="plus" />
          </Link>
        </Tooltip>
      ),
    ];

    return (
      <Card bordered={false}>
        <OATable
          loading={loading}
          data={list}
          fetchDataSource={this.fetchTable}
          extraOperator={extraOperator}
          columns={columns}
          multiOperator={multiOperator}
        />
      </Card>
    );
  }
}
