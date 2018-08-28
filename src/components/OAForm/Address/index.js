import React, { PureComponent, Fragment } from 'react';
import {
  Input,
  Select,
} from 'antd';

import districtData from '../../../../public/district';

const { district } = districtData;
const { Option } = Select;
const InputGroup = Input.Group;

export default class Address extends PureComponent {
  constructor(props) {
    super(props);
    const value = this.props.value || {};
    this.state = {
      province: [],
      city: [],
      county: [],
      value: {
        province_id: value.province_id || undefined,
        city_id: value.city_id || undefined,
        county_id: value.county_id || undefined,
        address: value.address || undefined,
      },
    };
  }

  componentDidMount() {
    this.makeSelectOption();
  }

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.value)
      !==
      JSON.stringify(this.props.value)
    ) {
      this.setState({ value: nextProps.value }, this.makeSelectOption);
    }
  }

  setPropsValue = () => {
    const { onChange, name } = this.props;
    const { value } = this.state;
    const newValue = {};
    Object.keys(name).forEach((key) => {
      newValue[key] = value[name[key]];
    });
    onChange(newValue);
  }

  makeSelectOption = () => {
    const { value } = this.state;
    const province = district.filter(item => item.parent_id === 0);
    let city = [];
    if (value && value.province_id) {
      city = district.filter(item => item.parent_id === value.province_id);
    }
    let county = [];
    if (value && value.city_id) {
      county = district.filter(item => item.parent_id === value.city_id);
    }
    this.setState({ province, city, county });
  }

  makeCity = (value) => {
    const city = district.filter(item => item.parent_id === value);
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
    const county = district.filter(item => item.parent_id === cityId);
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
    return (
      <Fragment>
        <InputGroup compact>
          <Select
            key="province_id"
            style={{ width: '33.33%' }}
            value={value.province_id}
            onChange={this.makeCity}
            placeholder="请选择"
          >
            {province.map((item) => {
              return (<Option key={item.id} value={item.id}>{item.name}</Option>);
            })}
          </Select>
          <Select
            key="city_id"
            style={{ width: '33.33%' }}
            value={value.city_id}
            onChange={this.makeCounty}
            placeholder="请选择"
          >
            {city.map((item) => {
              return (<Option key={item.id} value={item.id}>{item.name}</Option>);
            })}
          </Select>
          <Select
            key="countyId"
            style={{ width: '33.33%' }}
            onChange={(countyId) => {
              this.setState({
                value: {
                  ...value,
                  county_id: countyId,
                  address: undefined,
                },
              }, this.setPropsValue);
            }}
            value={value.county_id}
            placeholder="请选择"
          >
            {county.map((item) => {
              return (<Option key={item.id} value={item.id}>{item.name}</Option>);
            })}
          </Select>

        </InputGroup>
        <Input.TextArea
          onChange={(e) => {
            const address = e.target.value;
            this.setState({ value: { ...value, address } }, this.setPropsValue);
          }}
          value={value.address}
          placeholder="详细地址，请输入0-30个字符"
        />
      </Fragment>
    );
  }
}

Address.defaultProps = {
  onChange: () => { },
  name: {
    province_id: 'province_id',
    city_id: 'city_id',
    county_id: 'county_id',
    address: 'address',
  },
};
