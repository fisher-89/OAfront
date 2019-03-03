import React, { PureComponent } from 'react';
import {
  Button,
  Tree,
  Icon,
  Modal,
  notification,
} from 'antd';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import DepartForm from './departForm';
import TreeSort from '../../../components/TreeSort';
import { checkAuthority } from '../../../utils/utils';
import './department.less';

const { TreeNode } = Tree;

@connect(({ department, loading }) => ({
  department: department.department,
  sortLoading: loading.effects['department/sortDepartment'],
}))
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
          type: 'department/deleteDepartment',
          payload: { id },
        });
      },
    });
  }

  handleSuccess = (response) => {
    notification.success({
      message: response.message,
    });
  }

  handleSorterError = (error) => {
    notification.success({
      message: error,
    });
  }

  undotTreeData = (data, newData, pid) => {
    let sort = 0;
    data.forEach((item) => {
      sort += 1;
      const temp = {
        id: item.id,
        name: item.name,
        parent_id: pid || 0,
        sort,
      };
      if (item.children && item.children.length > 0) {
        this.undotTreeData(item.children, newData, item.id);
        delete temp.children;
      }
      const { department } = this.props;
      const dept = department.filter(key => (key.id === temp.id))[0];
      if ((temp.sort !== dept.sort) || (temp.parent_id !== dept.parent_id)) {
        newData.push(temp);
      }
    });
  }

  handleOnchange = (newTree) => {
    const newDataSource = [];
    this.undotTreeData(newTree, newDataSource);
    const { dispatch } = this.props;
    dispatch({
      type: 'department/sortDepartment',
      payload: {
        // old_data: department,
        new_data: newDataSource,
      },
      // onSuccess: this.handleSuccess,
      onError: this.handleSorterError,
    });
  }


  renderTreeNodes = (data) => {
    const { fetchDataSource } = this.props;
    return data.map((item) => {
      const content = (
        <React.Fragment>
          <a className="title-content" onClick={() => fetchDataSource(item.id)}>{item.name}</a>
          {
            !item.is_locked ? (
              <div className="selected-Icon">
                {checkAuthority(40) &&
                  (
                    <Icon
                      className="icon-edit"
                      type="edit"
                      style={{ marginLeft: '10px' }}
                      onClick={e => this.handleEidtEvent(e, item)}
                    />
                  )
                }
                {checkAuthority(41) &&
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
      const hasChangeAuth = checkAuthority(65);
      if (item.children && item.children.length) {
        return (
          <TreeNode title={content} key={item.key} disabled={!hasChangeAuth}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode key={item.key} title={content} disabled={!hasChangeAuth} />
      );
    });
  }

  render() {
    const { visible, editInfo } = this.state;
    const { department, loading, sortLoading } = this.props;
    return (
      <QueueAnim type="left">
        {
          checkAuthority(39) &&
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
                添加部门
              </Button>
            </div>
          )
        }
        <TreeSort
          rootPid={0}
          sorter={checkAuthority(65)}
          key="treeSort"
          showLine
          loading={loading || sortLoading}
          renderTreeNodes={this.renderTreeNodes}
          dataSource={department}
          onChange={this.handleOnchange}
        />
        {(checkAuthority(39) || checkAuthority(40)) &&
          (
            <DepartForm
              visible={visible}
              initialValue={editInfo}
              onCancel={this.handleModalVisible}
              treeData={department}
              onClose={() => this.setState({ editInfo: {} })}
            />
          )
        }
      </QueueAnim>
    );
  }
}
