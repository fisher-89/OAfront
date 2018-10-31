import React, { PureComponent } from 'react';
import {
  Input,
  Select,
  TreeSelect,
  Tabs,
  Col,
  Row,
} from 'antd';
import { Map } from 'react-amap';
import { connect } from 'dva';
import OAForm, {
  OAModal,
  Address,
  DatePicker,
  SearchTable,
} from '../../../components/OAForm';
import { markTreeData } from '../../../utils/utils';
import styles from './form.less';
import UIMarker from './UIMarker';

const { TabPane } = Tabs;
const FormItem = OAForm.Item;
const { Option } = Select;
@connect(({ shop }) => ({ shop }))
@OAForm.create()
@connect(({ brand, department, loading }) => ({
  brand: brand.brand,
  department: department.department,
  loading: (
    loading.effects['shop/addShop'] ||
    loading.effects['shop/editShop']
  ),
}))
export default class extends PureComponent {
  constructor() {
    super();
    this.state = {
      shopInfo: {},
      poiInfo: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'brand/fetchBrand' });
    dispatch({ type: 'department/fetchDepartment' });
  }


  componentWillReceiveProps(nextProps) {
    const { initialValue } = nextProps;
    if (initialValue !== this.state.shopInfo) {
      this.setState({ shopInfo: initialValue });
    }
  }

  handleError = (error) => {
    const { onError } = this.props;
    onError(error);
  }

  handleSubmit = (params) => {
    const { dispatch } = this.props;
    const body = {
      ...params,
      ...params.manager,
    };
    dispatch({
      type: params.id ? 'shop/editShop' : 'shop/addShop',
      payload: body,
      onError: this.handleError,
      onSuccess: () => this.props.handleVisible(false),
    });
  }

  handlePosition = (poi) => {
    this.props.form.setFieldsValue({
      latitude: poi.lat,
      longitude: poi.lng,
      address: poi.address,
    });
  }

  makeDecoratorValue = (info) => {
    const { form: { getFieldDecorator } } = this.props;
    [
      'city_id',
      'province_id',
      'county_id',
      'address',
    ].forEach((item) => {
      getFieldDecorator(item, { initialValue: info[item] });
    });
  }

  render() {
    const {
      brand,
      department,
      handleVisible,
      visible,
      initialValue,
      onCancel,
      validateFields,
      form: { getFieldDecorator, setFieldsValue },
    } = this.props;

    const info = initialValue;
    this.makeDecoratorValue(info);
    const { shopInfo, poiInfo } = this.state;
    const newTreeData = markTreeData(department, { value: 'id', label: 'name', parentId: 'parent_id' }, 0);
    const longFormItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const rowGutter = { xs: 16, lg: 24 };
    const colSpan = { xs: 6, lg: 12 };
    return (
      <OAModal
        title={info.id ? '编辑店铺' : '添加店铺'}
        visible={visible}
        loading={this.props.loading}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
      >
        {info.id ? (getFieldDecorator('id', {
          initialValue: info.id,
        }))(
          <Input type="hidden" placeholder="请输入" />
        ) : null}
        <Tabs defaultActiveKey="1" className={styles.tabs}>
          <TabPane
            tab={<div className={styles.tabpane}>基础信息</div>}
            key="1"
          >
            <FormItem label="店铺名称" {...longFormItemLayout} required>
              {getFieldDecorator('name', {
                initialValue: info.name,
               })(
                 <Input placeholder="请输入" style={{ width: '100%' }} />
                 )
              }
            </FormItem>
            <Row gutter={rowGutter}>
              <Col {...colSpan}>
                <FormItem label="店铺代码" {...formItemLayout} required>
                  {
                    getFieldDecorator('shop_sn', {
                    initialValue: info.shop_sn,
                     })(
                       <Input placeholder="请输入" style={{ width: '100%' }} />
                    )
                 }
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="店铺状态" {...formItemLayout} required>
                  <Select defaultValue="2">
                    <Option value="1">开业</Option>
                    <Option value="2">未开业</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter} >
              <Col {...colSpan}>
                <FormItem label="所属部门" {...formItemLayout} required>
                  {getFieldDecorator('department_id', {
                    initialValue: info.department_id ? info.department_id.toString() : '',
                  })(
                    <TreeSelect
                      placeholder="请选择部门"
                      treeDefaultExpandAll
                      treeData={newTreeData}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="所属品牌" {...formItemLayout} required>
                  {getFieldDecorator('brand_id', {
                    initialValue: info.brand_id ? info.brand_id.toString() : '',
                  })(
                    <Select showSearch placeholder="请选择">
                      {brand && brand.map((item) => {
                        return (
                          <Option key={item.id}>{item.name}</Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter} >
              <Col {...colSpan}>
                <FormItem label="开业日期" {...formItemLayout} required>
                  <DatePicker placeholder="请选择日期" />
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="结束日期" {...formItemLayout} required>
                  <DatePicker placeholder="请选择日期" />
                </FormItem>
              </Col>
            </Row>
            <FormItem label="店铺地址" {...longFormItemLayout} required>
              <Address
                name={{
                  city_id: 'city_id',
                  province_id: 'province_id',
                  county_id: 'county_id',
                  address: 'address',
                  }}
                value={{
                  city_id: info.city_id || null,
                  province_id: info.province_id || null,
                  county_id: info.county_id || null,
                  address: info.address || null,
                  }}
                onChange={(value) => {
                  setFieldsValue(value);
                  }}
              />
            </FormItem>
            <FormItem label="店铺标签" {...longFormItemLayout}>
              <Select />
            </FormItem>
            <Row gutter={rowGutter}>
              <Col {...colSpan}>
                <FormItem label="店长" {...formItemLayout}>
                  {
                getFieldDecorator('manager', {
                  initialValue: {
                    manager_sn: info.manager_sn || null,
                    manager_name: info.manager_name || null,
                  } || {},
                    })(
                      <SearchTable.Staff
                        name={{
                      manager_sn: 'staff_sn',
                      manager_name: 'realname',
                    }}
                        showName="manager_name"
                      />
                    )
                   }
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="一级负责人" {...formItemLayout}>
                  {
                getFieldDecorator('staff', {
                  initialValue: info.staff || [],
                })(
                  <SearchTable.Staff
                    name={{
                      staff_sn: 'staff_sn',
                      realname: 'realname',
                    }}
                    showName="realname"
                  />
                )
              }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={rowGutter}>
              <Col {...colSpan}>
                <FormItem label="二级负责人" {...formItemLayout}>
                  {
                 getFieldDecorator('staff', {
                initialValue: info.staff || [],
                     })(
                       <SearchTable.Staff
                         name={{
                    staff_sn: 'staff_sn',
                    realname: 'realname',
                       }}
                         showName="realname"
                       />
                       )
                  }
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="三级负责人" {...formItemLayout}>
                  {
               getFieldDecorator('staff', {
              initialValue: info.staff || [],
                   })(
                     <SearchTable.Staff
                       name={{
                  staff_sn: 'staff_sn',
                  realname: 'realname',
                    }}
                       showName="realname"
                     />
                     )
                  }
                </FormItem>
              </Col>
            </Row>
            <FormItem label="店员" {...longFormItemLayout}>
              {
                getFieldDecorator('staff', {
                  initialValue: info.staff || [],
                })(
                  <SearchTable.Staff
                    multiple
                    name={{
                      staff_sn: 'staff_sn',
                      realname: 'realname',
                    }}
                    showName="realname"
                  />
                )
              }
            </FormItem>
          </TabPane>
          <TabPane
            tab={<div className={styles.tabpane}>定位</div>}
            key="2"
          >
            <FormItem {...longFormItemLayout} label="店铺位置" required>
              {getFieldDecorator('address', {
              initialValue: poiInfo.address,
               })(
                 <Input placeholder="请输入" style={{ width: '100%' }} />
               )
              }
            </FormItem>

            <div style={{ width: '100%', height: '400px' }}>
              <Map
                zoom={15}
                useAMapUI="true"
                center={{
              longitude: (poiInfo.lng || shopInfo.lng),
              latitude: (poiInfo.lat || shopInfo.lat),
            }}
                amapkey="9a54ee2044c8fdd03b3d953d4ace2b4d"
              >
                <UIMarker handlePosition={this.handlePosition} />
              </Map>
            </div>
          </TabPane>
          <TabPane
            tab={<div className={styles.tabpane}>利鲨</div>}
            key="3"
          >
            <Row gutter={rowGutter}>
              <Col {...colSpan}>

                <FormItem label="上班时间" {...formItemLayout}>
                  {getFieldDecorator('clock_in', {
                initialValue: `${info.clock_in}:00`,
                    })(
                      <DatePicker
                        mode="time"
                        format="HH:mm:ss"
                        showTime={{ format: 'HH:mm:ss' }}
                        style={{ width: '100%' }}
                      />
                   )}
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="下班时间" {...formItemLayout}>
                  {getFieldDecorator('clock_out', {
                initialValue: `${info.clock_out}:00`,
                   })(
                     <DatePicker
                       mode="time"
                       format="HH:mm:ss"
                       showTime={{ format: 'HH:mm:ss' }}
                       style={{ width: '100%' }}
                     />
                   )}
                </FormItem>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </OAModal>
    );
  }
}
