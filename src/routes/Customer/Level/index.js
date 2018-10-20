import React from 'react';
import { Card, Button, Divider } from 'antd';
import store from './store/store';
import LevelForm from './form';
import OATable from '../../../components/OATable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

@store()
export default class extends React.PureComponent {
  state = {
    visible: false,
    initialValue: {},
  }

  makeColumns = () => {
    const { deleted } = this.props;
    const columns = [
      {
        width: 100,
        align: 'center',
        title: '序号',
        sorter: true,
        dataIndex: 'id',
      },
      {
        title: '名称',
        searcher: true,
        dataIndex: 'name',
      },
      {
        title: '说明',
        searcher: true,
        dataIndex: 'explain',
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
              <a onClick={() => deleted(record.id)}>删除</a>
            </React.Fragment>
          );
        },
      },
    ];
    return columns;
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  render() {
    const { visible, initialValue } = this.state;
    const { fetchLevel, level, loading } = this.props;
    const extraOperator = (
      <Button
        icon="plus"
        type="primary"
        onClick={() => {
          this.setState({ visible: true, initialValue: {} });
        }}
      >
        添加等级
      </Button>
    );
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <OATable
            data={level}
            loading={loading}
            total={level.length}
            fetchDataSource={fetchLevel}
            columns={this.makeColumns()}
            extraOperator={extraOperator}
          />
          <LevelForm
            visible={visible}
            initialValue={initialValue}
            onCancel={this.handleModalVisible}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
