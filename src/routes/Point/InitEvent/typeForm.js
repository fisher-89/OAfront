import React, { PureComponent } from 'react';
import {
  Input,
  TreeSelect,
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import OAForm from '../../../components/OAForm';
import { markTreeData } from '../../../utils/utils';

const { OAModal } = OAForm;
const FormItem = OAForm.Item;
@connect(({ loading }) => ({
  loading: loading.effects['point/addType'],
}))

@OAForm.create({
  onValuesChange(props, changeValue) {
    Object.keys(changeValue).forEach(key => props.handleFieldsError(key));
  },
})
export default class extends PureComponent {
  componentDidMount() {
    const { form, bindForm } = this.props;
    bindForm(form);
  }

  handleOnSuccess = () => {
    this.props.onCancel();
    this.props.dispatch(routerRedux.push('/point/initEvent'));
  }


  handleSubmit = (values, onError) => {
    const { dispatch } = this.props;
    dispatch({
      type: values.id ? 'point/editType' : 'point/addType',
      payload: values,
      onSuccess: this.handleOnSuccess,
      onError,
    });
  }

  render() {
    const {
      onError,
      visible,
      form,
      initialValue,
      onCancel,
      onClose,
      treeData,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const newTreeData = markTreeData(treeData, { value: 'id', lable: 'name', parentId: 'parent_id' }, null);
    return (
      <OAModal
        form={form}
        title="事件类型表单"
        visible={visible}
        onSubmit={this.handleSubmit}
        onCancel={() => onCancel(false)}
        afterClose={onClose}
        formProps={{
          onError,
          loading,
        }}
      >
        {initialValue.id ? getFieldDecorator('id', {
          initialValue: initialValue.id,
        })(
          <Input placeholder="请输入" type="hidden" />
        ) : null}

        <FormItem
          label="名称"
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
