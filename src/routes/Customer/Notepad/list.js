import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  // Divider,
} from 'antd';
import store from './store/store';
import OATable from '../../../components/OATable';
import { getFiltersData } from '../../../utils/utils';

@store()
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.user = window.user ? window.user : {};
  }

  handleLink = (name, id) => {
    this.props.history.push(`/client/notepad/list/${name}/${id}`);
  }

  makeColumns = () => {
    const { deleted, brand, staffBrandsAuth } = this.props;
    const brandsData = brand.filter(item => staffBrandsAuth.indexOf(item.id) !== -1);
    const columns = [
      {
        // width: 80,
        title: '序号',
        align: 'center',
        dataIndex: 'id',
        sorter: true,
      },
      {
        // width: 160,
        align: 'center',
        title: '客户姓名',
        searcher: true,
        dataIndex: 'client_name',
      },
      {
        width: 300,
        align: 'center',
        title: '合作品牌',
        dataIndex: 'brands.brand_id',
        filters: getFiltersData(brandsData),
        render: (_, record) => OATable.analysisColumn(brandsData, record.brands, false),
      },
      {
        // width: 240,
        searcher: true,
        title: '标题',
        align: 'center',
        dataIndex: 'title',
      },
      {
        // width: 400,
        title: '内容',
        align: 'center',
        dataIndex: 'content',
      },
      {
        title: '操作',
        render: (_, record) => {
          const { id } = record;
          let color;
          const clickAble = this.user.staff_sn === record.recorder_sn;
          if (!clickAble) {
            color = '#8e8e8e';
          }
          const style = color ? { color } : {};
          return (
            <Fragment>
              <a style={style} onClick={() => { if (clickAble) deleted(id); }}>删除</a>
            </Fragment>
          );
        },
      },
    ];
    return columns;
  }

  fetchDataSource = (params) => {
    const { fetchDataSource, customerId } = this.props;
    let { filters } = { ...params };
    filters = customerId ? `${filters};client_id=${customerId}` : filters;
    const newParams = {
      ...params,
      filters,
    };
    fetchDataSource(newParams);
  }

  render() {
    const { notes, loading } = this.props;
    const extraOperator = [
      (
        <Button
          type="primary"
          icon="plus"
          key="plus"
          onClick={() => {
            this.props.history.push('/client/notepad/list/add');
          }}
        >
          新建录入
        </Button>
      ),
    ];
    return (
      <OATable
        serverSide
        data={notes.data}
        loading={loading}
        total={notes.total}
        columns={this.makeColumns()}
        fetchDataSource={this.fetchDataSource}
        extraOperator={extraOperator}
      />
    );
  }
}
