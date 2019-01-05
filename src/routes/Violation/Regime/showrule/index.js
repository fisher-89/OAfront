import React, { PureComponent } from 'react';
import {
  Tag,
} from 'antd';
import ToolBar from './toolBar';
import './index.less';

export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rules: {
        volcano: /({<\w+>})+/,
        blue: /(\{\{\w+\}\})+/,
        default: /(\{\?\w+(\.\*\.)?\w*\?\})/,
      },
      contents: {},
    };
  }


  makeContent = () => {
    const { value } = this.props;
    let newValue = [];
    if (value) {
      newValue = value.split(/(\{\{\w+\}\})|(\{\?\w+\?\})|(\{\?\w+\.\*\.\w*\?\})|(\{<\d+>\})/);
      newValue = newValue.filter(item => item !== undefined);
    }
    return newValue;
  };

  compileHtml = (item, index) => {
    const { rules, contents } = this.state;
    let temp = item;
    if (contents) {
      Object.keys(rules).forEach((color) => {
        if (item.search(rules[color]) !== -1 && contents[item]) {
          const tagProps = { key: `tag-${index}` };
          if (color !== 'default') {
            tagProps.color = color;
          }
          temp = (
            <Tag {...tagProps}>{contents[item]}</Tag>
          );
        }
      });
    }

    return temp;
  };

  render() {
    const html = this.makeContent();
    const { content } = this.props;
    return (
      <div className="kuandu">
        <div>
          <label>{this.props.title} ： {this.props.value}</label>
        </div>
        <div className="textkuang">
          <label>表达式 ：</label>
          {html.map((item, index) => {
            return this.compileHtml(item, index);
          })}
        </div>
        <div
          className="displayed"
        >
          <ToolBar
            content={content}
            fields={this.props.fields}
            makeContents={(contents) => {
            this.setState({ contents });
          }}
          />
        </div>
      </div>
    );
  }
}
