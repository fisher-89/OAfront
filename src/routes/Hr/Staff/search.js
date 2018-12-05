/**
 * Created by Administrator on 2018/4/11.
 */
import React, { PureComponent } from 'react';
import { Input } from 'antd';
import { mapValues, find } from 'lodash';
import district from '../../../assets/district';
import { getInitSearchProps } from '../../../utils/utils';
import OAForm, { SearchTable, Address } from '../../../components/OAForm';


const FormItem = OAForm.Item;
const valueKey = {
  id_card_number: {
    title: '身份证号码',
  },
};

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


export default class Search extends PureComponent {
  addressChange = (name, title) => {
    return (value) => {
      const { onChange } = this.props;
      const response = { ...value };
      const filterText = mapValues(response, (filterValue) => {
        const text = (find(district, ['id', parseInt(filterValue, 10)]) || {}).name || '';
        return { text };
      });
      filterText[`${name}_province_id`].title = `${title}省`;
      filterText[`${name}_province_id`].same = name;
      filterText[`${name}_province_id`].number = 1;
      filterText[`${name}_city_id`].title = `${title}市`;
      filterText[`${name}_city_id`].same = name;
      filterText[`${name}_city_id`].number = 2;
      filterText[`${name}_county_id`].title = `${title}区`;
      filterText[`${name}_county_id`].same = name;
      filterText[`${name}_county_id`].number = 3;
      onChange(null, filterText)(response);
    };
  }

  render() {
    const { onChange, initialValue } = this.props;
    const propsValue = getInitSearchProps(initialValue, onChange, valueKey);
    const living = initialValue.living_province_id ? {
      living_province_id: initialValue.living_province_id,
      living_city_id: initialValue.living_city_id,
      living_county_id: initialValue.living_county_id,
    } : {};
    const household = initialValue.household_province_id ? {
      household_province_id: initialValue.household_province_id,
      household_city_id: initialValue.household_city_id,
      household_county_id: initialValue.household_county_id,
    } : {};
    const shopValue = (initialValue.shop_sn || []).map(item => ({ shop_sn: item }));
    return (
      <React.Fragment>

        <FormItem {...formItemLayout1} label="户口地址">
          <Address
            name={{
              household_city_id: 'city_id',
              household_county_id: 'county_id',
              household_province_id: 'province_id',
            }}
            value={household}
            visibles={{ address: true }}
            onChange={this.addressChange('household', '户口')}
          />
        </FormItem>

        <FormItem {...formItemLayout1} label="现居地址">
          <Address
            name={{
              living_city_id: 'city_id',
              living_county_id: 'county_id',
              living_province_id: 'province_id',
            }}
            value={living}
            visibles={{ address: true }}
            onChange={this.addressChange('living', '现居')}
          />
        </FormItem>

        <FormItem {...formItemLayout1} label="身份证">
          <Input placeholder="请输入" {...propsValue.id_card_number} />
        </FormItem>

        <FormItem {...formItemLayout1} label="店铺编号">
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
      </React.Fragment>
    );
  }
}

