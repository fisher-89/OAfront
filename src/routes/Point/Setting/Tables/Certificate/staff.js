import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import OATable from '../../../../../components/OATable';
import { checkAuthority } from '../../../../../utils/utils';

@connect(({ point, department, brand, loading }) => ({
  certificate: point.certificate,
  certificateLoading: loading.effects['point/fetchCertificate'],
  department: department.department,
  brand: brand.brand,
  certificateStaff: point.certificateStaff,
  dLoading: loading.department,
  bLoading: loading.brand,
  csLoading: loading.effects['point/fetchCertificateStaff'],
  deleteLoaing: loading.effects['point/deleteCertificateStaff'],
}))
export default class extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'department/fetchDepartment', payload: {} });
    dispatch({ type: 'brand/fetchBrand', payload: {} });
  }

  fetchStaffDataSource = (parmas) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/fetchCertificateStaff', payload: parmas });
  }

  handleDelete = (rows) => {
    const { dispatch } = this.props;
    const params = rows.map(item => (`${item.certificate_id}-${item.staff_sn}`));
    dispatch({
      type: 'point/deleteCertificateStaff',
      payload: { keys: params },
    });
  }

  makeStaffColumns = () => {
    const { brand, department, certificate } = this.props;
    const status = [
      { value: 1, text: '试用期' },
      { value: 2, text: '在职' },
      { value: 3, text: '停薪留职' },
      { value: -1, text: '离职' },
      { value: -2, text: '自动离职' },
      { value: -3, text: '开除' },
      { value: -4, text: '劝退' },
    ];
    const columns = [
      {
        title: '编号',
        dataIndex: 'staff_sn',
        searcher: true,
      },
      {
        title: '员工',
        dataIndex: 'realname',
        searcher: true,
      },
      {
        title: '证书',
        dataIndex: 'certificate_id',
        filters: certificate.map(item => ({ text: item.name, value: item.id })),
        render: (value) => {
          const { name } = certificate.find(item => item.id === value);
          return name;
        },
      }, {
        title: '分值',
        dataIndex: 'point',
        render: (_, record) => {
          const { point } = certificate.find(item => item.id === record.certificate_id);
          return point;
        },
      },
      {
        title: '品牌',
        align: 'center',
        dataIndex: 'brand_id',
        filters: brand.map(item => ({ text: item.name, value: item.id })),
        render: (_, record) => {
          return record.brand.name || '';
        },
      }, {
        title: '职位',
        dataIndex: 'position_name',
        searcher: true,
      },
      {
        title: '部门',
        dataIndex: 'department_id',
        treeFilters: {
          title: 'full_name',
          value: 'id',
          parentId: 'parent_id',
          data: department,
        },
        render: (_, record) => {
          return record.department.full_name || '';
        },
      },
      {
        title: '状态',
        dataIndex: 'status_id',
        filters: status,
        render: (_, record) => {
          return record.status.name || '';
        },
      },
    ];
    if (checkAuthority(166)) {
      columns.push(
        {
          title: '操作',
          render: (rowData) => {
            return (
              <Fragment>
                <a onClick={() => this.handleDelete([rowData])}>删除</a>
              </Fragment>
            );
          },
        }
      );
    }
    return columns;
  }


  makeMultiOperator = () => {
    const multiOperator = [];
    if (checkAuthority(166)) {
      multiOperator.push({ text: '批量删除', action: selectedRows => this.handleDelete(selectedRows) });
    }
    return multiOperator;
  }

  render() {
    const {
      certificateStaff,
      csLoading,
      dLoading,
      bLoading,
      extraOperator,
      deleteLoaing,
      certificateLoading,
    } = this.props;
    let staff = [];
    // if (Object.keys(certificateStaff).length) {
    // staff = certificateStaff.data.map(item => ({ ...item, position_name: item.position.name }));
    // }
    if (certificateStaff.length) {
      staff = certificateStaff.map(item => ({ ...item, position_name: item.position.name }));
    }
    const loading = csLoading || dLoading || bLoading || certificateLoading || deleteLoaing;
    return (
      <React.Fragment>
        <OATable
          loading={loading}
          columns={this.makeStaffColumns()}
          data={staff}
          rowKey={record => (`${record.staff_sn}-${record.certificate_id}`)}
          fetchDataSource={this.fetchStaffDataSource}
          multiOperator={this.makeMultiOperator()}
          extraOperator={extraOperator()}
          scroll={{ x: 300 }}
        />
      </React.Fragment>
    );
  }
}
