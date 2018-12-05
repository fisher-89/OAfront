import React, { PureComponent, Fragment } from 'react';
import {
  Input,
  Select,
} from 'antd';

import district from '../../../assets/district';
import { makeInitialValue, dontInitialValue } from '../../../utils/utils';

const { Option } = Select;
const InputGroup = Input.Group;
const disableds = {
  province: false,
  city: false,
  county: false,
  address: false,
};
export default class Address extends PureComponent {
  constructor(props) {
    super(props);
    const value = makeInitialValue(this.props.name, this.props.value || {});
    const province = district.filter(item => `${item.parent_id}` === '0');
    const { city, county } = this.makeSelectOption(value);
    this.state = {
      city,
      county,
      province,
      value: {
        province_id: value.province_id || undefined,
        city_id: value.city_id || undefined,
        county_id: value.county_id || undefined,
        address: value.address || undefined,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = makeInitialValue(nextProps.name, nextProps.value || {});
      const { city, county } = this.makeSelectOption(value);
      this.setState({ value, city, county });
    }
  }

  setPropsValue = () => {
    const { onChange, name } = this.props;
    const { value } = this.state;
    onChange(dontInitialValue(name, value));
  }

  makeSelectOption = (value) => {
    let city = [];
    if (value && value.province_id) {
      city = district.filter(item => `${item.parent_id}` === `${value.province_id}`);
    }
    let county = [];
    if (value && value.city_id) {
      county = district.filter(item => `${item.parent_id}` === `${value.city_id}`);
    }
    return { city, county };
  }

  makeCity = (value) => {
    const city = district.filter(item => `${item.parent_id}` === `${value}`);
    const newValue = {
      province_id: value,
      city_id: undefined,
      county_id: undefined,
      address: undefined,
    };
    this.setState({ city, value: newValue }, this.setPropsValue);
  };

  makeCounty = (cityId) => {
    const { value } = this.state;
    const county = district.filter(item => `${item.parent_id}` === `${cityId}`);
    this.setState({
      county,
      value: {
        ...value,
        city_id: cityId,
        county_id: undefined,
        address: undefined,
      },
    }, this.setPropsValue);
  };

  render() {
    const { province, city, county, value } = this.state;
    const { disabled, visibles } = this.props;
    const able = {
      ...disableds,
      ...disabled,
    };
    const style = { width: '33.33%' };
    return (
      <Fragment>
        <InputGroup compact>
          {!visibles.province && (
            <Select
              placeholder="省"
              key="province_id"
              onChange={this.makeCity}
              disabled={able.province}
              value={`${value.province_id || ''}`}
              style={{ ...style }}
            >
              <Option value="" key="province" >---省---</Option>
              {province.map((item) => {
                return (<Option key={`${item.id}`}>{item.name}</Option>);
              })}
            </Select>
          )}
          {!visibles.city && (
            <Select
              key="city_id"
              placeholder="市"
              disabled={able.city}
              onChange={this.makeCounty}
              value={`${value.city_id || ''}`}
              style={{ ...style }}
            >
              <Option value="" key="city" >---市---</Option>
              {city.map((item) => {
                return (<Option key={`${item.id}`}>{item.name}</Option>);
              })}
            </Select>
          )}
          {!visibles.county && (
            <Select
              key="countyId"
              onChange={(countyId) => {
                this.setState({
                  value: {
                    ...value,
                    county_id: countyId,
                    address: undefined,
                  },
                }, this.setPropsValue);
              }}
              placeholder="区"
              disabled={able.county}
              value={`${value.county_id || ''}`}
              style={{ ...style }}
            >
              <Option value="" key="county_id" >---区---</Option>
              {county.map((item) => {
                return (<Option key={`${item.id}`}>{item.name}</Option>);
              })}
            </Select>
          )}
        </InputGroup>
        {!visibles.address && (
          <Input.TextArea
            onChange={(e) => {
              const address = e.target.value;
              if (address.length === 50) return;
              this.setState({ value: { ...value, address } }, this.setPropsValue);
            }}
            disabled={able.address}
            value={value.address}
            placeholder="详细地址，请输入0-50个字符"
          />
        )}
      </Fragment>
    );
  }
}

Address.defaultProps = {
  onChange: () => {
  },
  name: {
    province_id: 'province_id',
    city_id: 'city_id',
    county_id: 'county_id',
    address: 'address',
  },
  disabled: disableds,
  visibles: disableds,
};
