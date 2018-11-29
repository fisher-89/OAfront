import React from 'react';
import XLSX from 'xlsx';
import { find } from 'lodash';
import { Row, Col, Select, Input, message, Spin, Form, Button, Progress } from 'antd';
import store from './store/store';
import OATable from '../../../components/OATable';
import TagSelect from '../../../components/TagSelect';


const { Option } = Select;
const InputGroup = Input.Group;
const FormItem = Form.Item;

const status = [
  { value: '0', text: '运行中' },
  { value: '1', text: '结束' },
  { value: '-1', text: '驳回' },
  { value: '-2', text: '撤回' },
];

@store()
export default class extends React.PureComponent {
  state = {
    formId: [],
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
      dateFilters: true,
      dataIndex: 'end_at',
    },
    {
      sorter: true,
      title: '发起时间',
      dateFilters: true,
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

  fetchForm = () => {
    const { flowRunFormVersion, flow } = this.props;
    const { id } = this.state;
    const data = id ? find(flow, ['id', parseInt(id, 10)]) : {};
    const formId = id ? [`${data.form_id}`] : [];
    this.setState({ formId }, () => {
      if (id) flowRunFormVersion(id);
    });
  }

  handleChange = (name) => {
    return (e) => {
      const value = e;
      const state = { ...this.state };
      if (name === 'type') {
        state.id = undefined;
        state.category = undefined;
      } else if (name === 'category') {
        state.id = undefined;
      }
      this.setState({ ...state, [name]: value }, this.fetchForm);
    };
  }

  handleSearch = (input, option) => (
    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  )

  handleFormChange = (value) => {
    this.setState({ formId: value });
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

  makeExportButton = () => {
    const { id, formId } = this.state;
    const { exportExcel, exportProgress } = this.props;
    const view = [<Button key="exportButton" icon="download" onClick={() => exportExcel(formId, id)}>导出</Button>];
    if (exportProgress !== null && exportProgress >= 0) {
      view.push(<div key="exportProgress" style={{ width: 150 }}><Progress percent={exportProgress} /></div>);
    } else if (exportProgress === -1) {
      view.push(
        <div key="exportProgress" style={{ width: 150 }}>
          <Progress percent={exportProgress} status="exception" />
        </div>
      );
    }
    return view;
  }

  render() {
    const { category, id, formId } = this.state;
    const {
      flow,
      loading,
      flowType,
      flowRunLog,
      formVersion,
      fetchDataSource,
    } = this.props;
    const cateData = flowType;
    const filters = {
      form_id: formId,
      flow_id: id,
    };
    const filterData = (category && flow.filter(item => category === `${item.flow_type_id}`)) || flow;
    const formVersionData = id ? (formVersion[id] || []) : [];
    const extraOperator = [
      this.makeExportButton(),
    ];
    return (
      <React.Fragment>
        <Row style={{ marginTop: 10, marginBottom: 10 }}>
          <Col span={24}>
            <InputGroup compact>
              <Select
                allowClear
                showSearch
                value={category}
                placeholder="分类"
                filterOption={this.handleSearch}
                defaultActiveFirstOption={false}
                notFoundContent={<Spin spinning />}
                style={{ width: 200, maxHeight: 400 }}
                onChange={this.handleChange('category')}
              >
                {cateData.map(item => (
                  <Option key={item.id}>{item.name}</Option>
                ))}
              </Select>
              <Select
                showArrow
                showSearch
                allowClear
                value={id}
                placeholder="筛选"
                filterOption={this.handleSearch}
                defaultActiveFirstOption={false}
                onChange={this.handleChange('id')}
                notFoundContent={<Spin spinning />}
                style={{ width: 200, maxHeight: 400 }}
              >
                {filterData.map(item => (
                  <Option key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </InputGroup>
          </Col>
          <Col span={24}>
            <FormItem label="表单版本">
              {formVersionData.length !== 0 && (
                <TagSelect
                  expandable
                  value={formId}
                  style={{ marginLeft: 10 }}
                  onChange={this.handleFormChange}
                >
                  {formVersionData.map(item => (
                    <TagSelect.Option key={item.id} value={`${item.id}`}>
                      {item.created_at}
                    </TagSelect.Option>)
                  )}
                </TagSelect>
              )}
            </FormItem>
          </Col>
        </Row>
        <OATable
          serverSide
          loading={loading}
          filters={filters}
          columns={this.columns}
          extraOperator={extraOperator}
          total={(formId.length && flowRunLog.total) || 0}
          dataSource={(formId.length && flowRunLog.data) || []}
          fileExportChange={{ onSuccess: this.exportSuccess }}
          fetchDataSource={params => formId.length &&
            (fetchDataSource(params))}
        />
      </React.Fragment>
    );
  }
}
