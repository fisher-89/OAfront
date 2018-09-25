import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button,
  Divider,
  message,
  Popconfirm,
} from 'antd';
import moment from 'moment';
import store from './store/store';
import OATable from '../../../components/OATable';

import { customerStatus } from '../../../assets/customer';
import { getFiltersData, customerAuthority } from '../../../utils/utils';

@connect(({ customer }) => ({ customer: customer.customer }))
@store()
export default class extends PureComponent {
  makeColumns = () => {
    const { source, tags, brands, deleted, staffBrandsAuth } = this.props;
    const { editable = [], visible = [] } = staffBrandsAuth;
    const onClick = (name, id) => {
      this.props.history.push(`/client/customer/list/${name}/${id}`);
    };
    const columns = [
      {
        width: 80,
        title: '序号',
        align: 'center',
        dataIndex: 'id',
        sorter: true,
      },
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
          let editAble = true;
          let seeAble = true;
          rowData.brands.forEach((item) => {
            if (editable.indexOf(item.brand_id) !== -1) {
              editAble = false;
            }
            if (visible.indexOf(item.brand_id) !== -1) {
              seeAble = false;
            }
          });
          const editStyle = editAble ? { color: '#8e8e8e' } : {};
          const seeStyle = seeAble ? { color: '#8e8e8e' } : {};
          return (
            <Fragment>
              <a
                style={seeStyle}
                onClick={() => {
                  if (!seeAble) {
                    onClick('info', rowData.id);
                  } else {
                    message.error('对不起，暂无客户的查看权限');
                  }
                }}
              >查看
              </a>
              {customerAuthority(187) && (
                <React.Fragment>
                  <Divider type="vertical" />
                  <a
                    style={editStyle}
                    onClick={() => {
                      if (!editAble) {
                        onClick('edit', rowData.id);
                      } else {
                        message.error('对不起，暂无客户的修改权限');
                      }
                    }}
                  >
                    编辑
                  </a>
                </React.Fragment>
              )}
              {customerAuthority(178) && (
                <React.Fragment>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="是否删除客户及相关事件?"
                    onConfirm={() => {
                      if (!editAble) {
                        deleted(rowData.id);
                      } else {
                        message.error('对不起，暂无客户的修改权限');
                      }
                    }}
                  >
                    <a style={editStyle}>删除</a>
                  </Popconfirm>
                </React.Fragment>
              )}
            </Fragment>
          );
        },
      },
    ];
    return columns;
  }


  render() {
    const extraOperator = [];
    if (customerAuthority(188)) {
      extraOperator.push((
        <Button
          type="primary"
          icon="plus"
          key="plus"
          onClick={() => {
            this.props.history.push('/client/customer/list/add');
          }}
        >
          客户
        </Button>
      ));
    }
    if (customerAuthority(192)) {
      extraOperator.push((
        <Button
          key="download"
          icon="cloud-download"
        >
          <a href="/api/crm/clients/example" style={{ color: 'rgba(0, 0, 0, 0.65)', marginLeft: 5 }}>下载模板</a>
        </Button>
      ));
    }

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
        excelInto={customerAuthority(192) ? '/api/crm/clients/import' : false}
      />
    );
  }
}
