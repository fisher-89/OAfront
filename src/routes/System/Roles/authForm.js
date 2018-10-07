import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Tree,
  Input,
} from 'antd';
import OAForm, { OAModal } from '../../../components/OAForm';
import { markTreeData } from '../../../utils/utils';

const FormItem = OAForm.Item;
const { TreeNode } = Tree;

@OAForm.create()
@connect(({ authority }) => ({
  authority: authority.authority,
}))
export default class extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'authority/fetchAuth' });
  }

  handleSubmit = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roles/editRole',
      payload: params,
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
      visible,
      onCancel,
      authority,
      initialValue,
      handleVisible,
      validateFields,
      form: { getFieldDecorator, setFieldsValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const authorityVal = (initialValue.authority || []).map(item => item.id.toString());
    const newTreeData = markTreeData(authority, { value: 'id', lable: 'auth_name', parentId: 'parent_id' }, 0);

    return (
      <OAModal
        title={`编辑 "${initialValue.role_name}" 权限`}
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

        {initialValue.role_name ? (getFieldDecorator('role_name', {
          initialValue: initialValue.role_name,
        }))(
          <Input type="hidden" placeholder="请输入" />
        ) : null}

        <FormItem {...formItemLayout} label="分配权限" >
          <div style={{ maxHeight: 400, overflow: 'auto', border: '1px dashed #eaeaea' }}>
            {getFieldDecorator('authority', {
              initialValue: authorityVal,
            })(
              <Tree
                checkable
                checkStrictly
                autoExpandParent={false}
                defaultExpandedKeys={authorityVal}
                defaultCheckedKeys={authorityVal}
                onCheck={(checkedKeys) => {
                  setFieldsValue({ authority: checkedKeys.checked });
                }}
              >
                {this.renderTreeNodes(newTreeData)}
              </Tree>
            )}
          </div>
        </FormItem>
      </OAModal>
    );
  }
}
