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
import { echo } from '../../../utils/echo';
import OATable from '../../../components/OATable';
import { getFiltersData } from '../../../utils/utils';

@connect(({ currentUser, workflow, loading }) => ({
  currentUserId: currentUser.currentUser.staff_sn,
  list: workflow.flow,
  flowType: workflow.flowType,
  superData: workflow.superData,
  loading: loading.models.workflow,
}))
export default class Flow extends PureComponent {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    // 权限监听（修改，新增，删除事件）
    echo.channel('role')
      .listen('RoleUpdateEvent', () => {
        dispatch({ type: 'workflow/getSuper' });
        this.fetchTable();
      })
      .listen('RoleAddEvent', () => {
        dispatch({ type: 'workflow/getSuper' });
        this.fetchTable();
      })
      .listen('RoleDeleteEvent', () => {
        dispatch({ type: 'workflow/getSuper' });
        this.fetchTable();
      });
  }

  componentWillMount() {
    const { dispatch, flowType, superData } = this.props;
    // 模型无流程分类数据
    if (flowType.length === 0) {
      dispatch({ type: 'workflow/fetchFlowType' });
    }
    // 超级管理员获取
    if (superData.length === 0) {
      dispatch({ type: 'workflow/getSuper' });
    }
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
    const { list, loading, flowType, superData, currentUserId } = this.props;
    const status = ['停用', '启用'];
    const isClient = ['否', '是'];
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
        dataIndex: 'number',
        sorter: true,
        defaultSortOrder: 'ascend',
        searcher: true,
      },
      {
        title: 'ID',
        dataIndex: 'id',
        sorter: true,
        searcher: true,
      },
      {
        title: '流程名称',
        dataIndex: 'name',
        searcher: true,
      },
      {
        title: '表名',
        dataIndex: 'form_id',
        render: key => `form_data_${key}`,
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
        title: '客服端可见',
        dataIndex: 'is_client',
        align: 'center',
        filters: [
          {
            text: isClient[1],
            value: 1,
          },
          {
            text: isClient[0],
            value: 0,
          },
        ],
        render: val => <span style={val ? null : { color: 'red' }}>{isClient[val]}</span>,
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        sorter: true,
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '操作',
        render: row => (
          <Fragment>
            <Popconfirm onConfirm={this.fetchClone(row.id)} title="确定要克隆该流程？">
              <a>克隆</a>
            </Popconfirm>
            {
              row.handle_id.includes(2) ?
                (
                  <span>
                    <Divider type="vertical" />
                    <Link to={`/workflow/flow/edit/${row.id}`}>编辑</Link>
                  </span>
                )
                : null
            }
            {
              row.handle_id.includes(3) ?
                (
                  <span>
                    <Divider type="vertical" />
                    {row.is_active ? (<a disabled >删除</a>) : (
                      <Popconfirm onConfirm={() => this.deleteFlows(row.id)} title="确定要删除该流程？">
                        <a>删除</a>
                      </Popconfirm>
                    )}
                  </span>
                )
                : null
            }
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
      // (
      //   <Tooltip title="添加新流程" key="add">
      //     <Link to="/workflow/flow/add">
      //       <Button type="primary" icon="plus" />
      //     </Link>
      //   </Tooltip>
      // ),
    ];
    if (superData.includes(currentUserId)) {
      const add = (
        <Tooltip title="添加新流程" key="add">
          <Link to="/workflow/flow/add">
            <Button type="primary" icon="plus" />
          </Link>
        </Tooltip>
      );
      extraOperator.push(add);
    }

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
