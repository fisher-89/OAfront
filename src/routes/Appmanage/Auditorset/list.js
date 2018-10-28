import React, { PureComponent, Fragment } from 'react';
import { Col, Row, Divider, Button } from 'antd';
import { connect } from 'dva';
import OATable from '../../../components/OATable';
import OAModal from './form';

@connect(({ appmanage, loading }) => ({
  reimdepartment: appmanage.reimdepartment,
  fetchLoading: loading.effects['appmanage/fetchReimDepartment'],
  deleteLoading: loading.effects['appmanage/deleteReimDepartment'],
}))

export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
  }
  fetchreimdepartment = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appmanage/fetchReimDepartment',
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
    dispatch({ type: 'appmanage/deleteReimDepartment', payload: { id } });
  }
  makeColumns = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        sorter: (a, b) => a.id - b.id,
        defaultSortOrder: 'ascend',
      },
      {
        title: '资金归属',
        searcher: true,
        align: 'left',
        dataIndex: 'name',
      }, {
        title: '品牌副总',
        align: 'left',
        dataIndex: 'manager_sn',
        render: (_, record) => {
          const name = record.manager_name;
          return name;
        },
      }, {
        title: '出纳',
        align: 'left',
        dataIndex: 'cashier_sn',
        render: (_, record) => {
          const name = record.cashier_name;
          return name;
        },
      }, {
        title: '财务审核人',
        align: 'center',
        dataIndex: 'auditor',
        render: (_, record) => {
          const name = record.auditor.map(item => item.auditor_realname);
          return name.join('|');
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
  }
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
          添加审核人
      </Button>
    ));
    return extra;
  }
  render() {
    const { reimdepartment, fetchLoading, deleteLoading } = this.props;
    const { visible, editInfo } = this.state;
    return (
      <Fragment>
        <Row>
          <Col span={36}>
            <OATable
              loading={deleteLoading || fetchLoading || false}
              data={reimdepartment}
              columns={this.makeColumns()}
              extraOperator={this.makeExtraOperator()}
              fetchDataSource={this.fetchreimdepartment}
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
