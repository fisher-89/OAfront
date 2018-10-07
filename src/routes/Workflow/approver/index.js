import React, { PureComponent, Fragment } from 'react';
import { Button, Divider, List, Avatar, Card, Row, Col } from 'antd';
import moment from 'moment';
import ApproverForm from './form';
import store from './store/store';
// import OATable from '../../../components/OATable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import OATable from '../../../components/OATable';

@store()
export default class extends PureComponent {
  state = {
    initialValue: {},
    visible: false,
  }

  columns = [
    { title: 'ID', dataIndex: 'id', sorter: true, searcher: true },
    { title: '名称', dataIndex: 'name', searcher: true },
    { title: '排序', dataIndex: 'sort', sorter: true },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      sorter: true,
      render: val => (<span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''}</span>),
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      sorter: true,
      render: val => (<span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''}</span>),
    },
    {
      title: '操作',
      render: rowData => (
        <Fragment>
          <a onClick={() => {
            this.setState({ initialValue: rowData, visible: true });
          }}
          >编辑
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.props.deleted(rowData.id)}>删除</a>
        </Fragment>
      ),
    },
  ]

  render() {
    const { loading, fetchDataSource } = this.props;
    const { visible, initialValue } = this.state;

    const extraOperator = [
      <Button type="primary" icon="plus" key="plus" onClick={() => this.setState({ visible: true })}>
        审批人
      </Button>,
    ];

    const list = [
      {
        title: '测试',
        description: '说明加上描述',
      },
      {
        title: '测试1',
        description: '说明加上描述1',
      },
      {
        title: '测试1',
        description: '说明加上描述1',
      },
      {
        title: '测试1',
        description: '说明加上描述1',
      },
      {
        title: '测试1',
        description: '说明加上描述1',
      },
      {
        title: '测试1',
        description: '说明加上描述1',
      },
      {
        title: '测试1',
        description: '说明加上描述1',
      },
      {
        title: '测试1',
        description: '说明加上描述1',
      },
      {
        title: '测试1',
        description: '说明加上描述1',
      },
      {
        title: '测试1',
        description: '说明加上描述1',
      },
    ];

    return (
      <React.Fragment>
        <PageHeaderLayout>
          <Row>
            <Col span={6}>
              <Card bordered={false}>
                <Button
                  icon="plus"
                  type="dashed"
                  style={{ width: '100%', marginBottom: 8 }}
                  onClick={() => { this.setState({ visible: true }); }}
                >
                  添加
                </Button>
                <div style={{ maxHeight: 600, overflowY: 'auto' }}>
                  <List
                    size="large"
                    rowKey="id"
                    loading={loading}
                    dataSource={list}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <a>查看</a>,
                          <a>编辑</a>,
                          <a>删除</a>,
                        ]}
                      >
                        <List.Item.Meta
                          title={item.title}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Card>
            </Col>
            <Col sm={{ span: 17, offset: 1 }} >
              <Card bordered={false}>
                <OATable
                  dataSource={list}
                  columns={this.columns}
                  extraOperator={extraOperator}
                />
              </Card>
            </Col>
          </Row>
          <ApproverForm
            visible={visible}
            initialValue={initialValue}
            onCancel={() => {
              this.setState({ initialValue: {}, visible: false });
            }}
          />
        </PageHeaderLayout>
      </React.Fragment>
    );
  }
}
