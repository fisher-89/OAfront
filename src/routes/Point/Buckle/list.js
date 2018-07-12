import React, { PureComponent } from 'react';
import { Layout, Menu, Button, Badge, Icon, Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import OATable from '../../../components/OATable';
import TaskForm from './form';
import { getUrlString, intersect } from '../../../utils/utils';
import './list.less';

const { Description } = DescriptionList;
function TaskView(props) {
  const { data, title } = props;
  return (
    <div className="task-view">
      <div className="task-header">{title}</div>
      <div className="task-content">
        <DescriptionList col="4" style={{ marginTop: '10px' }}>
          <Description term={(
            <React.Fragment>
              <Badge status="processing" />奖分指标
              {!data.point_b_awarding_target && <span style={{ color: 'red' }}>(未设置)</span>}
            </React.Fragment>
          )}
          >
            <div className="columbia">
              <p><label>奖分下限：</label>{data.point_b_awarding_target}</p>
              <p><label>未完成扣分：</label>{data.deducting_percentage_target}</p>
            </div>
          </Description>
          <Description term={(
            <React.Fragment><Badge status="error" />扣分指标</React.Fragment>
          )}
          >
            <div className="columbia">
              <p><label>扣分下限：</label>{data.point_b_deducting_target}</p>
              <p><label>未完成扣分：</label>{data.point_b_deducting_coefficient}</p>
            </div>
          </Description>
          <Description term={(
            <React.Fragment>
              <Badge status="warning" />人次指标
              {!data.event_count_target && <span style={{ color: 'red' }}>(未设置)</span>}
            </React.Fragment>
          )}
          >
            <div className="columbia">
              <p><label>奖扣人次：</label>{data.event_count_target}</p>
              <p><label>未完成人次扣分：</label>{data.event_count_mission}</p>
            </div>
          </Description>
          <Description term={(
            <React.Fragment>
              <Badge status="success" />扣分比例指标
              {!data.deducting_percentage_target && <span style={{ color: 'red' }}>(未设置)</span>}
            </React.Fragment>
          )}
          >
            <div className="columbia">
              <p><label>扣分比例：</label>{data.deducting_percentage_target}</p>
              <p><label>未完成扣分：</label>{data.deducting_percentage_ratio}</p>
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
          {props.name.substr(-2)}
        </div>
        <p>{props.name}<br />{props.staff_sn}</p>
      </div>
    </React.Fragment>
  );
}

const { Content, Sider } = Layout;
const ButtonGroup = Button.Group;
@connect(({ point, loading }) => ({
  targets: point.targets,
  targetDetails: point.targetsDetails,
  loading: loading.effects['point/fetchTargets'],
}))
export default class extends PureComponent {
  state = {
    visible: false,
    eidtInfo: {},
  }

  componentDidMount() {
    const id = getUrlString('id');
    this.fetchTargets(id ? { id } : null);
  }


  fetcTask = (id) => {
    const { dispatch, location: { pathname } } = this.props;
    dispatch(routerRedux.replace(`${pathname}?id=${id}`));
  }

  fetchTargets = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'point/fetchTargets',
      payload: params,
    });
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  makeTaskStaff = (targetsInfo) => {
    const notInThisMonthStaff = [];
    const newInNextMonthStaff = [];

    const thisMonthStaffId = targetsInfo.this_month_staff.map(item => item.staff_sn);
    const nextMonthStaffId = targetsInfo.next_month_staff.map(item => item.staff_sn);

    const taskStaff = intersect(thisMonthStaffId, nextMonthStaffId);

    targetsInfo.this_month_staff.forEach((item) => {
      if (!taskStaff.indexOf(item.staff_sn)) {
        notInThisMonthStaff.push(item);
      }
    });

    targetsInfo.next_month_staff.forEach((item) => {
      if (!taskStaff.indexOf(item.staff_sn)) {
        newInNextMonthStaff.push(item);
      }
    });
    return {
      notInThisMonthStaff,
      newInNextMonthStaff,
    };
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
    const { targets, targetDetails, loading } = this.props;
    const targetId = targets[0] && targets[0].id;
    const urlId = getUrlString('id');
    const id = urlId || targetId;
    let targetsInfo = {};
    let thisMonth = {};
    let nextMonth = {};
    let thisMonthStaff = [];
    let notInThisMonthStaff = [];
    let newInNextMonthStaff = [];
    if (targets.length && targetDetails[id]) {
      targetsInfo = targetDetails[id];
      thisMonth = {
        deducting_percentage_ratio: targetsInfo.deducting_percentage_ratio,
        deducting_percentage_target: targetsInfo.deducting_percentage_target,
        event_count_mission: targetsInfo.event_count_mission,
        event_count_target: targetsInfo.event_count_target,
        point_b_awarding_coefficient: targetsInfo.point_b_awarding_coefficient,
        point_b_awarding_target: targetsInfo.point_b_awarding_target,
        point_b_deducting_coefficient: targetsInfo.point_b_deducting_coefficient,
        point_b_deducting_target: targetsInfo.point_b_deducting_target,
      };
      nextMonth = targetsInfo.next_month;
      thisMonthStaff = targetsInfo.this_month_staff;
      ({ notInThisMonthStaff, newInNextMonthStaff } = this.makeTaskStaff(targetsInfo));
    }
    const extraOperator = [
      (
        <Button key="plus" type="danger">移除</Button>
      ),
    ];
    return (
      <Spin spinning={loading} >
        <Layout>
          <Sider
            theme="light"
            breakpoint="lg"
            collapsedWidth="0"
            style={{ background: '#fff', borderRight: '1px solid #e8e8e8' }}
          >
            <div className="actionContent">
              <ButtonGroup>
                <Button onClick={() => this.handleModalVisible(true)}>新增指标</Button>
                <Button type="danger" style={{ width: '88px' }}>删除</Button>
              </ButtonGroup>
            </div>
            <Menu theme="light" mode="inline" defaultSelectedKeys={[urlId || '0']}>
              {targets.map((item, index) => (
                <Menu.Item
                  key={urlId ? item.id.toString() : index.toString()}
                  onClick={() => this.fetcTask(item.id)}
                >
                  <span className="nav-text">{item.name}</span>
                </Menu.Item>
              ))}
            </Menu>
          </Sider>
          <Layout>
            <Content>
              <div style={{ background: '#fff', minHeight: 360 }}>
                <TaskView
                  title="本月指标"
                  key="thisMonth"
                  data={thisMonth}
                />
                <TaskView
                  title={(<React.Fragment>下月指标<Icon type="form" className="task-edit" onClick={() => this.handleModalVisible(true)} /></React.Fragment>)}
                  key="nextMonth"
                  data={nextMonth}
                />
                <div className="task-view">
                  <div className="task-header">本月考核人员</div>
                  <div style={{ marginTop: 10 }}>
                    <OATable
                      data={thisMonthStaff}
                      extraOperator={extraOperator}
                      columns={this.makeColumns()}
                    />
                  </div>
                  <div className="task-header">
                    下月不参与考核人员
                  </div>
                  <div
                    className="user-list"
                    style={{
                      ...(!notInThisMonthStaff.length && { lineHeight: '131px' }),
                    }}
                  >
                    {!notInThisMonthStaff.length && '没有奖扣任务人员!'}
                    {notInThisMonthStaff.map(item => (
                      <User key={item.staff_sn} staff_sn={item.staff_sn} name={item.staff_name} />
                    ))}

                  </div>
                  <div className="task-header">
                    下月新增考核人员
                  </div>
                  <div
                    className="user-list"
                    style={{
                      ...(!newInNextMonthStaff.length && { lineHeight: '131px' }),
                    }}
                  >
                    {!newInNextMonthStaff.length && '没有奖扣任务人员!'}
                    {newInNextMonthStaff.map(item => (
                      <User key={item.staff_sn} staff_sn={item.staff_sn} name={item.staff_name} />
                    ))}
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
      </Spin>
    );
  }
}
