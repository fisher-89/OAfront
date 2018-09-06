import React, { PureComponent, Fragment } from 'react';
import {
  Tabs,
  Modal,
  Divider,
} from 'antd';
import { connect } from 'dva';
import OATable from '../../../components/OATable';
import DepartTree from './departTree';
import DepartForm from './departForm';
import { customerAuthority, getBrandAuthority } from '../../../utils/utils';

const { TabPane } = Tabs;

@connect(({ department, brand, loading }) => ({
  brand: brand.brand,
  treeList: department.tree,
  department: department.department,
  fLoading: loading.effects['department/fetchDepart'],
}))
export default class extends PureComponent {
  state = {
    visible: false,
    activeKey: 'depart_list',
    editInfo: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'brand/fetchBrand' });
    dispatch({ type: 'department/fetchTreeDepart' });
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  handleEdit = (rowData) => {
    this.setState({ editInfo: rowData }, () => this.handleModalVisible(true));
  }

  handleDelete = (id) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确定要删除该分类及下面的子类么?',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'department/deleteDepart',
          payload: { id },
        });
      },
    });
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  fetchDepartment = (params) => {
    const { dispatch } = this.props;
    const { filters } = params;
    dispatch({
      type: 'department/fetchDepart',
      payload: {
        ...params,
        filters,
      },
    });
  };

  tabsChange = (activeKey) => {
    this.setState({ activeKey });
  };

  makeColumns = () => {
    const { brand } = this.props;
    const brandFilters = [];
    if (brand) {
      brand.forEach((item) => {
        if (getBrandAuthority(item.id)) {
          brandFilters.push({ text: item.name, value: item.id });
        }
      });
    }

    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        searcher: true,
        sorter: true,
      },
      {
        title: '部门名称',
        dataIndex: 'name',
        searcher: true,
      },
      {
        title: '部门全称',
        dataIndex: 'full_name',
        searcher: true,
      },
      {
        title: '品牌',
        dataIndex: 'brand_id',
        filters: brand && brandFilters,
        render: (val) => {
          const data = brand && brand.filter(item => item.id === val)[0];
          return data ? data.name : '';
        },
      },
      {
        title: '部门负责人',
        dataIndex: 'manager_name',
        sorter: true,
      },
    ];
    if (customerAuthority(143) || customerAuthority(144)) {
      columns.push(
        {
          title: '操作',
          render: (rowData) => {
            return (
              <Fragment>
                {customerAuthority(143) && (
                  <a onClick={() => this.handleEdit(rowData)}>编辑</a>
                )}
                <Divider type="vertical" />
                {customerAuthority(144) && (
                  <a onClick={() => this.handleDelete(rowData.id)}>删除</a>
                )}
              </Fragment>
            );
          },
        }
      );
    }
    return columns;
  }

  render() {
    const columns = this.makeColumns();
    const { fLoading, department, treeList } = this.props;
    const { visible, editInfo, activeKey } = this.state;
    return (
      <Fragment>
        <Tabs
          hideAdd
          animated
          type="editable-card"
          onEdit={this.onEdit}
          activeKey={activeKey}
          onChange={this.tabsChange}
        >
          <TabPane
            tab="部门列表"
            key="depart_list"
            closable={false}
          >
            <OATable
              serverSide
              columns={columns}
              loading={fLoading}
              dataSource={department && department.data}
              total={department.total || 0}
              filtered={department.filtered || 0}
              fetchDataSource={this.fetchDepartment}
            />
          </TabPane>
          <TabPane
            tab="部门结构"
            key="depart_s_list"
            closable={false}
          >
            <DepartTree fetchDataSource={typeId => this.setTypeId(typeId)} />
          </TabPane>
        </Tabs>
        {(customerAuthority(151) || customerAuthority(138)) &&
          (
            <DepartForm
              visible={visible}
              initialValue={editInfo}
              onCancel={this.handleModalVisible}
              treeData={treeList}
              onClose={() => this.setState({ editInfo: {} })}
            />
          )
        }
      </Fragment>
    );
  }
}
