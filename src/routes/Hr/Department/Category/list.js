import React, { PureComponent, Fragment } from 'react';
import {
  Modal,
  Button,
  Divider,
} from 'antd';
import { connect } from 'dva';
import OATable from 'components/OATable';
import { checkAuthority } from 'utils/utils';
import CateForm from './form';

@connect(({ department, loading }) => ({
  category: department.category,
  fLoading: loading.effects['department/fetchCategory'],
}))
export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
    filters: {},
  };

  fetchDepartment = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'department/fetchCategory', payload: params });
  }

  handleEdit = (rowData) => {
    this.setState({ editInfo: rowData }, () => this.handleModalVisible(true));
  }

  handleDelete = (id) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确定要删除该分类么?',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'department/deleteCategory',
          payload: { id },
        });
      },
    });
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  makeColumns = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        sorter: true,
      },
      {
        title: '分类名称',
        dataIndex: 'name',
        searcher: true,
      },
      {
        title: '分类字段',
        dataIndex: 'fields',
        render: (val) => {
          return val.join('，');
        },
      },
    ];
    if (checkAuthority(40) || checkAuthority(41)) {
      columns.push(
        {
          title: '操作',
          render: (rowData) => {
            return (
              <Fragment>
                {checkAuthority(40) && (
                  <a
                    onClick={() => this.handleEdit(rowData)}
                    disabled={rowData.is_locked === 1}
                  >编辑
                  </a>
                )}
                <Divider type="vertical" />
                {checkAuthority(41) && (
                  <a
                    onClick={() => this.handleDelete(rowData.id)}
                    disabled={rowData.is_locked === 1}
                  >删除
                  </a>
                )}
              </Fragment>
            );
          },
        }
      );
    }
    return columns;
  }

  makeExtraOperator = () => {
    const extra = [];
    if (checkAuthority(39)) {
      extra.push((
        <Button
          icon="plus"
          key="plus"
          type="primary"
          style={{ marginLeft: '10px' }}
          onClick={() => this.handleModalVisible(true)}
        >
          添加分类
        </Button>
      ));
    }
    return extra;
  }

  render() {
    const { fLoading, category } = this.props;
    const { visible, editInfo, filters } = this.state;
    return (
      <Fragment>
        <OATable
          filters={filters}
          columns={this.makeColumns()}
          loading={fLoading}
          dataSource={category}
          fetchDataSource={this.fetchDepartment}
          extraOperator={this.makeExtraOperator()}
        />
        {(checkAuthority(39) || checkAuthority(40)) &&
          (
            <CateForm
              visible={visible}
              initialValue={editInfo}
              onCancel={this.handleModalVisible}
              treeData={category}
              onClose={() => this.setState({ editInfo: {} })}
            />
          )
        }
      </Fragment>
    );
  }
}
