import React, { PureComponent, Fragment } from 'react';
import { Tabs, Button, Divider } from 'antd';
import XLSX from 'xlsx';
import OATable from '../../../components/OATable';
import BigLove from './form';
import Details from './details';
import PushLog from './logpush';
import {
  getFiltersData,
  findRenderKey,
  checkAuthority,
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
    panes: [],
    activeKey: '1',
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRows, selectedRowKeys });
  }

  pushLog = () => {
    const { panes } = this.state;
    if (JSON.stringify(panes) !== JSON.stringify([{ title: '补充推送', key: '2' }])) {
      panes.push({ title: '补充推送', key: '2' });
    }
    this.setState({ panes: [...panes], activeKey: '2' });
  }

  tabsChange = (activeKey) => {
    this.setState({ activeKey });
  }

  remove = () => {
    this.setState({ panes: [], activeKey: '1' });
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
        render: key => OATable.renderEllipsis(findRenderKey(department, key).full_name, true),
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
        render: key => OATable.renderEllipsis(key, true),
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
        render: key => (key ? '已支付' : '未支付'),
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
              {checkAuthority(204) && <Divider type="vertical" />}
              {checkAuthority(204) && <a onClick={() => this.handleEdit(rowData)}>编辑</a>}
              {checkAuthority(203) && <Divider type="vertical" />}
              {checkAuthority(203) &&
                <a onClick={() => this.paychange(rowData.id, payOrRefunder)}>{payOrRefunder}</a>}
              {checkAuthority(202) && <Divider type="vertical" />}
              {checkAuthority(202) && <a onClick={() => deleted(rowData.id)}>删除</a>}
            </Fragment>
          );
        },
      },
    ];
    return columns;
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

  xlsExportExcel = () => {
    const groupheaders = [
      '大爱名称',
      '能推送的群',
    ];
    const { rule, pushgroup } = this.props;
    const rulename = rule.map(item => item.name);
    const groupname = pushgroup.map(item => item.flock_name);
    const glenth = groupname.length;
    const rlenth = rulename.length;
    const sdata = [];
    if (rlenth > glenth) {
      for (let i = 0; i < rlenth; i += 1) {
        const midkey = [rulename[i], groupname[i]];
        sdata.push(midkey);
      }
    } else {
      for (let i = 0; i < glenth; i += 1) {
        const midkey = [rulename[i], groupname[i]];
        sdata.push(midkey);
      }
    }
    const headers = [
      '员工姓名',
      '开单日期',
      '大爱名称',
      '违纪时间',
      '开单人编号',
      '开单人姓名',
      '是否付款',
      '付款时间',
      '备注',
      '推送的群',
      '同步积分制',
    ];
    const data = [[
      '例：张三（被大爱姓名）',
      '例：2018-01-01（开单时间）',
      '例：迟到30分钟内（制度名称全写）',
      '例：2018-01-01',
      '例：100000（开单人编号）',
      '例：李四',
      '例：0（0：表示没有付款，1：表示已经付款）',
      '例：2018-01-01（没有付款这里为空）',
      '默认为空',
      '例：喜歌实业重要通知群',
      '默认不同步，1:同步',
    ],
    ];
    const workbook = XLSX.utils.book_new();
    sdata.unshift(groupheaders);
    data.unshift(headers);
    const fuzhuSheet = XLSX.utils.aoa_to_sheet(sdata);
    XLSX.utils.book_append_sheet(workbook, fuzhuSheet, '辅助表');
    const errorSheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, errorSheet, '主表');
    XLSX.writeFile(workbook, '大爱模板.xlsx');
  }

  render() {
    const { finelog, fetchFineLog, loading, department, brand, pushgroup } = this.props;
    const { detailsVisible,
      visible,
      initialValue,
      selectedRowKeys,
      selectedRows,
      panes,
      activeKey } = this.state;
    let excelExport = null;
    const extra = [];
    extra.push(
      checkAuthority(200) && (
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
          key="pushLog"
          type="primary"
          icon="mail"
          onClick={() => {
            this.pushLog();
          }}
        >
          补充推送
        </Button>
      ),
      (
        <Button
          key="download-temp"
          icon="cloud-download"
        >
          <a onClick={() => this.xlsExportExcel()} style={{ color: 'rgba(0, 0, 0, 0.65)', marginLeft: 5 }}>下载模板</a>
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
          type="editable-card"
          hideAdd
          activeKey={activeKey}
          onChange={this.tabsChange}
          onEdit={this.onEdit}
        >
          <TabPane closable={false} key="1" tab="大爱记录" >
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
              multiOperator={checkAuthority(203) && multiOperator}
              excelInto={checkAuthority(201) && excelInto}
              excelExport={checkAuthority(205) && excelExport}
            />
          </TabPane>
          {panes.map(pane => (
            <TabPane tab={pane.title} key={pane.key} >
              <PushLog
                finelog={finelog}
                fetchFineLog={fetchFineLog}
                loading={loading}
                department={department}
                brand={brand}
              />
            </TabPane>
          ))
          }
        </Tabs>
        <BigLove
          visible={visible}
          initialValue={initialValue}
          onCancel={this.handleModalVisible}
          pushgroup={pushgroup}
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
