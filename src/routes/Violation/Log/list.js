import React, { PureComponent, Fragment } from 'react';
import { Tabs, Button, Divider } from 'antd';
import OATable from '../../../components/OATable';
import BigLove from './form';
import store from './store/store';


const { TabPane } = Tabs;
@store()
export default class extends PureComponent {
  state = {
    visible: false,
    initialValue: {},
  }
  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  makeColumns = () => {
    const { ruleType, rule, deleted, loading } = this.props;
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        width: 50,
        fixed: 'left',
      },
      {
        title: '姓名',
        dataIndex: 'staff_name',
        width: 60,
        fixed: 'left',
      },
      {
        title: '品牌',
        dataIndex: 'brand_name',
        width: 120,
      },
      {
        title: '部门',
        dataIndex: 'department_name',
        width: 400,
      },
      {
        title: '大爱日期',
        dataIndex: 'violate_at',
        width: 100,
      },
      {
        title: '大爱原因',
        dataIndex: 'rule_id',
        width: 120,
        render: key => OATable.findRenderKey(rule, key).name,
      },
      {
        title: '大爱类型',
        dataIndex: 'type_id',
        loading,
        width: 120,
        render: (_, record) => {
          const type = { ...record.rules }.type_id;
          return OATable.findRenderKey(ruleType, type).name;
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
        dataIndex: 'billing_at',
        width: 100,
      },
      {
        title: '开单人',
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
        width: 120,
        fixed: 'right',
        render: (rowData) => {
          return (
            <Fragment>
              <a onClick={() => this.setState({ visible: true, initialValue: rowData })}>编辑</a>
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
  }

  render() {
    const { finelog, fetchFineLog, loading } = this.props;
    const { visible, initialValue } = this.state;
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
        text: '设置已支付',
        action: (selectedRows) => {
          this.sendPay(selectedRows);
        },
      },
    ];

    const rowSelection = {
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
              data={finelog}
              extraOperator={extra}
              scroll={{ x: 1750 }}
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
      </Fragment>
    );
  }
}
