import React, { PureComponent } from 'react';
import {
  Row,
  Col,
} from 'antd';
import { connect } from 'dva';
import OATable from '../../../components/OATable';
import DepartTree from './departTree';
import DepartForm from './departForm';
import request from '../../../utils/request';
import { customerAuthority, getBrandAuthority } from '../../../utils/utils';

@connect(({ brand, loading }) => ({
  brand: brand.brand,
  fLoading: loading.effects['department/fetchDepart'],
}))
export default class extends PureComponent {
  state = {
    total: 0,
    department: [],
    loading: false,
    visible: false,
    editInfo: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'brand/fetchBrand' });
  }

  handleEdit = (rowData) => {
    this.setState({ editInfo: rowData }, () => this.handleModalVisible(true));
  }

  handleSubmit = (params) => {
    return params;
  }

  handleError = (err) => {
    const { onError } = this.props;
    onError(err);
  }

  handleSuccess = () => {
    this.handleModalVisible(false);
  }

  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'department/deleteDepart',
      payload: { id },
    });
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  fetchDepartment = (param) => {
    this.setState({ loading: true });
    request('/api/department', {
      method: 'GET',
      body: param,
    }).then((response) => {
      this.setState({
        loading: false,
        department: response.data,
        total: response.total,
      });
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
    // if (customerAuthority(143) || customerAuthority(144)) {
    //   columns.push(
    //     {
    //       title: '操作',
    //       render: (rowData) => {
    //         return (
    //           <Fragment>
    //             {customerAuthority(143) && (
    //               <a onClick={() => this.handleEdit(rowData)}>编辑</a>
    //             )}
    //             <Divider type="vertical" />
    //             {customerAuthority(144) && (
    //               <a onClick={() => this.handleDelete(rowData.id)}>删除</a>
    //             )}
    //           </Fragment>
    //         );
    //       },
    //     }
    //   );
    // }
    return columns;
  }

  render() {
    const columns = this.makeColumns();
    const { total, loading, department, visible, editInfo } = this.state;

    return (
      <Row>
        <Col span={4} style={{ borderRight: '1px solid #e8e8e8' }}>
          <DepartTree fetchDataSource={typeId => this.setTypeId(typeId)} />
        </Col>
        <Col span={20}>
          <OATable
            serverSide
            data={department}
            total={total}
            columns={columns}
            loading={loading}
            scroll={{ x: 300 }}
            fetchDataSource={this.fetchDepartment}
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
