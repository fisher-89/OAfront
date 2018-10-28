import React, { PureComponent, Fragment } from 'react';
import { Divider, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import { getFiltersData } from '../../../utils/utils';
import OATable from '../../../components/OATable';
import OAModal from './form';


@connect(({ appmanage, department, loading }) => ({
  approvers: appmanage.approver,
  department: department.department,
  reimdepartment: appmanage.reimdepartment,
  fetchApproversLoading: loading.effects['appmanage/fetchApprovers'],
  fetchDepartmentLoading: loading.effects['department/fetchDepartment'],
  fetchReimdepartmentLoading: loading.effects['appmanage/fetchReimDepartment'],
  deleteLoading: loading.effects['appmanage/deleteApprovers'],
}))

export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'department/fetchDepartment',
      payload: {},
    });
    dispatch({
      type: 'appmanage/fetchReimDepartment',
      payload: {},
    });
  }

  fetchApprovers = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appmanage/fetchApprovers',
      payload: params,
    });
  }

  handleEdit = (data) => {
    this.setState({ editInfo: data }, () => this.handleModalVisible(true));
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'appmanage/deleteApprovers', payload: { id } });
  }

  makeColumns = () => {
    const { department, reimdepartment } = this.props;
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        searcher: true,
        sorter: (a, b) => a.id - b.id,
        defaultSortOrder: 'ascend',
      },
      {
        title: '部门',
        align: 'center',
        dataIndex: 'department_id',
        filters: getFiltersData(department),
        render: key => OATable.findRenderKey(department, key).name,
      }, {
        title: '资金归属',
        align: 'center',
        dataIndex: 'reim_department_id',
        render: key => OATable.findRenderKey(reimdepartment, key).name,
      }, {
        title: '一级审批人',
        align: 'center',
        dataIndex: 'approver1',
        render: (_, record) => {
          const name = record.approver1.map(item => item.realname);
          return name.join(',');
        },
      }, {
        title: '二级审批人',
        align: 'center',
        dataIndex: 'approver2',
        render: (_, record) => {
          const name = record.approver2.map(item => item.realname);
          return name.join(',');
        },
      }, {
        title: '三级审批人',
        align: 'center',
        dataIndex: 'approver3',
        render: (_, record) => {
          const name = record.approver3.map(item => item.realname);
          return name.join(',');
        },
      }, {
        title: '操作',
        align: 'center',
        render: (rowData) => {
          return (
            <Fragment>
              <a onClick={() => this.handleEdit(rowData)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleDelete(rowData.id)}>删除</a>
            </Fragment>
          );
        },
      }];
    return columns;
  };

  makeExtraOperator = () => {
    const extra = [];
    extra.push((
      <Button
        icon="plus"
        key="plus"
        type="primary"
        style={{ marginLeft: '10px' }}
        onClick={() => this.handleModalVisible(true)}
      >
          添加审批人
      </Button>
    ));
    return extra;
  }

  render() {
    const { visible, editInfo } = this.state;
    const {
      approvers,
      fetchApproversLoading,
      fetchDepartmentLoading,
      fetchReimdepartmentLoading,
      deleteLoading,
    } = this.props;
    return (
      <Fragment>
        <Row>
          <Col span={36}>
            <OATable
              data={approvers}
              extraOperator={this.makeExtraOperator()}
              columns={this.makeColumns()}
              fetchDataSource={this.fetchApprovers}
              loading={
                       fetchApproversLoading ||
                       fetchDepartmentLoading ||
                       fetchReimdepartmentLoading ||
                       deleteLoading ||
                      false
                     }
            />
          </Col>
        </Row>
        <OAModal
          initialValue={editInfo}
          visible={visible}
          onCancel={() => { this.setState({ editInfo: {} }); }}
          handleVisible={this.handleModalVisible}
        />
      </Fragment>
    );
  }
}
