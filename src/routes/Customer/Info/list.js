import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button,
  Divider,
  message,
  Popover,
  Popconfirm,
} from 'antd';
import moment from 'moment';
import { sexOption } from './add';
import MoreSearch from './moreSearch';
import store from './store/store';
import district from '../../../assets/district';
import { nation } from '../../../assets/nation';
import OATable from '../../../components/OATable';
import { province } from '../../../assets/province';
import { customerStatus } from '../../../assets/customer';
import { getFiltersData, customerAuthority, analysisData } from '../../../utils/utils';


@connect(({ customer }) => ({ customer: customer.customer }))
@store()
export default class extends PureComponent {
  state = {
    visible: false,
    filters: {},
  }

  searchParamsFilter = {}

  moreSearchChange = (filters) => {
    this.setState({ filters: { ...filters }, visible: false });
  }

  makeColumns = () => {
    const { source, tags, brands, deleted, staffBrandsAuth } = this.props;
    const { editable = [], visible = [] } = staffBrandsAuth;
    const onClick = (name, id) => this.props.history.push(`/client/customer/list/${name}/${id}`);
    const columns = [
      {
        width: 80,
        title: '序号',
        align: 'center',
        dataIndex: 'id',
        sorter: true,
      },
      {
        align: 'center',
        title: '客户姓名',
        dataIndex: 'name',
        searcher: true,
      },
      {
        align: 'center',
        title: '电话',
        dataIndex: 'mobile',
        searcher: true,
      },
      {
        align: 'center',
        title: '客户来源',
        dataIndex: 'source_id',
        filters: getFiltersData(source),
        render: key => OATable.findRenderKey(source, key).name,
      },
      {
        align: 'center',
        title: '客户状态',
        // width: 120,
        dataIndex: 'status',
        filters: getFiltersData(customerStatus),
        render: key => OATable.findRenderKey(customerStatus, key).name,
      },
      {
        width: 300,
        align: 'center',
        title: '合作品牌',
        filters: getFiltersData(brands),
        dataIndex: 'brands.brand_id',
        render: (_, record) => OATable.analysisColumn(brands, record.brands, 'brand_id'),
      },
      {
        hidden: true,
        title: '合作品牌',
        dataIndex: 'brands',
        render: (_, record) => analysisData(brands, record.brands, 'brand_id').join('、'),
      },
      {
        // width: 120,
        align: 'center',
        title: '初次合作时间',
        dataIndex: 'first_cooperation_at',
        sorter: true,
        render: time => (time ? moment(time).format('YYYY-MM-DD') : ''),
      },
      {
        // width: 160,
        title: '维护人',
        align: 'center',
        dataIndex: 'vindicator_name',
        searcher: true,
      },
      {
        width: 300,
        title: '标签',
        align: 'center',
        dataIndex: 'tags.tag_id',
        filters: tags.map(tag => ({ text: tag.name, value: tag.id })),
        render: (_, record) => OATable.analysisColumn(tags, record.tags, 'tag_id'),
      },
      {
        hidden: true,
        title: '标签',
        align: 'center',
        dataIndex: 'tags',
        render: (_, record) => analysisData(tags, record.tags, 'tag_id').join('、'),
      },
      {
        title: '操作',
        render: (_, rowData) => {
          let editAble = true;
          let seeAble = true;
          rowData.brands.forEach((item) => {
            if (editable.indexOf(item.brand_id) !== -1) {
              editAble = false;
            }
            if (visible.indexOf(item.brand_id) !== -1) {
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
                  if (!seeAble) {
                    onClick('info', rowData.id);
                  } else {
                    message.error('对不起，暂无客户的查看权限');
                  }
                }}
              >查看
              </a>
              {customerAuthority(187) && (
                <React.Fragment>
                  <Divider type="vertical" />
                  {editAble ? (
                    <a style={editStyle} onClick={() => message.error('对不起，暂无客户的修改权限')}>编辑</a>
                  ) :
                    (
                      <a style={editStyle} onClick={() => onClick('edit', rowData.id)}>编辑</a>
                    )}
                </React.Fragment>
              )}
              {customerAuthority(178) && (
                <React.Fragment>
                  <Divider type="vertical" />
                  {editAble ? (
                    <a style={editStyle} onClick={() => message.error('对不起，暂无删除权限')}>删除</a>
                  ) :
                    (
                      <Popconfirm
                        title="是否删除客户及相关事件?"
                        onConfirm={() => deleted(rowData.id)}
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
    const addressFilter = getFiltersData(district);
    const filterColumns = [
      {
        hidden: true,
        title: '性别',
        dataIndex: 'gender',
      },
      {
        hidden: true,
        title: '微信',
        searcher: true,
        dataIndex: 'wechat',
      },
      {
        hidden: true,
        title: '民族',
        searcher: true,
        dataIndex: 'nation',
      }, {
        hidden: true,
        title: '籍贯',
        searcher: true,
        dataIndex: 'native_place',
      }, {
        hidden: true,
        title: '备注',
        searcher: true,
        dataIndex: 'remark',
      },
      {
        hidden: true,
        title: '现住地址-省',
        dataIndex: 'province_id',
        filters: addressFilter,
        render: key => OATable.findRenderKey(addressFilter, key, 'value').text,
      },
      {
        hidden: true,
        title: '现住地址-市',
        dataIndex: 'city_id',
        filters: addressFilter,
        render: key => OATable.findRenderKey(addressFilter, key, 'value').text,
      },
      {
        hidden: true,
        title: '现住地址-区',
        dataIndex: 'county_id',
        filters: addressFilter,
        render: key => OATable.findRenderKey(addressFilter, key, 'value').text,
      },
      {
        hidden: true,
        title: '身份证号码',
        dataIndex: 'id_card_number',
      },
    ];
    return columns.concat(filterColumns);
  }


  render() {
    const { visible, filters } = this.state;
    const extraOperator = [];
    let styleAble = false;
    Object.keys(filters).forEach((filter) => {
      if (filters[filter]) {
        styleAble = true;
      }
    });
    const btnStyle = styleAble ? { color: '#40a9ff', borderColor: '#40a9ff' } : {};
    extraOperator.push((
      <Popover
        key="searchPop"
        visible={visible}
        trigger="click"
        placement="bottomLeft"
        content={
          <MoreSearch
            nation={nation}
            province={province}
            sexOption={sexOption}
            moreChange={this.moreSearchChange}
          />
        }
      >
        <Button
          icon="search"
          style={btnStyle}
          onClick={() => {
            this.setState({ visible: !visible });
          }}
        >更多筛选
        </Button>
      </Popover>
    ));
    if (customerAuthority(188)) {
      extraOperator.push((
        <Button
          type="primary"
          icon="plus"
          key="plus"
          onClick={() => {
            this.props.history.push('/client/customer/list/add');
          }}
        >
          添加客户
        </Button>
      ));
    }
    let excelExport = null;
    if (customerAuthority(192)) {
      extraOperator.push((
        <Button
          key="download-temp"
          icon="cloud-download"
        >
          <a href="/api/crm/clients/example" style={{ color: 'rgba(0, 0, 0, 0.65)', marginLeft: 5 }}>下载模板</a>
        </Button>
      ));
      excelExport = { actionType: 'customer/downloadExcelCustomer', fileName: '客户资料.xlsx' };
    }
    const excelInto = customerAuthority(192) ? '/api/crm/clients/import' : false;
    const { loading, customer, fetchDataSource } = this.props;
    return (
      <React.Fragment>
        <OATable
          serverSide
          filters={filters}
          loading={loading}
          data={customer.data}
          excelInto={excelInto}
          total={customer.total}
          excelExport={excelExport}
          columns={this.makeColumns()}
          extraOperator={extraOperator}
          fetchDataSource={fetchDataSource}
        />
      </React.Fragment>

    );
  }
}
