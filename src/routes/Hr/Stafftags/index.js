import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Card, Divider, Button } from 'antd';
import OATable from '../../../components/OATable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StaffTagType from './Type/index';
import TagForm from './form';

export default class extends PureComponent {
  state = {
    visible: false,
  }
  makeExtraOperator = () => {
    const extra = [];
    extra.push((
      <Button
        icon="plus"
        key="plus"
        type="primary"
        style={{ marginLeft: '10px' }}
        onClick={() => this.handleModalVisible(true)}
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
        dataIndex: 'tagType',
      },
      {
        align: 'center',
        title: '描述',
        dataIndex: 'describe',
        searcher: true,
      },
      {
        align: 'center',
        title: '操作',
        render: () => {
          return (
            <Fragment>
              <a>编辑</a>
              <Divider type="vertical" />
              <a>删除</a>
            </Fragment>
          );
        },
      },
    ];
    return colunms;
  }
  render() {
    const { visible } = this.state;
    const data = [{
      id: '1',
      name: 'John Brown',
    }, {
      id: '2',
      name: 'Jim Green',
    }, {
      id: '3',
      name: 'Joe Black',
    }, {
      id: '4',
      name: 'Disabled User',
    }];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Row>
            <Col span={4} pull={0}><div><StaffTagType /></div></Col>
            <Col span={20} push={0}>
              <Fragment>
                <OATable
                  columns={this.makeColunms()}
                  data={data}
                  extraOperator={this.makeExtraOperator()}
                />
                <TagForm
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
