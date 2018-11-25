import React, { PureComponent, Fragment } from 'react';
import { Card, Badge, Tooltip, Icon } from 'antd';
import store from './store/store';
import CustomerLogInfo from './customerLogInfo';
import OATable from '../../../components/OATable';
import { getFiltersData, checkAuthority } from '../../../utils/utils';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const statusFilters = [
  { value: 1, text: '可还原' },
  { value: 2, text: '已还原' },
  { value: 0, text: '锁定' },
  { value: -1, text: '删除' },
];

@store(['fetchClientLogs', 'fetchBrand'])
export default class extends PureComponent {
  state = {
    initialValue: {},
    visible: false,
  };

  componentWillMount() {
    const { fetchBrand, type } = this.props;
    fetchBrand();
    if (type) {
      this.fetchDataSource();
    }
  }


  makeColumns = () => {
    const { brands, type } = this.props;
    const columns = [
      {
        width: 80,
        title: '序号',
        align: 'center',
        dataIndex: 'id',
        sorter: true,
        defaultSortOrder: 'descend',
      },
    ];
    const columns1 = [
      {
        title: '客户姓名',
        align: 'center',
        searcher: true,
        dataIndex: 'clients.name',
      },
    ];
    const columns2 = [
      {
        title: '合作品牌',
        align: 'center',
        dataIndex: 'clients.brands.brand_id',
        onFilter: (value, record) => {
          if (!type) return true;
          const brandId = record.clients.brands.map(item => `${item.brand_id}`);
          return brandId.indexOf(value) !== -1;
        },
        filters: getFiltersData(brands),
        render: (_, record) => OATable.analysisColumn(brands, record.clients.brands, 'brand_id'),
      },
      {
        // width: 200,
        align: 'center',
        searcher: true,
        title: '操作人',
        dataIndex: 'staff_name',
      },
      {
        // width: 80,
        sorter: true,
        title: '操作时间',
        align: 'center',
        dataIndex: 'created_at',
      },
      {
        align: 'center',
        title: '操作类型',
        dataIndex: 'type',
        searcher: true,
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: statusFilters,
        render: (key) => {
          let status = '';
          if (key === 2) {
            status = <Badge status="default" text="已还原" />;
          } else if (key === 0) {
            status = (
              <Tooltip title="请先还原上一条数据" placement="topLeft" arrowPointAtCenter>
                <Badge status="warning" text="锁定" />&nbsp;<Icon type="question-circle" />
              </Tooltip>
            );
          } else if (key === 1) {
            status = <Badge status="success" text="可还原" />;
          } else if (key === -1) {
            const title = !checkAuthority(191) ? '可还原' : '删除数据不可还原，请联系管理员！';
            status = (
              <Tooltip title={title} placement="topLeft" arrowPointAtCenter>
                <Badge status="error" text="删除" />&nbsp;<Icon type="question-circle" />
              </Tooltip>
            );
          }
          return status;
        },
      },
      {
        title: '操作',
        render: (_, record) => {
          return (
            <Fragment>
              <a onClick={() => {
                this.setState({
                  initialValue: record,
                  visible: true,
                });
              }}
              >
                查看
              </a>
            </Fragment>
          );
        },
      },
    ];
    return type ? columns.concat(columns2) : columns.concat(columns1, columns2);
  }

  fetchDataSource = (params) => {
    const { fetchClientLogs, clientId } = this.props;
    const newParams = { ...params };
    newParams.filters = clientId ? `client_id=${clientId}` : newParams.filters;
    if (clientId) {
      newParams.clientId = clientId;
    }
    fetchClientLogs(newParams);
  }


  render() {
    const { clientLogs, loading, type, clientId } = this.props;
    const { visible, initialValue } = this.state;
    let data = [];
    let total = 0;
    if (type) {
      data = clientLogs[clientId] ? clientLogs[clientId] : [];
      total = clientLogs[clientId] ? clientLogs[clientId].length : 0;
    } else {
      ({ data, total } = clientLogs);
    }
    const renderContent = (
      <React.Fragment>
        <CustomerLogInfo
          type={type}
          visible={visible}
          initialValue={initialValue}
          onSuccess={this.fetchDataSource}
          onClose={() => {
            this.setState({
              initialValue: {},
              visible: false,
            });
          }}
        />
        <OATable
          data={data}
          total={total}
          loading={loading}
          serverSide={!type}
          columns={this.makeColumns()}
          fetchDataSource={this.fetchDataSource}
        />
      </React.Fragment>
    );
    return !type ? (
      <PageHeaderLayout>
        <Card bordered={false}>
          {renderContent}
        </Card>
      </PageHeaderLayout>
    ) : renderContent;
  }
}
