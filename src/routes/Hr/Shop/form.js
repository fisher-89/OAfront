import React, { PureComponent } from 'react';
import {
  Input,
  Select,
  TreeSelect,
} from 'antd';
import { connect } from 'dva';
import OAForm, {
  OAModal,
  Address,
  DatePicker,
  SearchTable,
} from '../../../components/OAForm';
import { markTreeData } from '../../../utils/utils';

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
      ...params.manager,
    };
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
      form: { getFieldDecorator, setFieldsValue },
    } = this.props;

    const info = initialValue;
    this.makeDecoratorValue(info);
    const newTreeData = markTreeData(department, { value: 'id', lable: 'name', parentId: 'parent_id' }, 0);
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <OAModal
        title="店铺表单"
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

        <FormItem {...formItemLayout} label="店铺代码" required>
          {
            getFieldDecorator('shop_sn', {
              initialValue: info.shop_sn,
            })(
              <Input placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="店铺名称" required>
          {
            getFieldDecorator('name', {
              initialValue: info.name,
            })(
              <Input placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="所属部门" required>
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
        <FormItem {...formItemLayout} label="所属品牌" required>
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
        <FormItem {...formItemLayout} label="店铺地址" required>
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
        <FormItem {...formItemLayout} label="上班时间">
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
        <FormItem {...formItemLayout} label="下班时间">
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
        <FormItem {...formItemLayout} label="店长">
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
        <FormItem {...formItemLayout} label="店员">
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
      </OAModal>
    );
  }
}
