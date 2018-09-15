import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Divider,
} from 'antd';
import NoteInfo from './info';
import store from './store/store';
import OATable from '../../../components/OATable';
import { getFiltersData, customerAuthority } from '../../../utils/utils';
@store()
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.user = window.user ? window.user : {};
    this.state = {
      initialValue: {},
      visible: false,
    };
  }

  handleLink = (name, id) => {
    this.props.history.push(`/client/notepad/list/${name}/${id}`);
  }

  makeColumns = () => {
    const { deleted, brand } = this.props;
    const columns = [
      {
        // width: 80,
        title: '序号',
        align: 'center',
        dataIndex: 'id',
        sorter: true,
      },
      {
        // width: 160,
        align: 'center',
        title: '客户姓名',
        searcher: true,
        dataIndex: 'client_name',
      },
      {
        width: 300,
        align: 'center',
        title: '合作品牌',
        dataIndex: 'brands.brand_id',
        filters: getFiltersData(brand),
        render: (_, record) => OATable.analysisColumn(brand, record.brands, false),
      },
      {
        // width: 240,
        searcher: true,
        title: '标题',
        align: 'center',
        dataIndex: 'title',
      },
      {
        // width: 160,
        align: 'center',
        title: '记录人',
        searcher: true,
        dataIndex: 'recorder_name',
      },
      {
        title: '操作',
        render: (_, record) => {
          const { id } = record;
          let color;
          const clickAble = this.user.staff_sn === record.recorder_sn;
          if (!clickAble) {
            color = '#8e8e8e';
          }
          const style = color ? { color } : {};
          return (
            <Fragment>
              <a onClick={() => {
                this.setState({
                  initialValue: record,
                  visible: true,
                });
              }}
              >查看
              </a>
              {customerAuthority(182) && (
                <React.Fragment>
                  <Divider type="vertical" />
                  <a style={style} onClick={() => { if (clickAble) deleted(id); }}>删除</a>
                </React.Fragment>
              )}
            </Fragment>
          );
        },
      },
    ];
    return columns;
  }

  fetchDataSource = (params) => {
    const { fetchDataSource, customerId } = this.props;
    let { filters } = { ...params };
    filters = customerId ? `${filters};client_id=${customerId}` : filters;
    const newParams = {
      ...params,
      filters,
    };
    fetchDataSource(newParams);
  }

  render() {
    const { notes, loading } = this.props;
    const { visible, initialValue } = this.state;
    const extraOperator = [];
    if (customerAuthority(182)) {
      extraOperator.push((
        <Button
          type="primary"
          icon="plus"
          key="plus"
          onClick={() => {
            this.props.history.push('/client/notepad/list/add');
          }}
        >
          新建录入
        </Button>
      ));
    }
    return (
      <React.Fragment>
        <NoteInfo
          visible={visible}
          brand={this.props.brand}
          initialValue={initialValue}
          onClose={() => {
            this.setState({
              initialValue: {},
              visible: false,
            });
          }}
        />
        <OATable
          serverSide
          data={notes.data}
          loading={loading}
          total={notes.total}
          columns={this.makeColumns()}
          fetchDataSource={this.fetchDataSource}
          extraOperator={extraOperator}
        />
      </React.Fragment>
    );
  }
}
