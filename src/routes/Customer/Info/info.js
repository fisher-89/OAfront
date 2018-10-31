import React from 'react';
import {
  Tag,
  Tabs,
  Form,
  Button,
  Row,
  Col,
  Card,
  Avatar,
  Icon,
} from 'antd';
import moment from 'moment';
import RcViewer from 'rc-viewer';
import store from './store/store';
import styles from './index.less';
import Notepad from '../Notepad/list';
import ActionLog from '../ActionLog/customer';
import district from '../../../assets/district';
import Ellipsis from '../../../components/Ellipsis';
import { customerStatus } from '../../../assets/customer';
import { findRenderKey, analysisData, customerAuthority } from '../../../utils/utils';

const { Meta } = Card;

const rcViewerOptions = {
  navbar: true,
  toolbar: {
    zoomIn: 0,
    zoomOut: 0,
    oneToOne: 0,
    reset: 0,
    prev: {
      show: 2,
      size: 'large',
    },
    play: 0,

    rotateLeft: {
      show: 2,
      size: 'large',
    },
    rotateRight: {
      show: 2,
      size: 'large',
    },
    next: {
      show: 2,
      size: 'large',
    },
    flipHorizontal: 0,
    flipVertical: 0,
  },
};


const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6, pull: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18, pull: 2 },
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

  const style = { borderBottom: '1px solid #ccc' };

  return (
    <div className={styles.customerInfo}>
      <Button icon="left" onClick={() => { props.history.goBack(-1); }}>返回</Button>
      <Card bordered={false} style={style} loading={loading}>
        <Meta
          avatar={<Avatar src={data.icon && data.icon[1]} size="large" style={{ width: 96, height: 96 }} />}
          title={
            <React.Fragment>
              {data.name}&nbsp;&nbsp;
              {data.gender === '男' ? <Icon type="man" style={{ color: '#4A90E2' }} /> : <Icon type="woman" style={{ color: '#E53A82' }} />}
            </React.Fragment>
          }
          description={
            <React.Fragment>
              <p>
                <span className={styles.iconSpan}><Icon type="mobile" />{data.mobile}</span>
                <span className={styles.iconSpan}><Icon type="wechat" />{data.wechat}</span>
              </p>
              <span className={styles.iconSpan}><Icon type="home" />{address}</span>
            </React.Fragment>
          }
        />
      </Card>
      <Card bordered={false} style={style} loading={loading}>
        <FormItem label="籍贯" {...formItemLayout}>{data.nation}</FormItem>
        <FormItem label="身份证" {...formItemLayout}>{data.id_card_number}</FormItem>
        <FormItem label="身份证照片" {...formItemLayout}>
          <RcViewer options={rcViewerOptions}>
            {data.id_card_image_f && (<img src={data.id_card_image_f} className={styles.idCard} alt="正面" width="120" height="75" />)}
            {data.id_card_image_b && (<img src={data.id_card_image_b} className={styles.idCard} alt="反面" width="120" height="75" />)}
          </RcViewer>
        </FormItem>
      </Card>
      <Card bordered={false} loading={loading}>
        <FormItem label="客户来源" {...formItemLayout}> {sourceData.name}</FormItem>
        <FormItem label="客户状态"{...formItemLayout}>{statusData.name}</FormItem>
        <FormItem label="客户等级"{...formItemLayout} >
          <Ellipsis tooltip lines={1}>
            {levelData.join('、')}
          </Ellipsis>
        </FormItem>
        <FormItem label="合作省份"{...formItemLayout} >
          <Ellipsis tooltip lines={1}>{linkagesData.join('、')}</Ellipsis>
        </FormItem>
        <FormItem label="合作品牌"{...formItemLayout} >
          <Ellipsis tooltip lines={1}>{brandData.join('、')}</Ellipsis>
        </FormItem>
        <FormItem label="合作时间" {...formItemLayout}>
          {data.first_cooperation_at ? moment(data.first_cooperation_at).format('YYYY-MM-DD') : ''}
        </FormItem>
        <FormItem label="标签" {...formItemLayout}>
          <Ellipsis tooltip lines={1}>
            {tagData.map((item, index) => {
              const key = `${index}`;
              return (
                <Tag key={key} color={item.color || ''}>{item.name}</Tag>
              );
            })}
          </Ellipsis>
        </FormItem>
        <FormItem label="备注" {...formItemLayout}>{data.remark}</FormItem>
        <FormItem label="维护人" {...formItemLayout}>{data.vindicator_name}</FormItem>
      </Card>
    </div>
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
        <Row gutter={16}>
          <Col span={8}>
            <Card bordered={false} style={{ height: 850 }}>
              <CustomerInfo data={customerInfo} {...customerInfoProps} />
            </Card>
          </Col>
          <Col span={16}>
            <Card bordered={false} style={{ height: 850 }}>
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
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
