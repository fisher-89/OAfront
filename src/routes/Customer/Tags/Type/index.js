import React from 'react';
import { Tag, Card, Button, Divider } from 'antd';
import store from '../store/type';
import TagTypeForm from './form';
import OATable from '../../../../components/OATable';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';

@store(['fetchTagsType', 'deleted'])
export default class extends React.PureComponent {
  state = {
    visible: false,
    initialValue: {},
  }

  makeColumns = () => {
    const { deleted } = this.props;
    const columns = [
      {
        title: '序号',
        searcher: true,
        dataIndex: 'id',
      },
      {
        title: '名称',
        searcher: true,
        dataIndex: 'name',
      },
      {
        title: '颜色',
        searcher: true,
        dataIndex: 'color',
        render: color => (<Tag color={color}>{color}</Tag>),
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
    const { fetchTagsType, tagsType, loading } = this.props;
    const extraOperator = (
      <Button
        icon="plus"
        type="primary"
        onClick={() => {
          this.setState({ visible: true, initialValue: {} });
        }}
      >
        添加标签类型
      </Button>
    );
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <OATable
            data={tagsType}
            loading={loading}
            total={tagsType.length}
            columns={this.makeColumns()}
            extraOperator={extraOperator}
            fetchDataSource={fetchTagsType}
          />
          <TagTypeForm
            visible={visible}
            initialValue={initialValue}
            onCancel={this.handleModalVisible}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
