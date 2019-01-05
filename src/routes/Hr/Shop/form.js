import React, { PureComponent } from 'react';
import {
  Tabs,
  Col,
  Row,
  Radio,
  Input,
  Select,
  TreeSelect,
  notification,
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import { omit, isEmpty } from 'lodash';
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
          clock_in: 'clock_in',
          clock_out: 'clock_out',
        });
        notification.error({ message: '表单错误，请重新填写。' });
      },
    });
  }
  handleSelectChange = (v) => {
    const { form } = this.props;
    const deploy = [
      { key: 'A', val: 25 },
      { key: 'B1', val: 20 },
      { key: 'B2', val: 15 },
      { key: 'B3', val: 10 },
      { key: 'C', val: 5 },
    ].filter(item => item.key === v);
    form.setFieldsValue({ staff_deploy: '' });
    if (!isEmpty(deploy)) {
      form.setFieldsValue({
        staff_deploy: deploy[0].val,
      });
    }
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
                      showSearch
                      placeholder="请选择部门"
                      treeData={newTreeData}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      filterTreeNode={(inputValue, treeNode) => {
                        return treeNode.props.title.indexOf(inputValue) !== -1;
                      }}
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
            tab={<div className={styles.tabpane}>店铺信息</div>}
            key="2"
          >
            <Row>
              <Col {...colSpan}>
                <FormItem label="店铺面积" {...formItemLayout}>
                  {getFieldDecorator('total_area', {
                    initialValue: initialValue.total_area || null,
                  })(
                    <Input placeholder="保留两位小数点" />
                  )}
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="排班类型" {...formItemLayout}>
                  {getFieldDecorator('work_type', {
                    initialValue: initialValue.work_type || '全班',
                  })(
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value="全班">全班</Radio.Button>
                      <Radio.Button value="倒班">倒班</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col {...colSpan}>
                <FormItem label="店铺类型" {...formItemLayout}>
                  {getFieldDecorator('shop_type', {
                    initialValue: initialValue.shop_type || '',
                  })(
                    <Select onChange={this.handleSelectChange}>
                      <Option value="">请选择</Option>
                      <Option value="A">A</Option>
                      <Option value="B1">B1</Option>
                      <Option value="B2">B2</Option>
                      <Option value="B3">B3</Option>
                      <Option value="C">C</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem label="城市系数" {...formItemLayout}>
                  {getFieldDecorator('city_ratio', {
                    initialValue: initialValue.city_ratio || null,
                  })(
                    <Select>
                      <Option value={null}>请选择</Option>
                      <Option value="0.8">0.8</Option>
                      <Option value="1">1</Option>
                      <Option value="1.2">1.2</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormItem label="人员配置" {...longFormItemLayout}>
                  {getFieldDecorator('staff_deploy', {
                    initialValue: initialValue.staff_deploy || '',
                  })(
                    <InputNumber placeholder="店铺人员配置数量" style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
            </Row>

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
