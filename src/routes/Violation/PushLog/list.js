import React, { PureComponent } from 'react';
import { Popover, Button, Tabs } from 'antd';
import OATable from 'components/OATable';
import MyPushLog from './mypushlog';
import store from './store';

const { TabPane } = Tabs;
@store()
export default class extends PureComponent {
  state = {
    activeKey: '1',
    panes: [],
  }

  componentWillMount() {
    this.props.fetchPushLog();
  }

  onChange = (activeKey) => {
    this.setState({ activeKey });
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  add = () => {
    const { panes } = this.state;
    if (JSON.stringify(panes) !== JSON.stringify([{ title: '我的推送记录', key: '2' }])) {
      panes.push({ title: '我的推送记录', key: '2' });
    }
    this.setState({ panes: [...panes], activeKey: '2' });
  }

  remove = () => {
    this.setState({ panes: [], activeKey: '1' });
  }

  makeColumns = () => {
    const columns = [
      {
        title: '记录ID',
        dataIndex: 'id',
        width: 50,
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: '推送信息内容',
        dataIndex: 'pushing_info',
        width: 460,
        render: (_, record) => {
          if (record.is_clear === 1) {
            return '链接已过期';
          } else {
            const hover = (
              <div><img src={record.pushing_info} alt={record.pushing_info} /></div>
            );
            return (
              <Popover content={hover} >{record.pushing_info}</Popover>
            );
          }
        },
      },
      {
        title: '推送状态',
        dataIndex: 'states',
        width: 80,
        render: (key) => {
          return key === 1 ? '成功' : '失败';
        },
      },
      {
        title: '推送类型',
        dataIndex: 'pushing_type',
        width: 85,
        render: (key) => {
          switch (key) {
            case 1:
              return '群';
            case 2:
              return '个人';
            case 3:
              return '定时';
            default:
              return null;
          }
        },
      },
      {
        title: '推送者员工编号',
        dataIndex: 'sender_staff_sn',
        searcher: true,
        width: 100,
      },
      {
        title: '推送者员工姓名',
        dataIndex: 'sender_staff_name',
        searcher: true,
        width: 120,
      },
      {
        title: '推送钉钉名称',
        dataIndex: 'ding_flock_name',
        searcher: true,
        width: 50,
        render: key => OATable.renderEllipsis(key, true),
      },
      {
        title: '推送给个人的员工编号',
        dataIndex: 'staff_sn',
        width: 50,
        render: key => OATable.renderEllipsis(key, true),
      },
      {
        title: '错误信息',
        dataIndex: 'error_message',
        width: 150,
        render: key => OATable.renderEllipsis(key, true),
      },
    ];
    return columns;
  }

  render() {
    const { pushlog } = this.props;
    const { activeKey, panes } = this.state;
    const extra = [];
    extra.push((
      <Button
        key="plus"
        type="primary"
        style={{ marginLeft: '10px' }}
        onClick={this.add}
      >
        我的推送记录
      </Button>));

    return (
      <Tabs
        type="editable-card"
        hideAdd
        activeKey={activeKey}
        onChange={this.onChange}
        onEdit={this.onEdit}
      >
        <TabPane closable={false} key="1" tab="大爱记录" >
          <OATable
            columns={this.makeColumns()}
            dataSource={pushlog}
            extraOperator={extra}
          />
        </TabPane>
        {panes.map(pane => (
          <TabPane tab={pane.title} key={pane.key} >
            <MyPushLog />
          </TabPane>
        ))
        }
      </Tabs>
    );
  }
}
