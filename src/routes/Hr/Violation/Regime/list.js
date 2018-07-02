/**
 * Created by Administrator on 2018/4/11.
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Tooltip,
  Icon,
  Divider,
  Button,
} from 'antd';
import { Link } from 'dva/router';
import OATable from '../../../../components/OATable1';

@connect(({ violation, loading }) => ({
  regimeList: violation.regime,
  regimeLoading: loading.effects['violation/fetchRegime'],
}))

export default class extends PureComponent {
  fetchFine = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'violation/fetchRegime', payload: params });
  }

  makeColums = () => {
    return [
      {
        title: '编号',
        dataIndex: 'id',
        sorter: true,
        searcher: true,
      },
      {
        title: '违纪名称',
        dataIndex: 'name',
        searcher: true,
      },
      {
        title: '排序',
        dataIndex: 'sort',
        sorter: true,
      }, {
        title: '操作',
        render: (rowData) => {
          return (
            <Fragment>
              <Link to={`/hr/violation/regime/edit/${rowData.id}`}>
                <Tooltip title="编辑" key="edit" mouseLeaveDelay={0}>
                  <Icon type="form" style={{ fontSize: '18px' }} />
                </Tooltip>
              </Link>
              <Divider type="vertical" />
              <Tooltip title="删除" key="delete" mouseLeaveDelay={0}>
                <a style={{ color: 'red' }} onClick={() => this.handleDelete([rowData.id])}>
                  <Icon type="delete" style={{ fontSize: '18px' }} />
                </a>
              </Tooltip>
            </Fragment>
          );
        },
      },
    ];
  }

  makeExtraOperator = () => {
    return [
      <Link to="/hr/violation/regime/add" key="add">
        <Tooltip title="添加大爱制度">
          <Button type="primary" icon="plus" />
        </Tooltip>
      </Link>,
    ];
  }


  render() {
    const { regimeLoading, regimeList } = this.props;
    const columns = this.makeColums();
    return (
      <Fragment>
        <OATable
          serverSide
          data={regimeList}
          columns={columns}
          scroll={{ x: 300 }}
          loading={regimeLoading}
          fetchDataSource={this.fetchFine}
          extraOperator={this.makeExtraOperator()}
        />
      </Fragment>
    );
  }
}
