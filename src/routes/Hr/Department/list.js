import React, { PureComponent, Fragment } from 'react';
import {
  Row,
  Col,
  Modal,
  Divider,
} from 'antd';
import { connect } from 'dva';
import OATable from '../../../components/OATable';
import DepartTree from './departTree';
import DepartForm from './departForm';
import { customerAuthority, getBrandAuthority } from '../../../utils/utils';

@connect(({ department, brand, loading }) => ({
  brand: brand.brand,
  department: department.department,
  fLoading: loading.effects['department/fetchDepartment'],
}))
export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'brand/fetchBrand' });
    dispatch({ type: 'department/fetchDepartment' });
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
          type: 'department/deleteDepartment',
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
    dispatch({
      type: 'department/fetchDepartment',
      payload: params,
    });
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
    const { fLoading, department } = this.props;
    const { visible, editInfo } = this.state;
    return (
      <Row>
        <Col span={4} style={{ borderRight: '1px solid #e8e8e8' }}>
          <DepartTree dataSource={department} fetchDataSource={typeId => this.setTypeId(typeId)} />
        </Col>
        <Col span={20}>
          <OATable
            serverSide={false}
            columns={columns}
            loading={fLoading}
            dataSource={department}
          />
        </Col>
        <Col span={20}>
          {(customerAuthority(151) || customerAuthority(138)) &&
            (
              <DepartForm
                visible={visible}
                initialValue={editInfo}
                onCancel={this.handleModalVisible}
                treeData={department}
                onClose={() => this.setState({ editInfo: {} })}
              />
            )
          }
        </Col>
      </Row>
    );
  }
}
