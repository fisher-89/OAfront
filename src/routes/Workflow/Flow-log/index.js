import React from 'react';
import { Row, Col, Card, Radio, Select, Input } from 'antd';
import store from './store/store';
import OATable from '../../../components/OATable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const { Option } = Select;
const InputGroup = Input.Group;


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

  render() {
    const { type, category, id } = this.state;
    const { fetchDataSource, flowRunLog, flowType, formType, flow, form } = this.props;
    let cateData = [];
    let filterData = [];
    if (type === '1') {
      cateData = flowType;
      if (category) {
        filterData = flow.filter(item => category === `${item.flow_type_id}`);
      } else {
        filterData = flow;
      }
    } else {
      cateData = formType;
      if (category) {
        filterData = form.filter(item => category === `${item.form_type_id}`);
      } else {
        filterData = form;
      }
    }
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
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
          <OATable
            columns={this.columns}
            total={flowRunLog.total}
            dataSource={flowRunLog.data}
            fetchDataSource={fetchDataSource}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
