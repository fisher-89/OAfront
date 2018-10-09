import React, { PureComponent, Fragment } from 'react';
import { Button, Divider, List, Card, Row, Col } from 'antd';
import QueueAnim from 'rc-queue-anim';
import ApproverForm from './form';
import ModeForm from './modeForm';
import store from './store/store';
import OATable from '../../../components/OATable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

@store()
export default class extends PureComponent {
  state = {
    modeId: undefined,
    initialValue: {},
    visible: false,
    type: false,
  }

  componentWillMount() {
    const { fetchMode, fetchDepartment } = this.props;
    fetchMode();
    fetchDepartment();
  }

  componentWillReceiveProps(nextProps) {
    const { list } = nextProps;
    const { modeId } = this.state;
    if (nextProps.list !== this.props.list && !modeId) {
      const [firstData] = list;
      this.fetchDetails(firstData.id);
    }
  }

  fetchDetails = (modeId) => {
    const { fetchDataSource } = this.props;
    this.setState({ modeId }, () => {
      fetchDataSource({ id: modeId });
    });
  }


  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      sorter: true,
      searcher: true,
    },
    {
      searcher: true,
      title: '所属部门',
      dataIndex: 'department_name',
    },
    {
      width: 200,
      title: '员工',
      dataIndex: 'approver_staff',
      render: key => this.renderTooltip(key),
    },
    {
      width: 200,
      title: '角色',
      dataIndex: 'approver_roles',
      render: key => this.renderTooltip(key),
    },
    {
      width: 200,
      title: '部门',
      dataIndex: 'approver_departments',
      render: key => this.renderTooltip(key),
    },
    {
      title: '操作',
      render: rowData => (
        <Fragment>
          <a onClick={() => {
            this.setState({ initialValue: rowData, visible: true, type: true });
          }}
          >编辑
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.props.deleted(rowData.id, this.state.modeId)}>删除</a>
        </Fragment>
      ),
    },
  ]

  renderTooltip = (key) => {
    const text = key.map(item => item.text).join('、');
    return OATable.renderEllipsis(text, true);
  }


  render() {
    const { loading, list, rulesData = {}, modeDeleted } = this.props;
    const { visible, initialValue, type, modeId } = this.state;
    const modeDetails = rulesData[modeId] || [];
    const header = list.find(item => item.id === modeId) || {};
    const extraOperator = [
      <Button type="primary" icon="plus" key="plus" onClick={() => this.setState({ visible: true, type: true })}>
        规则
      </Button>,
    ];
    return (
      <React.Fragment>
        <PageHeaderLayout>
          <Row>
            <QueueAnim>
              <Col span={6}>
                <Card bordered={false} key="mode">
                  <Button
                    icon="plus"
                    type="dashed"
                    style={{ width: '100%', marginBottom: 8 }}
                    onClick={() => { this.setState({ visible: true, type: false }); }}
                  >
                    添加
                  </Button>
                  <div style={{ maxHeight: 600, overflowY: 'auto' }}>
                    <List
                      size="large"
                      rowKey="id"
                      loading={loading}
                      dataSource={list}
                      renderItem={item => (
                        <List.Item
                          actions={[
                            <a onClick={() => {
                              this.fetchDetails(item.id);
                            }}
                            >查看
                            </a>,
                            <a onClick={() => {
                              this.setState({ visible: true, type: false, initialValue: item });
                            }}
                            >编辑
                            </a>,
                            <a onClick={() => { modeDeleted(item.id); }}>删除</a>,
                          ]}
                        >
                          <List.Item.Meta
                            title={item.name}
                            description={item.description}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </Card>
              </Col>
              <Col sm={{ span: 17, offset: 1 }}>
                {modeId !== undefined && (
                  <Card bordered={false} key="details">
                    <div style={{ marginBottom: 10 }}>
                      <p> 模板名称：{header.name}</p>
                      <p> 模板描述：{header.description}</p>
                    </div>
                    <OATable
                      loading={loading}
                      serverSide={false}
                      columns={this.columns}
                      dataSource={modeDetails}
                      extraOperator={extraOperator}
                      fetchDataSource={() => {
                        this.props.fetchDataSource({ id: modeId, update: true });
                      }}
                    />
                  </Card>
                )}
              </Col>
            </QueueAnim>
          </Row>
          <ModeForm
            visible={visible && !type}
            initialValue={initialValue}
            onCancel={() => {
              this.setState({ initialValue: {}, type: false, visible: false });
            }}
          />
          <ApproverForm
            modeId={modeId}
            initialValue={initialValue}
            visible={visible && type && modeId !== undefined}
            onCancel={() => {
              this.setState({ initialValue: {}, type: true, visible: false });
            }}
          />
        </PageHeaderLayout>
      </React.Fragment>
    );
  }
}
