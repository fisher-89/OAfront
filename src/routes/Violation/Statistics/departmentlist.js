import React, { PureComponent } from 'react';
import { Tree } from 'antd';
import TreeSort from './TreeSort';

const { TreeNode } = Tree;
export default class extends PureComponent {
  renderTreeNodes = (data) => {
    return data.map((item) => {
      const { setDepartment } = this.props;
      const content = (
        <React.Fragment>
          <a onClick={() => setDepartment(item)}>{item.name}</a>
        </React.Fragment>
      );
      if (item.children && item.children.length) {
        return (
          <TreeNode title={content} key={item.key} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode key={item.key} title={content} />
      );
    });
  }
  render() {
    const { department } = this.props;
    return (
      <TreeSort
        showLine
        rootPid={0}
        key="treeSort"
        renderTreeNodes={this.renderTreeNodes}
        dataSource={department}
      />
    );
  }
}
