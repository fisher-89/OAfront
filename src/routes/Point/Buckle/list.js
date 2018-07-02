import React, { PureComponent } from 'react';
import { Layout, Menu, Button, Badge, Icon } from 'antd';
import { connect } from 'dva';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import OATable from '../../../components/OATable';
import TaskForm from './form';
import './list.less';

const { Description } = DescriptionList;
function TaskView(props) {
  return (
    <div className="task-view">
      <div className="task-header">{props.title}</div>
      <div className="task-content">
        <DescriptionList col="4" style={{ marginTop: '10px' }}>
          <Description term={(
            <React.Fragment><Badge status="processing" />奖分任务 <span style={{ color: 'red' }}>(未设置)</span></React.Fragment>
          )}
          >
            <div className="columbia">
              <p><label>奖分下限：</label>200</p>
              <p><label>未完成扣分：</label>差额扣分</p>
            </div>
          </Description>
          <Description term={(
            <React.Fragment><Badge status="error" />扣分任务</React.Fragment>
          )}
          >
            <div className="columbia">
              <p><label>扣分下限：</label>200</p>
              <p><label>未完成扣分：</label>差额扣分</p>
            </div>
          </Description>
          <Description term={(
            <React.Fragment><Badge status="warning" />人次任务 <span style={{ color: 'red' }}>(未设置)</span></React.Fragment>
          )}
          >
            <div className="columbia">
              <p><label>奖扣人次：</label>200</p>
              <p><label>未完成人次扣分：</label>5</p>
            </div>
          </Description>
          <Description term={(
            <React.Fragment> <Badge status="success" />扣分比例任务 <span style={{ color: 'red' }}>(未设置)</span></React.Fragment>
          )}
          >
            <div className="columbia">
              <p><label>扣分比例：</label>200</p>
              <p><label>未完成扣分：</label>差额扣分</p>
            </div>
          </Description>
        </DescriptionList>
      </div>
    </div>
  );
}

function User(props) {
  return (
    <React.Fragment>
      <div className="user-item">
        <div className="avata">
          {props.title}
        </div>
        <p>{props.name}<br />{props.staff_sn}</p>
      </div>
    </React.Fragment>
  );
}

const { Content, Sider } = Layout;
const ButtonGroup = Button.Group;
const task = [
  {
    id: '1',
    name: '测试数据',
  },
  {
    id: '2',
    name: '经理层任务',
  },
];
@connect()
export default class extends PureComponent {
  state = {
    visible: false,
    eidtInfo: {},
  }

  fetchTask = (id) => {
    return id;
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  makeColumns = () => {
    const columns = [
      {
        dataIndex: 'id',
        title: '编号',
        searcher: true,
      },
      {
        dataIndex: 'staff_id',
        title: '员工姓名',
        searcher: true,
      },
      {
        dataIndex: 'department_id',
        title: '部门',
        searcher: true,
      },
      {
        dataIndex: 'brand_id',
        title: '品牌',
        searcher: true,
      },
      {
        dataIndex: 'shop_sn',
        title: '店铺',
        searcher: true,
      },
    ];
    return columns;
  }

  render() {
    const { visible, eidtInfo } = this.state;

    const extraOperator = [
      (
        <Button key="plus" type="danger">移除</Button>
      ),
    ];
    return (
      <Layout>
        <Sider
          theme="light"
          breakpoint="lg"
          collapsedWidth="0"
          style={{ background: '#fff', borderRight: '1px solid #e8e8e8' }}
        >
          <div className="actionContent">
            <ButtonGroup>
              <Button onClick={() => this.handleModalVisible(true)}>新增任务</Button>
              <Button type="danger" style={{ width: '88px' }}>删除</Button>
            </ButtonGroup>
          </div>
          <Menu theme="light" mode="inline" defaultSelectedKeys={['0']}>
            {task.map((item, index) => (
              <Menu.Item key={index.toString()} onClick={() => this.fetchTask(item.id)}>
                <span className="nav-text">{item.name}</span>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout>
          <Content>
            <div style={{ background: '#fff', minHeight: 360 }}>
              <TaskView
                title="本月任务"
                data={{}}
              />
              <TaskView
                title={(<React.Fragment>下月任务<Icon type="form" className="task-edit" onClick={() => this.handleModalVisible(true)} /></React.Fragment>)}
                data={{}}
              />
              <div className="task-view">
                <div className="task-header">本月考核人员</div>
                <div style={{ marginTop: 10 }}>
                  <OATable
                    data={[]}
                    extraOperator={extraOperator}
                    columns={this.makeColumns()}
                  />
                </div>
                <div className="task-header">
                  下月不参与考核人员
                </div>
                <div className="user-list">
                  <User title="尾音" staff_sn="100001" name="尾尾音" />
                  <User title="尾音" staff_sn="100001" name="尾尾音" />
                  <User title="尾音" staff_sn="100001" name="尾尾音" />
                  <User title="尾音" staff_sn="100001" name="尾尾音" />
                  <User title="尾音" staff_sn="100001" name="尾尾音" />
                  <User title="尾音" staff_sn="100001" name="尾尾音" />
                </div>
                <div className="task-header">
                  下月新增考核人员
                </div>
                <div className="user-list">
                  <User title="尾音" staff_sn="100001" name="尾尾音" />
                  <User title="尾音" staff_sn="100001" name="尾尾音" />
                  <User title="尾音" staff_sn="100001" name="尾尾音" />
                  <User title="尾音" staff_sn="100001" name="尾尾音" />
                  <User title="尾音" staff_sn="100001" name="尾尾音" />
                  <User title="尾音" staff_sn="100001" name="尾尾音" />
                </div>
              </div>
            </div>
          </Content>
        </Layout>
        <TaskForm
          visible={visible}
          initialValue={eidtInfo}
          handleVisible={this.handleModalVisible}
        />
      </Layout>
    );
  }
}
