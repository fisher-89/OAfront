import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Divider,
  message,
  Popconfirm,
} from 'antd';
import NoteInfo from './info';
import store from './store/store';
import OATable from '../../../components/OATable';
import { getFiltersData, checkAuthority } from '../../../utils/utils';
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
    const { deleted, brand, staffBrandsAuth, type } = this.props;
    const { editable = [], visible = [] } = staffBrandsAuth;
    const columns = [
      {
        width: 120,
        title: '序号',
        align: 'center',
        dataIndex: 'id',
        sorter: true,
        defaultSortOrder: 'desced',
      },
      {
        width: 240,
        searcher: true,
        title: '标题',
        dataIndex: 'title',
      },
      {
        width: 300,
        align: 'center',
        title: '合作品牌',
        dataIndex: 'brands.brand_id',
        filters: getFiltersData(brand),
        render: (_, record) => OATable.analysisColumn(brand, record.brands, false),
      },
    ];
    const columns1 = [
      {
        // width: 160,
        align: 'center',
        title: '客户姓名',
        searcher: true,
        dataIndex: 'client_name',
      },
    ];
    const columns2 = [
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
          const userInfo = window.user || {};
          if (userInfo.staff_sn !== record.recorder_sn) {
            editAble = true;
          }
          const editStyle = editAble ? { color: '#8e8e8e' } : {};
          const seeStyle = seeAble ? { color: '#8e8e8e' } : {};
          return (
            <Fragment>
              <a
                style={seeStyle}
                onClick={() => {
                  if (seeAble) {
                    message.error('对不起，暂无查看权限');
                    return;
                  }
                  this.setState({
                    initialValue: record,
                    visible: true,
                  });
                }}
              >查看
              </a>
              {checkAuthority(182) && (
                <React.Fragment>
                  <Divider type="vertical" />
                  {editAble ? (
                    <a style={editStyle} onClick={() => message.error('对不起，暂无删除权限')}>删除</a>
                  ) :
                    (
                      <Popconfirm
                        title="是否删除客户的事件?"
                        onConfirm={() => deleted(record.id)}
                      >
                        <a style={editStyle}>删除</a>
                      </Popconfirm>
                    )}
                </React.Fragment>
              )}
            </Fragment>
          );
        },
      },
    ];
    return type ? columns.concat(columns2) : columns.concat(columns1, columns2);
  }

  fetchDataSource = (params) => {
    const { fetchDataSource, clientId } = this.props;
    let { filters } = { ...params };
    filters = clientId ? `client_id=${clientId}` : filters;
    const newParams = {
      ...params,
      filters,
    };
    if (clientId) {
      newParams.clientId = clientId;
    }
    fetchDataSource(newParams);
  }

  render() {
    const { notes, loading, type, clientId } = this.props;
    const { visible, initialValue } = this.state;
    let data = [];
    let total = 0;
    if (type) {
      data = notes[clientId] ? notes[clientId] : [];
      total = notes[clientId] ? notes[clientId].length : 0;
    } else {
      ({ data, total } = notes);
    }
    const extraOperator = [];
    if (checkAuthority(182) && !type) {
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
