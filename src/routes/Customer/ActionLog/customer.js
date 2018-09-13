import React, { PureComponent, Fragment } from 'react';
import { Card } from 'antd';
import store from './store/store';
import CustomerLogInfo from './customerLogInfo';
import OATable from '../../../components/OATable';
import { getFiltersData } from '../../../utils/utils';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

@store(['fetchClientLogs', 'fetchBrand'])
export default class extends PureComponent {
  state = {
    initialValue: {},
    visible: false,
  };

  componentWillMount() {
    const { fetchBrand } = this.props;
    fetchBrand();
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
      },
      {
        title: '客户姓名',
        align: 'center',
        searcher: true,
        dataIndex: 'clients.name',
      },
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
        title: '操作',
        render: (_, record) => {
          const disabled = Array.isArray(record.changes);
          let color;
          if (disabled) {
            color = '#666';
          }
          return (
            <Fragment>
              <a
                {...color ? { style: { color } } : {}}
                onClick={() => {
                  if (disabled) { return; }
                  this.setState({
                    initialValue: record,
                    visible: true,
                  });
                }}
              >
                还原修改
              </a>
            </Fragment>
          );
        },
      },
    ];
    return columns;
  }

  fetchDataSource = (params) => {
    const { fetchClientLogs, clientId } = this.props;
    const newParams = { ...params };
    newParams.filters = clientId ? `client_id=${clientId}` : '';
    fetchClientLogs(newParams);
  }


  render() {
    const { clientLogs, loading, type } = this.props;
    const { visible, initialValue } = this.state;
    let data = [];
    let total = 0;
    if (Array.isArray(clientLogs)) {
      data = clientLogs;
      total = clientLogs.length;
    } else {
      ({ data, total } = clientLogs);
    }
    const renderContent = (
      <React.Fragment>
        <CustomerLogInfo
          visible={visible}
          initialValue={initialValue}
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
