import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import {
  Row,
  Col,
  Tabs,
  Input,
  Select,
  TreeSelect,
} from 'antd';
import OAForm, { SearchTable, OAModal, DatePicker } from '../../../components/OAForm';
import { markTreeData, getBrandAuthority, getDepartmentAuthority } from '../../../utils/utils';

const FormItem = OAForm.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const formItemLayout2 = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const fieldsBoxLayout = {
  xs: 24,
  lg: 12,
};

const formItemLayout1 = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

@OAForm.create()
@connect(({ brand, expense, department, position, loading }) => ({
  brand: brand.brand,
  expense: expense.expense,
  position: position.position,
  department: department.department,
  loading: loading.effects['staffs/transfer'],
}))
export default class extends PureComponent {
  handleSubmit = (params, onError) => {
    const { dispatch, onCancel } = this.props;
    dispatch({
      type: 'staffs/transfer',
      payload: {
        ...params,
        shop_sn: params.shop_sn.shop_sn || '',
      },
      onError: errors => onError(errors),
      onSuccess: () => onCancel(),
    });
  };

  handleSelectChange = () => {
    const { form } = this.props;
    const brands = form.getFieldValue('cost_brands');
    const positionId = form.getFieldValue('position_id');
    if (!isEmpty(brands) || positionId !== '') {
      form.setFieldsValue({
        cost_brands: [],
        position_id: '',
      });
    }
  }

  render() {
    const {
      brand,
      expense,
      loading,
      visible,
      onCancel,
      position,
      editStaff,
      department,
      validateFields,
      validatorRequired,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formatDepart = department.map((item) => {
      const curItem = item;
      if (getDepartmentAuthority(item.id) === false) {
        curItem.disabled = true;
      }
      return curItem;
    });
    const brands = brand.filter((item) => {
      const curItem = item;
      if (getBrandAuthority(item.id) === false) {
        curItem.disabled = true;
      }
      return curItem;
    });
    const brandId = getFieldValue('brand_id');
    const costBrand = expense.filter((item) => {
      const ids = item.brands.map(i => i.id);
      return ids.indexOf(parseInt(brandId, 10)) !== -1;
    });
    const fposition = position.filter((item) => {
      const ids = item.brands.map(i => i.id);
      return ids.indexOf(parseInt(brandId, 10)) !== -1;
    });
    const newTreeData = markTreeData(formatDepart, { value: 'id', label: 'name', parentId: 'parent_id' }, 0);
    const style = { maxHeight: 600, overflowY: 'auto', overflowX: 'hidden' };
    const renderTitle = title => <div style={{ width: 220, textAlign: 'center' }}>{title}</div>;

    return (
      <React.Fragment>
        <OAModal
          width={600}
          title="人事变动"
          visible={visible}
          loading={loading}
          style={{ top: 30 }}
          onCancel={onCancel}
          onSubmit={validateFields(this.handleSubmit)}
        >
          <Tabs defaultActiveKey="1">
            <TabPane forceRender tab={renderTitle('基础信息')} key="1" style={style}>
              <Row>
                <Col {...fieldsBoxLayout}>
                  {getFieldDecorator('staff_sn', {
                    initialValue: editStaff.staff_sn || '',
                  })(
                    <Input type="hidden" />
                  )}
                  {getFieldDecorator('operation_type', {
                    initialValue: 'transfer',
                  })(
                    <Input type="hidden" />
                  )}
                  <FormItem label="员工姓名" {...formItemLayout}>
                    <span className="ant-form-text">{editStaff.realname}</span>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col {...fieldsBoxLayout}>
                  <FormItem label="所属品牌" {...formItemLayout} required>
                    {getFieldDecorator('brand_id', {
                      initialValue: editStaff.brand_id,
                      rules: [validatorRequired],
                    })(
                      <Select name="brand_id" placeholer="请选择" onChange={this.handleSelectChange}>
                        {brands && brands.map((item) => {
                          return (
                            <Option key={item.id} value={item.id} disabled={item.disabled}>
                              {item.name}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem label="职位" {...formItemLayout} required>
                    {getFieldDecorator('position_id', {
                      initialValue: editStaff.position_id,
                      rules: [validatorRequired],
                    })(
                      <Select
                        showSearch
                        placeholer="请选择"
                        filterOption={(inputValue, option) => {
                          return option.props.children.indexOf(inputValue) !== -1;
                        }}
                      >
                        <Option key="-1" value="">--请选择--</Option>
                        {fposition.map((item) => {
                          return (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24} >
                  <FormItem label="费用品牌" {...formItemLayout1} required>
                    {getFieldDecorator('cost_brands', {
                      initialValue: (editStaff.cost_brands || []).map(item => `${item.id}`),
                      rules: [validatorRequired],
                    })(
                      <Select mode="multiple" placeholer="请选择">
                        {costBrand.map((item) => {
                          return (
                            <Option key={`${item.id}`}>{item.name}</Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={24} >
                  <FormItem label="所属部门" {...formItemLayout1} required>
                    {getFieldDecorator('department_id', {
                      initialValue: `${editStaff.department_id}`,
                      rules: [validatorRequired],
                    })(
                      <TreeSelect
                        showSearch
                        treeData={newTreeData}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        filterTreeNode={(inputValue, treeNode) => {
                          return treeNode.props.title.indexOf(inputValue) !== -1;
                        }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col {...fieldsBoxLayout}>
                  <FormItem label="员工状态" {...formItemLayout} required>
                    {getFieldDecorator('status_id', {
                      initialValue: editStaff.status_id,
                      rules: [validatorRequired],
                    })(
                      <Select name="status_id" placeholer="请选择">
                        <Option key="-1" value={1}>试用期</Option>
                        <Option key="2" value={2}>在职</Option>
                        <Option key="3" value={3}>停薪留职</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={24} >
                  <FormItem label="所属店铺" {...formItemLayout1}>
                    {getFieldDecorator('shop_sn', {
                      initialValue: editStaff.shop_sn ? {
                        shop_name: editStaff.shop_name || editStaff.shop.name,
                        shop_sn: editStaff.shop_sn,
                      } : {},
                    })(
                      <SearchTable.Shop />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
            <TabPane forceRender tab={renderTitle('操作设置')} key="2" style={style}>
              <FormItem label="执行日期" {...formItemLayout2} required>
                {getFieldDecorator('operate_at', {
                  initialValue: '',
                  rules: [validatorRequired],
                })(
                  <DatePicker />
                )}
              </FormItem>
              <FormItem label="操作说明" {...formItemLayout2} >
                {getFieldDecorator('operation_remark', {
                  initialValue: '',
                })(
                  <Input.TextArea
                    placeholder="最大长度100个字符"
                    autosize={{
                      minRows: 4,
                      maxRows: 6,
                    }}
                  />
                )}
              </FormItem>
            </TabPane>
          </Tabs>
        </OAModal>
      </React.Fragment>

    );
  }
}
