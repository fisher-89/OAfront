import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Card, Divider, Button, Tabs } from 'antd';
import OATable from '../../../components/OATable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import RuleType from './Type/index';
import store from './store/store';
import RuleForm from './details';
import NewRule from './newruletab';

const { TabPane } = Tabs;
@store()
export default class extends PureComponent {
  state= {
    panes: [],
    newpane: 0,
    visible: false,
    activeKey: 'ruleList',
    details: {},
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  tabsChange = (activeKey) => {
    this.setState({ activeKey });
  }

  remove = (targetKey) => {
    const { panes } = this.state;
    let { activeKey } = this.state;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    } else { activeKey = 'ruleList'; }
    if (newPanes.length === 0) {
      activeKey = 'ruleList';
    }
    this.setState({ panes: [...newPanes], activeKey });
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
          this.add();
        }}
      >
          新建制度
      </Button>
    ));
    return extra;
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  details = (params) => {
    this.setState({ details: params });
    this.handleModalVisible(true);
  }

  add = (params) => {
    const { panes, newpane } = this.state;
    const activeKey = `${newpane + 1}`;
    if (params) {
      panes.push({ title: '编辑制度', content: params, key: activeKey });
    } else {
      panes.push({ title: '新建制度', content: '', key: activeKey });
    }
    this.setState({ panes: [...panes], activeKey, newpane: activeKey });
  }


  makeColumns = () => {
    const { ruleDelete } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '原因',
        dataIndex: 'name',
      },
      {
        title: '类型',
        dataIndex: 'type_id',
      },
      {
        title: '扣分规则',
        dataIndex: 'score',
      },
      {
        title: '扣钱规则',
        dataIndex: 'money',
      },
      {
        title: '记录时间',
        dataIndex: 'created_at',
      },

      {
        title: '操作',
        render: (RowData) => {
          return (
            <Fragment>
              <a onClick={() => this.details(RowData)}>查看</a>
              <Divider type="vertical" />
              <a onClick={() => this.add(RowData)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => ruleDelete(RowData.id)}>删除</a>
            </Fragment>
          );
        },
      },
    ];
    return columns;
  }

  render() {
    const { visible, panes, activeKey, details } = this.state;
    const {
      content,
      fetchRule,
      rule,
      ruletype,
      typeSubmit,
      typeDelete,
      loading } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Tabs
            hideAdd
            type="editable-card"
            activeKey={activeKey}
            onEdit={this.onEdit}
            onChange={this.tabsChange}
          >
            <TabPane
              key="ruleList"
              tab="制度管理"
              closable={false}
            >
              <Row gutter={16}>
                <Col span={4}>
                  <RuleType
                    ruletype={ruletype}
                    typeSubmit={typeSubmit}
                    typeDelete={typeDelete}
                  />
                </Col>
                <Col span={1} />
                <Col span={19}>
                  <OATable
                    data={rule}
                    columns={this.makeColumns()}
                    total={rule.length}
                    loading={loading}
                    fetchDataSource={fetchRule}
                    extraOperator={this.makeExtraOperator()}
                  />
                  <RuleForm
                    content={content}
                    ruletype={ruletype}
                    initialValue={details}
                    visible={visible}
                    onCancel={this.handleModalVisible}
                  />
                </Col>
              </Row>
            </TabPane>
            {panes.map(pane => (
              <TabPane tab={pane.title} key={pane.key}>
                <NewRule
                  remove={() => this.remove(pane.key)}
                  initialValue={pane.content}
                  ruletype={ruletype}
                  typeSubmit={typeSubmit}
                />
              </TabPane>
              ))}
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
