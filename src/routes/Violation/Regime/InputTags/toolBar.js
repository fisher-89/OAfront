import React, { PureComponent } from 'react';
import {
  Tag,
} from 'antd';
import './index.less';

export default class ToolBar extends PureComponent {
  constructor(props) {
    super(props);
    const { makeContents } = this.props;
    makeContents();
    this.state = {
      rules: {
        symbol: {
          color: 'volcano',
          title: '运算符号',
          content: {},
        },
        system: {
          color: 'blue',
          title: '系统变量',
          content: {},
        },
      },
    };
  }


  componentDidMount() {
    this.initStateConent(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.content !== this.props.content) {
      this.initStateConent(newProps);
    }
  }


  setPropsContent = () => {
    const { rules } = this.state;
    let contents = {};
    Object.keys(rules).forEach((key) => {
      contents = {
        ...contents,
        ...rules[key].content,
      };
    });
    this.props.makeContents(contents);
  };

  initStateConent = (newProps) => {
    const { content: { math, operator } } = newProps;
    if (!math || !operator) {
      return;
    }
    const { rules, rules: { system, symbol } } = this.state;
    const sysContent = {};
    math.forEach((item) => {
      sysContent[`{{${item.key}}}`] = item.name;
    });
    const symContent = {};
    operator.forEach((item) => {
      symContent[`{<${item.id}>}`] = item.code;
    });
    this.setState({
      rules: {
        ...rules,
        system: {
          ...system,
          content: sysContent,
        },
        symbol: {
          ...symbol,
          content: symContent,
        },
      },
    }, this.setPropsContent);
  }

  render() {
    const { rules } = this.state;
    const { plusItem } = this.props;

    return (
      <div>
        {Object.keys(rules).map((key, index) => {
          if (Object.keys(rules[key].content).length === 0) {
            return '';
          }
          return (
            <div key={key}>
              <label> {`${rules[key].title} ：`} </label>
              {Object.keys(rules[key].content).map((item, count) => {
                const content = rules[key].content[item];
                const k = `${index}-${count}`;
                return (
                  <Tag
                    key={k}
                    onClick={() => plusItem(item)}
                    color={rules[key].color}
                  >
                    {content}
                  </Tag>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}
