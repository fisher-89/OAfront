import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Card, Divider, Button } from 'antd';
import OATable from '../../../components/OATable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StaffTagType from './Type/index';
import TagForm from './form';
import store from './store/store';

@store(['fetchTags', 'deleted'])

/* shoptags是完全复制于stafftags 接口都是同一个 区别是上传时type 不同 shop/staff */
export default class extends PureComponent {
  state = {
    visible: false,
    initialValue: {},
  }
  makeExtraOperator = () => {
    const extra = [];
    extra.push((
      <Button
        icon="plus"
        key="plus"
        type="primary"
        style={{ marginLeft: '10px' }}
        onClick={() => {
          this.handleModalVisible(true);
          this.setState({ initialValue: {} });
        }}
      >
          添加标签
      </Button>
    ));
    return extra;
  }
  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }
  makeColunms = () => {
    const { deleted } = this.props;
    const colunms = [
      {
        width: 100,
        align: 'center',
        title: '序号',
        dataIndex: 'id',
        sorter: (a, b) => a.id - b.id,
        defaultSortOrder: 'ascend',
      },
      {
        align: 'center',
        searcher: true,
        dataIndex: 'name',
        title: '名称',
      },
      {
        align: 'center',
        title: '标签类型',
        dataIndex: 'tag_category_id',
        render: (_, record) => {
          const name = { ...record.category };
          return name.name;
        },
      },
      {
        align: 'center',
        title: '描述',
        dataIndex: 'description',
      },
      {
        align: 'center',
        title: '操作',
        render: (rowData) => {
          return (
            <Fragment>
              <a onClick={() => this.setState({ visible: true, initialValue: rowData })}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => deleted(rowData.id)}>删除</a>
            </Fragment>
          );
        },
      },
    ];
    return colunms;
  }
  render() {
    const { visible, initialValue } = this.state;
    const { fetchTags, stafftags, loading } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Row gutter={16}>
            <Col span={6}><StaffTagType /></Col>
            <Col span={18}>
              <Fragment>
                <OATable
                  data={stafftags}
                  loading={loading}
                  fetchDataSource={fetchTags}
                  total={stafftags.length}
                  columns={this.makeColunms()}
                  extraOperator={this.makeExtraOperator()}
                />
                <TagForm
                  initialValue={initialValue}
                  visible={visible}
                  onCancel={this.handleModalVisible}
                />
              </Fragment>
            </Col>
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}
