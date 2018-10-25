import React from 'react';
import XLSX from 'xlsx';
import { Row, Col, Card, Radio, Select, Input, message } from 'antd';
import store from './store/store';
import OATable from '../../../components/OATable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const { Option } = Select;
const InputGroup = Input.Group;

const status = [
  { value: '0', text: '运行中' },
  { value: '1', text: '结束' },
  { value: '-1', text: '驳回' },
  { value: '-2', text: '撤回' },
];

@store()
export default class extends React.PureComponent {
  state = {
    type: '1',
    id: undefined,
    category: undefined,
  }

  columns = [
    {
      sorter: true,
      title: '编号',
      searcher: true,
      dataIndex: 'id',
    },
    {
      title: '名称',
      searcher: true,
      dataIndex: 'name',
    },
    {
      sorter: true,
      title: '操作时间',
      dataIndex: 'end_at',
    },
    {
      sorter: true,
      title: '发起时间',
      dataIndex: 'created_at',
    },
    {
      title: '状态',
      filters: status,
      dataIndex: 'status',
      render: key => OATable.findRenderKey(status, key, 'value').text,
    },
    {
      title: '发起人',
      searcher: true,
      dataIndex: 'creator_name',
    },
  ]

  handleChange = (name) => {
    return (e) => {
      const value = (e.target || {}).value || e;
      const state = { ...this.state };
      if (name === 'type') {
        state.id = undefined;
        state.category = undefined;
      } else if (name === 'category') {
        state.id = undefined;
      }
      this.setState({ ...state, [name]: value });
    };
  }

  exportSuccess = ({ headers, data }) => {
    if (!data.length) {
      message.error('暂无流程运行记录!');
      return;
    }
    const workbook = XLSX.utils.book_new();
    const dataExcel = [...data];
    dataExcel.unshift(headers);
    const errorSheet = XLSX.utils.aoa_to_sheet(dataExcel);
    XLSX.utils.book_append_sheet(workbook, errorSheet);
    XLSX.writeFile(workbook, '流程运行记录.xlsx');
  }

  render() {
    const { type, category, id } = this.state;
    const { fetchDataSource, flowRunLog, flowType, formType, flow, form, loading } = this.props;
    let cateData = [];
    let filterData = [];
    const filters = {
      flow_id: undefined,
      form_id: undefined,
      form_type_id: undefined,
      flow_type_id: undefined,
    };
    const filterExtra = Object.keys(this.state)
      .filter(key => this.state[key]).length === 3;
    if (type === '1') {
      cateData = flowType;
      if (filterExtra) filters.flow_id = [id];
      filterData = (category && flow.filter(item => category === `${item.flow_type_id}`)) || flow;
    } else {
      cateData = formType;
      if (filterExtra) filters.form_id = [id];
      filterData = (category && form.filter(item => category === `${item.form_type_id}`)) || form;
    }
    const excelExport = {
      fileName: '流程运行记录',
      actionType: 'workflow/flowRunLogExport',
    };
    return (
      <PageHeaderLayout>
        <Card bordered={false} style={{ minHeight: 400 }}>
          <Row>
            <Col>
              <Radio.Group
                defaultValue={type}
                buttonStyle="solid"
                onChange={this.handleChange('type')}
              >
                <Radio.Button value="1">流程</Radio.Button>
                <Radio.Button value="2">表单</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
          <Row style={{ marginTop: 10, marginBottom: 10 }}>
            <Col>
              <InputGroup compact>
                <Select
                  value={category}
                  placeholder="分类"
                  style={{ width: 200, maxHeight: 400 }}
                  onChange={this.handleChange('category')}
                >
                  <Option value="">----请选择----</Option>
                  {cateData.map(item => (
                    <Option key={item.id}>{item.name}</Option>
                  ))}
                </Select>
                <Select
                  value={id}
                  placeholder="筛选"
                  style={{ width: 200, maxHeight: 400 }}
                  onChange={this.handleChange('id')}
                >
                  <Option value="">----请选择----</Option>
                  {filterData.map(item => (
                    <Option key={item.id}>{item.name}</Option>
                  ))}
                </Select>
              </InputGroup>
            </Col>
          </Row>
          <div style={{ display: filterExtra ? 'block' : 'none' }}>
            <OATable
              serverSide
              loading={loading}
              filters={filters}
              columns={this.columns}
              excelExport={excelExport}
              total={(filterExtra && flowRunLog.total) || 0}
              dataSource={(filterExtra && flowRunLog.data) || []}
              fileExportChange={{ onSuccess: this.exportSuccess }}
              fetchDataSource={params => filterExtra && (fetchDataSource(params))}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
