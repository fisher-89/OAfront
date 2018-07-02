import React from 'react';
import {
  Input,
  Select,
} from 'antd';

const { Option } = Select;

export default class EdiTableCell extends React.Component {
  state = {
    value: this.props.value,
  }

  handleChange = (e) => {
    const formItemValue = e.target ? e.target.value : e;
    this.setState({ value: formItemValue });
  }

  check = () => {
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }

  makeFormItemType = () => {
    const { type: { name }, type, dataSource } = this.props;
    const { value } = this.state;
    let item;
    switch (name) {
      case 'select':
        // console.log(type);
        item = (
          <Select
            value={value}
            mode={type.mode || 'combobox'}
            onChange={this.handleChange}
            style={{
              width: '200px',
            }}
          >
            {dataSource.map((data) => {
              return (
                <Option
                  value={data[type.value]}
                  key={data[type.value]}
                >
                  {data[type.showName]}
                </Option>
              );
            })}
          </Select>
        );
        break;
      default:
        item = (
          <Input
            value={value}
            onChange={this.handleChange}
            onPressEnter={this.check}
          />
        );
        break;
    }
    return item;
  }

  render() {
    return (
      <div className="editable-cell">
        {this.makeFormItemType()}
      </div>
    );
  }
}
