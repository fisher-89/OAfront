import React from 'react';
import {
  Spin,
  Tabs,
  Form,
  Button,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Notepad from '../Notepad/list';
import ActionLog from './log';
import styles from './index.less';
import district from '../../../assets/district';
import store from './store';
import { customerStatus } from '../../../assets/customer';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

function getAddress(data) {
  let address;
  try {
    address = JSON.parse(data);
    address = Object.keys(address).map((addr) => {
      const value = address[addr];
      const temp = district.find(dist => value === dist.id) || {};
      return temp.name || value;
    });
    address = address.join('');
  } catch (e) { address = data; }
  return address;
}

function CustomerInfo(props) {
  const { data, loading, source, tags } = props;
  const address = getAddress(data.present_address || []);
  const sourceData = source.find(item => item.id === data.source_id) || {};
  const statusData = customerStatus.find(item => item.id === data.status) || {};
  const tagId = (data.has_tags || []).map(item => item.tag_id);
  const tagData = tags.filter(item => tagId.indexOf(item.id) !== -1).map(item => item.name);
  return (
    <Spin spinning={loading}>
      <div className={styles.customerInfo}>
        <FormItem label="客户姓名" {...formItemLayout}>{data.name}</FormItem>
        <FormItem label="性别" {...formItemLayout}>{data.gender}</FormItem>
        <FormItem label="籍贯" {...formItemLayout}>{data.nation}</FormItem>
        <FormItem label="身份证" {...formItemLayout}>{data.id_card_number}</FormItem>
        <FormItem label="现住地址" {...formItemLayout}>{address}</FormItem>
        <FormItem label="电话" {...formItemLayout}>{data.mobile}</FormItem>
        <FormItem label="微信" {...formItemLayout}>{data.wechat}</FormItem>
        <FormItem label="客户来源" {...formItemLayout}> {sourceData.name}</FormItem>
        <FormItem label="客户状态"{...formItemLayout}>{statusData.name}</FormItem>
        <FormItem label="合作品牌"{...formItemLayout} />
        <FormItem label="合作时间" {...formItemLayout}> {moment(data.first_cooperation_at).format('YYYY-MM-DD')}</FormItem>
        <FormItem label="标签" {...formItemLayout}> {tagData.join('、')}</FormItem>
        <FormItem label="备注" {...formItemLayout}>{data.remark}</FormItem>
        <FormItem label="维护人" {...formItemLayout}>{data.vindicator_name}</FormItem>
      </div>
    </Spin>
  );
}


const { TabPane } = Tabs;
@connect(({ customer }) => ({ customer }))
@store
export default class extends React.PureComponent {
  componentWillMount() {
    const { fetch, match } = this.props;
    const { id } = match.params;
    fetch({ id });
    this.id = id;
  }

  render() {
    const { customer: { customerDetails } } = this.props;
    const customerInfo = customerDetails[this.id] || {};
    const customerInfoProps = { ...this.props };
    delete customerInfoProps.customer;
    return (
      <React.Fragment>
        <Button icon="left">返回客户列表</Button>
        <Tabs defaultActiveKey="1" style={{ marginTop: 10 }}>
          <TabPane tab="基本信息" key="1" >
            <CustomerInfo
              data={customerInfo}
              {...customerInfoProps}
            />
          </TabPane>
          <TabPane tab="记事本" key="2">
            <Notepad type="user" />
          </TabPane>
          <TabPane tab="操作日志" key="3">
            <ActionLog type="user" />
          </TabPane>
        </Tabs>
      </React.Fragment>
    );
  }
}
