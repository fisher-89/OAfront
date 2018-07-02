import React from 'react';
import { Input, Icon } from 'antd';
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
    this.setState({ editable: true });
  }

  render() {
    const { value, editable } = this.state;
    const { type } = this.props;
    return (
      <div className="editable-cell">
        {
          editable ? (
            <Input
              {...{ type } || null}
              value={value}
              onChange={this.handleChange}
              onPressEnter={this.check}
              suffix={
                <Icon
                  type="check"
                  className="editable-cell-icon-check"
                  onClick={this.check}
                />
              }
            />
          ) : (
            <div style={{ paddingRight: 24 }}>
              {value}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
            )
        }
      </div>
    );
  }
}
