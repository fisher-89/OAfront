import React, { PureComponent } from 'react';
import { Popover, Button } from 'antd';
import OATable from 'components/OATable';

export default class extends PureComponent {
  componentWillMount() {
    const { fetchBillImage } = this.props;
    fetchBillImage();
  }

  filterUnclear = () => {
    const { fetchBillImage } = this.props;
    const params = {
      overdued: 1,
    };
    fetchBillImage(params);
  }

  filterMine = () => {
    const { fetchBillImage } = this.props;
    const params = {
      own: 1,
    };
    fetchBillImage(params);
  }

  makeColumns = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        width: 50,
        sorter: (a, b) => a.id - b.id,
        defaultSortOrder: 'descend',
      },
      {
        title: '姓名',
        dataIndex: 'staff_name',
        searcher: true,
        width: 60,
      },
      {
        title: '部门',
        dataIndex: 'department_name',
        searcher: true,
        width: 50,
      },
      {
        title: '是否过期',
        dataIndex: 'is_clear',
        width: 30,
        render: key => (key ? '是' : '否'),
      },
      {
        title: '账单',
        dateFilters: true,
        dataIndex: 'file_path',
        width: 300,
        render: (_, record) => {
          if (record.is_clear === 1) {
            return '链接已过期';
          } else {
            const hover = (
              <div><img src={record.file_path} alt={record.file_name} /></div>
            );
            return (
              <Popover content={hover} >{record.file_path}</Popover>
            );
          }
        },
      },
    ];
    return columns;
  }
  render() {
    const { billimage, fetchBillImage, loading } = this.props;
    const extra = [];
    extra.push(
      (
        <Button
          key="isnotclear"
          type="primary"
          icon="clock-circle"
          onClick={() => this.filterUnclear()}
        >
          图片未过期的
        </Button>
      ),
      (
        <Button
          key="myrecord"
          type="primary"
          icon="highlight"
          onClick={() => this.filterMine()}
        >
          我录入的
        </Button>
      ),
      (
        <Button
          key="reset"
          type="primary"
          icon="redo"
          onClick={() => fetchBillImage()}
        >
          重置
        </Button>
      )
    );
    return (
      <OATable
        columns={this.makeColumns()}
        dataSource={billimage}
        loading={loading}
        fetchDataSource={fetchBillImage}
        extraOperator={extra}
      />
    );
  }
}
