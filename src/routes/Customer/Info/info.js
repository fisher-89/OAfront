import React from 'react';
import {
  Tag,
  Spin,
  Tabs,
  Form,
  Button,
  Row,
  Col,
} from 'antd';
import moment from 'moment';
import store from './store/store';
import styles from './index.less';
import ActionLog from '../ActionLog/customer';
import Notepad from '../Notepad/list';
import district from '../../../assets/district';
import { customerStatus } from '../../../assets/customer';
import { findRenderKey, analysisData, customerAuthority } from '../../../utils/utils';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

export function getAddress(data) {
  let address = '';
  try {
    // address = JSON.parse(data);
    Object.keys(data).forEach((addr) => {
      const value = data[addr];
      const temp = district.find(dist => `${value}` === `${dist.id}`) || {};
      if (temp.name) {
        address += temp.name;
      } else {
        address += value;
      }
    });
  } catch (e) { address = data; }
  return address;
}

function CustomerInfo(props) {
  const { data, loading, source, tags, brands, tagsType, level } = props;
  const presentAddress = {
    province_id: data.province_id || '',
    city_id: data.city_id || '',
    county_id: data.county_id || '',
    address: data.address || '',
  };
  const address = getAddress(presentAddress || {});
  const sourceData = findRenderKey(source, data.source_id);
  const statusData = findRenderKey(customerStatus, data.status);
  const analysisTag = analysisData(tags, data.tags, 'tag_id', false);
  const brandData = analysisData(brands, data.brands, 'brand_id');
  const tagsTypeId = tagsType.map(item => item.id);
  const tagData = analysisTag.map((item) => {
    const tagsTypeIndex = tagsTypeId.indexOf(item.type_id);
    if (tagsTypeId.indexOf(item.type_id) !== -1) {
      return {
        ...item,
        color: tagsType[tagsTypeIndex].color,
      };
    }
    return item;
  });

  const levelData = analysisData(level, data.levels, 'level_id');
  const linkagesData = analysisData(district, data.linkages, 'linkage_id');
  return (
    <Spin spinning={loading || false}>
      <div className={styles.customerInfo}>
        <FormItem label="客户姓名" {...formItemLayout}>
          {data.name}
          {data.icon && (<img src={data.icon[1]} alt="头像" />)}
        </FormItem>
        <FormItem label="性别" {...formItemLayout}>{data.gender}</FormItem>
        <FormItem label="籍贯" {...formItemLayout}>{data.nation}</FormItem>
        <FormItem label="身份证" {...formItemLayout}>{data.id_card_number}</FormItem>
        <FormItem label="身份证照片" {...formItemLayout}>
          {data.id_card_image_f && (<img src={data.id_card_image_f[1]} alt="正面" />)}
          {data.id_card_image_b && (<img src={data.id_card_image_b[1]} alt="反面" />)}
        </FormItem>
        <FormItem label="现住地址" {...formItemLayout}>{address}</FormItem>
        <FormItem label="电话" {...formItemLayout}>{data.mobile}</FormItem>
        <FormItem label="微信" {...formItemLayout}>{data.wechat}</FormItem>
        <FormItem label="客户来源" {...formItemLayout}> {sourceData.name}</FormItem>
        <FormItem label="客户状态"{...formItemLayout}>{statusData.name}</FormItem>
        <FormItem label="客户等级"{...formItemLayout} >{levelData.join('、')}</FormItem>
        <FormItem label="合作省份"{...formItemLayout} >{linkagesData.join('、')}</FormItem>
        <FormItem label="合作品牌"{...formItemLayout} >{brandData.join('、')}</FormItem>
        <FormItem label="合作时间" {...formItemLayout}>
          {data.first_cooperation_at ? moment(data.first_cooperation_at).format('YYYY-MM-DD') : ''}
        </FormItem>
        <FormItem label="标签" {...formItemLayout}>
          {tagData.map((item, index) => {
            const key = `${index}`;
            return (
              <Tag key={key} color={item.color || ''}>{item.name}</Tag>
            );
          })}
        </FormItem>
        <FormItem label="备注" {...formItemLayout}>{data.remark}</FormItem>
        <FormItem label="维护人" {...formItemLayout}>{data.vindicator_name}</FormItem>
      </div>
    </Spin>
  );
}


const { TabPane } = Tabs;
@store()
export default class extends React.PureComponent {
  componentWillMount() {
    const { fetchDataSource, fetchLevel, match } = this.props;
    const { id } = match.params;
    fetchDataSource({ id });
    fetchLevel();
    this.id = id || 0;
  }

  render() {
    const { details } = this.props;
    const customerInfo = details[this.id] || {};
    const customerInfoProps = { ...this.props };
    delete customerInfoProps.customer;
    return (
      <React.Fragment>
        <Button icon="left" onClick={() => { this.props.history.goBack(-1); }}>返回客户列表</Button>
        <Row gutter={16}>
          <Col span={8} style={{ marginTop: 20, paddingTop: 10 }}>
            <CustomerInfo
              data={customerInfo}
              {...customerInfoProps}
            />
          </Col>
          <Col span={16}>
            <Tabs defaultActiveKey="2" style={{ marginTop: 10 }} >
              {customerAuthority(181) && (
                <TabPane tab="客户事件" key="2" style={{ minHeight: 300 }}>
                  <Notepad
                    type="user"
                    clientId={this.id}
                  />
                </TabPane>
              )}
              {customerAuthority(184) && (
                <TabPane tab="操作日志" key="3" style={{ minHeight: 300 }}>
                  <ActionLog
                    type="user"
                    clientId={this.id}
                  />
                </TabPane>
              )}
            </Tabs>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
