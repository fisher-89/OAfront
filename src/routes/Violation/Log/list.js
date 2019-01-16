import React, { PureComponent, Fragment } from 'react';
import { Tabs, Button, Divider } from 'antd';
import OATable from '../../../components/OATable';
import BigLove from './form';
import Details from './details';
import {
  getFiltersData,
  findRenderKey,
} from '../../../utils/utils';
import store from './store/store';

const { TabPane } = Tabs;
@store()
export default class extends PureComponent {
  state = {
    detailsVisible: false,
    visible: false,
    initialValue: {},
    selectedRows: [],
    selectedRowKeys: [],
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows, selectedRowKeys });
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  handleDetailsVisible = (flag) => {
    this.setState({ detailsVisible: !!flag });
  }

  handleEdit = (data) => {
    const now = new Date();
    const time = now.getTime();
    this.setState({
      initialValue: {
        ...data,
        staff: {
          staff_name: data.staff_name,
          staff_sn: data.staff_sn,
        },
        billing: {
          billing_sn: data.billing_sn,
          billing_name: data.billing_name,
        },
        time,
      },
    }, () => this.handleModalVisible(true));
  }

  makeColumns = () => {
    const { deleted, department, brand } = this.props;
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        width: 50,
        fixed: 'left',
        sorter: (a, b) => a.id - b.id,
        defaultSortOrder: 'ascend',
      },
      {
        title: '姓名',
        dataIndex: 'staff_name',
        searcher: true,
        width: 60,
        fixed: 'left',
      },
      {
        title: '品牌',
        dataIndex: 'brand_id',
        width: 120,
        filters: getFiltersData(brand),
        render: key => OATable.renderEllipsis(findRenderKey(brand, key).name, true),
      },
      {
        title: '部门',
        dataIndex: 'department_id',
        treeFilters: {
          value: 'id',
          title: 'name',
          data: department,
          parentId: 'parent_id',
        },
        width: 285,
        render: key => OATable.findRenderKey(department, key).full_name,
      },
      {
        title: '违纪日期',
        dateFilters: true,
        dataIndex: 'violate_at',
        width: 100,
      },
      {
        title: '大爱原因',
        dataIndex: 'rules.name',
        width: 120,
        exportRender: (record) => {
          const { name } = record.rules;
          return name;
        },
      },
      {
        title: '大爱类型',
        dataIndex: 'rules.rule_types.name',
        width: 105,
        exportRender: (record) => {
          const { name } = record.rules.rule_types;
          return name;
        },
      },
      {
        title: '当月次数',
        dataIndex: 'quantity',
        width: 50,
      },
      {
        title: '大爱金额',
        dataIndex: 'money',
        width: 50,
      },
      {
        title: '分值',
        dataIndex: 'score',
        width: 50,
      },
      {
        title: '支付状态',
        dataIndex: 'has_paid',
        filters: [
          { text: '已支付', value: 1 },
          { text: '未支付', value: 0 },
        ],
        width: 50,
        render: (key) => {
          if (key) {
            return '已支付';
          } else {
            return '未支付';
          }
        },
      },
      {
        title: '开单日期',
        dateFilters: true,
        dataIndex: 'billing_at',
        width: 100,
      },
      {
        title: '开单人',
        searcher: true,
        dataIndex: 'billing_name',
        width: 60,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 300,
      },
      {
        title: '操作',
        width: 180,
        fixed: 'right',
        render: (rowData) => {
          const payOrRefunder = rowData.has_paid ? '退款' : '支付';
          return (
            <Fragment>
              <a onClick={() => this.setState({
                detailsVisible: true, initialValue: rowData,
              })}
              >查看
              </a>
              <Divider type="vertical" />
              <a onClick={() => this.handleEdit(rowData)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.paychange(rowData.id, payOrRefunder)}>{payOrRefunder}</a>
              <Divider type="vertical" />
              <a onClick={() => deleted(rowData.id)}>删除</a>
            </Fragment>
          );
        },
      },
    ];
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
        onClick={() => {
          this.handleModalVisible(true);
          this.setState({ initialValue: {} });
        }}
      >
        新建大爱
      </Button>),
      (
        <Button
          key="download-temp"
          icon="cloud-download"
        >
          <a href="/api/violation/punish/example" style={{ color: 'rgba(0, 0, 0, 0.65)', marginLeft: 5 }}>下载模板</a>
        </Button>
      ),

    );
    return extra;
  }


  sendPay = (payload, onError) => {
    const { payFine } = this.props;
    let selectId = [];
    selectId = payload.map(item => item.id);
    payFine(selectId, onError);
    this.onSelectChange([], []);
  }

  paychange = (id, choice) => {
    const { paymentChange, refund } = this.props;
    if (choice === '支付') {
      paymentChange(id);
    } else if (choice === '退款') {
      refund(id);
    }
  }

  render() {
    const { finelog, fetchFineLog, loading } = this.props;
    const { detailsVisible, visible, initialValue, selectedRowKeys, selectedRows } = this.state;
    let excelExport = null;
    const extra = [];
    extra.push((
      <Button
        icon="plus"
        key="plus"
        type="primary"
        style={{ marginLeft: '10px' }}
        onClick={() => {
          this.handleModalVisible(true);
          this.setState({ initialValue: {} });
        }}
      >
        新建大爱
      </Button>),
      (
        <Button
          key="download-temp"
          icon="cloud-download"
        >
          <a href="/api/violation/punish/example" style={{ color: 'rgba(0, 0, 0, 0.65)', marginLeft: 5 }}>下载模板</a>
        </Button>
      ));


    const excelInto = '/api/violation/punish/import';
    excelExport = { actionType: 'violation/downloadExcelFinLog', fileName: '大爱记录.xlsx' };
    const multiOperator = [
      {
        text: '已支付',
        action: (selectedRowsReal) => {
          this.sendPay(selectedRowsReal);
        },
      },
      {
        text: '清空选择',
        action: () => {
          this.onSelectChange([], []);
        },
      },
    ];

    const rowSelection = {
      selectedRows,
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.has_paid === 1,
      }),
    };

    return (
      <Fragment>
        <Tabs
          type="card"
        >
          <TabPane key="1" tab="大爱记录" >
            <OATable
              loading={loading}
              columns={this.makeColumns()}
              fetchDataSource={fetchFineLog}
              data={finelog.data}
              serverSide
              extraOperator={extra}
              total={finelog.total}
              scroll={{ x: 1685 }}
              rowSelection={rowSelection}
              multiOperator={multiOperator}
              excelInto={excelInto}
              excelExport={excelExport}
            />
          </TabPane>
        </Tabs>
        <BigLove
          visible={visible}
          initialValue={initialValue}
          onCancel={this.handleModalVisible}
        />
        <Details
          visible={detailsVisible}
          initialValue={initialValue}
          onCancel={this.handleDetailsVisible}
          paymentChange={this.paychange}
          finelog={finelog}
        />
      </Fragment>
    );
  }
}
