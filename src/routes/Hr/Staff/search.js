/**
 * Created by Administrator on 2018/4/11.
 */
import React, { PureComponent } from 'react';
import { Cascader, Col, Input } from 'antd';
import { mapValues, find } from 'lodash';
import district, { treeDistrict } from '../../../assets/district';
import { getInitSearchProps } from '../../../utils/utils';
import OAForm, { SearchTable } from '../../../components/OAForm';
import { formItemLayout } from '../../../components/OATable/MoreSearch';

const districtData = treeDistrict;

const FormItem = OAForm.Item;
const valueKey = {
  id_card_number: {
    title: '身份证号码',
  },
};

export default class Search extends PureComponent {
  cascaderChange = (name, title) => {
    return (value) => {
      const response = {
        [`${name}_city_id`]: value[1],
        [`${name}_county_id`]: value[2],
        [`${name}_province_id`]: value[0],
      };
      const { onChange } = this.props;
      const filterText = mapValues(response, (filterValue) => {
        const text = find(district, ['id', filterValue]).name;
        return { text };
      });
      filterText[`${name}_province_id`].title = `${title}省`;
      filterText[`${name}_city_id`].title = `${title}市`;
      filterText[`${name}_county_id`].title = `${title}区`;
      onChange(null, filterText)(response);
    };
  }

  render() {
    const { onChange, initialValue, colSpan } = this.props;
    const propsValue = getInitSearchProps(initialValue, onChange, valueKey);
    const living = initialValue.living_province_id ? [
      initialValue.living_province_id,
      initialValue.living_city_id,
      initialValue.living_county_id,
    ] : [];
    const household = initialValue.household_province_id ? [
      initialValue.household_province_id,
      initialValue.household_city_id,
      initialValue.household_county_id,
    ] : [];
    const shopValue = (initialValue.shop_sn || []).map(item => ({ shop_sn: item }));
    return (
      <React.Fragment>
        <Col span={colSpan}>
          <FormItem {...formItemLayout} label="店铺编号">
            <SearchTable.Shop
              multiple
              value={shopValue}
              showName="shop_sn"
              name={{ shop_sn: 'shop_sn' }}
              onChange={(value) => {
                const changeValue = value.map(item => item.shop_sn);
                onChange('shop_sn', { title: '店铺编号', text: changeValue })(changeValue);
              }}
            />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem {...formItemLayout} label="身份证">
            <Input placeholder="请输入" {...propsValue.id_card_number} />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem {...formItemLayout} label="户口地址">
            <Cascader
              value={household}
              options={districtData}
              placeholder="请输入地区"
              style={{ width: '100%' }}
              getPopupContainer={trigger => trigger}
              onChange={this.cascaderChange('household', '户口')}
            />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem {...formItemLayout} label="现居地址">
            <Cascader
              value={living}
              options={districtData}
              placeholder="请输入地区"
              style={{ width: '100%' }}
              getPopupContainer={trigger => trigger}
              onChange={this.cascaderChange('living', '现居')}
            />
          </FormItem>
        </Col>
      </React.Fragment>
    );
  }
}

