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
  Form,
  Tabs,
  Avatar,
} from 'antd';
import { isEmpty } from 'lodash';
import QueueAnim from 'rc-queue-anim';
import styles from './index.less';
import ChangeLog from './infoTabs/changeLog';
import Bespoke from './infoTabs/bespoke';
import StaffAuth from './infoTabs/staffAuth';

const { Meta } = Card;
const { TabPane } = Tabs;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const staffProperty = ['无', '108将', '36天罡', '24金刚', '18罗汉'];

export default class StaffInfo extends PureComponent {
  render() {
    const { data, loading } = this.props;
    // const relatives = data.relatives ? data.relatives.map((item) => {
    //   return `${item.realname}   (${item.relative_type.name})   编号(${item.staff_sn})`;
    // }).join('') : '  ';
    const idNumber = data.id_card_number;
    const birthday = idNumber ? [idNumber.substr(6, 4), idNumber.substr(10, 2), idNumber.substr(12, 2)].join('-') : '';
    const style = { paddingTop: 5, paddingBottom: 0, padding: '0' };
    return (
      <QueueAnim style={{ display: 'flex' }} className={styles.userInfo}>
        <Row gutter={16} style={{ width: '100%' }}>
          <Col span={10}>
            <Card>
              <div key="userInfo" style={{ flexGrow: 1, wordBreak: 'break-all' }}>
                <Card key="userInfo" bordered={false} loading={loading} bodyStyle={{ borderBottom: '1px dashed #aaa', padding: '24px 0' }}>
                  <Meta
                    avatar={<Avatar src="/default_avatar.png" size="large" style={{ width: 40, height: 40 }} />}
                    title={
                      <React.Fragment>
                        {data.realname}&nbsp;&nbsp;
                        {data.gender === '男' ?
                          <Icon type="man" style={{ color: '#4A90E2' }} /> :
                          <Icon type="woman" style={{ color: '#E53A82' }} />
                        }
                      </React.Fragment>
                    }
                    description={<span>员工编号：{ data.staff_sn }</span>}
                  />
                  <div style={{ margin: '20px 0 10px 20px' }}>
                    <p>
                      {data.mobile ? (
                        <span className={styles.iconSpan} style={{ marginRight: 40 }}>
                          <Icon type="mobile" />{data.mobile}
                        </span>
                      ) : ''}
                      {data.wechat_number ? (
                        <span className={styles.iconSpan}>
                          <Icon type="wechat" />{data.wechat_number}
                        </span>
                      ) : ''}
                    </p>
                    {data.living_province_name ? (
                      <span className={styles.iconSpan}><Icon type="home" />
                        {`
                          ${data.living_province_name || ''}
                          ${data.living_city_name ? `-${data.living_city_name}` : ''}
                          ${data.living_county_name ? `-${data.living_county_name}` : ''}
                          ${`${data.living_address || ''}`}
                        `}
                      </span>
                    ) : ''}
                  </div>
                  {!isEmpty(data.tags) ? (
                    <FormItem label="标签" {...formItemLayout}>
                      { (data.tags || []).map(item => <Tag>{item.name}</Tag>) }
                    </FormItem>
                  ) : ''}
                </Card>
                <Card key="userInfo1" bordered={false} loading={loading} bodyStyle={style} style={style}>
                  <FormItem label="状态" {...formItemLayout}>{data.status.name}</FormItem>
                  <FormItem label="品牌" {...formItemLayout}>
                    {data.brand.name || ''}
                  </FormItem>
                  <FormItem label="职位" {...formItemLayout}>
                    {data.position.name || ''}
                  </FormItem>
                  <FormItem label="部门" {...formItemLayout}>
                    {`${data.department.full_name}`}
                  </FormItem>
                  {data.shop ? (
                    <FormItem label="店铺" {...formItemLayout}>
                      {data.shop.name}
                    </FormItem>
                  ) : ''}
                  <FormItem label="员工属性" {...formItemLayout}>
                    {`${staffProperty[data.property]}`}
                  </FormItem>
                </Card>
                <Card key="userInfo2" bordered={false} loading={loading} bodyStyle={style} style={style}>
                  <FormItem label="入职时间" {...formItemLayout}>
                    {data.hired_at}
                  </FormItem>
                  <FormItem label="转正时间" {...formItemLayout}>
                    {data.employed_at}
                  </FormItem>
                  <FormItem label="离职时间" {...formItemLayout}>
                    {data.left_at}
                  </FormItem>
                </Card>
                <Card key="userInfo3" bordered={false} loading={loading} bodyStyle={style} style={style}>
                  <FormItem label="生日" {...formItemLayout}>
                    {birthday}
                  </FormItem>
                  <FormItem label="学历" {...formItemLayout}>
                    {data.education}
                  </FormItem>
                  <FormItem label="民族" {...formItemLayout}>
                    {data.national}
                  </FormItem>
                  <FormItem label="政治面貌" {...formItemLayout}>
                    {data.politics}
                  </FormItem>
                  <FormItem label="籍贯" {...formItemLayout}>
                    {data.native_place}
                  </FormItem>
                  <FormItem label="婚姻状况" {...formItemLayout}>
                    {data.marital_status}
                  </FormItem>
                  <FormItem label="身高/体重" {...formItemLayout}>
                    {`${data.height} ${data.height && 'cm'} ${(data.height && data.weight) && '/'} ${data.weight}${data.weight && 'kg'}`}
                  </FormItem>
                  <FormItem label="身份证号" {...formItemLayout}>
                    {data.id_card_number}
                  </FormItem>
                  <FormItem label="户口所在地" {...formItemLayout}>
                    {`
                      ${data.household_province_name || ''}
                      ${data.household_city_name ? `-${data.household_city_name}` : ''}
                      ${data.household_county_name ? `-${data.household_county_name}` : ''}
                      ${`${data.household_address || ''}`}
                    `}
                  </FormItem>
                  <FormItem label="现居地址" {...formItemLayout}>
                    {`
                      ${data.living_province_name || ''}
                      ${data.living_city_name ? `-${data.living_city_name}` : ''}
                      ${data.living_county_name ? `-${data.living_county_name}` : ''}
                      ${`${data.living_address || ''}`}
                    `}
                  </FormItem>
                  <FormItem label="银行账户" {...formItemLayout}>
                    {` ${data.account_name}    ${data.account_bank}   ${data.account_number}  `}
                  </FormItem>
                  <FormItem label="紧急联系人" {...formItemLayout}>
                    {`${data.concat_name || ''} ${data.concat_type ? `(${data.concat_type})` : ''} ${`${data.concat_tel || ''}`}`}
                  </FormItem>
                </Card>
                <Card key="userInfo4" bordered={false} loading={loading} bodyStyle={style} style={style}>
                  <FormItem label="钉钉编码" {...formItemLayout}>
                    {data.dingtalk_number}
                  </FormItem>
                  <FormItem label="招聘人员" {...formItemLayout}>
                    {data.recruiter_name}
                  </FormItem>
                  <FormItem label="备注" {...formItemLayout}>
                    {data.remark}
                  </FormItem>
                </Card>
              </div>
            </Card>
          </Col>
          <Col span={14}>
            <Card>
              {/* <div style={{ width: 200, flexShrink: 0 }} /> */}
              <div key="userLog">
                <Tabs defaultActiveKey="changeLog">
                  <TabPane key="changeLog" tab="变更记录" >
                    <ChangeLog staffSn={data.staff_sn} />
                  </TabPane>
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
