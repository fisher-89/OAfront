import React, { PureComponent } from 'react';
import { Tree, Spin, Icon } from 'antd';
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
    const { data: { oa } } = this.props;
    return data.map((item) => {
      const hasAuth = oa.indexOf(parseInt(item.key, 10)) !== -1;
      const round = <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #ccc', verticalAlign: 'middle', display: 'inline-block' }} />;
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} icon={hasAuth ? <Icon type="check-circle" /> : round}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} key={item.key} icon={hasAuth ? <Icon type="check-circle" /> : round} />;
    });
  }

  render() {
    const { authority, loading, data } = this.props;
    const checkedKeys = data.oa || [];
    const treeData = markTreeData(authority, { value: 'id', label: 'auth_name', parentId: 'parent_id' }, 0);
    return (
      <Spin spinning={loading || false}>
        <Tree
          showIcon
          showLine
          checkedKeys={checkedKeys}
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
      </Spin>
    );
  }
}
