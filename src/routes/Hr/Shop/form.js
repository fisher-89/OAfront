import React, { PureComponent } from 'react';
import {
  Input,
  Select,
  TreeSelect,
  Tabs,
  Col,
  Row,
  notification,
} from 'antd';
import { connect } from 'dva';
import { omit } from 'lodash';
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
@connect(({ brand, department, stafftags, loading }) => ({
  brand: brand.brand,
  stafftags: stafftags.stafftags,
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
    dispatch({ type: 'stafftags/fetchStaffTags', payload: { type: 'shops' } });
  }

  handleSubmit = (params) => {
    const { dispatch, onCancel, onError } = this.props;
    const { address } = params.real_address;
    const body = omit({
      ...params,
      ...params.manager_sn,
      ...params.assistant_sn,
      ...params.real_address,
      ...params.shop_address,
      real_address: address,
    }, ['shop_address']);

    dispatch({
      type: params.id ? 'shop/editShop' : 'shop/addShop',
      payload: body,
      onSuccess: () => onCancel(),
      onError: (errors) => {
        onError(errors, {
          city_id: 'shop_address',
          county_id: 'shop_address',
          province_id: 'shop_address',
          address: 'shop_address',
        });
        notification.error({ message: '表单错误，请重新填写。' });
      },
    });
  }

  render() {
    const {
      brand,
      department,
      stafftags,
      visible,
      initialValue,
      onCancel,
      validateFields,
      validatorRequired,
      form: { getFieldDecorator, setFieldsValue },
    } = this.props;
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
    const isEdit = initialValue.shop_sn !== undefined;
    const shoptags = (initialValue.tags || []).map(item => item.id.toString());
    return (
      <OAModal
        title={initialValue.id ? '编辑店铺' : '添加店铺'}
        visible={visible}
        loading={this.props.loading}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={onCancel}
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
                    rules: [validatorRequired],
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
                      rules: [validatorRequired],
                    })(
                      <Input placeholder="请输入" style={{ width: '100%' }} disabled={isEdit} />
                    )
                  }
                </FormItem>
              </Col>


              <Col {...colSpan}>
                <FormItem label="店铺状态" {...formItemLayout} required>
                  {getFieldDecorator('status_id', {
                    initialValue: initialValue.status_id ? initialValue.status_id.toString() : '1',
                    rules: [validatorRequired],
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
                    initialValue: initialValue.department_id ? initialValue.department_id.toString() : '1',
                    rules: [validatorRequired],
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
                    initialValue: initialValue.brand_id ? initialValue.brand_id.toString() : '1',
                    rules: [validatorRequired],
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
                <FormItem label="开业日期" {...formItemLayout} >
                  {getFieldDecorator('opening_at',
                    {
                      initialValue: initialValue.opening_at || undefined,
                    })(
                      <DatePicker placeholder="请选择日期" />
                    )}
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="结束日期" {...formItemLayout} >
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
                    initialValue: initialValue.clock_in || null,
                  })(
                    <DatePicker
                      mode="time"
                      format="HH:mm:ss"
                      showTime={{ format: 'HH:mm:ss' }}
                      style={{ width: '100%' }}
                      onChange={(time) => {
                        setFieldsValue({ clock_in: time });
                      }}
                    />
                  )}
                </FormItem>
              </Col>


              <Col {...colSpan}>
                <FormItem label="下班时间" {...formItemLayout}>
                  {getFieldDecorator('clock_out', {
                    initialValue: initialValue.clock_out || null,
                  })(
                    <DatePicker
                      mode="time"
                      format="HH:mm:ss"
                      showTime={{ format: 'HH:mm:ss' }}
                      style={{ width: '100%' }}
                      onChange={(time) => {
                        setFieldsValue({ clock_out: time });
                      }}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>


            <Row>
              <Col>
                <FormItem label="店铺标签" {...longFormItemLayout}>
                  {getFieldDecorator('tags', {
                    initialValue: shoptags || [],
                  })(
                    <Select
                      mode="multiple"
                      placeholder="请选择"
                    >
                      {stafftags.map((item) => {
                        return <Option key={`${item.id}`}>{item.name}</Option>;
                      })}
                    </Select>
                  )}
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
                      initialValue: {
                        manager_sn: initialValue.manager_sn || '',
                        manager_name: initialValue.manager_name || '',
                      },
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
                      initialValue: {
                        assistant_sn: initialValue.assistant_sn || '',
                        assistant_name: initialValue.assistant_name || '',
                      },
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
          >
            {getFieldDecorator('lng', {
              initialValue: initialValue.lng || null,
            })(<Input type="hidden" />)}

            {getFieldDecorator('lat', {
              initialValue: initialValue.lat || null,
            })(<Input type="hidden" />)}

            {getFieldDecorator('real_address', {
              initialValue: {
                address: initialValue.real_address || '',
                lng: initialValue.lng || null,
                lat: initialValue.lat || null,
            },
            })(<SearchMap />)}
          </TabPane>
        </Tabs>
      </OAModal>
    );
  }
}
