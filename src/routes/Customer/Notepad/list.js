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
    this.state = {
      initialValue: {},
      visible: false,
    };
  }

  componentWillMount() {
    const { type } = this.props;
    if (type) {
      this.fetchDataSource();
    }
  }


  handleLink = (name, id) => {
    this.props.history.push(`/client/notepad/list/${name}/${id}`);
  }

  makeColumns = () => {
    const { deleted, brand, staffBrandsAuth } = this.props;
    const { editable = [], visible = [] } = staffBrandsAuth;
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
          let editAble = true;
          let seeAble = true;
          record.brands.forEach((item) => {
            if (editable.indexOf(item) !== -1) {
              editAble = false;
            }
            if (visible.indexOf(item) !== -1) {
              seeAble = false;
            }
          });
          const editStyle = editAble ? { color: '#8e8e8e' } : {};
          const seeStyle = seeAble ? { color: '#8e8e8e' } : {};
          return (
            <Fragment>
              <a
                style={seeStyle}
                onClick={() => {
                  if (seeAble) {
                    message.error('对不起，暂无客户的查看权限');
                    return;
                  }
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
                  <a
                    style={editStyle}
                    onClick={() => {
                      if (editStyle) {
                        message.error('对不起，暂无客户的修改权限');
                        return;
                      }
                      deleted(id);
                    }}
                  >删除
                  </a>
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
    const { fetchDataSource, clientId } = this.props;
    let { filters } = { ...params };
    filters = clientId ? `client_id=${clientId}` : filters;
    const newParams = {
      ...params,
      filters,
    };
    fetchDataSource(newParams);
  }

  render() {
    const { notes, loading, type } = this.props;
    const { visible, initialValue } = this.state;
    let data = [];
    let total = 0;
    if (type) {
      data = Array.isArray(notes) ? notes : [];
      total = Array.isArray(notes) ? notes.length : 0;
    } else {
      ({ data, total } = notes);
    }
    const extraOperator = [];
    if (customerAuthority(182) && !type) {
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
          data={data}
          total={total}
          loading={loading}
          columns={this.makeColumns()}
          extraOperator={extraOperator}
          serverSide={type === undefined}
          fetchDataSource={this.fetchDataSource}
        />
      </React.Fragment>
    );
  }
}
