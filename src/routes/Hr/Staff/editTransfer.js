import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Select, Row, Col, Button } from 'antd';

import { makePositionData } from '../../../utils/utils';

import OAFrom from '../../../components/OAForm';

const FormItem = OAFrom.Item;
const { SearchTable, DatePicker } = OAFrom;
const { Option } = Select;

@connect(({ brand, department, position, loading }) => ({
  brand: brand.brand,
  brandLoading: loading.models.brand,
  department: department.department,
  departmentLoading: loading.models.department,
  position: position.position,
  positionLoading: loading.models.position,
}))

@OAForm.Config
@OAForm.create({
  onValuesChange(props, changeValues, allValues) {
    props.onChange(allValues);
    Object.keys(changeValues).forEach(key => props.handleFieldsError(key));
  },
})
export default class extends PureComponent {
  constructor(props) {
    super(props);
    const { position, form, bindForm } = props;
    bindForm(form);
    this.state = {
      position: position || [],
      // positionId: staffInfo.position_id,
    };
  }

  componentDidMount() {
    const brandId = this.props.staffInfo.brand_id;
    this.handleChange(brandId, true);
  }

  // componentWillReceiveProps(newProps) {
  //   if (newProps.staffInfo !== this.props.staffInfo) {
  //     this.setState({ positionId: newProps.staffInfo.postion_id });
  //   }
  // }

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

  handleSubmitSuccess = (e) => {
    return e;
  };

  render() {
    const { brand, department } = this.props;
    const { position } = this.state;
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
    // const initialFieldsValue = {
    //   ...staffInfo,
    //   position_id: positionId,
    // };
    return (
      <OAFrom
        form={this.props.form}
      >
        <Row>
          <Col {...fieldsBoxLayout}>
            <FormItem label="姓名" {...formItemLayout}>
              <Input placeholder="请输入" name="realname" disabled />
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label="调离" {...formItemLayout}>
              <Button type="danger" icon="logout" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col {...fieldsBoxLayout}>
            <FormItem label="部门" required {...formItemLayout}>
              <Select name="department_id" placeholer="请选择">
                {department && department.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                  );
                })}
              </Select>
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label="状态" required {...formItemLayout}>
              <Select name="status_id" placeholer="请选择">
                <Option key="-1" value={1}>试用期</Option>
                <Option key="2" value={2}>在职</Option>
                <Option key="3" value={3}>离职</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col {...fieldsBoxLayout}>
            <FormItem label="品牌" required {...formItemLayout}>
              <Select name="brand_id" placeholer="请选择" onChange={this.handleChange}>
                {brand && brand.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                  );
                })}
              </Select>
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label="职位" required {...formItemLayout}>
              <Select name="position_id" placeholer="请选择">
                <Option key="-1" value="">--请选择--</Option>
                {position.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                  );
                })}
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col {...fieldsBoxLayout}>
            <FormItem label="店铺编号" {...formItemLayout}>
              <SearchTable
                module="shop"
                name={{
                  shop_sn: 'shop_sn',
                }}
                showName="shop_sn"
                placeholder="请选择"
              />
            </FormItem>
          </Col>
          <Col {...fieldsBoxLayout}>
            <FormItem label="执行时间" name="operate_at" required {...formItemLayout}>
              <DatePicker />
            </FormItem>
          </Col>
        </Row>
        <FormItem label="操作说明" {...formItemLayout} name="operation_remark">
          <Input.TextArea
            placeholder="最大长度100个字符"
            autosize={{
              minRows: 4,
              maxRows: 6,
            }}
          />
        </FormItem>
      </OAFrom>
    );
  }
}
