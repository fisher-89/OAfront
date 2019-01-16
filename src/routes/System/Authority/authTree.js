import React, { PureComponent } from 'react';
import {
  Button,
  Tree,
  Icon,
  Modal,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import AuthForm from './form';
import TreeSort from '../../../components/TreeSort';
import { checkAuthority } from '../../../utils/utils';
import style from './authority.less';

const { TreeNode } = Tree;

@connect(({ authority }) => ({ authority }))
export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  handleEidtEvent = (e, item) => {
    e.stopPropagation();
    const temp = { ...item };
    if (item.children) {
      delete temp.children;
    }
    this.setState({ editInfo: temp }, () => this.handleModalVisible(true));
  }

  handleDelete = (e, id) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确定要删除该分类及下面的子类么?',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'authority/deleteAuth',
          payload: { id },
        });
      },
    });
  }

  handleSorterError = (error) => {
    Modal.error({
      title: '错误信息',
      content: error,
    });
  }


  undotTreeData = (data, newData, pid) => {
    let sort = 0;
    data.forEach((item) => {
      sort += 1;
      const temp = {
        id: item.id,
        name: item.name,
        parent_id: pid || null,
        sort,
      };
      if (item.children && item.children.length > 0) {
        this.undotTreeData(item.children, newData, item.id);
        delete temp.children;
      }
      newData.push(temp);
    });
  }

  handleOnchange = (newTree) => {
    const newDataSource = [];
    this.undotTreeData(newTree, newDataSource);
    const { dataSource, dispatch } = this.props;
    dispatch({
      type: 'authority/sorterAuth',
      payload: {
        old_data: dataSource,
        new_data: newDataSource,
      },
      onError: this.handleSorterError,
    });
  }

  showTitle = (item) => {
    return (
      <div>{item.id} | {item.auth_name}</div>
    );
  }

  renderTreeNodes = (data) => {
    const { fetchDataSource } = this.props;
    return data.map((item) => {
      const content = (
        <React.Fragment>
          <Tooltip placement="top" title={this.showTitle(item)} onClick={() => fetchDataSource(item.id)}>
            <a className="title-content">{item.auth_name}</a>
          </Tooltip>
          {
            !item.is_lock ? (
              <div className="selected-Icon">
                {checkAuthority(151) &&
                  (
                    <Icon
                      className="icon-form"
                      type="form"
                      style={{ marginLeft: '10px' }}
                      onClick={e => this.handleEidtEvent(e, item)}
                    />
                  )
                }
                {checkAuthority(152) &&
                  (
                    <Icon
                      className="icon-delete"
                      type="delete"
                      style={{ marginLeft: '10px' }}
                      onClick={e => this.handleDelete(e, item.id)}
                    />
                  )
                }
              </div>
          ) : null}
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
    const { visible, editInfo } = this.state;
    const { dataSource, loading } = this.props;
    return (
      <QueueAnim type="left" className={style.tree}>
        {
          checkAuthority(138) &&
          (
            <div
              key="add"
              className="add-event-type"
            >
              <Button
                icon="plus"
                type="primary"
                style={{ width: '100%' }}
                onClick={() => this.handleModalVisible(true)}
              >
                权限菜单
              </Button>
            </div>
          )
        }
        <TreeSort
          showLine
          rootPid={0}
          key="treeSort"
          loading={loading}
          dataSource={dataSource}
          sorter={checkAuthority(151)}
          renderTreeNodes={this.renderTreeNodes}
          onChange={this.handleOnchange}
        />
        {(checkAuthority(151) || checkAuthority(138)) &&
          (
            <AuthForm
              visible={visible}
              initialValue={editInfo}
              handleVisible={this.handleModalVisible}
              treeData={dataSource}
              onCancel={() => this.setState({ editInfo: {} })}
            />
          )
        }
      </QueueAnim>
    );
  }
}
