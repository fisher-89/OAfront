import React from 'react';
import { Card, Button } from 'antd';
import store from './store';
import TagForm from './form';
import OATable from '../../../components/OATable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

@store(['fetchTagsType', 'fetchTags'])
export default class extends React.PureComponent {
  state = {
    visible: false,
  }

  componentWillMount() {
    const { fetchTagsType } = this.props;
    fetchTagsType();
  }

  makeColumns = () => {
    const { tagsType } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '名称',
        searcher: true,
        dataIndex: 'name',
      },
      {
        title: '标签类型',
        dataIndex: 'type_id',
        filters: tagsType.map(item => ({ value: item.id, text: value.name })),
        render: (key) => {
          const value = tagsType.find(item => item.id === key) || {};
          return value.name || '';
        },
      },
      {
        title: '颜色',
        searcher: true,
        dataIndex: 'color',
      },
      {
        title: '操作',
        render: () => {
          return (
            <React.Fragment>
              <a>编辑</a>
              <a>删除</a>
            </React.Fragment>
          );
        },
      },
    ];
    return columns;
  }

  render() {
    const { visible } = this.state;
    const { fetchTags, tags } = this.props;
    const extraOperator = (
      <Button
        icon="plus"
        type="primary"
        onClick={() => this.handleModalVisible(true)}
      >
        添加标签
      </Button>
    );
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <OATable
            data={tags}
            total={tags.length}
            fetchDataSource={fetchTags}
            columns={this.makeColumns()}
            extraOperator={extraOperator}
          />
          <TagForm visible={visible} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
