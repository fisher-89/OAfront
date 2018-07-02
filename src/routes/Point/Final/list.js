import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Divider,
} from 'antd';
import { connect } from 'dva';

import OATable from '../../../components/OATable';
import FinalForm from './form';
import { customerAuthority } from '../../../utils/utils';
@connect(({ point, loading }) => ({
  final: point.final,
  finalLoading: loading.effects['point/fetchFinal'],
  deleteLoaing: loading.effects['point/deleteFinal'],
}))
export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
  }

  fetchFinal = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/fetchFinal', payload: params });
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  handleEdit = (data) => {
    this.setState({
      editInfo: {
        ...data,
        staff: {
          staff_name: data.staff_name,
          staff_sn: data.staff_sn,
        },
      },
    }, () => this.handleModalVisible(true));
  }

  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'point/deleteFinal', payload: { id } });
  }

  makeColumns = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        searcher: true,
      },
      {
        title: '审核人编号',
        dataIndex: 'staff_sn',
        searcher: true,
      },
      {
        title: '审核人姓名',
        dataIndex: 'staff_name',
        searcher: true,
      },
      {
        title: 'A分加分上限',
        dataIndex: 'point_a_awarding_limit',
        rangeFilters: true,
      },
      {
        title: 'A分减分上限',
        dataIndex: 'point_a_deducting_limit',
        rangeFilters: true,
      },
      {
        title: 'B分加分上限',
        dataIndex: 'point_b_awarding_limit',
        rangeFilters: true,
      },
      {
        title: 'B分减分上限',
        dataIndex: 'point_b_deducting_limit',
        rangeFilters: true,
      },
    ];

    if (customerAuthority(154) || customerAuthority(155)) {
      columns.push(
        {
          title: '操作',
          render: (rowData) => {
            return (
              <Fragment>
                {customerAuthority(154) && (
                  <a onClick={() => this.handleEdit(rowData)}>编辑</a>
                )}
                <Divider type="vertical" />
                {customerAuthority(155) && (
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

  makeExtraOperator = () => {
    const extra = [];
    if (customerAuthority(150)) {
      extra.push((
        <Button
          icon="plus"
          key="plus"
          type="primary"
          style={{ marginLeft: '10px' }}
          onClick={() => this.handleModalVisible(true)}
        >
          添加终审人
        </Button>
      ));
    }
    return extra;
  }

  render() {
    const { final, finalLoading, deleteLoaing } = this.props;
    const { visible, editInfo } = this.state;
    return (
      <React.Fragment>
        {
          (customerAuthority(150) || customerAuthority(154)) &&
          (
            <FinalForm
              initialValue={editInfo}
              visible={visible}
              onCancel={() => { this.setState({ editInfo: {} }); }}
              handleVisible={this.handleModalVisible}
            />
          )
        }
        <OATable
          serverSide
          loading={finalLoading || deleteLoaing || false}
          extraOperator={this.makeExtraOperator()}
          columns={this.makeColumns()}
          dataSource={final && final.data}
          total={final && final.total}
          filtered={final && final.filtered}
          fetchDataSource={this.fetchFinal}
        />
      </React.Fragment>
    );
  }
}
