import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Divider,
} from 'antd';
import { connect } from 'dva';

import OATable from '../../../components/OATable';
import FinalForm from './form';
import { customerAuthority } from '../../../utils/utils';
@connect(({ position, loading }) => ({
  position: position.position,
  fLoading: loading.effects['position/fetchPosition'],
  dLoaing: loading.effects['position/deletePosition'],
}))
export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
  }

  fetchPosition = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'position/fetchPosition', payload: params });
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  handleEdit = (data) => {
    this.setState({ editInfo: data }, () => this.handleModalVisible(true));
  }

  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'position/deletePosition', payload: { id } });
  }

  makeColumns = () => {
    const isPublic = ['否', '是'];
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        searcher: true,
      },
      {
        title: '职位名称',
        dataIndex: 'name',
        searcher: true,
      },
      {
        title: '职级',
        dataIndex: 'level',
        searcher: true,
      },
      {
        title: '是否共享',
        dataIndex: 'is_public',
        filters: isPublic.map((item, i) => {
          return { text: item, value: i };
        }),
        render: val => isPublic[val],
      },
      {
        title: '关联品牌',
        dataIndex: 'brands',
        render: (val) => {
          let brandStr = '';
          val.forEach((item) => {
            brandStr += `${item.name},`;
          });
          return brandStr.slice(0, -1);
        },
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
          添加职位
        </Button>
      ));
    }
    return extra;
  }

  render() {
    const { position, fLoading, dLoading } = this.props;
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
          loading={fLoading || dLoading || false}
          extraOperator={this.makeExtraOperator()}
          columns={this.makeColumns()}
          dataSource={position && position.data}
          total={position && position.total}
          filtered={position && position.filtered}
          fetchDataSource={this.fetchPosition}
        />
      </React.Fragment>
    );
  }
}
