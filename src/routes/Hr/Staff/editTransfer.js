import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { Input, Select, Row, Col, TreeSelect } from 'antd';
import NextForm from './nextForm';


import OAForm, { SearchTable, OAModal } from '../../../components/OAForm';
import { markTreeData } from '../../../utils/utils';

const FormItem = OAForm.Item;
const { Option } = Select;

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
  state = {
    visible: false,
  }

  handleSubmit = (params, onError) => {
    const { dispatch, onCancel } = this.props;
    dispatch({
      type: 'staffs/transfer',
      payload: params,
      onError: (errors) => {
        this.setState({ visible: false }, onError(errors));
      },
      onSuccess: () => {
        this.setState({ visible: false }, onCancel());
      },
    });
  };

  handleNextForm = () => {
    this.setState({ visible: true });
  }

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
      form,
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
      form: { getFieldDecorator, setFieldsValue, getFieldValue },
    } = this.props;

    const brandId = getFieldValue('brand_id');
    const costBrand = expense.filter((item) => {
      const ids = item.brands.map(i => i.id);
      return ids.indexOf(parseInt(brandId, 10)) !== -1;
    });
    const fposition = position.filter((item) => {
      const ids = item.brands.map(i => i.id);
      return ids.indexOf(parseInt(brandId, 10)) !== -1;
    });
    const newTreeData = markTreeData(department, { value: 'id', label: 'name', parentId: 'parent_id' }, 0);

    return (
      <React.Fragment>
        <NextForm
          form={form}
          visible={this.state.visible}
          onSubmit={validateFields(this.handleSubmit)}
          onCancel={() => { this.setState({ visible: false }); }}
        />
        <OAModal
          width={600}
          title="人事变动"
          okText="下一步"
          visible={visible}
          loading={loading}
          style={{ top: 30 }}
          onCancel={onCancel}
          onSubmit={validateFields(this.handleNextForm)}
        >

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
                <span>{editStaff.realname}</span>
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
              <FormItem label="所属部门" {...formItemLayout1} required>
                {getFieldDecorator('department_id', {
                  initialValue: `${editStaff.department_id}`,
                  rules: [validatorRequired],
                })(
                  <TreeSelect
                    showSearch
                    treeDefaultExpandAll
                    treeData={newTreeData}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    filterTreeNode={(inputValue, treeNode) => {
                      return treeNode.props.title.indexOf(inputValue) !== -1;
                    }}
                  />
                )}
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
                    {brand && brand.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
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
                  <Select showSearch placeholer="请选择">
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
              <FormItem label="店铺编号" {...formItemLayout1}>
                {getFieldDecorator('shop_sn', {
                  initialValue: editStaff.shop_sn,
                })(
                  <SearchTable.Shop
                    name="shop_sn"
                    showName="shop_sn"
                    placeholder="请选择"
                    onChange={(value) => {
                      setFieldsValue(value);
                    }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </OAModal>
      </React.Fragment>

    );
  }
}
