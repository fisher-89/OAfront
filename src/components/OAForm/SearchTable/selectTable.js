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

  clickSelectValue = (selectedRow) => {
    const {
      index,
      multiple,
    } = this.props;
    const { value } = this.state;
    const selectedKey = selectedRow[index];
    let valueKey;
    if (multiple) {
      valueKey = value.map(item => item[index]);
      const hasIndex = valueKey.indexOf(selectedKey) !== -1;
      if (hasIndex) {
        valueKey = valueKey.filter(item => item !== selectedKey);
      } else {
        valueKey.push(selectedKey);
      }
    } else {
      valueKey = [selectedKey];
    }
    this.handelChange(valueKey, [selectedRow]);
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

  handelChange = (selectedRowKeys, selectedRows) => {
    const { setSelectedValue, index } = this.props;
    const { value } = this.state;
    const newValue = selectedRowKeys.map((item) => {
      const selectedRow = selectedRows.find(row => row[index] === item);
      return selectedRow || value.find(row => row[index] === item);
    });
    this.setState({ value: newValue }, () => {
      setSelectedValue([...newValue]);
    });
  };

  render() {
    const {
      columns,
      data,
      multiple,
      loading,
      fetchDataSource,
      total,
      index,
      scroll,
      serverSide,
    } = this.props;

    const { value } = this.state;
    const selection = multiple ? {
      rowSelection: {
        type: 'checkbox',
        onChange: this.handelChange,
        selectedRowKeys: value.map(item => item[index]),
      },
    } : {};
    return (
      <div style={{ cursor: this.state.cursor }}>
        <OATable
          {...(serverSide !== undefined ? { serverSide } : { serverSide: true })}
          {...{ scroll: scroll || { x: 760 } }}
          {...selection}
          columns={columns}
          data={data}
          total={total}
          loading={loading}
          onRow={this.handleRow}
          fetchDataSource={fetchDataSource}
        />
      </div>
    );
  }
}
