import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Select, Row, Col, Button, Modal, TreeSelect } from 'antd';
import moment from 'moment';

import OAForm, { SearchTable, DatePicker, OAModal } from '../../../components/OAForm';
import { markTreeData } from '../../../utils/utils';

const FormItem = OAForm.Item;
const { Option } = Select;

@OAForm.create()
@connect(({ brand, department, position }) => ({
  brand: brand.brand,
  position: position.position,
  department: department.department,
}))

export default class extends PureComponent {
  handleSubmit = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'staffs/transfer',
      payload: params,
      onError: this.handleError,
      onSuccess: this.handleSuccess,
    });
  };

  handleError = (err) => {
    const { onError } = this.props;
    onError(err);
  };

  handleSuccess = () => {
    this.props.onCancel();
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
          operate_at: moment().format('YYYY-MM-DD'),
        });
      },
      onCancel: () => {},
    });
  };
  render() {
    const {
      brand,
      loading,
      visible,
      position,
      editStaff,
      department,
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
    const newTreeData = markTreeData(department, { value: 'id', lable: 'name', parentId: 'parent_id' }, 0);

    return (
      <OAModal
        width={600}
        title="人事变动"
        visible={visible}
        style={{ top: 30 }}
        loading={loading}
        onCancel={() => this.props.onCancel()}
        onSubmit={validateFields(this.handleSubmit)}
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
            <FormItem label="部门" {...formItemLayout} required>
              {getFieldDecorator('department_id', editStaff.department_id ? {
                initialValue: editStaff.department_id.toString(),
              } : { initialValue: '1' })(
                <TreeSelect
                  treeDefaultExpandAll
                  treeData={newTreeData}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                />
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
            <FormItem {...formItemLayout} label="执行时间" required>
              {getFieldDecorator('operate_at', {
                initialValue: editStaff.operate_at || '',
              })(
                <DatePicker
                  style={{
                    width: '100%',
                  }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem
          {...{
            labelCol: {
              span: 4,
            },
            wrapperCol: {
              span: 18,
            },
          }
          }
          label="费用品牌"
        >
          {getFieldDecorator('cost_brand', {
            initialValue: editStaff.cost_brand,
          })(
            <Select mode="multiple" placeholer="请选择">
              {brand && brand.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...{
            labelCol: {
              span: 4,
            },
            wrapperCol: {
              span: 18,
            },
          }
          }
          label="操作说明"
        >
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
