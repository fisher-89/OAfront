/**
 * Created by Administrator on 2018/4/11.
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Tooltip, Icon, Divider, Button, Tag } from 'antd';

import OATable from '../../../../components/OATable';
import OAForm, { OAModal } from '../../../../components/OAForm1';
import { makePositionData } from '../../../../utils/utils';

// const FormItem = OAForm.Item;

@connect(({ violation, brand, department, position, loading }) => ({
  brand: brand.brand,
  brandLoading: loading.models.brand,
  department: department.department,
  departmentLoading: loading.models.department,
  position: position.position,
  positionLoading: loading.models.position,
  fineList: violation.fine,
  fineLoading: loading.effects['violation/fetchFine'],
  regimeList: violation.regime,
  regimeLoading: loading.effects['violation/fetchRegime'],
}))

@OAForm.create()
export default class extends PureComponent {
  state = {
    filterPosition: [],
    visible: false,
    editInfo: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'violation/fetchRegime', payload: {} });
    dispatch({ type: 'brand/fetchBrand' });
    dispatch({ type: 'position/fetchPosition' });
    dispatch({ type: 'department/fetchDepartment', payload: {} });
  }

  fetchFine = (params) => {
    const { dispatch, position } = this.props;
    let { filterPosition } = this.state;
    if (params.filters.brand_id) {
      const brandId = params.filters.brand_id;
      const pushPosition = makePositionData(brandId, brand);
      if (pushPosition.length > 0) {
        filterPosition = pushPosition;
      }
    } else {
      filterPosition = position;
    }
    this.setState({ filterPosition: [...filterPosition] });
    dispatch({ type: 'violation/fetchFine', payload: params });
  };

  makeColums = () => {
    const { regimeList, brand, department, position } = this.props;
    const { filterPosition } = this.state;
    const brandFilters = [];
    if (brand) {
      brand.forEach((item) => {
        brandFilters.push({ text: item.name, value: item.id });
      });
    }
    return [
      {
        title: '编号',
        dataIndex: 'id',
        sorter: true,
        searcher: true,
      },
      {
        title: '员工',
        dataIndex: 'criminal_name',
        searcher: true,
      },
      {
        title: '类型',
        dataIndex: 'rule_id',
        filters:
          regimeList &&
          regimeList.map((item) => {
            return { text: item.name, value: item.id };
          }),
        render: (value) => {
          const rule =
            regimeList && regimeList.filter(item => item.id === value)[0];
          return rule && rule.name;
        },
      },
      {
        title: '违纪时间',
        dateFilters: true,
        dataIndex: 'disciplined_at',
      },
      {
        title: '金额',
        sorter: true,
        align: 'center',
        dataIndex: 'price',
      },
      {
        title: '品牌',
        dataIndex: 'criminal_brand_id',
        filters: brand && brandFilters,
        render: (val) => {
          const data = brand && brand.filter(item => item.id === val)[0];
          return data ? data.name : '';
        },
      },
      {
        title: '职位',
        dataIndex: 'criminal_position_id',
        filters:
          filterPosition &&
          filterPosition.map((item) => {
            return { text: item.name, value: item.id };
          }),
        render: (val) => {
          const data = position && position.filter(item => item.id === val)[0];
          return data ? data.name : '';
        },
      },
      {
        title: '部门',
        dataIndex: 'criminal_department_id',
        treeFilters: {
          title: 'full_name',
          value: 'id',
          parentId: 'parent_id',
          data:
            department &&
            department.map((item) => {
              return {
                ...item,
              };
            }),
        },
        render: (val) => {
          const data =
            department && department.filter(item => item.id === val)[0];
          const fullName = data ? data.full_name : '';
          const content = (
            <Tooltip title={fullName} placement="right">
              {fullName}
            </Tooltip>
          );
          return content;
        },
      },
      {
        title: '店铺代码',
        dataIndex: 'criminal_shop_sn',
        searcher: true,
      },
      {
        title: '开单人',
        dataIndex: 'punisher_name',
        searcher: true,
      },
      {
        title: '支付状态',
        dataIndex: 'has_paid',
        align: 'center',
        sorter: true,
        render: (status) => {
          return status === 1 ? (
            <Tag color="#87d068">已支付</Tag>
          ) : (
            <Tooltip title="支付" key="pay" mouseLeaveDelay={0}>
              <Button icon="to-top" style={{ fontSize: '16px' }} />
            </Tooltip>
          );
        },
      },
      {
        title: '操作',
        render: (rowData) => {
          return (
            <Fragment>
              <Tooltip title="编辑" key="edit" mouseLeaveDelay={0}>
                <a onClick={() => this.handleEdit(rowData)}>
                  <Icon type="form" style={{ fontSize: '18px' }} />
                </a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="删除" key="delete" mouseLeaveDelay={0}>
                <a
                  style={{ color: 'red' }}
                  onClick={() => this.handleDelete([rowData.id])}
                >
                  <Icon type="delete" style={{ fontSize: '18px' }} />
                </a>
              </Tooltip>
            </Fragment>
          );
        },
      },
    ];
  };

  makeExtraOperator = () => {
    return [
      <Tooltip title="添加大爱记录" key="add">
        <a onClick={this.handleModalVisible}>
          <Button type="primary" icon="plus" />
        </a>
      </Tooltip>,
    ];
  };

  handleAddSuccess = () => { };

  handleAddSubmit = () => { };

  handleEdit = (rowData) => {
    this.setState({
      editInfo: rowData,
    }, () => {
      this.handleModalVisible(true);
    });
  }

  handleEditSuccess = () => { };

  handleEditSubmit = () => { };

  handleModalVisible = (flag) => {
    this.setState({
      visible: !!flag,
    });
  }

  handleFinePrice = (value) => {
    this.staffPrice = {
      ...this.staffPrice,
      ...value,
    };
    if (
      Object.keys(this.staffPrice.info).length > 0 &&
      this.staffPrice.rule !== null
    ) {
      return value;
    }
  };

  hanlePay = (ids) => {
    return ids;
  };

  handleDelete = (ids) => {
    return ids;
  };

  render() {
    const { fineLoading, fineList, form } = this.props;

    const {
      editInfo,
      visible,
    } = this.state;

    const rowSelection = {
      getCheckboxProps: (record) => {
        const hasPaid = record.has_paid;
        return { disabled: hasPaid === 1 };
      },
    };
    const multiOperator = [
      {
        text: '支付',
        action: selectedRows => this.hanlePay(selectedRows.map(row => row.id)),
      },
      {
        text: '删除',
        action: selectedRows =>
          this.handleDelete(selectedRows.map(row => row.id)),
      },
    ];
    return (
      <Fragment>
        <OATable
          serverSide
          scroll={{ x: 300 }}
          loading={fineLoading}
          columns={this.makeColums()}
          rowSelection={rowSelection}
          multiOperator={multiOperator}
          data={fineList && fineList.data}
          fetchDataSource={this.fetchFine}
          total={fineList && fineList.total}
          extraOperator={this.makeExtraOperator()}
          excelExport={this.fetchFine}
          excelInto="http://192.168.20.144:8001/api/punish/into"
        />
        <OAModal
          form={form}
          visible={visible}
          title="验证规则"
          onCancel={() => this.handleModalVisible(false)}
          afterClose={() => { this.setState({ editInfo: {} }); }}
          onSubmit={editInfo.id ? this.handleEditSubmit : this.handleAddSubmit}
        />
      </Fragment>
    );
  }
}
