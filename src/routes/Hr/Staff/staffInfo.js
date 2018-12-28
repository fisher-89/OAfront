/**
 * Created by Administrator on 2018/4/15.
 */
import React, { PureComponent, Fragment } from 'react';
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
                      <Fragment>
                        <div className={styles.splitBox}>{data.realname}&nbsp;&nbsp;
                          {data.gender === '男' ?
                            <Icon type="man" style={{ color: '#4A90E2' }} /> :
                            <Icon type="woman" style={{ color: '#E53A82' }} />
                          }
                        </div>
                        <div className={styles.splitBox}>
                          <div className={styles.mobile}><Icon type="mobile" />&nbsp;&nbsp;{data.mobile}</div>
                        </div>
                      </Fragment>
                    }
                    description={
                      <Fragment>
                        <p className={styles.splitBox}>编号：{ data.staff_sn }</p>
                        <p className={styles.splitBox}><Icon type="idcard" />&nbsp;&nbsp;{ data.id_card_number }</p>
                      </Fragment>
                    }
                  />
                  <div className={styles.tags}>
                    标签: { (data.tags).map(item => <Tag key={item.id}>{item.name}</Tag>) }
                  </div>
                  <Card className={styles.card} bodyStyle={{ padding: '20px' }}>
                    <p>状态：{ data.status.name }</p>
                    <p>品牌：{ data.brand.name }</p>
                    <p>职位：{ data.position.name }</p>
                    <p>部门：{ data.department.full_name }</p>
                  </Card>
                  <Card className={styles.card} bodyStyle={{ padding: '20px' }}>
                    <p className={styles.splitBox}>微信：{ data.wechat_number }</p>
                    <p className={styles.splitBox}>生日：{ birthday }</p>
                    <p className={styles.splitBox}>民族：{ data.national }</p>
                    <p className={styles.splitBox}>学历：{ data.education }</p>
                    <p className={styles.splitBox}>政治面貌：{ data.politics }</p>
                    <p className={styles.splitBox}>籍贯：{ data.native_place }</p>
                    <p className={styles.splitBox}>婚姻状况：{ data.marital_status }</p>
                    <p className={styles.splitBox}>身高(cm)/体重(kg)：{ data.height }/{ data.weight }</p>
                    <p>户口所在地：
                      {data.household_province_name}&nbsp;
                      {data.household_city_name}&nbsp;
                      {data.household_county_name}&nbsp;
                      {data.household_address}
                    </p>
                    <p>银行账户：{ data.account_number }</p>
                    <p>现住地址：
                      {data.living_province_name}&nbsp;
                      {data.living_city_name}&nbsp;
                      {data.living_county_name}&nbsp;
                      {data.living_address}
                    </p>
                    <p>紧急联系人：{ data.concat_name } ({ data.concat_type }) { data.concat_tel }</p>
                  </Card>
                  <Card className={styles.card} bodyStyle={{ padding: '20px' }}>
                    <p>钉钉编号：{ data.dingtalk_number }</p>
                    <p>招聘人员：{ data.recruiter_name }</p>
                    <p>备注：{ data.remark }</p>
                  </Card>
                  <Card className={styles.card} bodyStyle={{ padding: '20px' }}>
                    <p>店铺：{ (data.shop || {}).name }</p>
                    <p className={styles.splitBox}>店长：{ (data.shop || {}).manager_name }</p>
                    <p className={styles.splitBox}>
                      店长手机号：{ (data.shop || {}).manager_mobile}
                    </p>
                    <p>地址：{ (data.shop || {}).real_address }</p>
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
                  <TabPane key="timeline" tab="时间轴" >
                    <Timeline pending="Recording..." reverse={false}>
                      {timelist && timelist.map((item) => {
                        const change = item.changes;
                        return (
                          <Timeline.Item key={item.id}>
                            {item.operation_type} {!isEmpty(change) ? ` (${change[0] ? change[0] : '无'} => ${change[1] ? change[1] : '无'})` : ''} {item.created_at}
                          </Timeline.Item>
                        );
                      })}
                    </Timeline>
                  </TabPane>
                  {
                    checkAuthority(118) ? (
                      <TabPane key="changeLog" tab="变更记录" >
                        <ChangeLog staffSn={data.staff_sn} />
                      </TabPane>
                    ) : null
                  }
                  <TabPane key="userAuth" tab="员工权限" >
                    <StaffAuth data={data} />
                  </TabPane>
                  {/* <TabPane key="relatives" tab="关系网" /> */}
                  <TabPane key="bespoke" tab="预约操作" >
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
