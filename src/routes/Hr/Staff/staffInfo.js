/**
 * Created by Administrator on 2018/4/15.
 */
import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  Tag,
  Card,
  Icon,
  Tabs,
  Avatar,
  Timeline,
} from 'antd';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import QueueAnim from 'rc-queue-anim';
import { checkAuthority } from 'utils/utils';
import styles from './index.less';
import ChangeLog from './infoTabs/changeLog';
import Bespoke from './infoTabs/bespoke';
import StaffAuth from './infoTabs/staffAuth';

const { Meta } = Card;
const { TabPane } = Tabs;
const staffProperty = ['无', '109将', '36天罡', '24金刚', '18罗汉'];

@connect(({ staffs, loading }) => ({
  list: staffs.formatLogDetails,
  loading: loading.effects['staffs/fetchFormatLog'],
}))
export default class StaffInfo extends PureComponent {
  componentWillMount() {
    const { dispatch, data } = this.props;
    dispatch({ type: 'staffs/fetchFormatLog', payload: { id: data.staff_sn } });
  }

  render() {
    const { data, loading, list } = this.props;
    const timelist = list[data.staff_sn];
    // const relatives = data.relatives ? data.relatives.map((item) => {
    //   return `${item.realname}   (${item.relative_type.name})   编号(${item.staff_sn})`;
    // }).join('') : '  ';
    const defaultVal = (<span className={styles.place}>未填写</span>);
    const idNumber = data.id_card_number;
    const birthday = idNumber ? [idNumber.substr(6, 4), idNumber.substr(10, 2), idNumber.substr(12, 2)].join('-') : '';
    return (
      <QueueAnim style={{ display: 'flex' }} className={styles.userInfo}>
        <Row gutter={16} style={{ width: '100%' }}>
          <Col span={9}>
            <Card bordered={false}>
              <div key="userInfo" style={{ flexGrow: 1, wordBreak: 'break-all' }}>
                <Card key="userInfo" bordered={false} loading={loading} bodyStyle={{ padding: 0 }}>
                  <Meta
                    avatar={<Avatar src="/default_avatar.png" size="large" style={{ width: 40, height: 40 }} />}
                    title={
                      <div className={styles.flexBox}>
                        <div>{data.realname}&nbsp;&nbsp;
                          {data.gender === '男' ?
                            <Icon type="man" style={{ color: '#4A90E2' }} /> :
                            <Icon type="woman" style={{ color: '#E53A82' }} />
                          }
                        </div>
                        <div className={styles.mobile}><Icon type="mobile" />&nbsp;&nbsp;{data.mobile}</div>
                      </div>
                    }
                    description={
                      <div className={styles.flexBox}>
                        <p>编号：{data.staff_sn}</p>
                        <p><Icon type="idcard" />&nbsp;&nbsp;{data.id_card_number}</p>
                      </div>
                    }
                  />
                  <div className={styles.tags}>
                    标签：
                    {!isEmpty(data.tags) ? (data.tags).map(item => (
                      <Tag color={item.category.color} key={item.id}>{item.name}</Tag>
                    )) : defaultVal}
                  </div>
                  <Card className={styles.card} bodyStyle={{ padding: '20px' }}>
                    <p>状态：{data.status.name}</p>
                    <p>品牌：{data.brand.name}</p>
                    <p>职位：{data.position.name}</p>
                    <div className={styles.item}>
                      <label>部门：</label>
                      <div>{data.department.full_name || defaultVal}</div>
                    </div>
                  </Card>
                  <Card className={styles.card} bodyStyle={{ padding: '20px' }}>
                    <p className={styles.splitBox}>微信：{data.wechat_number || defaultVal}</p>
                    <p className={styles.splitBox}>生日：{birthday || defaultVal}</p>
                    <p className={styles.splitBox}>民族：{data.national || defaultVal}</p>
                    <p className={styles.splitBox}>学历：{data.education || defaultVal}</p>
                    <p className={styles.splitBox}>政治面貌：{data.politics || defaultVal}</p>
                    <p className={styles.splitBox}>籍贯：{data.native_place || defaultVal}</p>
                    <p className={styles.splitBox}>婚姻状况：{data.marital_status || defaultVal}</p>
                    <p className={styles.splitBox}>身高/体重：{`${data.height || 0}cm`}/{`${data.weight || 0}kg`}</p>
                    <p>银行账户：{data.account_number || defaultVal}</p>
                    <p>紧急联系人：{data.concat_name} ({data.concat_type}) {data.concat_tel}</p>
                    <div className={styles.item}>
                      <label>现居地址：</label>
                      <div>
                        {(() => {
                          if (data.living_province_name && data.living_city_name) {
                            return (
                              <span>
                                {data.living_province_name}&nbsp;
                                {data.living_city_name}&nbsp;
                                {data.living_county_name}&nbsp;
                                {data.living_address}
                              </span>
                            );
                          } else {
                            return defaultVal;
                          }
                        })()}
                      </div>
                    </div>
                    <div className={styles.item}>
                      <label>户口所在地：</label>
                      <div>
                        {(() => {
                          if (data.household_city_name && data.household_province_name) {
                            return (
                              <span>
                                {data.household_province_name}&nbsp;
                                {data.household_city_name}&nbsp;
                                {data.household_county_name}&nbsp;
                                {data.household_address}
                              </span>
                            );
                          } else {
                            return defaultVal;
                          }
                        })()}
                      </div>
                    </div>
                  </Card>
                  <Card className={styles.card} bodyStyle={{ padding: '20px' }}>
                    <p>员工属性：{staffProperty[data.property] || defaultVal}</p>
                    <p>钉钉编号：{data.dingtalk_number || defaultVal}</p>
                    <p>招聘人员：{data.recruiter_name || defaultVal}</p>
                    <div className={styles.item}>
                      <label>备注：</label>
                      <div>{data.remark || defaultVal}</div>
                    </div>
                  </Card>
                  <Card className={styles.card} bodyStyle={{ padding: '20px' }}>
                    <p>店铺：{(data.shop || {}).name || defaultVal}</p>
                    <p>店长：{(data.shop || {}).manager_name || defaultVal}</p>
                    <p>店长手机号：{(data.shop || {}).manager_mobile || defaultVal}</p>
                    <div className={styles.item}>
                      <label>地址：</label>
                      <div>{(data.shop || {}).real_address || defaultVal}</div>
                    </div>
                  </Card>
                </Card>
              </div>
            </Card>
          </Col>
          <Col span={15}>
            <Card bordered={false}>
              <div style={{ width: 200, flexShrink: 0 }} />
              <div key="userLog">
                <Tabs defaultActiveKey="timeline">
                  <TabPane key="timeline" tab="时间轴" style={{ marginLeft: 10 }}>
                    <Timeline
                      pendingDot={<Icon type="flag" style={{ fontSize: '16px' }} />}
                      reverse={false}
                      style={{ marginTop: 20 }}
                    >
                      {!isEmpty(timelist) && timelist.map((item) => {
                        const changes = item.transfer;
                        return (
                          <Timeline.Item
                            dot={<Icon type="clock-circle-o" style={{ fontSize: '18px' }} />}
                            key={item.id}
                          >
                            <div style={{ paddingLeft: 20, color: '#333' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{item.operate_at} &nbsp;&nbsp; {item.operation_type}</span>
                                <span style={{ color: '#AAA' }}>操作时间 &nbsp;&nbsp; {item.created_at}</span>
                              </div>
                              <div style={{ fontSize: '12px', lineHeight: '25px' }}>
                                {!isEmpty(changes) && changes.map((change) => {
                                  return (<div key={change}>{change[0]} {'=>'} {change[1]}</div>);
                                })}
                              </div>
                            </div>
                          </Timeline.Item>
                        );
                      })}
                    </Timeline>
                  </TabPane>
                  {
                    checkAuthority(118) ? (
                      <TabPane key="changeLog" tab="变更记录">
                        <ChangeLog staffSn={data.staff_sn} />
                      </TabPane>
                    ) : null
                  }
                  {
                    checkAuthority(69) ? (
                      <TabPane key="userAuth" tab="员工权限">
                        <StaffAuth data={data} />
                      </TabPane>
                    ) : null
                  }
                  {/* <TabPane key="relatives" tab="关系网" /> */}
                  <TabPane key="bespoke" tab="预约操作">
                    <Bespoke staffSn={data.staff_sn} />
                  </TabPane>
                </Tabs>
              </div>
            </Card>
          </Col>
        </Row>
      </QueueAnim>
    );
  }
}
