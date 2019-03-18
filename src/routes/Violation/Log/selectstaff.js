import React, { PureComponent } from 'react';
import { Select, Tooltip } from 'antd';
import { connect } from 'dva';
import { debounce } from 'lodash';

const { Option } = Select;
@connect(({ staffs }) => ({
  staffs: staffs.staff,
}))
export default class extends PureComponent {
  searchStaff = debounce((params) => {
    this.fetchOption(params);
  }, 500)

  fetchOption = (name) => {
    const { dispatch } = this.props;
    const params = {
      filters: `realname~${name};status_id>=0;`,
    };
    if (name) {
      dispatch({ type: 'staffs/fetchStaff', payload: params });
    }
  }

  render() {
    const { staffname, staffs, onChange, values } = this.props;
    return (
      <Select
        value={staffname}
        onChange={(value, option) => onChange(value, option.props.name, values)}
        style={{ minWidth: 120 }}
        showArrow={false}
        showSearch
        onSearch={e => this.searchStaff(e)}
        optionLabelProp="name"
        filterOption={false}
      >
        {(staffs.data || []).map((item) => {
          return (
            <Option
              value={item.staff_sn}
              key={item.staff_sn}
              name={item.realname}
            >
              <Tooltip placement="topLeft" title={`${item.realname} ${item.department.full_name}`}><span>{item.realname}  {item.department.full_name}</span></Tooltip>
            </Option>
          );
        })}
      </Select>
    );
  }
}
