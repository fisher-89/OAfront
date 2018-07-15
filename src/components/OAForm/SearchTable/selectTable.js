/**
 * Created by Administrator on 2018/3/31.
 */
import React from 'react';
import OATable from '../../OATable/index';

export default class SelectTable extends React.Component {
  constructor(props) {
    super(props);
    const { selectValue } = props;
    this.state = {
      cursor: 'default',
      value: selectValue || [],
    };
  }

  componentWillReceiveProps(newProps) {
    const { selectValue } = newProps;
    if (selectValue !== this.props.selectValue) {
      this.setState({ value: [...selectValue] });
    }
  }

  clickSelectValue = (selectedRows) => {
    const {
      data,
      index,
      multiple,
    } = this.props;
    let { value } = this.state;
    if (multiple) {
      const valueKey = value.map(item => item[index]);
      const removeValIndex = valueKey.indexOf(selectedRows[index]);
      if (removeValIndex !== -1) {
        value = value.filter((_, i) => i !== removeValIndex);
      } else {
        data.forEach((item) => {
          if (item[index] === selectedRows[index]) {
            value.push(item);
          }
        });
      }
    } else {
      value = [selectedRows];
    }
    this.handelChange('', value);
  };

  handleRow = (record) => {
    return {
      onMouseEnter: () => {
        this.setState({ cursor: 'pointer' });
      },
      onMouseLeave: () => {
        this.setState({ cursor: 'default' });
      },
      onClick: () => {
        this.clickSelectValue(record);
      },
    };
  };

  handelChange = (_, selectedRows) => {
    const { setSelectedValue } = this.props;
    const value = [];
    selectedRows.forEach((item) => {
      const temp = this.makeValueKey(item);
      value.push(temp);
    });
    this.setState({ value }, () => {
      setSelectedValue([...value]);
    });
  };

  makeValueKey = (item) => {
    const temp = {};
    const { name } = this.props;
    Object.keys(name).forEach((key) => {
      temp[name[key]] = item[name[key]];
    });
    return temp;
  };

  // dotFieldsValue = (data, parentKey) => {
  //   let response = {};
  //   Object.keys(data || {}).forEach((key) => {
  //     const value = data[key];
  //     const newKey = parentKey === undefined ? key : `${parentKey}.${key}`;
  //     if (Array.isArray(value)) {
  //       if (typeof value[0] === 'object') {
  //         response = {
  //           ...response,
  //           ...this.dotFieldsValue(value, newKey),
  //         };
  //       } else {
  //         response[newKey] = value;
  //       }
  //     } else if (typeof value === 'object') {
  //       response = {
  //         ...response,
  //         ...this.dotFieldsValue(value, newKey),
  //       };
  //     } else {
  //       response[newKey] = value;
  //     }
  //   });
  //   return response;
  // }

  render() {
    const {
      columns,
      data,
      multiple,
      loading,
      fetchDataSource,
      total,
      index,
    } = this.props;

    const { value } = this.state;
    const selection = multiple ? {
      rowSelection: {
        type: 'checkbox',
        onChange: this.handelChange,
        selectedRowKeys: value.map(item => item[index]),
      },
    } : {};
    // const dataSource = data && data.map((item) => {
    //   return this.dotFieldsValue(item);
    // });
    return (
      <div style={{ cursor: this.state.cursor }}>
        <OATable
          {...selection}
          columns={columns}
          data={data}
          total={total}
          loading={loading}
          fetchDataSource={fetchDataSource}
          serverSide
          onRow={this.handleRow}
        />
      </div>
    );
  }
}
