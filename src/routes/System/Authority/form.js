import React, { PureComponent } from 'react';
import {
  Input,
  Radio,
  TreeSelect,
} from 'antd';
import { connect } from 'dva';
import OAForm, {
  OAModal,
} from '../../../components/OAForm';
import { markTreeData } from '../../../utils/utils';

const FormItem = OAForm.Item;

@OAForm.create()
@connect(({ authority }) => ({ authority }))
export default class extends PureComponent {
  handleError = (error) => {
    const { onError } = this.props;
    onError(error);
  }

  handleIsMenu = (e) => {
    const menu = this.props.form.getFieldValue('is_menu');
    console.log(menu);
    const ismenu = e.target.value;
    if (ismenu === '1') {
      console.log(ismenu);
    } else {
      console.log('aaa');
    }
  }

  handleSubmit = (params) => {
    const { dispatch } = this.props;
    const body = {
      ...params,
    };
    dispatch({
      type: params.id ? 'authority/editAuth' : 'authority/addAuth',
      payload: body,
      onError: this.handleError,
      onSuccess: () => this.props.handleVisible(false),
    });
  }

  render() {
    const {
      treeData,
      handleVisible,
      visible,
      initialValue,
      onCancel,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const newTreeData = markTreeData(treeData, { value: 'id', label: 'auth_name', parentId: 'parent_id' }, 0);

    return (
      <OAModal
        title={initialValue.id ? '编辑权限' : '添加权限'}
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

        <FormItem {...formItemLayout} label="权限名称" required>
          {
            getFieldDecorator('auth_name', {
              initialValue: initialValue.auth_name,
            })(
              <Input placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="权限路由" >
          {
            getFieldDecorator('access_url', {
              initialValue: initialValue.access_url,
            })(
              <Input placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="上级权限菜单" >
          {getFieldDecorator('parent_id', {
            initialValue: initialValue.parent_id ? initialValue.parent_id.toString() : null,
          })(
            <TreeSelect
              placeholder="上级权限菜单默认为空"
              treeDefaultExpandAll
              treeData={newTreeData}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="是否为菜单" >
          {getFieldDecorator('is_menu', {
            initialValue: initialValue.is_menu ? initialValue.is_menu.toString() : '0',
          })(
            <Radio.Group buttonStyle="solid" onChange={this.handleIsMenu} >
              <Radio.Button value="1">是</Radio.Button>
              <Radio.Button value="0">否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="菜单名称" >
          {
            getFieldDecorator('menu_name', {
              initialValue: initialValue.menu_name,
            })(
              <Input placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="菜单图标" >
          {
            getFieldDecorator('menu_logo', {
              initialValue: initialValue.menu_logo,
            })(
              <Input placeholder="请输入" style={{ width: '100%' }} />
            )
          }
        </FormItem>
      </OAModal>
    );
  }
}
