import React, { PureComponent } from 'react';
import { connect } from 'dva';
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
      form: { getFieldDecorator, setFieldsValue },
    } = this.props;

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
                {getFieldDecorator('realname', {
                  initialValue: editStaff.realname,
                })(
                  <Input placeholder="请输入" disabled />
                )}
              </FormItem>
            </Col>
            <Col {...fieldsBoxLayout}>
              <FormItem label="员工状态" required {...formItemLayout}>
                {getFieldDecorator('status_id', {
                  initialValue: editStaff.status_id,
                })(
                  <Select name="status_id" placeholer="请选择">
                    <Option key="-1" value={1}>试用期</Option>
                    <Option key="2" value={2}>在职</Option>
                    <Option key="3" value={3}>离职</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...fieldsBoxLayout}>
              <FormItem label="所属品牌" required {...formItemLayout}>
                {getFieldDecorator('brand_id', {
                  initialValue: editStaff.brand_id,
                })(
                  <Select name="brand_id" placeholer="请选择">
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
              <FormItem label="职位" required {...formItemLayout}>
                {getFieldDecorator('position_id', {
                  initialValue: editStaff.position_id,
                })(
                  <Select name="position_id" placeholer="请选择">
                    <Option key="-1" value="">--请选择--</Option>
                    {position.map((item) => {
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
                })(
                  <Select mode="multiple" placeholer="请选择">
                    {expense.map((item) => {
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
                })(
                  <TreeSelect
                    treeDefaultExpandAll
                    treeData={newTreeData}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  />
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
