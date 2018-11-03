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
import Maps from './maps';
import styles from './form.less';

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
      ...params.shop_address,
      ...params.manager1_sn,
      ...params.manager_sn,
      ...params.manager2_sn,
      ...params.manager3_sn,
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

    const info = initialValue;
    this.makeDecoratorValue(info);
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
            <Row>
              <Col>
                <FormItem label="店铺名称" {...longFormItemLayout} required>
                  {getFieldDecorator('name', {
                     initialValue: info.name,
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
                    initialValue: info.shop_sn || '',
                     })(
                       <Input placeholder="请输入" style={{ width: '100%' }} />
                    )
                 }
                </FormItem>
              </Col>


              <Col {...colSpan}>
                <FormItem label="店铺状态" {...formItemLayout} required>
                  {getFieldDecorator('status_id', {
                  initialValue: info.status_id !== undefined ? info.status_id.toString() : '0',
                })(
                  <Select>
                    <Option value="0">开业</Option>
                    <Option value="1">未开业</Option>
                  </Select>
                   )}
                </FormItem>
              </Col>
            </Row>


            <Row>
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


            <Row>
              <Col {...colSpan}>
                <FormItem label="开业日期" {...formItemLayout} required>
                  {getFieldDecorator('opening_at',
                    { initialValue: info.opening_at || undefined,
                    })(
                      <DatePicker placeholder="请选择日期" />
                      )}
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="结束日期" {...formItemLayout} required>
                  {getFieldDecorator('end_at',
                    { initialValue: info.end_at || undefined,
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
                address: initialValue.address || '',
                city_id: initialValue.city_id || '',
                county_id: initialValue.county_id || '',
                province_id: initialValue.province_id || '',
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
              initialValue: info.clock_in || '00:00:00',
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
              initialValue: info.clock_out || '00:00:00',
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
                   initialValue: info.tags || [],
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
                  initialValue: info.manager_name || null,
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
                <FormItem label="区域经理" {...formItemLayout}>
                  {
                getFieldDecorator('manager1_sn', {
                  initialValue: info.manager1_name || [],
                })(
                  <SearchTable.Staff
                    name={{
                      manager1_sn: 'staff_sn',
                      manager1_name: 'realname',
                    }}
                    showName="manager1_name"
                  />
                )
              }
                </FormItem>
              </Col>
            </Row>


            <Row>
              <Col {...colSpan}>
                <FormItem label="大区经理" {...formItemLayout}>
                  {
                 getFieldDecorator('manager2_sn', {
                initialValue: info.manager2_name || [],
                     })(
                       <SearchTable.Staff
                         name={{
                          manager2_sn: 'staff_sn',
                          manager2_name: 'realname',
                       }}
                         showName="manager2_name"
                       />
                       )
                  }
                </FormItem>
              </Col>


              <Col {...colSpan}>
                <FormItem label="部长" {...formItemLayout}>
                  {
               getFieldDecorator('manager3_sn', {
              initialValue: info.manager3_name || [],
                   })(
                     <SearchTable.Staff
                       name={{
                        manager3_sn: 'staff_sn',
                        manager3_name: 'realname',
                    }}
                       showName="manager3_name"
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
              </Col>
            </Row>
          </TabPane>


          <TabPane
            tab={<div className={styles.tabpane}>店铺定位</div>}
            key="3"
          >
            <FormItem label="店铺定位" {...longFormItemLayout}>
              <Input />
            </FormItem>
            <div style={{ width: '100%', height: '400px' }} >
              <Maps />
            </div>
          </TabPane>
        </Tabs>
      </OAModal>
    );
  }
}
