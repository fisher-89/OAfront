/**
 * Created by Administrator on 2018/4/11.
 */
import React, { PureComponent } from 'react';
import { Cascader } from 'antd';
import { treeDistrict } from '../../../assets/district';
import { getInitSearchProps } from '../../../utils/utils';
import OAForm, { SearchTable } from '../../../components/OAForm';

const district = treeDistrict;

const FormItem = OAForm.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const valueKey = ['shop_sn', 'id_card_number'];

export default class Search extends PureComponent {
  cascaderChange = (name) => {
    return (value) => {
      const response = {
        [`${name}_city_id`]: value[1],
        [`${name}_county_id`]: value[2],
        [`${name}_province_id`]: value[0],
      };
      const { onChange } = this.props;
      onChange()(response);
    };
  }

  render() {
    const { onChange, initialValue } = this.props;
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
    return (
      <div style={{ width: 400 }}>
        <FormItem {...formItemLayout} label="店铺搜索">
          <SearchTable.Shop
            multiple
            name="shop_sn"
            {...propsValue.shop_sn}
          />
        </FormItem>
        <FormItem {...formItemLayout} label="户口所在地">
          <Cascader
            value={household}
            options={district}
            placeholder="请输入地区"
            style={{ width: '100%' }}
            getPopupContainer={trigger => trigger}
            onChange={this.cascaderChange('household')}
          />
        </FormItem>
        <FormItem {...formItemLayout} label="现居住地">
          <Cascader
            value={living}
            options={district}
            placeholder="请输入地区"
            style={{ width: '100%' }}
            getPopupContainer={trigger => trigger}
            onChange={this.cascaderChange('living')}
          />
        </FormItem>
      </div>
    );
  }
}

