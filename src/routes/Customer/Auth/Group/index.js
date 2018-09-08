import React from 'react';
import { Card, Divider, Button } from 'antd';
import store from '../store';
import AuthForm from './form';
import OATable from '../../../../components/OATable';
import { getFiltersData } from '../../../../utils/utils';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';


@store(['fetchAuth', 'deletedGroup'])
export default class extends React.PureComponent {
  state = {
    visible: false,
    initialValue: {},
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  makeColumns = () => {
    const { brand, deletedGroup } = this.props;
    const filters = getFiltersData(brand);
    const columns = [
      {
        searcher: true,
        title: '分组名称',
        dataIndex: 'name',
      },
      {
        filters,
        width: 300,
        title: '品牌操作权限',
        dataIndex: 'editables.brand_id',
        render: (_, record) => OATable.analysisColumn(brand, record.editables, false),
      },
      {
        filters,
        width: 300,
        title: '品牌查看权限',
        dataIndex: 'visibles.brand_id',
        render: (_, record) => OATable.analysisColumn(brand, record.visibles, false),
      },
      {
        width: 300,
        title: '员工',
        searcher: true,
        dataIndex: 'staffs.staff_id',
        render: (_, record) => {
          const value = record.staffs.map(item => item.staff_name);
          return OATable.renderEllipsis(value.join('、') || '', true);
        },
      },
      {
        title: '描述',
        dataIndex: 'description',
      },
      {
        title: '操作',
        render: (_, record) => {
          return (
            <React.Fragment>
              <a onClick={() => {
                this.setState({ visible: true, initialValue: record });
              }}
              >编辑
              </a>
              <Divider type="vertical" />
              <a onClick={() => deletedGroup(record.id)}>删除</a>
            </React.Fragment>
          );
        },
      },
    ];
    return columns;
  }

  render() {
    const { fetchAuth, auth, loading } = this.props;
    const { visible, initialValue } = this.state;
    const extraOperator = (
      <Button
        icon="plus"
        type="primary"
        style={{ marginLeft: '10px' }}
        onClick={() => this.handleModalVisible(true)}
      >
        添加权限
      </Button>
    );
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <OATable
            serverSide
            data={auth.data}
            loading={loading}
            total={auth.total}
            scroll={{ x: 1200 }}
            fetchDataSource={fetchAuth}
            columns={this.makeColumns()}
            extraOperator={extraOperator}
          />
          <AuthForm
            visible={visible}
            initialValue={initialValue}
            onCancel={() => {
              this.setState({ visible: false, initialValue: {} });
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
