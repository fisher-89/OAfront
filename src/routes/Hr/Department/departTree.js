import React, { PureComponent } from 'react';
import {
  Button,
  Tree,
  Icon,
  Modal,
} from 'antd';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import DepartForm from './departForm';
import TreeSort from '../../../components/TreeSort';
import { customerAuthority } from '../../../utils/utils';
import './department.less';

const { TreeNode } = Tree;

@connect(({ department, loading }) => ({
  dataSource: department.tree,
  loading: loading.effects['department/fetchDepartment'],
  sortLoading: loading.effects['department/fetchDepartment'],
}))
export default class extends PureComponent {
  state = {
    visible: false,
    editInfo: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'department/fetchTreeDepart' });
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
      type: 'point/sorterType',
      payload: {
        old_data: dataSource,
        new_data: newDataSource,
      },
      onError: this.handleSorterError,
    });
  }


  renderTreeNodes = (data) => {
    return data.map((item) => {
      const content = (
        <React.Fragment>
          <a className="title-content">{item.name}</a>
          <div className="selected-Icon">
            {customerAuthority(151) &&
              (
                <Icon
                  className="icon-form"
                  type="form"
                  style={{ marginLeft: '10px' }}
                  onClick={e => this.handleEidtEvent(e, item)}
                />
              )
            }
            {customerAuthority(152) &&
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
    const { dataSource, loading, sortLoading } = this.props;
    return (
      <QueueAnim type="left">
        {
          customerAuthority(138) &&
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
          sorter={customerAuthority(151)}
          key="treeSort"
          showLine
          loading={loading || sortLoading}
          renderTreeNodes={this.renderTreeNodes}
          dataSource={dataSource}
          onChange={this.handleOnchange}
        />
        {(customerAuthority(151) || customerAuthority(138)) &&
          (
            <DepartForm
              visible={visible}
              initialValue={editInfo}
              onCancel={this.handleModalVisible}
              treeData={dataSource}
              onClose={() => this.setState({ editInfo: {} })}
            />
          )
        }
      </QueueAnim>
    );
  }
}
