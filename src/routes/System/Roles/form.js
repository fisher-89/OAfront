import React, { PureComponent } from 'react';
import {
  Tree,
  Input,
  Select,
} from 'antd';
import { connect } from 'dva';
import OAForm, {
  OAModal,
} from '../../../components/OAForm';
import { markTreeData } from '../../../utils/utils';

const FormItem = OAForm.Item;
const { TreeNode } = Tree;
const { Option } = Select;

@OAForm.create()
@connect(({ brand, department }) => ({
  brand: brand.brand,
  department: department.department,
}))
export default class extends PureComponent {
  state = {
    checkedKeys: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'brand/fetchBrand' });
    dispatch({ type: 'department/fetchDepartment' });
  }


  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  }

  handleSubmit = (params) => {
    const { dispatch } = this.props;
    const { checkedKeys } = this.state;
    const body = {
      ...params,
      department: checkedKeys,
    };
    console.log(body);
    dispatch({
      type: params.id ? 'roles/editRoles' : 'roles/addRoles',
      payload: body,
      onError: this.handleError,
      onSuccess: () => this.props.handleVisible(false),
    });
  }

  handleError = (error) => {
    const { onError } = this.props;
    onError(error);
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode title={item.title} key={item.key} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode key={item.key} title={item.title} />
      );
    });
  }

  render() {
    const {
      brand,
      visible,
      onCancel,
      department,
      initialValue,
      handleVisible,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const brandVal = (initialValue.brand || []).map(item => item.id.toString());
    const departmentVal = (initialValue.department || []).map(item => item.id.toString());
    const newTreeData = markTreeData(department, { value: 'id', lable: 'name', parentId: 'parent_id' }, 0);

    return (
      <OAModal
        title={initialValue.id ? '编辑角色' : '创建角色'}
        visible={visible}
        loading={this.props.loading}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => handleVisible(false)}
        afterClose={onCancel}
      >
        {initialValue.id ? (getFieldDecorator('id', {
          initialValue: initialValue.id,
        }))(
          <Input type="hidden" placeholder="请输入" />
        ) : null}

        <FormItem {...formItemLayout} label="角色名称" required>
          {
            getFieldDecorator('role_name', {
              initialValue: initialValue.role_name || null,
            })(
              <Input placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="配属品牌" >
          {getFieldDecorator('brand', {
            initialValue: brandVal,
          })(
            <Select
              mode="multiple"
              placeholder="请选择"
            >
              {brand.map(item => (
                <Option key={`${item.id}`}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="配属部门" >
          <div style={{ maxHeight: 400, overflow: 'auto', border: '1px dashed #eaeaea' }}>
            <Tree
              checkable
              autoExpandParent={false}
              onCheck={this.onCheck}
              selectedKeys={departmentVal}
            >
              {this.renderTreeNodes(newTreeData)}
            </Tree>
          </div>
        </FormItem>
      </OAModal>
    );
  }
}
