/**
 * Created by Administrator on 2018/4/15.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Badge, Tooltip, Icon, Divider } from 'antd';
import OATable from '../../../../components/OATable';
import BespokeInfo from './bespokeInfo';

const statusFilters = [
  { value: 1, text: '可撤销' },
  { value: 2, text: '已撤销' },
  { value: 0, text: '锁定' },
];

@connect(({ staffs, loading }) => ({
  list: staffs.staffBespokeDetails,
  loading: loading.effects['staffs/fetchBespokeStaff'] || loading.effects['staffs/deleteBespokeStaff'],
}))
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.id = props.staffSn;
    this.state = {
      visible: false,
      initialValue: {},
    };
  }

  columns = [
    {
      title: '执行日期',
      dataIndex: 'operate_at',
    },
    {
      align: 'center',
      searcher: true,
      title: '操作人',
      dataIndex: 'admin.realname',
    },
    {
      title: '操作时间',
      dataIndex: 'updated_at',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: statusFilters,
      render: (key) => {
        let status = '';
        if (key === 2) {
          status = <Badge status="default" text="已撤销" />;
        } else if (key === 0) {
          status = (
            <Tooltip title="请先撤销上一条数据" placement="topLeft" arrowPointAtCenter>
              <Badge status="warning" text="锁定" />&nbsp;<Icon type="question-circle" />
            </Tooltip>
          );
        } else if (key === 1) {
          status = <Badge status="success" text="可撤销" />;
        }
        return status;
      },
    },
    {
      title: '操作',
      render: (record) => {
        return (
          <React.Fragment>
            {
              record.status === 1 ? (
                <React.Fragment>
                  <a onClick={() => this.handleCancel(record.id)}>撤消</a>
                  <Divider type="vertical" />
                </React.Fragment>
              ) : ''
            }
            <a onClick={() => this.showChanges(record)}>查看</a>
          </React.Fragment>
        );
      },
    },
  ]

  showChanges = (record) => {
    this.setState({ visible: true, initialValue: record });
  }

  handleCancel = (id) => {
    const { dispatch, staffSn } = this.props;
    dispatch({ type: 'staffs/deleteBespokeStaff', payload: { id, staffSn } });
  }

  fetch = () => {
    const { dispatch, staffSn } = this.props;
    this.id = staffSn;
    dispatch({ type: 'staffs/fetchBespokeStaff', payload: { id: this.id } });
  }

  render() {
    const { list, loading } = this.props;
    const { visible, initialValue } = this.state;
    const data = list[this.id] || [];
    return (
      <React.Fragment>
        <OATable
          data={data}
          loading={loading}
          columns={this.columns}
          fetchDataSource={this.fetch}
        />
        <BespokeInfo
          visible={visible}
          initialValue={initialValue}
          onClose={() => {
            this.setState({
              initialValue: {},
              visible: false,
            });
          }}
        />
      </React.Fragment>
    );
  }
}
