import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Select, Row, Col, Button, Modal } from 'antd';
import moment from 'moment';

import { makePositionData } from '../../../utils/utils';

import OAForm, { SearchTable, DatePicker, OAModal } from '../../../components/OAForm';

const FormItem = OAForm.Item;
// const { SearchTable, DatePicker } = OAForm;
const { Option } = Select;

@OAForm.create()
@connect(({ brand, department, position, loading }) => ({
  brand: brand.brand,
  brandLoading: loading.models.brand,
  department: department.department,
  departmentLoading: loading.models.department,
  position: position.position,
  positionLoading: loading.models.position,
}))

export default class extends PureComponent {
  handleChange = (value, type) => {
    const { brand, position } = this.props;
    let newPosition = makePositionData(value.toString(), brand);
    if (position.length === 0) {
      newPosition = position;
    }
    const newState = {
      position: [...newPosition],
    };
    if (!type) {
      newState.positionId = '';
    }
    this.setState({
      ...newState,
    });
  };

  handleSubmit = (params) => {
    const { dispatch } = this.props;
    const response = { ...params };
    dispatch({
      type: 'staffs/editStaff',
      payload: response,
      onError: this.handleError,
      onSuccess: this.handleSuccess,
    });
  };

  transferOut = () => {
    Modal.confirm({
      title: '确认调离?',
      cancelText: '取消',
      okText: '确认',
      onOk: () => {
        this.props.form.setFieldsValue({
          shop_sn: '',
          brand_id: 1,
          status_id: 1,
          position_id: 1,
          department_id: 1,
          operation_remark: '人员调离',
          operate_at: moment().format('YY-MM-DD'),
        });
      },
      onCancel: () => {},
    });
  };
  render() {
    const {
      brand,
      visible,
      position,
      editStaff,
      department,
      brandLoading,
      validateFields,
      form: { getFieldDecorator, setFieldsValue },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const fieldsBoxLayout = {
      xs: 24,
      lg: 12,
    };

    return (
      <OAModal
        width={600}
        title="人事变动"
        visible={visible}
        style={{ top: 30 }}
        loading={brandLoading}
        onCancel={() => this.props.onCancel()}
        onSubmit={validateFields(this.handleSubmit)}
      >
        <Row>
          <Col {...fieldsBoxLayout}>
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('realname', {
                initialValue: editStaff.realname,
              })(
                <Input placeholder="请输入" disabled />
              )}
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label="调离" {...formItemLayout}>
              <Button type="danger" icon="logout" onClick={this.transferOut} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col {...fieldsBoxLayout}>
            <FormItem label="部门" required {...formItemLayout}>
              {getFieldDecorator('department_id', {
                initialValue: editStaff.department_id,
              })(
                <Select name="department_id" placeholer="请选择">
                  {department && department.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label="状态" required {...formItemLayout}>
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
            <FormItem label="品牌" required {...formItemLayout}>
              {getFieldDecorator('brand_id', {
                initialValue: editStaff.brand_id,
              })(
                <Select name="brand_id" placeholer="请选择" onChange={this.handleChange}>
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
          <Col {...fieldsBoxLayout}>
            <FormItem label="店铺编号" {...formItemLayout}>
              {getFieldDecorator('shop_sn', {
                initialValue: editStaff.shop_sn,
              })(
                <SearchTable.Shop
                  name={{
                    shop_sn: 'shop_sn',
                  }}
                  showName="shop_sn"
                  placeholder="请选择"
                  onChange={(value) => {
                    setFieldsValue(value);
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label="执行时间" name="operate_at" required {...formItemLayout}>
              {getFieldDecorator('operate_at', {
                initialValue: editStaff.operate_at || '',
              })(
                <DatePicker />
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem label="操作说明" {...formItemLayout} name="operation_remark">
          {getFieldDecorator('operation_remark', {
            initialValue: editStaff.operation_remark || '',
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
      </OAModal>
    );
  }
}
