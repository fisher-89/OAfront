import React, { PureComponent } from 'react';
import {
  Input,
  TreeSelect,
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import OAForm, { OAModal } from '../../../components/OAForm1';
import { markTreeData } from '../../../utils/utils';

const FormItem = OAForm.Item;
@connect(({ loading }) => ({
  loading: loading.effects['point/addType'],
}))
@OAForm.create()
export default class extends PureComponent {
  componentDidMount() {
    const { form, bindForm } = this.props;
    bindForm(form);
  }

  handleOnSuccess = () => {
    this.props.onCancel();
    this.props.dispatch(routerRedux.push('/point/initEvent'));
  }


  handleSubmit = (values) => {
    const { dispatch, onError } = this.props;
    dispatch({
      type: values.id ? 'point/editType' : 'point/addType',
      payload: values,
      onSuccess: this.handleOnSuccess,
      onError,
    });
  }

  render() {
    const {
      visible,
      form,
      initialValue,
      onCancel,
      onClose,
      treeData,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;
    const newTreeData = markTreeData(treeData, { value: 'id', lable: 'name', parentId: 'parent_id' }, null);
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <OAModal
        form={form}
        title="事件类型表单"
        visible={visible}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => onCancel(false)}
        afterClose={onClose}
      >
        {initialValue.id ? getFieldDecorator('id', {
          initialValue: initialValue.id,
        })(
          <Input placeholder="请输入" type="hidden" />
        ) : null}

        <FormItem
          label="名称"
          {...formItemLayout}
        >
          {getFieldDecorator('name', {
            initialValue: initialValue.name || '',
            rules: [
              {
                required: true,
                message: '必填内容',
              },
            ],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          label="上级分类"
          {...formItemLayout}
        >
          {getFieldDecorator('parent_id', initialValue.parent_id ? {
            initialValue: initialValue.parent_id.toString(),
          } : { initialValue: null })(
            <TreeSelect
              placeholder="上级分类默认为空"
              treeDefaultExpandAll
              treeData={newTreeData}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            />
          )}
        </FormItem>
        <FormItem
          label="排序"
          {...formItemLayout}
        >
          {getFieldDecorator('sort', {
            initialValue: initialValue.sort || 99,
          })(
            <InputNumber placeholder="请输入" />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
