import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Divider,
} from 'antd';
import store from '../store/urlSource';
import SourceForm from './form';
import OATable from '../../../../components/OATable';
@store()
export default class List extends PureComponent {
  state = {
    initialValue: {},
    visible: false,
  }

  columns = [
    { title: '序号', dataIndex: 'id', sorter: true },
    { title: '名称', dataIndex: 'name', searcher: true },
    { title: '地址', dataIndex: 'url' },
    {
      title: '操作',
      render: record => (
        <Fragment>
          <a onClick={() => {
            this.setState({ visible: true, initialValue: record });
          }}
          >编辑
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.props.deleted(record.id)}>删除</a>
        </Fragment>
      ),
    },
  ]

  render() {
    const { columns } = this;
    const { loading } = this.props;
    const { visible, initialValue } = this.state;
    const extraOperator = [
      <Button
        type="primary"
        icon="plus"
        onClick={() => {
          this.setState({ visible: true });
        }}
      >新建接口
      </Button>,
    ];

    return (
      <React.Fragment>
        <OATable
          data={[]}
          total={0}
          columns={columns}
          loading={loading}
          extraOperator={extraOperator}
          fetchDataSource={this.fetchFormType}
        />
        <SourceForm
          visible={visible}
          initialValue={initialValue}
          onCancel={() => { this.setState({ visible: false, initialValue: {} }); }}
        />
      </React.Fragment>
    );
  }
}
