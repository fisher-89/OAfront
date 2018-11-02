import React, { PureComponent } from 'react';
import { Tree, Spin } from 'antd';
import { connect } from 'dva';
import { markTreeData } from '../../../../utils/utils';

const { TreeNode } = Tree;

@connect(({ authority, loading }) => ({
  authority: authority.authority,
  loading: (
    loading.effects['authority/fetchAuth']
  ),
}))
export default class extends PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'authority/fetchAuth' });
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item} disabled={item.disabled}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} disabled={item.disabled} />;
    });
  }

  render() {
    const { authority, loading, data } = this.props;
    const checkedKeys = data.oa || [];
    const treeData = markTreeData(authority, { value: 'id', label: 'auth_name', parentId: 'parent_id' }, 0);
    return (
      <Spin spinning={loading || false}>
        <Tree
          showLine
          checkable
          checkedKeys={checkedKeys}
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
      </Spin>
    );
  }
}
