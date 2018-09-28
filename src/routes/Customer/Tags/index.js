import React from 'react';
import { Card, Button, Divider } from 'antd';
import TagForm from './form';
import TagType from './Type';
import store from './store/store';
import OATable from '../../../components/OATable';
import { customerAuthority } from '../../../utils/utils';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

@store(['fetchTagsType', 'fetchTags', 'deleted'])
export default class extends React.PureComponent {
  state = {
    visible: false,
    initialValue: {},
  }

  makeColumns = () => {
    const { tagsType, deleted } = this.props;
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
        title: '标签类型',
        dataIndex: 'type_id',
        filters: tagsType.map(item => ({ value: item.id, text: item.name })),
        render: (key) => {
          const value = tagsType.find(item => `${item.id}` === `${key}`) || {};
          return value.name || '';
        },
      },
      {
        title: '描述',
        searcher: true,
        dataIndex: 'describe',
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
    const { fetchTags, tags, loading } = this.props;
    const extraOperator = (
      <Button
        icon="plus"
        type="primary"
        onClick={() => {
          this.setState({ visible: true, initialValue: {} });
        }}
      >
        添加标签
      </Button>
    );

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div style={{ display: 'flex' }}>
            {customerAuthority(180) && (
              <div style={{ width: 200, marginRight: 40 }}>
                <TagType />
              </div>
            )}
            <div style={{ flexGrow: 1 }}>
              <OATable
                data={tags}
                loading={loading}
                total={tags.length}
                fetchDataSource={fetchTags}
                columns={this.makeColumns()}
                extraOperator={extraOperator}
              />
            </div>
          </div>
          <TagForm
            visible={visible}
            initialValue={initialValue}
            onCancel={this.handleModalVisible}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
