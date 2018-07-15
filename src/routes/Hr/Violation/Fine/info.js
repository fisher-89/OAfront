import React, { Fragment } from 'react';
import {
  Form,
  Switch,
  Row,
  Col,
  Select,
  Input,
} from 'antd';
import OAForm from '../../../../components/OAForm';

const FormItem = Form.Item;
const {
  SearchTable,
  DatePicker,
} = OAForm;
const { Option } = Select;

export function fineInfo(regimeList, handleFinePrice) {
  return (
    <Fragment>
      <Row>
        <Col {...{
          xs: 24, sm: 15,
        }}
        >
          <FormItem
            required
            label="员工"
            {...{
              labelCol: { xs: { span: 24 }, sm: { span: 8 } },
              wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, lg: { span: 12 } },
            }}
          >
            <SearchTable.Staff
              name={{
                criminal_sn: 'staff_sn',
                criminal_name: 'realname',
                criminal_brandId: 'brand_id',
                criminal_brand: 'brand.name',
                criminal_department_d: 'department_id',
                criminal_department: 'department.full_name',
                criminal_position_id: 'position_id',
                criminal_position: 'position.name',
                criminal_shopSn: 'shop_sn',
              }}
              showName="realname"
              placeholder="请选择员工"
              onChange={(value, newFieldsValue) => {
                const temp = newFieldsValue;
                handleFinePrice({ info: value, rule: null });
                temp.ruleId = null;
                return temp;
              }}
            />
          </FormItem>
        </Col>
        <Col {...{
          xs: 24, sm: 8,
        }}
        >
          <FormItem
            required
            label="支付"
            name="has_paid"
            {...{
              labelCol: { xs: { span: 24 }, sm: { span: 8 } },
              wrapperCol: { xs: { span: 24 }, sm: { span: 12 }, lg: { span: 12 } },
            }}
          >
            <Switch />
          </FormItem>
        </Col>
      </Row>
      <FormItem
        label="店铺代码"
      >
        <SearchTable.Shop
          name={{
            criminal_shop_sn: 'shop_sn',
          }}
          showName="shop_sn"
          placeholder="请选择"
        />
      </FormItem>
      <FormItem
        required
        label="违纪类型"
        name="rule_id"
      >
        <Select
          placeholder="请选择"
          onChange={(value) => {
            handleFinePrice({ rule: value });
          }}
        >
          {regimeList.map((item) => {
            return (
              <Option value={item.id} key={item.id}>{item.name}</Option>
            );
          })}
        </Select>
      </FormItem>
      <FormItem
        required
        label="金额"
        name="price"
      >
        <Input />
      </FormItem>

      <FormItem
        required
        label="违纪时间"
        name="disciplined_at"
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
        />
      </FormItem>
      <FormItem
        required
        label="开单时间"
        name="Billing_at"
      >
        <DatePicker />
      </FormItem>
      <FormItem
        required
        label="开单人"
      >
        <SearchTable.Staff
          name={{
            punisher_name: 'realname',
            punisher_sn: 'staff_sn',
          }}
          showName="realname"
          placeholder="请选择员工"
        />
      </FormItem>
    </Fragment>
  );
}
