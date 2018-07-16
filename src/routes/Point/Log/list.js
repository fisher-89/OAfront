import React, { PureComponent } from 'react';
import { connect } from 'dva';

import OATable from '../../../components/OATable';

@connect(({ point, department, brand, loading }) => ({
  department: department.department,
  brand: brand.brand,
  log: point.pointLog,
  logLoading: loading.effects['point/fetchPointLog'],
  dLoading: loading.department,
  bLoading: loading.brand,
}))
export default class extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'department/fetchDepartment',
      payload: {},
    });
    dispatch({
      type: 'brand/fetchBrand',
      payload: {},
    });
  }

  fetchPointLog = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/fetchPointLog', payload: params });
  }


  makeColumns = () => {
    const { brand, department } = this.props;

    const brandFilters = brand.map(item => ({ text: item.name, value: item.id }));
    const sources = { 0: '系统', 1: '基础', 2: '奖扣', 3: '任务', 4: '考勤', 5: '日志' };

    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        searcher: true,
        sorter: true,
      },
      {
        title: '标题',
        dataIndex: 'title',
        searcher: true,
      },
      {
        title: '员工',
        dataIndex: 'staff_name',
        searcher: true,
      },
      {
        title: '品牌',
        dataIndex: 'brand_id',
        filters: brandFilters,
        render: (_, record) => {
          return record.brand_name || '';
        },
      },
      {
        title: '部门',
        dataIndex: 'department_id',
        treeFilters: {
          title: 'full_name',
          value: 'id',
          parentId: 'parent_id',
          data: department,
        },
        render: (_, record) => {
          return record.department_name || '';
        },
      },
      {
        title: 'A分变动',
        dataIndex: 'point_a',
        rangeFilters: true,
      },
      {
        title: 'B分变动',
        dataIndex: 'point_b',
        rangeFilters: true,
      },
      {
        title: '变化时间',
        dataIndex: 'changed_at',
        sorter: true,
      },
      {
        title: '积分来源',
        dataIndex: 'source_id',
        render: (id) => {
          return sources[id];
        },
        filters: sources,
      },
      {
        title: '初审人',
        dataIndex: 'first_approver_name',
        searcher: true,
      },
      {
        title: '终审人',
        dataIndex: 'final_approver_name',
        searcher: true,
      },
    ];
    return columns;
  }

  render() {
    const { log, logLoading, dLoading, bLoading } = this.props;
    return (
      <React.Fragment>
        <OATable
          serverSide
          loading={logLoading || dLoading || bLoading}
          columns={this.makeColumns()}
          dataSource={log && log.data}
          total={log && log.total}
          filtered={log && log.filtered}
          fetchDataSource={this.fetchPointLog}
          scroll={{ x: 300 }}
        />
      </React.Fragment>
    );
  }
}
