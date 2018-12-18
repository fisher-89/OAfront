import React, { PureComponent, Fragment } from 'react';
import { Cascader, Col } from 'antd';
import { mapValues, find } from 'lodash';
import OAForm from '../../../components/OAForm';
import district, { treeDistrict } from '../../../assets/district';

const districtData = treeDistrict;
const FormItem = OAForm.Item;
const formItemLayout1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

export default class extends PureComponent {
  cascaderChange = (name, title) => {
    return (value) => {
      const response = {
        city_id: value[1],
        county_id: value[2],
        province_id: value[0],
      };
      const { onChange } = this.props;
      const filterText = mapValues(response, (filterValue) => {
        const text = (find(district, ['id', filterValue]) || {}).name || '';
        return { text };
      });
      filterText.province_id.title = `${title}省`;
      filterText.city_id.title = `${title}市`;
      filterText.county_id.title = `${title}区`;
      onChange(null, filterText)(response);
    };
  }
  render() {
    const { colSpan, initialValue } = this.props;
    const shopAddress = initialValue.province_id ? [
      initialValue.province_id,
      initialValue.city_id,
      initialValue.county_id,
    ] : [];
    return (
      <Fragment>
        <Col span={colSpan}>
          <FormItem {...formItemLayout1} label="所在地区">
            <Cascader
              value={shopAddress}
              placeholder="请选择"
              options={districtData}
              getPopupContainer={trigger => trigger}
              style={{ width: '95%' }}
              onChange={this.cascaderChange('', '所在地区')}
            />
          </FormItem>
        </Col>
      </Fragment>
    );
  }
}
