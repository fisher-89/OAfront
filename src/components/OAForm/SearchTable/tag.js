import React from 'react';
import {
  Tag,
  Tooltip,
  Icon,
} from 'antd';

export default class extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
      return true;
    } else if (JSON.stringify(nextProps.disabled) !== JSON.stringify(this.props.disabled)) {
      return true;
    }
    return false;
  }


  handleTagRemove = (removedTag) => {
    this.props.setTagSelectedValue(removedTag);
  };

  render() {
    const { value, showName, valueName } = this.props;

    let tagsData = [];
    if (value && value.length > 0) {
      tagsData = value.map((item, index) => {
        if (typeof item === 'object') {
          return {
            value: item[valueName],
            label: item[showName] || item,
            key: index,
          };
        } else {
          return {
            value: showName,
            label: item || '',
            key: index,
          };
        }
      });
    }
    const click = this.props.disabled ? null : {
      onClick: () => {
        this.props.handleModelVisble(true);
      },
    };
    const color = this.props.disabled ? '#f5f5f5' : '#fff';
    const mouseStyle = this.props.disabled ? 'not-allowed' : 'pointer';
    const tags = tagsData.map((item, index) => {
      const tag = item.label;
      const isLongTag = tag.length > 20;
      const key = `tag${item.value}-${index}`;
      const tagElem = (
        <Tag
          key={key}
          style={{ cursor: mouseStyle, background: color }}
          closable={!this.props.disabled}
          afterClose={() => this.handleTagRemove(item.key)}
        >
          {isLongTag ? `${tag.slice(0, 20)}...` : tag}
        </Tag>
      );
      return isLongTag ? <Tooltip title={tag} key={key}>{tagElem}</Tooltip> : tagElem;
    });

    return (
      <div>
        {tags}
        <Tag
          key="tag.add"
          {...click}
          style={{ cursor: mouseStyle, background: color, borderStyle: 'dashed' }}
        >
          <Icon type="plus" /> {this.props.placeholder}
        </Tag>
      </div>
    );
  }
}
