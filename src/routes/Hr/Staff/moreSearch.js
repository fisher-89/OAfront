/**
 * Created by Administrator on 2018/4/11.
 */
import React, { PureComponent } from 'react';

import {
  Cascader,
  Input,
} from 'antd';
import district from '../../../../public/district.json';

import OAForm, { SearchTable } from '../../../components/OAForm';
import OATableSearch from '../../../components/OATable/search';

const FormItem = OAForm.Item;
@OAForm.create()
class Search extends PureComponent {
  state = {
    info: [],
    live: [],
    shop: [],
    cardNumber: '',
  };

  onFilter = (inputValue, path) => {
    const result = path.some((option) => {
      return option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
    });
    return result;
  };


  onChange = (value, key) => {
    this.setState({ [key]: value });
  };

  moreSearch = () => {
    const { getFieldsValue } = this.props.form;
    const formValue = getFieldsValue();
    const oldKey = ['household_province_id', 'household_city_id', 'household_county_id'];
    let info = {};
    if (formValue.id_card_number.length > 0) {
      info = { id_card_number: { like: formValue.id_card_number } };
    }

    if (formValue.shop.length > 0) {
      info = { shop_sn: { in: formValue.shop.map(item => item.shop_sn) } };
    }

    formValue.household.forEach((item, key) => {
      info[oldKey[key]] = item;
    });

    const nowKey = ['living_province_id', 'living_city_id', 'living_county_id'];
    formValue.living.forEach((item, key) => {
      info[nowKey[key]] = item;
    });

    this.props.search({ info });
  };

  resetMoreFilters = () => {
    this.setState({
      info: [],
      live: [],
      shop: [],
      cardNumber: '',
    }, () => {
      this.props.search({ info: {} });
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 25 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 25 },
        sm: { span: 15 },
      },
    };
    const { live, info, cardNumber, shop } = this.state;
    const { form: { getFieldDecorator, resetFields }, form } = this.props;
    // console.log(shop);
    return (
      <OAForm
        form={form}
        style={{ minWidth: 500 }}
        onSubmit={this.handleSubmit}
      >
        <FormItem
          {...formItemLayout}
          label="店铺搜索"
        >
          {getFieldDecorator('shop', {
            initialValue: shop,
          })(
            <Input type="hidden" />
          )}
          <SearchTable.Shop
            multiple
            name={{
              shop_sn: 'shop_sn',
            }}
            showName="shop_sn"
            value={shop}
            modalVisible={(visible) => {
              this.props.modalVisible(visible);
            }}
            onChange={(value) => {
              this.onChange(value, 'shop');
            }}
          />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="户口所在地"
        >
          {getFieldDecorator('household', {
            initialValue: info,
          })(
            <Input type="hidden" />
          )}
          <Cascader
            value={info}
            changeOnSelect
            options={district}
            placeholder="请输入地区"
            showSearch={this.onFilter}
            onChange={(value) => {
              this.onChange(value, 'info');
            }}
            getPopupContainer={trigger => trigger}
          />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="现居住地"
        >
          {getFieldDecorator('living', {
            initialValue: live,
          })(
            <Input type="hidden" />
          )}
          <Cascader
            value={live}
            changeOnSelect
            options={district}
            placeholder="请输入地区"
            showSearch={this.onFilter}
            onChange={(value) => {
              this.onChange(value, 'live');
            }}
            getPopupContainer={trigger => trigger}
          />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="身份证号"
        >
          {getFieldDecorator('id_card_number', {
            initialValue: cardNumber,
          })(
            <Input placeholder="请输入身份证" />
          )}
        </FormItem>
        <div className="ant-table-filter-dropdown-btns">
          <a className="ant-table-filter-dropdown-link confirm" onClick={this.moreSearch}>
            确定
          </a>
          <a
            className="ant-table-filter-dropdown-link clear"
            onClick={() => {
              resetFields();
              this.resetMoreFilters();
            }}
          >重置
          </a>
        </div>
      </OAForm>
    );
  }
}
export default OATableSearch(Search);
