import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button,
  Divider,
} from 'antd';
import moment from 'moment';
import store from './store/store';
import OATable from '../../../components/OATable';
import { customerStatus } from '../../../assets/customer';
import { getFiltersData } from '../../../utils/utils';


@connect(({ customer }) => ({ customer: customer.customer }))
@store()
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.user = window.user ? window.user : {};
  }

  makeColumns = () => {
    const { source, tags, brands, deleted, staffBrandsAuth } = this.props;
    const onClick = (name, id) => {
      this.props.history.push(`/client/customer/list/${name}/${id}`);
    };
    const columns = [
      {
        align: 'center',
        title: '客户姓名',
        dataIndex: 'name',
        // width: 160,
        searcher: true,
      },
      {
        align: 'center',
        title: '电话',
        dataIndex: 'mobile',
        // width: 160,
        searcher: true,
      },
      {
        align: 'center',
        title: '客户来源',
        dataIndex: 'source_id',
        filters: getFiltersData(source),
        render: key => OATable.findRenderKey(source, key).name,
      },
      {
        align: 'center',
        title: '客户状态',
        // width: 120,
        dataIndex: 'status',
        filters: getFiltersData(customerStatus),
        render: key => OATable.findRenderKey(customerStatus, key).name,
      },
      {
        width: 300,
        align: 'center',
        title: '合作品牌',
        filters: getFiltersData(brands),
        dataIndex: 'brands.brand_id',
        render: (_, record) => OATable.analysisColumn(brands, record.brands, 'brand_id'),
      },
      {
        // width: 120,
        align: 'center',
        title: '合作时间',
        dataIndex: 'first_cooperation_at',
        sorter: true,
        render: time => (time ? moment(time).format('YYYY-MM-DD') : ''),
      },
      {
        // width: 160,
        title: '维护人',
        align: 'center',
        dataIndex: 'vindicator_name',
        searcher: true,
      },
      {
        width: 300,
        title: '标签',
        align: 'center',
        dataIndex: 'tags.tag_id',
        filters: tags.map(tag => ({ text: tag.name, value: tag.id })),
        render: (_, record) => OATable.analysisColumn(tags, record.tags, 'tag_id'),
      },
      {
        title: '操作',
        render: (_, rowData) => {
          let color;
          let clickAble = false;
          rowData.brands.forEach((item) => {
            if (staffBrandsAuth.indexOf(item.brand_id) !== -1) {
              clickAble = true;
            }
          });
          if (!clickAble) {
            color = '#8e8e8e';
          }
          const style = color ? { color } : {};
          return (
            <Fragment>
              <a
                onClick={() => {
                  onClick('info', rowData.id);
                }}
              >查看
              </a>
              <Divider type="vertical" />
              <a
                style={style}
                onClick={() => {
                  if (clickAble) onClick('edit', rowData.id);
                }}
              >编辑
              </a>
              <Divider type="vertical" />
              <a style={style} onClick={() => { if (clickAble) deleted(rowData.id); }}>删除</a>
            </Fragment >
          );
        },
      },
    ];
    return columns;
  }


  render() {
    const extraOperator = [
      (
        <Button
          type="primary"
          icon="plus"
          key="plus"
          onClick={() => {
            this.props.history.push('/client/customer/list/add');
          }}
        >
          新建客户资料
        </Button>
      ),
    ];
    const { loading, customer, fetchDataSource } = this.props;
    return (
      <OATable
        serverSide
        loading={loading}
        data={customer.data}
        total={customer.total}
        columns={this.makeColumns()}
        extraOperator={extraOperator}
        fetchDataSource={fetchDataSource}
      />
    );
  }
}
