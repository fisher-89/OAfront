import React from 'react';
import { Input } from 'antd';
import './tableCell.less';

export default class EditableCell extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || ' ',
      editable: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ value });
  }

  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }

  edit = () => {
    this.setState({ editable: true }, () => {
      this.input.input.focus();
    });
  }

  render() {
    const { value, editable } = this.state;
    const { type, style } = this.props;
    return (
      <div className="editable-cell" onClick={this.edit}>
        {
          editable ? (
            <Input
              {...{ type } || null}
              ref={(e) => { this.input = e; }}
              value={value}
              onChange={this.handleChange}
              onPressEnter={this.check}
              onBlur={this.check}
              style={{ ...style }}
            />
          ) : (
              value
            )
        }
      </div>
    );
  }
}
