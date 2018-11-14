import React, { PureComponent } from 'react';
import {
  Input,
  Select,
  TreeSelect,
  Tabs,
  Col,
  Row,
} from 'antd';
import { connect } from 'dva';
import OAForm, {
  OAModal,
  Address,
  DatePicker,
  SearchTable,
} from '../../../components/OAForm';
import { markTreeData } from '../../../utils/utils';
import styles from './form.less';
import SearchMap from '../../../components/Maps';

const { TabPane } = Tabs;
const FormItem = OAForm.Item;
const { Option } = Select;
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
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'brand/fetchBrand' });
    dispatch({ type: 'department/fetchDepartment' });
  }

  handleError = (error) => {
    const { onError } = this.props;
    onError(error);
  }


  handleSubmit = (params) => {
    const { dispatch } = this.props;
    const body = {
      ...params,
      ...params.manager_sn,
      ...params.assistant_sn,
      real_address: params.real_address.address,
      lat: params.real_address.position.latitude,
      lng: params.real_address.position.longitude,
      ...params.shop_address,
    };
    delete body.shop_address;
    dispatch({
      type: params.id ? 'shop/editShop' : 'shop/addShop',
      payload: body,
      onError: this.handleError,
      onSuccess: () => this.props.handleVisible(false),
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
      form: { getFieldDecorator },
    } = this.props;
    this.makeDecoratorValue(initialValue);
    const newTreeData = markTreeData(department, { value: 'id', label: 'name', parentId: 'parent_id' }, 0);
    const longFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const colSpan = { xs: 24, lg: 12 };
    const mng = {};
    mng.manager_sn = initialValue.manager_sn;
    mng.manager_name = initialValue.manager_name;
    const ast = {};
    ast.assistant_sn = initialValue.assistant_sn;
    ast.assistant_name = initialValue.assistant_name;
    return (
      <OAModal
        title={initialValue.id ? '编辑店铺' : '添加店铺'}
        visible={visible}
        loading={this.props.loading}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
      >
        {initialValue.id ? (getFieldDecorator('id', {
          initialValue: initialValue.id,
        }))(
          <Input type="hidden" placeholder="请输入" />
        ) : null}
        <Tabs defaultActiveKey="1" className={styles.tabs}>
          <TabPane
            tab={<div className={styles.tabpane}>基础信息</div>}
            key="1"
          >
            <Row>
              <Col>
                <FormItem label="店铺名称" {...longFormItemLayout} required>
                  {getFieldDecorator('name', {
                    initialValue: initialValue.name,
                  })(
                    <Input placeholder="请输入" style={{ width: '100%' }} />
                  )
                  }
                </FormItem>
              </Col>
            </Row>


            <Row>
              <Col {...colSpan}>
                <FormItem label="店铺代码" {...formItemLayout} required>
                  {
                    getFieldDecorator('shop_sn', {
                      initialValue: initialValue.shop_sn || '',
                    })(
                      <Input placeholder="请输入" style={{ width: '100%' }} />
                    )
                  }
                </FormItem>
              </Col>


              <Col {...colSpan}>
                <FormItem label="店铺状态" {...formItemLayout} required>
                  {getFieldDecorator('status_id', {
                    initialValue: initialValue.status_id !== undefined ? initialValue.status_id.toString() : '1',
                  })(
                    <Select>
                      <Option value="1">未营业</Option>
                      <Option value="2">营业中</Option>
                      <Option value="3">闭店</Option>
                      <Option value="4">取消</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>


            <Row>
              <Col {...colSpan}>
                <FormItem label="所属部门" {...formItemLayout} required>
                  {getFieldDecorator('department_id', {
                    initialValue: initialValue.department_id ? initialValue.department_id.toString() : '',
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
                    initialValue: initialValue.brand_id ? initialValue.brand_id.toString() : '',
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


            <Row>
              <Col {...colSpan}>
                <FormItem label="开业日期" {...formItemLayout} required>
                  {getFieldDecorator('opening_at',
                    {
                      initialValue: initialValue.opening_at || undefined,
                    })(
                      <DatePicker placeholder="请选择日期" />
                    )}
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="结束日期" {...formItemLayout} required>
                  {getFieldDecorator('end_at',
                    {
                      initialValue: initialValue.end_at || undefined,
                    })(
                      <DatePicker placeholder="请选择日期" />
                    )}
                </FormItem>
              </Col>
            </Row>


            <Row>
              <Col>
                <FormItem label="店铺地址" {...longFormItemLayout} required>
                  {getFieldDecorator('shop_address', {
                    initialValue: {
                      address: initialValue.address || null,
                      city_id: initialValue.city_id || null,
                      county_id: initialValue.county_id || null,
                      province_id: initialValue.province_id || null,
                    },
                  })(
                    <Address />
                  )}
                </FormItem>
              </Col>
            </Row>


            <Row>
              <Col {...colSpan}>
                <FormItem label="上班时间" {...formItemLayout}>
                  {getFieldDecorator('clock_in', {
                    initialValue: initialValue.clock_in || '00:00:00',
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
                    initialValue: initialValue.clock_out || '00:00:00',
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


            <Row>
              <Col>
                <FormItem label="店铺标签" {...longFormItemLayout}>
                  {getFieldDecorator('tags', {
                    initialValue: initialValue.tags || [],
                  })(<Select />)}
                </FormItem>
              </Col>
            </Row>
          </TabPane>


          <TabPane
            tab={<div className={styles.tabpane}>店铺成员</div>}
            key="2"
          >
            <Row>
              <Col {...colSpan}>
                <FormItem label="店长" {...formItemLayout}>
                  {
                    getFieldDecorator('manager_sn', {
                      initialValue: mng || null,
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
                <FormItem label="驻店人员" {...formItemLayout}>
                  {
                    getFieldDecorator('assistant_sn', {
                      initialValue: ast || [],
                    })(
                      <SearchTable.Staff
                        name={{
                          assistant_sn: 'staff_sn',
                          assistant_name: 'realname',
                        }}
                        showName="assistant_name"
                      />
                    )
                  }
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormItem label="店员" {...longFormItemLayout}>
                  {
                    getFieldDecorator('staff', {
                      initialValue: initialValue.staff || [],
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
              </Col>
            </Row>
          </TabPane>


          <TabPane
            tab={<div className={styles.tabpane}>店铺定位</div>}
            key="3"
          > {getFieldDecorator('lng', {
            initialValue: initialValue.lng || null,
          })(<Input type="hidden" />)}
            {getFieldDecorator('lat', {
              initialValue: initialValue.lat || null,
            })(<Input type="hidden" />)}

            <FormItem>
              {getFieldDecorator('real_address', {
                initialValue: {
                  address: initialValue.real_address || '',
                  lng: initialValue.lng || undefined,
                  lat: initialValue.lat || undefined,
              },
              })(<SearchMap />)}
            </FormItem>
          </TabPane>
        </Tabs>
      </OAModal>
    );
  }
}
