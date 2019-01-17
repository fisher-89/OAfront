import React, { PureComponent } from 'react';
import {
  Tag,
} from 'antd';
import styles from './index.less';

export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rules: {
        volcano: /({<\w+>})+/,
        blue: /(\{\{\w+\}\})+/,
        default: /(\{\?\w+(\.\*\.)?\w*\?\})/,
      },
      contents: {
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
    const { contents } = this.state;
    let symbol = {};
    Object.keys(contents).forEach((key) => {
      symbol = {
        ...symbol,
        ...contents[key].content,
      };
    });
    this.makeContents(symbol);
  };

  makeContents = (contents) => {
    this.setState({ contents });
  };

  initStateConent = (newProps) => {
    const { content: { math, operator } } = newProps;
    if (!math || !operator) {
      return;
    }
    const { contents, contents: { system, symbol } } = this.state;
    const sysContent = {};
    math.forEach((item) => {
      sysContent[`{{${item.key}}}`] = item.name;
    });
    const symContent = {};
    operator.forEach((item) => {
      symContent[`{<${item.id}>}`] = item.code;
    });
    this.setState({
      contents: {
        ...contents,
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
          if (color === 'volcano') {
            temp = (
              <span {...tagProps} className={styles.fuhao}>{contents[item]}</span>
            );
          } else {
            if (color !== 'default') {
              tagProps.color = color;
            }
            temp = (
              <Tag {...tagProps}>{contents[item]}</Tag>
            );
          }
        }
      });
    }

    return temp;
  };

  render() {
    const html = this.makeContent();
    return (
      <div className={styles.class}>
        <div className={styles.kuandu}>
          <div>
            <label>{this.props.title} ： {this.props.value}</label>
          </div>
          <div className={styles.textkuang}>
            <label>表达式 ：</label>
            {html.map((item, index) => {
            return this.compileHtml(item, index);
          })}
          </div>
        </div>
      </div>
    );
  }
}
